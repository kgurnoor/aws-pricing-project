import { useState, useMemo } from "react";
import Table from "@cloudscape-design/components/table";
import Input from "@cloudscape-design/components/input";
import SpaceBetween from "@cloudscape-design/components/space-between";
import Select from "@cloudscape-design/components/select";
import pricingData from "../assets/index-current-version.json";

interface PricingItem {
  regionCode: string;
  location: string;
  price: number;
  unit: string;
  description: string;
  usagetype?: string;
}

interface Props {
  selectedService: { label?: string; value?: string } | null;
}

type SortOption = { label: string; value: string };

const SORT_OPTIONS: SortOption[] = [
  { label: "Price (Lowest first)", value: "price_asc" },
  { label: "Price (Highest first)", value: "price_desc" },
  { label: "Usage Type (A-Z)", value: "usagetype_asc" },
  { label: "Usage Type (Z-A)", value: "usagetype_desc" },
  { label: "Region (A-Z)", value: "regionCode_asc" },
  { label: "Region (Z-A)", value: "regionCode_desc" },
  { label: "Location (A-Z)", value: "location_asc" },
  { label: "Location (Z-A)", value: "location_desc" },
];

const GlobalPricingTable: React.FC<Props> = ({ selectedService }) => {
  const [searchText, setSearchText] = useState("");
  const [sortOption, setSortOption] = useState<SortOption>(SORT_OPTIONS[0]);

  // Extract all pricing data for the selected service
  const allPricing: PricingItem[] = useMemo(() => {
    if (!selectedService || !pricingData.products || !pricingData.terms || !pricingData.terms.OnDemand) return [];
    const items: PricingItem[] = [];
    for (const [productSku, product] of Object.entries<any>(pricingData.products)) {
      const regionCode = product?.attributes?.regionCode;
      const usagetype = product?.attributes?.usagetype || productSku;
      const location = product?.attributes?.location;
      const onDemandTerms = (pricingData.terms.OnDemand as Record<string, any>)[productSku];
      if (onDemandTerms) {
        for (const termKey of Object.keys(onDemandTerms)) {
          const priceDimensions = onDemandTerms[termKey]?.priceDimensions;
          if (!priceDimensions) continue;
          for (const priceDimKey of Object.keys(priceDimensions)) {
            const priceDimension = priceDimensions[priceDimKey];
            if (
              priceDimension &&
              priceDimension.pricePerUnit &&
              priceDimension.pricePerUnit.USD !== undefined
            ) {
              items.push({
                regionCode,
                location,
                price: parseFloat(priceDimension.pricePerUnit.USD),
                unit: priceDimension.unit,
                description: priceDimension.description,
                usagetype,
              });
            }
          }
        }
      }
    }
    return items;
  }, [selectedService]);

  // Global search filter: match any relevant field
  const filteredItems = useMemo(() => {
    if (!searchText) return allPricing;
    const lower = searchText.toLowerCase();
    return allPricing.filter(
      item =>
        (item.regionCode && item.regionCode.toLowerCase().includes(lower)) ||
        (item.location && item.location.toLowerCase().includes(lower)) ||
        (item.usagetype && item.usagetype.toLowerCase().includes(lower)) ||
        (item.description && item.description.toLowerCase().includes(lower)) ||
        (item.unit && item.unit.toLowerCase().includes(lower)) ||
        String(item.price).includes(lower)
    );
  }, [allPricing, searchText]);

  // Sorting logic
  const sortedItems = useMemo(() => {
    const [field, dir] = sortOption.value.split("_");
    return [...filteredItems].sort((a, b) => {
      let cmp = 0;
      if (field === "price") {
        cmp = a.price - b.price;
      } else if (field === "usagetype") {
        cmp = (a.usagetype || "").localeCompare(b.usagetype || "");
      } else if (field === "regionCode") {
        cmp = (a.regionCode || "").localeCompare(b.regionCode || "");
      } else if (field === "location") {
        cmp = (a.location || "").localeCompare(b.location || "");
      }
      return dir === "asc" ? cmp : -cmp;
    });
  }, [filteredItems, sortOption]);

  const columns = [
    { id: "usagetype", header: "Usage Type", cell: (item: PricingItem) => item.usagetype },
    { id: "regionCode", header: "Region Code", cell: (item: PricingItem) => item.regionCode },
    { id: "location", header: "Location", cell: (item: PricingItem) => item.location },
    { id: "description", header: "Description", cell: (item: PricingItem) => item.description },
    { id: "price", header: "Price (USD)", cell: (item: PricingItem) => item.price.toFixed(6) },
    { id: "unit", header: "Unit", cell: (item: PricingItem) => item.unit },
  ];

  return (
    <SpaceBetween size="m">
      <SpaceBetween direction="horizontal" size="m">
        <Input
          placeholder="Search all pricing (region, usage type, description, etc.)"
          value={searchText}
          onChange={({ detail }) => setSearchText(detail.value)}
        />
        <Select
          selectedOption={sortOption}
          onChange={({ detail }) => setSortOption(detail.selectedOption as SortOption)}
          options={SORT_OPTIONS}
          ariaLabel="Sort by"
          placeholder="Sort by"
        />
      </SpaceBetween>
      <Table
        columnDefinitions={columns}
        items={sortedItems}
        header="Global Pricing Search"
        variant="embedded"
        stickyHeader
        empty={<span>No pricing data matches your search.</span>}
      />
    </SpaceBetween>
  );
};

export default GlobalPricingTable;

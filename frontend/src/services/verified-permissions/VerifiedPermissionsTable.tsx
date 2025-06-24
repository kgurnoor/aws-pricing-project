import { useState, useMemo } from "react";
import Table from "@cloudscape-design/components/table";
import Input from "@cloudscape-design/components/input";
import Box from "@cloudscape-design/components/box";
import SpaceBetween from "@cloudscape-design/components/space-between";
import Select from "@cloudscape-design/components/select";
import pricingData from "../../assets/index-current-version.json";

interface PricingItem {
  regionCode: string;
  location: string;
  price: number;
  unit: string;
  description: string;
  usagetype?: string;
}

type SortOption = { label: string; value: string };

interface Props {
  selectedRegions: { label: string; value: string }[];
  selectedProducts: { label: string; value: string }[];
  selectedDuration: { label?: string; value?: string } | null;
  versionInfo?: { versionEffectiveBeginDate?: string; versionEffectiveEndDate?: string };
}

const SORT_OPTIONS: SortOption[] = [
  { label: "Price (Lowest first)", value: "minPrice_asc" },
  { label: "Price (Highest first)", value: "minPrice_desc" },
  { label: "SKU/Usage Type (A-Z)", value: "sku_asc" },
  { label: "SKU/Usage Type (Z-A)", value: "sku_desc" },
  { label: "Region (A-Z)", value: "regionCodes_asc" },
  { label: "Region (Z-A)", value: "regionCodes_desc" },
];

const VerifiedPermissionsTable: React.FC<Props> = ({
  selectedRegions,
  selectedProducts,
  selectedDuration,
  versionInfo = {},
}) => {
  if (
    !Array.isArray(selectedRegions) ||
    !Array.isArray(selectedProducts) ||
    !selectedDuration ||
    !pricingData ||
    !pricingData.products ||
    !pricingData.terms ||
    !pricingData.terms.OnDemand ||
    selectedRegions.length === 0 ||
    selectedProducts.length === 0
  ) {
    return (
      <Box color="text-status-error">
        No pricing data for this selection.
      </Box>
    );
  }

  const [searchText, setSearchText] = useState("");
  const [sortOption, setSortOption] = useState<SortOption>(SORT_OPTIONS[0]);

  // Extract and group pricing data
  const pricing: PricingItem[] = [];
  try {
    for (const [productSku, product] of Object.entries<any>(pricingData.products)) {
      const regionCode = product?.attributes?.regionCode;
      if (!selectedRegions.some(region => region.value === regionCode)) continue;
      const usagetype = product?.attributes?.usagetype || productSku;
      if (!selectedProducts.some(product => product.value === usagetype)) continue;
      if (selectedDuration.value !== "OnDemand") continue;
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
              pricing.push({
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
  } catch (err) {
    console.error("Error extracting pricing data:", err);
    return <Box color="text-status-error">Error extracting pricing data.</Box>;
  }

  // Group by SKU (usagetype) and show min-max price range for each
  const skuGroups: Record<string, PricingItem[]> = {};
  pricing.forEach(item => {
    const key = item.usagetype || "";
    if (!skuGroups[key]) skuGroups[key] = [];
    skuGroups[key].push(item);
  });

  let rows = Object.entries(skuGroups).map(([sku, items]) => {
    const prices = items.map(i => i.price);
    const min = Math.min(...prices);
    const max = Math.max(...prices);
    return {
      sku,
      regionCodes: [...new Set(items.map(i => i.regionCode))].join(", "),
      locations: [...new Set(items.map(i => i.location))].join(", "),
      description: items[0]?.description,
      priceRange: min === max ? min.toFixed(6) : `${min.toFixed(6)} - ${max.toFixed(6)}`,
      minPrice: min,
      maxPrice: max,
      unit: items[0]?.unit,
    };
  });

  // SEARCH: filter rows based on searchText
  const filteredRows = useMemo(() => {
    if (!searchText) return rows;
    const lower = searchText.toLowerCase();
    return rows.filter(
      row =>
        row.sku.toLowerCase().includes(lower) ||
        row.regionCodes.toLowerCase().includes(lower) ||
        row.locations.toLowerCase().includes(lower) ||
        (row.description || "").toLowerCase().includes(lower)
    );
  }, [rows, searchText]);

  // SORT: sort according to sortOption
  const sortedRows = useMemo(() => {
    const [field, dir] = sortOption.value.split("_");
    return [...filteredRows].sort((a, b) => {
      let cmp = 0;
      if (field === "minPrice") {
        cmp = a.minPrice - b.minPrice;
      } else if (field === "sku") {
        cmp = a.sku.localeCompare(b.sku);
      } else if (field === "regionCodes") {
        cmp = a.regionCodes.localeCompare(b.regionCodes);
      }
      return dir === "asc" ? cmp : -cmp;
    });
  }, [filteredRows, sortOption]);

  const columns = [
    { id: "sku", header: "SKU/Usage Type", cell: (item: any) => item.sku },
    { id: "regionCodes", header: "Region(s)", cell: (item: any) => item.regionCodes },
    { id: "locations", header: "Location(s)", cell: (item: any) => item.locations },
    { id: "description", header: "Description", cell: (item: any) => item.description },
    {
      id: "priceRange",
      header: "Price Range (USD)",
      cell: (item: any) => item.priceRange,
      sortingField: "minPrice"
    },
    { id: "unit", header: "Unit", cell: (item: any) => item.unit },
    {
      id: "versionBegin",
      header: "Version Begin",
      cell: () =>
        versionInfo.versionEffectiveBeginDate
          ? versionInfo.versionEffectiveBeginDate.split("T")[0]
          : "N/A",
    },
    {
      id: "versionEnd",
      header: "Version End",
      cell: () =>
        versionInfo.versionEffectiveEndDate
          ? versionInfo.versionEffectiveEndDate.split("T")[0]
          : "N/A",
    },
  ];

  return (
    <SpaceBetween size="m">
      <SpaceBetween direction="horizontal" size="m">
        <Input
          placeholder="Search pricing table..."
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
        items={sortedRows}
        header="Pricing Table"
        variant="embedded"
        stickyHeader
        empty={<span>No pricing data for this selection.</span>}
      />
    </SpaceBetween>
  );
};

export default VerifiedPermissionsTable;

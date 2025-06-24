import Multiselect from "@cloudscape-design/components/multiselect";
import pricingData from "../assets/index-current-version.json";

type ProductOption = { label?: string; value?: string };

interface Props {
  selectedProducts: ProductOption[];
  setSelectedProducts: (products: ProductOption[]) => void;
  selectedRegions: { label?: string; value?: string }[];
}

const ProductSelector: React.FC<Props> = ({ selectedProducts, setSelectedProducts, selectedRegions }) => {
  const productSet = new Set<string>();
  if (pricingData.products && selectedRegions.length > 0) {
    for (const product of Object.values<any>(pricingData.products)) {
      if (selectedRegions.some(region => product.attributes.regionCode === region.value)) {
        productSet.add(product.attributes.usagetype || product.sku);
      }
    }
  }
  const allOptions: ProductOption[] = Array.from(productSet).map((prod) => ({
    label: prod,
    value: prod,
  })).sort((a, b) => (a.label || "").localeCompare(b.label || ""));

  const selectAllOption: ProductOption = { label: "Select All", value: "__ALL__" };
  const options = [selectAllOption, ...allOptions];

  const handleChange = ({ detail }: any) => {
    const selected = detail.selectedOptions;
    if (selected.some((opt: ProductOption) => opt.value === "__ALL__")) {
      setSelectedProducts(allOptions);
    } else {
      setSelectedProducts(selected);
    }
  };

  return (
    <Multiselect
      selectedOptions={selectedProducts}
      onChange={handleChange}
      options={options}
      placeholder="Select Usage Types"
      selectedAriaLabel="Selected usage types"
      filteringType="auto"
      disabled={selectedRegions.length === 0}
      // Default behavior: dropdown closes after each selection (AWS-style)
    />
  );
};

export default ProductSelector;

import Multiselect from "@cloudscape-design/components/multiselect";
import regionData from "../assets/index-current-region.json";

type RegionOption = { label?: string; value?: string };

interface Props {
  selectedRegions: RegionOption[];
  setSelectedRegions: (regions: RegionOption[]) => void;
}

const RegionSelector: React.FC<Props> = ({ selectedRegions, setSelectedRegions }) => {
  const allOptions: RegionOption[] = Object.entries((regionData as any).regions)
    .map(([key, value]: [string, any]) => ({
      label: value.regionCode,
      value: key,
    }))
    .sort((a, b) => (a.label || "").localeCompare(b.label || ""));

  // "Select All" logic
  const selectAllOption: RegionOption = { label: "Select All", value: "__ALL__" };
  const options = [selectAllOption, ...allOptions];

  const handleChange = ({ detail }: any) => {
    const selected = detail.selectedOptions;
    if (selected.some((opt: RegionOption) => opt.value === "__ALL__")) {
      setSelectedRegions(allOptions);
    } else {
      setSelectedRegions(selected);
    }
  };

  return (
    <Multiselect
      selectedOptions={selectedRegions}
      onChange={handleChange}
      options={options}
      placeholder="Select Regions"
      selectedAriaLabel="Selected regions"
      filteringType="auto"
      // Default behavior: dropdown closes after each selection (AWS-style)
    />
  );
};

export default RegionSelector;

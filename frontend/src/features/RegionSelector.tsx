import Multiselect from "@cloudscape-design/components/multiselect";
import { useVerifiedPermissions } from "../hooks/useVerifiedPermissions";

type RegionOption = { label?: string; value?: string };

interface Props {
  selectedRegions: RegionOption[];
  setSelectedRegions: (regions: RegionOption[]) => void;
}

const RegionSelector: React.FC<Props> = ({ selectedRegions, setSelectedRegions }) => {
  const { data: regionData, loading, error } = useVerifiedPermissions('index-current-region');

  const allOptions: RegionOption[] =
    !loading && !error && regionData?.regions
      ? Object.entries(regionData.regions)
          .map(([key, value]: [string, any]) => ({
            label: value.regionCode,
            value: key,
          }))
          .sort((a, b) => (a.label || "").localeCompare(b.label || ""))
      : [];

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
      placeholder={
        loading
          ? "Loading..."
          : error
          ? "Failed to load regions"
          : "Select Regions"
      }
      selectedAriaLabel="Selected regions"
      filteringType="auto"
      disabled={loading || !!error}
      // Default behavior: dropdown closes after each selection (AWS-style)
    />
  );
};

export default RegionSelector;

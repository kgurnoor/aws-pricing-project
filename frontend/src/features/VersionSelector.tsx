import Select from "@cloudscape-design/components/select";
import { useVerifiedPermissions } from "../hooks/useVerifiedPermissions";

type VersionOption = { label?: string; value?: string };

interface Props {
  selectedVersion: VersionOption | null;
  setSelectedVersion: (version: VersionOption | null) => void;
}

const VersionSelector: React.FC<Props> = ({ selectedVersion, setSelectedVersion }) => {
  const { data: versionData, loading, error } = useVerifiedPermissions('index-version');

  const options: VersionOption[] = !loading && !error && versionData?.versions
    ? Object.entries(versionData.versions)
        .map(([version, info]: [string, any]) => ({
          label: `${version} (${info.versionEffectiveBeginDate.split("T")[0]})`,
          value: version,
        }))
        .sort((a, b) => (b.value || "").localeCompare(a.value || "")) // Descending order
    : [];

  return (
    <Select
      selectedOption={selectedVersion}
      onChange={({ detail }) => setSelectedVersion(detail.selectedOption)}
      options={options}
      placeholder={loading ? "Loading..." : error ? "Failed to load versions" : "Select Version"}
      selectedAriaLabel="Selected version"
      filteringType="auto"
      disabled={loading || !!error}
    />
  );
};

export default VersionSelector;

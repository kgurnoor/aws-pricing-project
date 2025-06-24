import Select from "@cloudscape-design/components/select";
import versionData from "../assets/index-version.json";

type VersionOption = { label?: string; value?: string };

interface Props {
  selectedVersion: VersionOption | null;
  setSelectedVersion: (version: VersionOption | null) => void;
}

const VersionSelector: React.FC<Props> = ({ selectedVersion, setSelectedVersion }) => {
  const options: VersionOption[] = Object.entries((versionData as any).versions)
    .map(([version, info]: [string, any]) => ({
      label: `${version} (${info.versionEffectiveBeginDate.split("T")[0]})`,
      value: version,
    }))
    .sort((a, b) => (b.value || "").localeCompare(a.value || "")); // Descending order

  return (
    <Select
      selectedOption={selectedVersion}
      onChange={({ detail }) => setSelectedVersion(detail.selectedOption)}
      options={options}
      placeholder="Select Version"
      selectedAriaLabel="Selected version"
      filteringType="auto"
    />
  );
};

export default VersionSelector;

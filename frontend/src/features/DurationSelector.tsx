// DurationSelector.tsx
import Select from "@cloudscape-design/components/select";
import { useDurations } from "../hooks/useDurations";

type DurationOption = { label?: string; value?: string };

interface Props {
  selectedDuration: DurationOption | null;
  setSelectedDuration: (duration: DurationOption | null) => void;
}

const DurationSelector: React.FC<Props> = ({ selectedDuration, setSelectedDuration }) => {
  const { durations, loading, error } = useDurations();

  return (
    <Select
      selectedOption={selectedDuration}
      onChange={({ detail }) => setSelectedDuration(detail.selectedOption)}
      options={durations}
      placeholder={loading ? "Loading..." : error ? "Failed to load durations" : "Select Duration"}
      selectedAriaLabel="Selected duration"
      filteringType="auto"
      disabled={loading || !!error}
    />
  );
};

export default DurationSelector;

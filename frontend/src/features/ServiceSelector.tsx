import Select from "@cloudscape-design/components/select";
import { useServices } from "../hooks/useServices";

type ServiceOption = { label?: string; value?: string };

interface Props {
  selectedService: ServiceOption | null;
  setSelectedService: (service: ServiceOption | null) => void;
}

const ServiceSelector: React.FC<Props> = ({ selectedService, setSelectedService }) => {
  const { services, loading, error } = useServices();

  // Defensive: If loading or error, show empty options
  const options: ServiceOption[] =
    !loading && !error && services?.offers
      ? Object.entries(services.offers)
          .map(([key, value]: [string, any]) => ({
            label: value.offerCode,
            value: key,
          }))
          .sort((a, b) => (a.label || "").localeCompare(b.label || ""))
      : [];

  return (
    <Select
      selectedOption={selectedService}
      onChange={({ detail }) => setSelectedService(detail.selectedOption)}
      options={options}
      placeholder={loading ? "Loading..." : error ? "Failed to load services" : "Select AWS Service"}
      selectedAriaLabel="Selected service"
      filteringType="auto"
      disabled={loading || !!error}
    />
  );
};

export default ServiceSelector;

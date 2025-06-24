import VerifiedPermissionsTable from "../services/verified-permissions/VerifiedPermissionsTable";

interface Props {
  service: { label?: string; value?: string } | null;
  region: { label: string; value: string }[];
  product: { label: string; value: string }[];
  duration: { label?: string; value?: string } | null;
  versionInfo: { versionEffectiveBeginDate?: string; versionEffectiveEndDate?: string };
}

const PricingTable: React.FC<Props> = ({ service, region, product, duration, versionInfo }) => {
  if (!service) return null;

  switch (service.value) {
    case "AmazonVerifiedPermissions":
      return (
        <VerifiedPermissionsTable
          selectedRegions={region}
          selectedProducts={product}
          selectedDuration={duration}
          versionInfo={versionInfo}
        />
      );
    default:
      return (
        <div>
          Data for {service.label || "this service"} is not yet available.
        </div>
      );
  }
};

export default PricingTable;

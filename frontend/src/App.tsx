import AppLayout from "@cloudscape-design/components/app-layout";
import Container from "@cloudscape-design/components/container";
import Header from "@cloudscape-design/components/header";
import SpaceBetween from "@cloudscape-design/components/space-between";
import Button from "@cloudscape-design/components/button";
import ServiceSelector from "./features/ServiceSelector";
import VersionSelector from "./features/VersionSelector";
import RegionSelector from "./features/RegionSelector";
import ProductSelector from "./features/ProductSelector";
import DurationSelector from "./features/DurationSelector";
import PricingTable from "./features/PricingTable";
import GlobalPricingTable from "./features/GlobalPricingTable"; // <-- ADD THIS IMPORT
import Box from "@cloudscape-design/components/box";
import NavBar from "./components/NavBar";
import HelpBar from "./components/HelpBar";
import ErrorBoundary from "./components/ErrorBoundary";
import versionData from "./assets/index-version.json";
import { useState } from "react";

function App() {
  const [selectedService, setSelectedService] = useState<any>(null);
  const [selectedVersion, setSelectedVersion] = useState<any>(null);
  const [selectedRegions, setSelectedRegions] = useState<any[]>([]);
  const [selectedProducts, setSelectedProducts] = useState<any[]>([]);
  const [selectedDuration, setSelectedDuration] = useState<any>(null);
  const [showPricingTable, setShowPricingTable] = useState(false);
  const [showDiscounts, setShowDiscounts] = useState(false);
  const [showGlobalSearch, setShowGlobalSearch] = useState(false); // <-- ADD THIS STATE

  const handleShowPricing = () => setShowPricingTable(true);

  const handleServiceChange = (service: any) => {
    setSelectedService(service);
    setShowPricingTable(false);
    setShowDiscounts(false);
    setShowGlobalSearch(false);
    setSelectedProducts([]);
    setSelectedDuration(null);
    setSelectedRegions([]);
  };
  const handleVersionChange = (version: any) => {
    setSelectedVersion(version);
    setShowPricingTable(false);
    setShowDiscounts(false);
    setShowGlobalSearch(false);
    setSelectedProducts([]);
    setSelectedDuration(null);
    setSelectedRegions([]);
  };
  const handleRegionChange = (regions: any[]) => {
    setSelectedRegions(regions);
    setShowPricingTable(false);
    setShowDiscounts(false);
    setShowGlobalSearch(false);
    setSelectedProducts([]);
    setSelectedDuration(null);
  };
  const handleProductChange = (products: any[]) => {
    setSelectedProducts(products);
    setShowPricingTable(false);
    setShowDiscounts(false);
    setShowGlobalSearch(false);
  };
  const handleDurationChange = (duration: any) => {
    setSelectedDuration(duration);
    setShowPricingTable(false);
    setShowDiscounts(false);
    setShowGlobalSearch(false);
  };

  const serviceName = selectedService?.label || "this service";
  const selectedVersionInfo =
    selectedVersion &&
    versionData.versions &&
    typeof selectedVersion.value === "string" &&
    Object.prototype.hasOwnProperty.call(versionData.versions, selectedVersion.value)
      ? (versionData.versions as Record<string, any>)[selectedVersion.value]
      : {};

  return (
    <AppLayout
      navigation={<NavBar />}
      tools={<HelpBar />}
      content={
        <Container header={<Header variant="h1">AWS Pricelist Visualizer</Header>}>
          <SpaceBetween size="l">
            <SpaceBetween direction="horizontal" size="l">
              <ServiceSelector
                selectedService={selectedService}
                setSelectedService={handleServiceChange}
              />
              <VersionSelector
                selectedVersion={selectedVersion}
                setSelectedVersion={handleVersionChange}
              />
              <RegionSelector
                selectedRegions={selectedRegions}
                setSelectedRegions={handleRegionChange}
              />
              <ProductSelector
                selectedProducts={selectedProducts}
                setSelectedProducts={handleProductChange}
                selectedRegions={selectedRegions}
              />
              <DurationSelector
                selectedDuration={selectedDuration}
                setSelectedDuration={handleDurationChange}
              />
              <Button
                variant="primary"
                onClick={handleShowPricing}
                disabled={
                  !selectedService ||
                  !selectedVersion ||
                  !selectedRegions.length ||
                  !selectedProducts.length ||
                  !selectedDuration
                }
              >
                View Pricing
              </Button>
              <Button
                variant="normal"
                onClick={() => setShowDiscounts(true)}
                disabled={!selectedService}
              >
                Show Discounts
              </Button>
              <Button
                variant="normal"
                onClick={() => setShowGlobalSearch(gs => !gs)}
                disabled={!selectedService}
              >
                {showGlobalSearch ? "Show Filtered Table" : "Global Search"}
              </Button>
            </SpaceBetween>

            {showGlobalSearch && selectedService && (
              <GlobalPricingTable selectedService={selectedService} />
            )}

            {!showGlobalSearch && showPricingTable && (
              <ErrorBoundary>
                <PricingTable
                  service={selectedService}
                  region={selectedRegions}
                  product={selectedProducts}
                  duration={selectedDuration}
                  versionInfo={selectedVersionInfo}
                />
              </ErrorBoundary>
            )}

            {showDiscounts && (
              <Box margin="m">
                <Header variant="h3">Discounts</Header>
                <p>
                  No discounts or reserved pricing available for {serviceName}.
                </p>
              </Box>
            )}
          </SpaceBetween>
        </Container>
      }
    />
  );
}

export default App;

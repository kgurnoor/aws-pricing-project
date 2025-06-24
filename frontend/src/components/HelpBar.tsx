import Box from "@cloudscape-design/components/box";
import Button from "@cloudscape-design/components/button";

const HelpBar = () => (
  <Box padding="m">
    <h3>Help</h3>
    <p>
      <strong>How to use:</strong>
      <ul>
        <li>
          <b>Select a service</b> and version.
        </li>
        <li>
          <b>Select one or more regions</b> and usage types using the multi-select dropdowns. You can use the search box in each dropdown for quick filtering, or use "Select All" to choose all options at once.
        </li>
        <li>
          <b>Select a duration</b> (e.g., On-Demand).
        </li>
        <li>
          Click <b>View Pricing</b> to display the pricing table.
        </li>
        <li>
          Use the <b>search box</b> above the table to filter results by SKU, region, or description.
        </li>
        <li>
          Use the <b>Sort by</b> dropdown to sort the table by price, SKU, or region (ascending or descending), similar to AWS Cloudscape UI.
        </li>
      </ul>
      <b>Note:</b> The table will only show data when at least one region and one usage type are selected.
    </p>
    <Button
      variant="link"
      onClick={() => window.open("https://aws.amazon.com/pricing/", "_blank")}
    >
      AWS Pricing Docs
    </Button>
  </Box>
);

export default HelpBar;

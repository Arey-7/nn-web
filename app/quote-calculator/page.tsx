import type { Metadata } from "next";
import PageHeader from "../components/page-header";
import Calculator from "./calculator";

export const metadata: Metadata = {
  title: "Quote calculator",
  description:
    "Internal tool: working costs and a client quote for a print job.",
  robots: { index: false, follow: false },
};

export default function QuoteCalculatorPage() {
  return (
    <div className="pb-32">
      <div className="no-print">
        <PageHeader
          eyebrow="Internal tool"
          title="Print quote calculator"
          lede="Costs on the left, the client's quote on the right. Cost plus 35%, rounded up to the nearest 200, VAT added on top. Figures update as you type and are kept on this device."
        />
      </div>
      <Calculator />
    </div>
  );
}

import type { Metadata } from "next";
import PageHeader from "../components/page-header";
import Calculator from "./calculator";
import Gate from "./gate";
import SignOutButton from "./sign-out-button";
import { hasSession, isConfigured } from "./session";

export const metadata: Metadata = {
  title: "Quote calculator",
  description: "Internal tool.",
  robots: { index: false, follow: false },
};

// Reading the session cookie already opts this route out of static rendering.
// Saying so as well means a later refactor cannot quietly turn a private page
// into a cacheable one.
export const dynamic = "force-dynamic";

export default async function QuoteCalculatorPage() {
  const unlocked = await hasSession();

  if (!unlocked) {
    return (
      <div className="pb-32">
        <Gate configured={isConfigured()} />
      </div>
    );
  }

  return (
    <div className="pb-32">
      <div className="no-print">
        <PageHeader
          eyebrow="Internal tool"
          title="Quote calculator"
          lede="Pick the kind of work, put the costs in on the left, and the client's quote builds on the right. Cost plus 35%, rounded up to the nearest 200, with VAT on top. Figures update as you type and are kept on this device."
        />
        <div className="mx-auto mt-8 flex max-w-[1600px] justify-end px-6 md:px-10">
          <SignOutButton />
        </div>
      </div>
      <Calculator />
    </div>
  );
}

import type { Metadata } from "next";
import PageHeader from "../components/page-header";
import WorkIndex from "./work-index";

export const metadata: Metadata = {
  title: "Work",
  description:
    "Press, film and radio for the African Wildlife Foundation, the Kenya Human Rights Commission, the Kenya Revenue Authority, Nation Media Group, Peugeot, CfC Stanbic and others.",
};

export default function ProjectsPage() {
  return (
    <div className="pb-32">
      <PageHeader
        eyebrow="Work"
        title={
          <>
            Thirty years
            <br />
            of <span className="italic text-accent">arguments</span>.
          </>
        }
        lede="Every campaign we can still put our hands on — the press pages, the television, and the radio nobody keeps."
      />

      <div className="mx-auto max-w-[1600px] px-6 md:px-10">
        <WorkIndex />
      </div>
    </div>
  );
}

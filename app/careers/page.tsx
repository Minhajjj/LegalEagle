import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Briefcase, Building, MapPin } from "lucide-react";
import { le } from "@/lib/design-system";

const JOBS = [
  {
    id: "fe-engineer",
    title: "Senior Frontend Engineer",
    department: "Engineering",
    location: "Remote",
    type: "Full-time",
  },
  {
    id: "legal-analyst",
    title: "Legal Data Analyst",
    department: "Product",
    location: "New York, NY",
    type: "Full-time",
  },
  {
    id: "sales-exec",
    title: "Enterprise Sales Executive",
    department: "Sales",
    location: "London, UK",
    type: "Full-time",
  },
];

export default function CareersPage() {
  return (
    <div className="min-h-screen" style={{ backgroundColor: le.background }}>
      <section
        className="py-24 text-white"
        style={{ background: `linear-gradient(160deg, ${le.primary} 0%, #243d5c 100%)` }}
      >
        <div className="container mx-auto px-6 text-center">
          <h1 className="mb-6 font-serif text-4xl font-bold md:text-6xl">Build the future of law</h1>
          <p className="mx-auto mb-8 max-w-2xl text-lg text-white/80 md:text-xl">
            Engineers, designers, and legal experts reimagining how the world works with contracts.
          </p>
          <Button size="lg" variant="secondary" asChild>
            <Link href="#open-roles">View open positions</Link>
          </Button>
        </div>
      </section>

      <section className="bg-white py-20">
        <div className="container mx-auto px-6">
          <div className="mb-24 grid grid-cols-1 items-center gap-12 md:grid-cols-2">
            <div>
              <h2 className="mb-6 font-serif text-3xl font-bold" style={{ color: le.text }}>
                Culture at LegalEagle
              </h2>
              <p className="mb-4 text-lg" style={{ color: le.muted }}>
                Remote-first, outcome-driven, and serious about depth of work—with room for life outside
                the job.
              </p>
              <p className="text-lg" style={{ color: le.muted }}>
                Diverse, global, and curious about the intersection of technology and law.
              </p>
            </div>
            <div
              className="flex h-64 w-full items-center justify-center rounded-[12px] border border-slate-200 text-2xl font-bold text-slate-300 md:h-96"
              style={{ backgroundColor: le.background }}
            >
              Team photo
            </div>
          </div>

          <div id="open-roles">
            <h2 className="mb-12 text-center font-serif text-3xl font-bold" style={{ color: le.text }}>
              Open positions
            </h2>
            <div className="mx-auto max-w-4xl space-y-4">
              {JOBS.map((job) => (
                <div
                  key={job.id}
                  className="group flex flex-col justify-between gap-4 rounded-[12px] border border-slate-200 bg-white p-6 transition-all hover:border-[#2563eb]/40 hover:shadow-md md:flex-row md:items-center"
                >
                  <div>
                    <h3
                      className="text-xl font-bold transition-colors group-hover:text-[#2563eb]"
                      style={{ color: le.text }}
                    >
                      {job.title}
                    </h3>
                    <div className="mt-2 flex flex-wrap items-center gap-4 text-sm" style={{ color: le.muted }}>
                      <span className="flex items-center gap-1">
                        <Briefcase className="h-4 w-4" />
                        {job.department}
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        {job.location}
                      </span>
                      <span className="flex items-center gap-1">
                        <Building className="h-4 w-4" />
                        {job.type}
                      </span>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    className="shrink-0 transition-colors group-hover:border-[#1a3a52] group-hover:bg-[#1a3a52] group-hover:text-white"
                  >
                    Apply
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

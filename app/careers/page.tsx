import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Briefcase, Building, MapPin } from "lucide-react";

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
    <div className="min-h-screen bg-[#F2F1EE]">
      {/* Hero */}
      <section className="bg-[#1C212B] text-white py-24">
        <div className="container mx-auto px-6 text-center">
          <h1 className="text-4xl md:text-6xl font-bold font-serif mb-6">
            Build the Future of Law
          </h1>
          <p className="text-xl text-white/70 max-w-2xl mx-auto mb-8">
            Join a team of passionate engineers, designers, and legal experts re-imagining how the world interacts with contracts.
          </p>
          <Button size="lg" className="bg-[#308970] hover:bg-[#266d59] text-white border-0">
            View Open Positions
          </Button>
        </div>
      </section>

      {/* Values/Culture */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-24">
            <div>
              <h2 className="text-3xl font-bold text-[#1C212B] mb-6 font-serif">Culture at LegalEagle</h2>
              <p className="text-[#1C212B]/70 mb-4 text-lg">
                We're a remote-first company that values outcome over output. We believe in deep work, swift execution, and maintaining a healthy life outside of the office.
              </p>
              <p className="text-[#1C212B]/70 text-lg">
                Our team is diverse, global, and united by a shared curiosity about the intersection of technology and law.
              </p>
            </div>
            <div className="bg-[#F2F1EE] rounded-xl h-64 md:h-96 w-full flex items-center justify-center text-[#1C212B]/20 font-bold text-3xl border border-[#E5E5E5]">
              Team Photo Placeholder
            </div>
          </div>

          {/* Open Roles */}
          <div>
            <h2 className="text-3xl font-bold text-[#1C212B] mb-12 text-center font-serif">Open Positions</h2>
            <div className="space-y-4 max-w-4xl mx-auto">
              {JOBS.map((job) => (
                <div
                  key={job.id}
                  className="bg-white border border-[#E5E5E5] p-6 rounded-lg hover:border-[#308970] transition-colors flex flex-col md:flex-row md:items-center justify-between group"
                >
                  <div className="mb-4 md:mb-0">
                    <h3 className="text-xl font-bold text-[#1C212B] group-hover:text-[#308970] transition-colors">{job.title}</h3>
                    <div className="flex flex-wrap items-center gap-4 mt-2 text-sm text-[#1C212B]/60">
                      <span className="flex items-center">
                        <Briefcase className="w-4 h-4 mr-1" />
                        {job.department}
                      </span>
                      <span className="flex items-center">
                        <MapPin className="w-4 h-4 mr-1" />
                        {job.location}
                      </span>
                      <span className="flex items-center">
                        <Building className="w-4 h-4 mr-1" />
                        {job.type}
                      </span>
                    </div>
                  </div>
                  <Button variant="outline" className="shrink-0 group-hover:bg-[#308970] group-hover:text-white group-hover:border-[#308970] transition-all">
                    Apply Now
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

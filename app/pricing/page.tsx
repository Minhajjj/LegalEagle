import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-[#F2F1EE] pt-24 pb-12">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-[#1C212B] mb-4 font-serif">
            Transparent, Simple Pricing
          </h1>
          <p className="text-xl text-[#1C212B]/70 max-w-2xl mx-auto">
            Choose the perfect plan for your legal document analysis needs.
            No hidden fees, cancel anytime.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {/* Free Tier */}
          <div className="bg-white rounded-xl p-8 border border-[#E5E5E5] flex flex-col hover:border-[#308970]/30 transition-colors shadow-sm">
            <div className="mb-4">
              <h3 className="text-xl font-bold text-[#1C212B]">Starter</h3>
              <p className="text-[#1C212B]/60">Perfect for individuals</p>
            </div>
            <div className="mb-6">
              <span className="text-4xl font-bold text-[#1C212B]">$0</span>
              <span className="text-[#1C212B]/60">/month</span>
            </div>
            <Button variant="outline" className="w-full mb-8" asChild>
              <Link href="/signup">Get Started</Link>
            </Button>
            <ul className="space-y-4 flex-1">
              {[
                "3 Document Analyses/month",
                "Basic Risk Assessment",
                "Standard Parsing Speed",
                "Email Support",
              ].map((feature, i) => (
                <li key={i} className="flex items-start">
                  <Check className="w-5 h-5 text-[#308970] mr-3 shrink-0" />
                  <span className="text-[#1C212B]/80 text-sm">{feature}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Pro Tier */}
          <div className="bg-[#1C212B] rounded-xl p-8 border border-[#1C212B] flex flex-col relative transform md:-translate-y-4 shadow-xl">
            <div className="absolute top-0 right-0 bg-[#308970] text-white text-xs font-bold px-3 py-1 rounded-bl-lg rounded-tr-lg">
              POPULAR
            </div>
            <div className="mb-4">
              <h3 className="text-xl font-bold text-white">Professional</h3>
              <p className="text-white/60">For practicing lawyers</p>
            </div>
            <div className="mb-6">
              <span className="text-4xl font-bold text-white">$49</span>
              <span className="text-white/60">/month</span>
            </div>
            <Button className="w-full mb-8 bg-[#308970] hover:bg-[#266d59] text-white border-0" asChild>
              <Link href="/signup">Start Free Trial</Link>
            </Button>
            <ul className="space-y-4 flex-1">
              {[
                "Unlimited Document Analyses",
                "Advanced Risk Detection",
                "Priority Parsing Queue",
                "Clause Comparison Tool",
                "Export to PDF & Word",
                "24/7 Priority Support",
              ].map((feature, i) => (
                <li key={i} className="flex items-start">
                  <Check className="w-5 h-5 text-[#308970] mr-3 shrink-0" />
                  <span className="text-white/80 text-sm">{feature}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Enterprise Tier */}
          <div className="bg-white rounded-xl p-8 border border-[#E5E5E5] flex flex-col hover:border-[#308970]/30 transition-colors shadow-sm">
            <div className="mb-4">
              <h3 className="text-xl font-bold text-[#1C212B]">Enterprise</h3>
              <p className="text-[#1C212B]/60">For law firms & teams</p>
            </div>
            <div className="mb-6">
              <span className="text-4xl font-bold text-[#1C212B]">Custom</span>
            </div>
            <Button variant="outline" className="w-full mb-8" asChild>
              <Link href="/contact">Contact Sales</Link>
            </Button>
            <ul className="space-y-4 flex-1">
              {[
                "Everything in Professional",
                "Custom API Integration",
                "Dedicated Account Manager",
                "SSO & Advanced Security",
                "Training & Onboarding",
                "SLA Guarantees",
              ].map((feature, i) => (
                <li key={i} className="flex items-start">
                  <Check className="w-5 h-5 text-[#308970] mr-3 shrink-0" />
                  <span className="text-[#1C212B]/80 text-sm">{feature}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

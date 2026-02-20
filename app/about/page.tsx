import Image from "next/image";
import { Users, Shield, Zap, Globe } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#F2F1EE]">
      {/* Hero Section */}
      <section className="bg-[#1C212B] text-white py-24">
        <div className="container mx-auto px-6 text-center">
          <h1 className="text-4xl md:text-6xl font-bold font-serif mb-6">
            Democratizing Legal Intelligence
          </h1>
          <p className="text-xl text-white/70 max-w-2xl mx-auto leading-relaxed">
            We're on a mission to make professional-grade legal document analysis accessible, accurate, and instant for everyone effectively leveling the playing field.
          </p>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 px-6">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-white p-8 rounded-xl border border-[#E5E5E5] shadow-sm">
              <div className="w-12 h-12 bg-[#308970]/10 rounded-lg flex items-center justify-center mb-6">
                 <Shield className="w-6 h-6 text-[#308970]" />
              </div>
              <h3 className="text-xl font-bold text-[#1C212B] mb-3">Trust First</h3>
              <p className="text-[#1C212B]/70">Security and confidentiality are at the core of everything we build. Your data never trains our public models.</p>
            </div>
            <div className="bg-white p-8 rounded-xl border border-[#E5E5E5] shadow-sm">
              <div className="w-12 h-12 bg-[#308970]/10 rounded-lg flex items-center justify-center mb-6">
                 <Zap className="w-6 h-6 text-[#308970]" />
              </div>
              <h3 className="text-xl font-bold text-[#1C212B] mb-3">Radical Speed</h3>
              <p className="text-[#1C212B]/70">We believe legal review shouldn't take days. Our AI analyzes complex contracts in seconds.</p>
            </div>
             <div className="bg-white p-8 rounded-xl border border-[#E5E5E5] shadow-sm">
              <div className="w-12 h-12 bg-[#308970]/10 rounded-lg flex items-center justify-center mb-6">
                 <Users className="w-6 h-6 text-[#308970]" />
              </div>
              <h3 className="text-xl font-bold text-[#1C212B] mb-3">Human Centric</h3>
              <p className="text-[#1C212B]/70">AI suggests, humans decide. We build tools that empower legal professionals, not replace them.</p>
            </div>
             <div className="bg-white p-8 rounded-xl border border-[#E5E5E5] shadow-sm">
              <div className="w-12 h-12 bg-[#308970]/10 rounded-lg flex items-center justify-center mb-6">
                 <Globe className="w-6 h-6 text-[#308970]" />
              </div>
              <h3 className="text-xl font-bold text-[#1C212B] mb-3">Global Standard</h3>
              <p className="text-[#1C212B]/70">Trained on international law and jurisdictions to serve a global client base effectively.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section (Placeholder) */}
      <section className="py-20 bg-white border-t border-[#E5E5E5]">
        <div className="container mx-auto px-6 text-center">
            <h2 className="text-3xl font-bold text-[#1C212B] mb-12 font-serif">Meet the Experts</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 max-w-4xl mx-auto">
                 {/* Team Member 1 */}
                <div className="group cursor-pointer">
                    <div className="w-32 h-32 bg-[#F2F1EE] rounded-full mx-auto mb-6 overflow-hidden border-2 border-transparent group-hover:border-[#308970] transition-all">
                        {/* Placeholder for legal image */}
                        <div className="w-full h-full flex items-center justify-center text-[#1C212B]/30">Photo</div>
                    </div>
                    <h3 className="text-xl font-bold text-[#1C212B]">Sarah Jennings</h3>
                    <p className="text-[#308970] font-medium mb-2">CEO & Co-Founder</p>
                    <p className="text-sm text-[#1C212B]/60">Former Big Law partner with 15+ years of M&A experience.</p>
                </div>
                 {/* Team Member 2 */}
                <div className="group cursor-pointer">
                    <div className="w-32 h-32 bg-[#F2F1EE] rounded-full mx-auto mb-6 overflow-hidden border-2 border-transparent group-hover:border-[#308970] transition-all">
                         <div className="w-full h-full flex items-center justify-center text-[#1C212B]/30">Photo</div>
                    </div>
                    <h3 className="text-xl font-bold text-[#1C212B]">David Chen</h3>
                    <p className="text-[#308970] font-medium mb-2">CTO & Co-Founder</p>
                    <p className="text-sm text-[#1C212B]/60">AI Researcher from MIT. Specialized in NLP for legal texts.</p>
                </div>
                 {/* Team Member 3 */}
                <div className="group cursor-pointer">
                    <div className="w-32 h-32 bg-[#F2F1EE] rounded-full mx-auto mb-6 overflow-hidden border-2 border-transparent group-hover:border-[#308970] transition-all">
                        <div className="w-full h-full flex items-center justify-center text-[#1C212B]/30">Photo</div>
                    </div>
                    <h3 className="text-xl font-bold text-[#1C212B]">Elena Rodriguez</h3>
                    <p className="text-[#308970] font-medium mb-2">Head of Product</p>
                    <p className="text-sm text-[#1C212B]/60">Design obsessionist. Making complex tools feel simple.</p>
                </div>
            </div>
        </div>
      </section>
    </div>
  );
}

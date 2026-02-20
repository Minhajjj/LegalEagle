"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Mail, MapPin, Send, Phone, MessageSquare } from "lucide-react";

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-[#F2F1EE] flex flex-col">
      <main className="flex-grow py-20 px-6">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
            {/* Left Side: Brand Info */}
            <div className="space-y-8">
              <div>
                <h2 className="text-4xl font-black text-[#308970] mb-4 uppercase tracking-tighter leading-none">
                  Contact Our <br />
                  Legal Experts
                </h2>
                <p className="text-[#308970]/70 font-bold text-lg max-w-md">
                  Have questions about our AI forensic analysis? Our team is
                  here to help.
                </p>
              </div>

              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-[#308970] rounded-xl flex items-center justify-center shrink-0">
                    <Mail className="text-white w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-black text-[#308970] uppercase tracking-widest text-xs mb-1">
                      Email
                    </h4>
                    <p className="text-[#308970] font-bold">
                      support@legaleagle.ai
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-[#308970] rounded-xl flex items-center justify-center shrink-0">
                    <Phone className="text-white w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-black text-[#308970] uppercase tracking-widest text-xs mb-1">
                      Phone
                    </h4>
                    <p className="text-[#308970] font-bold">
                      +1 (555) 000-EAGLE
                    </p>
                  </div>
                </div>
              </div>

              <div className="pt-8 border-t border-[#308970]/20 flex items-center space-x-4 text-[#308970]/50 font-black text-xs uppercase tracking-[0.2em]">
                <MessageSquare className="w-4 h-4" />
                <span>Typical response: 2 hours</span>
              </div>
            </div>

            {/* Right Side: Form */}
            <div className="bg-white border-2 border-[#308970]/10 rounded-[40px] p-8 md:p-12 shadow-sm">
              {!submitted ? (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-xs font-black text-[#308970] uppercase tracking-widest">
                      Full Name
                    </label>
                    <Input
                      placeholder="Jane Doe"
                      className="bg-[#F2F1EE]/50 border-none rounded-xl py-6 font-bold text-[#308970]"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-black text-[#308970] uppercase tracking-widest">
                      Email Address
                    </label>
                    <Input
                      type="email"
                      placeholder="jane@company.com"
                      className="bg-[#F2F1EE]/50 border-none rounded-xl py-6 font-bold text-[#308970]"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-black text-[#308970] uppercase tracking-widest">
                      Message
                    </label>
                    <Textarea
                      placeholder="How can we help you today?"
                      className="bg-[#F2F1EE]/50 border-none rounded-xl min-h-[150px] font-bold text-[#308970]"
                      required
                    />
                  </div>
                  <Button
                    type="submit"
                    className="w-full bg-[#308970] text-white py-8 rounded-2xl font-black uppercase tracking-widest hover:scale-[1.02] transition-transform flex items-center justify-center gap-3"
                  >
                    <Send className="w-5 h-5" />
                    Send Message
                  </Button>
                </form>
              ) : (
                <div className="text-center py-20">
                  <div className="w-20 h-20 bg-[#308970]/10 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Send className="text-[#308970] w-10 h-10" />
                  </div>
                  <h3 className="text-2xl font-black text-[#308970] mb-2 uppercase">
                    Sent!
                  </h3>
                  <p className="text-[#308970]/70 font-bold">
                    We'll get back to you shortly.
                  </p>
                  <Button
                    variant="ghost"
                    onClick={() => setSubmitted(false)}
                    className="mt-8 text-[#308970] font-black uppercase text-xs tracking-widest"
                  >
                    New Message
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

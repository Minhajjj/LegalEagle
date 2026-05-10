"use client";
import { use, useMemo, useState } from "react";
import { Sidebar } from "@/components/sidebar";
import { templates } from "@/lib/templates";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Printer } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { le } from "@/lib/design-system";

export default function TemplateBuilderPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const templateId = parseInt(resolvedParams.id, 10);
  const template = templates.find((t) => t.id === templateId);

  if (!template) {
    notFound();
  }

  // Extract unique variables from the template content (e.g. {{Company_Name}})
  const variables = useMemo(() => {
    const matches = template.content.match(/\{\{(.*?)\}\}/g);
    if (!matches) return [];
    // Remove brackets and get unique values
    const cleanVars = matches.map((m) => m.replace(/\{\{|\}\}/g, ""));
    return Array.from(new Set(cleanVars));
  }, [template.content]);

  // State to hold the user's input for each variable
  const [values, setValues] = useState<Record<string, string>>({});

  const handleInputChange = (variable: string, value: string) => {
    setValues((prev) => ({ ...prev, [variable]: value }));
  };

  // Generate the live preview content with highlights
  const previewContent = useMemo(() => {
    // Split by variables, keeping the variable in the array
    const parts = template.content.split(/(\{\{.*?\}\})/g);
    
    return parts.map((part, index) => {
      if (part.startsWith("{{") && part.endsWith("}}")) {
        const variable = part.replace(/\{\{|\}\}/g, "");
        const userValue = values[variable];
        const isFilled = Boolean(userValue);
        const displayValue = userValue || `[${variable.replace(/_/g, " ")}]`;
        
        return (
          <span 
            key={index} 
            className={isFilled ? "bg-[#2563eb]/15 text-[#1a3a52] font-bold px-1 rounded-sm transition-colors print:bg-transparent print:text-inherit print:p-0 print:font-normal" : "text-gray-400 font-normal"}
          >
            {displayValue}
          </span>
        );
      }
      return <span key={index}>{part}</span>;
    });
  }, [template.content, values]);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row" style={{ backgroundColor: le.background }}>
      <div className="print:hidden">
        <Sidebar />
      </div>

      {/* Main Content Area */}
      <div className="flex-1 md:ml-20 flex flex-col h-screen print:h-auto print:ml-0">
        
        {/* Header - Hidden on Print */}
        <header className="bg-white border-b border-slate-200 px-8 py-4 flex items-center justify-between shrink-0 print:hidden z-10 sticky top-0">
          <div className="flex items-center gap-4">
            <Link href="/templates">
              <Button variant="ghost" size="icon" className="text-slate-500 hover:text-[#2563eb]">
                <ArrowLeft className="w-5 h-5" />
              </Button>
            </Link>
            <div>
              <h1 className="text-xl font-bold text-[#0f172a]">{template.name}</h1>
              <span className="text-xs px-2 py-0.5 rounded-full uppercase font-bold tracking-wider bg-[#1a3a52]/10 text-[#1a3a52]">
                {template.category}
              </span>
            </div>
          </div>
          <Button onClick={handlePrint}>
            <Printer className="w-4 h-4 mr-2" />
            Save as PDF
          </Button>
        </header>

        {/* Builder Area */}
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden print:overflow-visible">
          
          {/* Sidebar Form - Hidden on Print */}
          <aside className="w-full md:w-[350px] bg-white border-r border-slate-200 overflow-y-auto shrink-0 print:hidden p-6 space-y-6 shadow-[4px_0_24px_rgba(0,0,0,0.02)] z-0">
            <div>
              <h2 className="text-lg font-bold text-[#0f172a] mb-2">Fill Details</h2>
              <p className="text-sm text-[#64748b] mb-6">
                Fill in the fields below to automatically populate the document on the right.
              </p>
            </div>

            {variables.length === 0 ? (
              <p className="text-sm font-medium text-[#2563eb]">No variables found in this template.</p>
            ) : (
              <div className="space-y-4">
                {variables.map((variable) => (
                  <div key={variable} className="space-y-1.5">
                    <label className="text-sm font-semibold text-[#0f172a]/80 capitalize">
                      {variable.replace(/_/g, " ")}
                    </label>
                    <Input
                      placeholder={`Enter ${variable.replace(/_/g, " ").toLowerCase()}`}
                      value={values[variable] || ""}
                      onChange={(e) => handleInputChange(variable, e.target.value)}
                      className="border-slate-200 focus-visible:ring-[#2563eb]/35"
                    />
                  </div>
                ))}
              </div>
            )}
          </aside>

          {/* Document Preview Area */}
          <main className="flex-1 overflow-y-auto print:bg-white p-8 md:p-12 print:p-0 flex justify-center" style={{ backgroundColor: le.background }}>
            
            {/* The Document Page itself */}
            <div className="w-full max-w-[850px] bg-white print:shadow-none shadow-xl rounded-sm min-h-[1100px] p-12 md:p-20 print:p-0">
              <pre className="whitespace-pre-wrap font-serif text-[15px] leading-relaxed text-black font-medium">
                {previewContent}
              </pre>
            </div>
            
          </main>
        </div>

      </div>
    </div>
  );
}

"use client";
import { Sidebar } from "@/components/sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileCheck, Download } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function TemplatesPage() {
  const templates = [
    {
      id: 1,
      name: "Employment Agreement",
      description: "Standard employment contract template with comprehensive terms",
      category: "Employment",
      downloads: 1243,
    },
    {
      id: 2,
      name: "NDA Template",
      description: "Non-disclosure agreement template for protecting confidential information",
      category: "Confidentiality",
      downloads: 892,
    },
    {
      id: 3,
      name: "Service Contract",
      description: "Professional service agreement template for client engagements",
      category: "Services",
      downloads: 654,
    },
    {
      id: 4,
      name: "Lease Agreement",
      description: "Commercial and residential lease agreement templates",
      category: "Real Estate",
      downloads: 432,
    },
    {
      id: 5,
      name: "Partnership Agreement",
      description: "Business partnership agreement with profit-sharing terms",
      category: "Business",
      downloads: 321,
    },
    {
      id: 6,
      name: "Purchase Agreement",
      description: "Asset and equipment purchase agreement template",
      category: "Commercial",
      downloads: 289,
    },
  ];

  return (
    <div className="min-h-screen bg-[#F2F1EE]">
      <div className="flex">
        <Sidebar />
        
        <div className="flex-1 ml-20">
          <div className="container mx-auto px-8 py-12">
            <div className="mb-8">
              <h1 className="text-4xl font-bold text-[#1C212B] mb-2">Standard Templates</h1>
              <p className="text-[#1C212B]/60">Browse and download professional legal document templates</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {templates.map((template) => (
                <Card key={template.id} className="hover:shadow-lg transition-all">
                  <CardHeader>
                    <div className="flex items-start justify-between mb-2">
                      <FileCheck className="w-8 h-8 text-[#308970]" />
                      <span className="text-xs px-2 py-1 bg-[#308970]/10 text-[#308970] rounded">
                        {template.category}
                      </span>
                    </div>
                    <CardTitle className="text-lg">{template.name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-[#1C212B]/70 mb-4">{template.description}</p>
                    <div className="flex items-center justify-between">
                      <p className="text-xs text-[#1C212B]/50">{template.downloads} downloads</p>
                      <Button size="sm" variant="outline">
                        <Download className="w-4 h-4 mr-2" />
                        Download
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


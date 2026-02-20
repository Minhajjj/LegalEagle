import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { FileText } from "lucide-react";

interface DocumentCardProps {
  name: string;
  riskLevel: "Low" | "Medium" | "High";
  date: string;
  onClick?: () => void;
}

const riskColors = {
  Low: "bg-[#308970]",
  Medium: "bg-[#F4A261]",
  High: "bg-[#E63946]",
};

export function DocumentCard({ name, riskLevel, date, onClick }: DocumentCardProps) {
  return (
    <Card
      className={cn(
        "cursor-pointer transition-all hover:shadow-lg hover:border-[#308970]/30",
        "border border-[#E5E5E5]"
      )}
      onClick={onClick}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <FileText className="w-5 h-5 text-[#1C212B]/50" />
          <div className={cn("w-2 h-2 rounded-full", riskColors[riskLevel])} />
        </div>
      </CardHeader>
      <CardContent>
        <h3 className="font-semibold text-[#1C212B] mb-2 line-clamp-2">{name}</h3>
        <p className="text-xs text-[#1C212B]/60">{date}</p>
      </CardContent>
    </Card>
  );
}


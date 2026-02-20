import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface RiskCardProps {
  severity: "High" | "Medium" | "Low";
  clauseName: string;
  explanation: string;
}

const severityStyles = {
  High: {
    bg: "bg-[#308970]/5",
    border: "border-l-4 border-[#E63946]",
  },
  Medium: {
    bg: "bg-[#308970]/5",
    border: "border-l-4 border-[#F4A261]",
  },
  Low: {
    bg: "bg-[#308970]/5",
    border: "border-l-4 border-[#308970]",
  },
};

export function RiskCard({ severity, clauseName, explanation }: RiskCardProps) {
  const styles = severityStyles[severity];

  return (
    <Card
      className={cn(
        "mb-3 cursor-pointer transition-all hover:shadow-md",
        styles.bg,
        styles.border
      )}
    >
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-2">
          <span
            className={cn(
              "text-xs font-semibold uppercase tracking-wide",
              severity === "High" && "text-[#E63946]",
              severity === "Medium" && "text-[#F4A261]",
              severity === "Low" && "text-[#308970]"
            )}
          >
            {severity} Risk
          </span>
        </div>
        <h4 className="font-semibold text-[#1C212B] mb-2">{clauseName}</h4>
        <p className="text-sm text-[#1C212B]/70 leading-relaxed">
          {explanation}
        </p>
      </CardContent>
    </Card>
  );
}


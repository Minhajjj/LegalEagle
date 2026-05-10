"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { FileText, MoreVertical, Edit2, Trash2 } from "lucide-react";
import { motion } from "framer-motion";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { le } from "@/lib/design-system";
import { useAppReducedMotion } from "@/lib/motion-utils";

interface DocumentCardProps {
  name: string;
  riskLevel: "Low" | "Medium" | "High";
  date: string;
  onClick?: () => void;
  onRename?: (e: React.MouseEvent) => void;
  onDelete?: (e: React.MouseEvent) => void;
}

const riskColors = {
  Low: le.success,
  Medium: le.medium,
  High: le.warning,
};

export function DocumentCard({ name, riskLevel, date, onClick, onRename, onDelete }: DocumentCardProps) {
  const reduceMotion = useAppReducedMotion();

  return (
    <motion.div
      whileHover={
        reduceMotion
          ? undefined
          : { y: -4, boxShadow: "0 12px 28px rgba(15,23,42,0.12)" }
      }
      transition={{ duration: 0.2 }}
    >
      <Card
        className={cn(
          "cursor-pointer border border-slate-200/90 rounded-[12px] bg-white shadow-sm shadow-slate-200/30",
        )}
        onClick={onClick}
      >
        <CardHeader className="pb-3 relative">
          <div className="flex items-start justify-between">
            <FileText className="w-5 h-5" style={{ color: le.muted }} />
            
            <div className="flex items-center gap-2">
              <div
                className="w-2.5 h-2.5 rounded-full"
                style={{ backgroundColor: riskColors[riskLevel] }}
              />
              
              {(onRename || onDelete) && (
                <div onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-7 w-7 text-slate-500 hover:text-slate-800 -mr-2">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-40 rounded-xl border-slate-200 shadow-xl" onClick={(e) => e.stopPropagation()}>
                      {onRename && (
                        <DropdownMenuItem onClick={onRename} className="cursor-pointer rounded-lg">
                          <Edit2 className="mr-2 h-4 w-4 text-slate-500" />
                          <span>Rename</span>
                        </DropdownMenuItem>
                      )}
                      {onRename && onDelete && <DropdownMenuSeparator />}
                      {onDelete && (
                        <DropdownMenuItem onClick={onDelete} className="cursor-pointer rounded-lg text-red-600 focus:text-red-600">
                          <Trash2 className="mr-2 h-4 w-4" />
                          <span>Delete</span>
                        </DropdownMenuItem>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <h3
            className="font-semibold mb-2 line-clamp-2"
            style={{ color: le.text }}
          >
            {name}
          </h3>
          <p className="text-sm" style={{ color: le.muted }}>
            {date}
          </p>
        </CardContent>
      </Card>
    </motion.div>
  );
}

"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";
import { motion } from "framer-motion";
import { le } from "@/lib/design-system";
import { springSnappy, useAppReducedMotion } from "@/lib/motion-utils";

interface ChatInputProps {
  onSend?: (message: string) => void;
  placeholder?: string;
}

export function ChatInput({
  onSend,
  placeholder = "Ask about this document…",
}: ChatInputProps) {
  const reduceMotion = useAppReducedMotion();
  const [message, setMessage] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && onSend) {
      onSend(message);
      setMessage("");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex items-center gap-2 p-3 bg-white rounded-[12px] shadow-lg border border-slate-200"
    >
      <Input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder={placeholder}
        className="border-0 focus-visible:ring-2 bg-transparent flex-1 rounded-[8px]"
        style={
          {
            ["--tw-ring-color" as string]: `${le.secondary}40`,
          } as React.CSSProperties
        }
      />
      <motion.div
        whileHover={reduceMotion ? undefined : { scale: 1.05 }}
        whileTap={reduceMotion ? undefined : { scale: 0.94 }}
        transition={springSnappy}
      >
        <Button
          type="submit"
          size="icon"
          className="rounded-[8px] text-white shadow-md border-0"
          style={{ backgroundColor: le.secondary }}
        >
          <Send className="w-4 h-4" />
        </Button>
      </motion.div>
    </form>
  );
}

"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";

interface ChatInputProps {
  onSend?: (message: string) => void;
  placeholder?: string;
}

export function ChatInput({ onSend, placeholder = "Ask about this document..." }: ChatInputProps) {
  const [message, setMessage] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && onSend) {
      onSend(message);
      setMessage("");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex items-center gap-2 p-4 bg-white rounded-full shadow-lg border border-[#E5E5E5]">
      <Input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder={placeholder}
        className="border-0 focus-visible:ring-0 bg-transparent flex-1"
      />
      <Button
        type="submit"
        size="icon"
        className="rounded-full bg-[#308970] hover:bg-[#2a7863]"
      >
        <Send className="w-4 h-4" />
      </Button>
    </form>
  );
}


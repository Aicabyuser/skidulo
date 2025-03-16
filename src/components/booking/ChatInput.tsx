
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";
import { useTranslation } from "react-i18next";

interface ChatInputProps {
  onSubmit: (message: string) => void;
  isDisabled: boolean;
}

const ChatInput = ({ onSubmit, isDisabled }: ChatInputProps) => {
  const [inputValue, setInputValue] = useState("");
  const { t } = useTranslation();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || isDisabled) return;
    
    onSubmit(inputValue.trim());
    setInputValue("");
  };

  return (
    <form onSubmit={handleSubmit} className="w-full flex gap-2">
      <Input
        placeholder={t("booking.assistant.askAbout")}
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        className="flex-grow"
        disabled={isDisabled}
      />
      <Button type="submit" size="icon" disabled={isDisabled || !inputValue.trim()}>
        <Send className="h-4 w-4" />
      </Button>
    </form>
  );
};

export default ChatInput;

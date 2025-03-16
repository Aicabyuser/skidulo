
import React, { useState } from "react";
import { 
  FormField, 
  FormItem, 
  FormLabel, 
  FormControl, 
  FormMessage 
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { useFormContext } from "react-hook-form";
import AiSuggestionGenerator from "./AiSuggestionGenerator";
import { useTranslation } from "react-i18next";

const NotesField = () => {
  const [aiSuggestion, setAiSuggestion] = useState("");
  const form = useFormContext();
  const { t } = useTranslation();

  return (
    <FormField
      control={form.control}
      name="notes"
      render={({ field }) => (
        <FormItem>
          <div className="flex justify-between items-center">
            <FormLabel>{t("booking.additionalNotes")}</FormLabel>
            <AiSuggestionGenerator 
              setAiSuggestion={setAiSuggestion} 
              aiSuggestion={aiSuggestion}
            />
          </div>
          <FormControl>
            <Textarea 
              placeholder={t("booking.notesPlaceholder")} 
              className="resize-none min-h-[100px]" 
              {...field} 
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default NotesField;

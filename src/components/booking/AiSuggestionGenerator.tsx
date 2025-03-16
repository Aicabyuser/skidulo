
import React, { useState } from "react";
import { Loader2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useFormContext } from "react-hook-form";

interface AiSuggestionGeneratorProps {
  setAiSuggestion: (suggestion: string) => void;
  aiSuggestion: string;
}

const AiSuggestionGenerator = ({ 
  setAiSuggestion, 
  aiSuggestion 
}: AiSuggestionGeneratorProps) => {
  const [isGeneratingSuggestion, setIsGeneratingSuggestion] = useState(false);
  const form = useFormContext();

  const generateAiSuggestion = () => {
    setIsGeneratingSuggestion(true);
    
    // Simulate AI generating meeting notes/suggestions
    setTimeout(() => {
      const suggestions = [
        `I'm looking forward to discussing how ${form.getValues().serviceName} can help me achieve my goals.`,
        `I have some specific questions about ${form.getValues().serviceName} that I'd like to address during our meeting.`,
        `I'm interested in learning more about how we can work together on ${form.getValues().serviceName}.`,
        `I've been researching ${form.getValues().serviceName} and would like to explore how it fits my needs.`,
      ];
      
      const randomSuggestion = suggestions[Math.floor(Math.random() * suggestions.length)];
      setAiSuggestion(randomSuggestion);
      setIsGeneratingSuggestion(false);
    }, 1500);
  };

  const useAiSuggestion = () => {
    form.setValue("notes", aiSuggestion);
    toast.success("AI suggestion added to notes");
    setAiSuggestion("");
  };

  return (
    <>
      <Button
        type="button"
        variant="ghost" 
        size="sm"
        className="text-highlight-purple gap-1 h-8"
        onClick={generateAiSuggestion}
        disabled={isGeneratingSuggestion}
      >
        {isGeneratingSuggestion ? (
          <>
            <Loader2 className="h-3 w-3 animate-spin" />
            Generating...
          </>
        ) : (
          <>
            <Sparkles className="h-3 w-3" />
            Get AI Suggestion
          </>
        )}
      </Button>
      
      {aiSuggestion && (
        <div className="mt-2 p-3 bg-highlight-purple/5 border border-highlight-purple/10 rounded-md">
          <p className="text-sm font-medium mb-2 flex items-center gap-1">
            <Sparkles className="h-3 w-3 text-highlight-purple" />
            AI Suggestion:
          </p>
          <p className="text-sm text-muted-foreground mb-2">{aiSuggestion}</p>
          <Button 
            type="button" 
            variant="outline" 
            size="sm" 
            className="text-xs border-highlight-purple/20 text-highlight-purple"
            onClick={useAiSuggestion}
          >
            Use This Suggestion
          </Button>
        </div>
      )}
    </>
  );
};

export default AiSuggestionGenerator;

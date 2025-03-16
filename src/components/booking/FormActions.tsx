
import React from "react";
import { Button } from "@/components/ui/button";
import { CalendarClock, Loader2, CreditCard } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { useTranslation } from "react-i18next";

interface FormActionsProps {
  isSubmitting: boolean;
  showPayment?: boolean;
  price?: number;
}

const FormActions = ({ isSubmitting, showPayment = false, price = 0 }: FormActionsProps) => {
  const isMobile = useIsMobile();
  const { t } = useTranslation();
  
  return (
    <div className="pt-4 flex flex-col sm:flex-row justify-between gap-4">
      <Button
        type="button"
        variant="outline"
        className="order-2 sm:order-1 border-highlight-purple/20 text-highlight-purple hover:bg-highlight-purple/5"
        onClick={() => window.history.back()}
        size={isMobile ? "sm" : "default"}
      >
        {t("booking.cancel")}
      </Button>
      <Button
        type="submit"
        disabled={isSubmitting}
        className="order-1 sm:order-2 rounded-full shadow-lg bg-gradient-to-r from-highlight-purple to-highlight-blue hover:from-highlight-purple/90 hover:to-highlight-blue/90"
        size={isMobile ? "sm" : "default"}
      >
        {isSubmitting ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            {isMobile ? t("booking.processing") : t("booking.processingRequest")}
          </>
        ) : showPayment ? (
          <>
            <CreditCard className="mr-2 h-4 w-4" />
            {isMobile ? t("booking.payNow") : t("booking.proceedToPayment")}
          </>
        ) : (
          <>
            <CalendarClock className="mr-2 h-4 w-4" />
            {isMobile 
              ? (price > 0 ? `${t("booking.continue")} ($${price})` : t("booking.confirm")) 
              : (price > 0 ? `${t("booking.continue")} (${price > 0 ? `$${price}` : t("booking.free")})` : t("booking.confirmBooking"))
            }
          </>
        )}
      </Button>
    </div>
  );
};

export default FormActions;

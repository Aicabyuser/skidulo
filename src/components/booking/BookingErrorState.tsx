
import React from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardHeader, CardContent, CardFooter, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";

interface BookingErrorStateProps {
  username: string | undefined;
}

const BookingErrorState = ({ username }: BookingErrorStateProps) => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <Card className="w-full max-w-md p-6 text-center">
        <CardHeader>
          <CardTitle className="text-xl text-red-500">{t("booking.providerNotFound.title")}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-4">
            {t("booking.providerNotFound.message")} "{username}"
          </p>
        </CardContent>
        <CardFooter className="flex justify-center">
          <Button 
            onClick={() => navigate("/")}
            className="rounded-full shadow-lg bg-gradient-to-r from-highlight-purple to-highlight-blue"
          >
            {t("booking.providerNotFound.returnHome")}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default BookingErrorState;

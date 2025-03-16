
import React from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

const CtaSection = () => {
  const { t } = useTranslation();
  
  return (
    <section className="py-16 md:py-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-radial from-highlight-purple/5 to-transparent -z-10"></div>
      <div className="absolute -top-40 -right-40 w-80 h-80 bg-highlight-blue/10 rounded-full filter blur-3xl"></div>
      <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-highlight-purple/10 rounded-full filter blur-3xl"></div>
      
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center backdrop-blur-sm p-8 rounded-2xl border border-highlight-purple/10 shadow-xl">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-highlight-purple to-highlight-blue">
            {t("cta.title")}
          </h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            {t("cta.subtitle")}
          </p>
          <Button size="lg" asChild className="rounded-full shadow-lg bg-gradient-to-r from-highlight-purple to-highlight-blue hover:from-highlight-purple/90 hover:to-highlight-blue/90">
            <Link to="/signup">{t("cta.getStarted")}</Link>
          </Button>
          <p className="text-sm text-muted-foreground mt-4">
            {t("cta.noCreditCard")}
          </p>
        </div>
      </div>
    </section>
  );
};

export default CtaSection;

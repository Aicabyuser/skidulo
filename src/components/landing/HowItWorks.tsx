
import React from "react";
import { useTranslation } from "react-i18next";

const HowItWorks = () => {
  const { t } = useTranslation();
  
  const steps = [
    {
      step: "01",
      title: t("howItWorks.step1.title"),
      description: t("howItWorks.step1.description"),
      gradient: "from-highlight-purple to-highlight-blue"
    },
    {
      step: "02",
      title: t("howItWorks.step2.title"),
      description: t("howItWorks.step2.description"),
      gradient: "from-highlight-blue to-highlight-teal"
    },
    {
      step: "03",
      title: t("howItWorks.step3.title"),
      description: t("howItWorks.step3.description"),
      gradient: "from-highlight-teal to-highlight-purple"
    }
  ];

  return (
    <section id="how-it-works" className="py-16 md:py-24 relative">
      <div className="absolute top-1/3 left-0 w-80 h-80 bg-highlight-pink/5 rounded-full filter blur-3xl -z-10"></div>
      
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-highlight-purple to-highlight-pink">
            {t("howItWorks.title")}
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {t("howItWorks.subtitle")}
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-12">
          {steps.map((step, i) => (
            <div key={i} className="relative backdrop-blur-sm p-8 rounded-2xl border border-highlight-purple/10 hover:shadow-lg transition-all">
              <div className={`absolute -top-4 -right-4 bg-gradient-to-br ${step.gradient} text-white w-12 h-12 rounded-full flex items-center justify-center font-bold shadow-lg animate-float`}>
                {step.step}
              </div>
              <h3 className="text-xl font-medium mb-3">{step.title}</h3>
              <p className="text-muted-foreground">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;

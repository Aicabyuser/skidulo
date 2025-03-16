
import React from "react";
import { useTranslation } from "react-i18next";

const StatsSection = () => {
  const { t } = useTranslation();
  
  return (
    <section className="py-12 bg-gradient-to-b from-background/0 to-secondary/10">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {[
            { value: "3M+", label: t("stats.meetings"), color: "from-highlight-purple to-highlight-blue" },
            { value: "100K+", label: t("stats.users"), color: "from-highlight-blue to-highlight-teal" },
            { value: "150+", label: t("stats.countries"), color: "from-highlight-teal to-highlight-blue" },
            { value: "99.9%", label: t("stats.uptime"), color: "from-highlight-pink to-highlight-purple" }
          ].map((stat, i) => (
            <div key={i} className="p-4">
              <div className={`text-2xl md:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r ${stat.color}`}>
                {stat.value}
              </div>
              <div className="text-sm text-muted-foreground mt-1">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsSection;

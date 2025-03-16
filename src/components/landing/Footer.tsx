
import React from "react";
import { CalendarClock } from "lucide-react";
import { useTranslation } from "react-i18next";
import LanguageSelector from "@/components/common/LanguageSelector";

const Footer = () => {
  const { t } = useTranslation();
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="border-t border-border/40 backdrop-blur-sm bg-background/70 py-12">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center gap-2 mb-6 md:mb-0">
            <div className="bg-gradient-primary p-2 rounded-full">
              <CalendarClock className="h-5 w-5 text-white" />
            </div>
            <span className="font-bold bg-clip-text text-transparent bg-gradient-to-r from-highlight-purple to-highlight-blue">
              Skidulo.com
            </span>
          </div>
          <div className="flex flex-wrap justify-center gap-6 mb-6 md:mb-0">
            <a href="#" className="text-sm text-muted-foreground hover:text-highlight-purple transition-colors">{t("footer.about")}</a>
            <a href="#" className="text-sm text-muted-foreground hover:text-highlight-blue transition-colors">{t("footer.privacy")}</a>
            <a href="#" className="text-sm text-muted-foreground hover:text-highlight-teal transition-colors">{t("footer.terms")}</a>
            <a href="#" className="text-sm text-muted-foreground hover:text-highlight-pink transition-colors">{t("footer.contact")}</a>
            <a href="#" className="text-sm text-muted-foreground hover:text-highlight-orange transition-colors">{t("footer.blog")}</a>
            <LanguageSelector />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">© {currentYear} Skidulo. {t("footer.rights")}</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

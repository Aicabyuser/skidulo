
import React from "react";
import { Link } from "react-router-dom";
import { CalendarClock, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetClose } from "@/components/ui/sheet";
import { useIsMobile } from "@/hooks/use-mobile";
import { useTranslation } from "react-i18next";
import LanguageSelector from "@/components/common/LanguageSelector";

const Header = () => {
  const isMobile = useIsMobile();
  const { t } = useTranslation();
  
  const navLinks = [
    { href: "#features", label: t("header.features"), color: "highlight-blue" },
    { href: "#how-it-works", label: t("header.howItWorks"), color: "highlight-purple" },
    { href: "#testimonials", label: t("header.testimonials"), color: "highlight-teal" },
    { href: "#pricing", label: t("header.pricing"), color: "highlight-pink" },
    { href: "/contact", label: t("header.contact"), color: "highlight-orange", isRoute: true },
    { href: "/booking/johndoe", label: t("header.demoBooking"), color: "highlight-blue", isRoute: true }
  ];

  const NavLinks = ({ onClick }: { onClick?: () => void }) => (
    <>
      {navLinks.map((link, index) => (
        link.isRoute ? (
          <Link 
            key={index}
            to={link.href}
            className={`text-sm font-medium hover:text-${link.color} transition-colors`}
            onClick={onClick}
          >
            {link.label}
          </Link>
        ) : (
          <a 
            key={index}
            href={link.href} 
            className={`text-sm font-medium hover:text-${link.color} transition-colors`}
            onClick={onClick}
          >
            {link.label}
          </a>
        )
      ))}
    </>
  );

  return (
    <header className="sticky top-0 z-50 backdrop-blur-xl bg-background/70 border-b border-border/40 shadow-sm">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="bg-gradient-primary p-2 rounded-full">
            <CalendarClock className="h-6 w-6 text-white" />
          </div>
          <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-highlight-purple to-highlight-blue">
            Skidulo.com
          </span>
        </div>
        
        {isMobile ? (
          <div className="flex items-center gap-2">
            <LanguageSelector />
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Open menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[250px] sm:w-[300px]">
                <div className="flex flex-col gap-6 mt-8">
                  <nav className="flex flex-col space-y-6">
                    <NavLinks onClick={() => document.querySelector<HTMLButtonElement>("[data-radix-collection-item]")?.click()} />
                  </nav>
                  <div className="flex flex-col gap-3 mt-4">
                    <Button variant="outline" asChild className="w-full justify-center rounded-full border-highlight-blue/20 text-highlight-blue">
                      <Link to="/signin">{t("header.login")}</Link>
                    </Button>
                    <Button asChild className="w-full justify-center rounded-full shadow-lg bg-gradient-to-r from-highlight-purple to-highlight-blue hover:from-highlight-purple/90 hover:to-highlight-blue/90">
                      <Link to="/signup">{t("header.signup")}</Link>
                    </Button>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        ) : (
          <>
            <nav className="hidden md:flex items-center space-x-8">
              <NavLinks />
            </nav>
            <div className="hidden md:flex items-center space-x-4">
              <LanguageSelector />
              <Button variant="outline" asChild className="rounded-full border-highlight-blue/20 text-highlight-blue backdrop-blur-sm">
                <Link to="/signin">{t("header.login")}</Link>
              </Button>
              <Button asChild className="rounded-full shadow-lg bg-gradient-to-r from-highlight-purple to-highlight-blue hover:from-highlight-purple/90 hover:to-highlight-blue/90">
                <Link to="/signup">{t("header.signup")}</Link>
              </Button>
            </div>
          </>
        )}
      </div>
    </header>
  );
};

export default Header;


import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { useTranslation } from "react-i18next";

const Testimonials = () => {
  const { t } = useTranslation();
  
  const testimonials = [
    {
      quote: "Skidulo has completely transformed how I schedule client meetings. No more back-and-forth emails!",
      author: "Sarah J.",
      role: "Marketing Consultant",
      color: "highlight-purple"
    },
    {
      quote: "The seamless calendar integration and automated reminders have reduced our no-show rate by 80%.",
      author: "Michael T.",
      role: "Healthcare Provider",
      color: "highlight-blue"
    },
    {
      quote: "As a remote team, coordinating across time zones was a nightmare until we found Skidulo.",
      author: "Elena R.",
      role: "Product Manager",
      color: "highlight-teal"
    }
  ];

  return (
    <section id="testimonials" className="py-16 md:py-24 bg-gradient-to-b from-background/0 to-secondary/10">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-highlight-orange to-highlight-pink">
            {t("testimonials.title")}
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {t("testimonials.subtitle")}
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, i) => (
            <Card key={i} className="backdrop-blur-md bg-card/60 border-highlight-purple/10 shadow-lg">
              <CardContent className="p-6">
                <div className={`mb-4 text-${testimonial.color}`}>
                  {Array(5).fill(0).map((_, i) => (
                    <span key={i} className="text-lg">★</span>
                  ))}
                </div>
                <p className="mb-6 italic">"{testimonial.quote}"</p>
                <div>
                  <div className={`font-medium text-${testimonial.color}`}>{testimonial.author}</div>
                  <div className="text-sm text-muted-foreground">{testimonial.role}</div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;

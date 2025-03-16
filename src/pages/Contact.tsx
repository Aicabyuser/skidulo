
import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";

const Contact = () => {
  const { t } = useTranslation();
  
  const formSchema = z.object({
    name: z.string().min(2, {
      message: "Name must be at least 2 characters.",
    }),
    email: z.string().email({
      message: "Please enter a valid email address.",
    }),
    subject: z.string().min(5, {
      message: "Subject must be at least 5 characters.",
    }),
    message: z.string().min(10, {
      message: "Message must be at least 10 characters.",
    }),
    subscribe: z.boolean().default(false).optional(),
  });

  type ContactFormValues = z.infer<typeof formSchema>;

  const form = useForm<ContactFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      subject: "",
      message: "",
      subscribe: false,
    },
  });

  function onSubmit(values: ContactFormValues) {
    console.log(values);
    toast.success("Message sent successfully! We'll get back to you soon.");
    form.reset();
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-background to-secondary/20">
      {/* Header section with gradient background */}
      <div className="bg-gradient-to-r from-highlight-purple/10 to-highlight-blue/10 py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-highlight-purple to-highlight-blue">
            {t("contact.getInTouch")}
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {t("contact.subtitle")}
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16 flex flex-col md:flex-row gap-12">
        {/* Contact information */}
        <div className="md:w-1/3 space-y-8">
          <div className="backdrop-blur-md bg-card/60 border border-highlight-purple/10 p-6 rounded-xl shadow-lg">
            <h2 className="text-xl font-semibold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-highlight-purple to-highlight-teal">
              {t("contact.contactInfo")}
            </h2>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground">{t("contact.email")}</p>
                <p className="font-medium">support@skidulo.com</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">{t("contact.phone")}</p>
                <p className="font-medium">+1 (555) 123-4567</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">{t("contact.address")}</p>
                <p className="font-medium">
                  123 Calendar Street<br />
                  San Francisco, CA 94103<br />
                  United States
                </p>
              </div>
            </div>
          </div>

          <div className="backdrop-blur-md bg-card/60 border border-highlight-blue/10 p-6 rounded-xl shadow-lg">
            <h2 className="text-xl font-semibold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-highlight-blue to-highlight-teal">
              {t("contact.businessHours")}
            </h2>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-muted-foreground">{t("contact.mondayFriday")}</span>
                <span>9:00 AM - 6:00 PM</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">{t("contact.saturday")}</span>
                <span>10:00 AM - 4:00 PM</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">{t("contact.sunday")}</span>
                <span>{t("contact.closed")}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Contact form */}
        <div className="md:w-2/3">
          <div className="backdrop-blur-md bg-card/60 border border-highlight-purple/10 p-8 rounded-xl shadow-lg">
            <h2 className="text-2xl font-semibold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-highlight-purple to-highlight-blue">
              {t("contact.sendMessage")}
            </h2>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("contact.name")}</FormLabel>
                        <FormControl>
                          <Input placeholder={t("contact.yourName")} {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("contact.email")}</FormLabel>
                        <FormControl>
                          <Input placeholder={t("contact.yourEmail")} {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="subject"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("contact.subject")}</FormLabel>
                      <FormControl>
                        <Input placeholder={t("contact.subjectPlaceholder")} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="message"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("contact.message")}</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder={t("contact.messagePlaceholder")} 
                          className="min-h-[150px]" 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="subscribe"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>
                          {t("contact.subscribe")}
                        </FormLabel>
                        <FormDescription>
                          {t("contact.subscribeDescription")}
                        </FormDescription>
                      </div>
                    </FormItem>
                  )}
                />

                <Button 
                  type="submit" 
                  className="w-full sm:w-auto bg-gradient-to-r from-highlight-purple to-highlight-blue hover:from-highlight-purple/90 hover:to-highlight-blue/90 transition-all duration-300"
                >
                  {t("contact.send")}
                </Button>
              </form>
            </Form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;

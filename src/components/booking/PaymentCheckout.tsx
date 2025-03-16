
import React from "react";
import { Lock, CreditCard } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import FormActions from "@/components/booking/FormActions";

interface PaymentCheckoutProps {
  price: number;
  onSubmit: (e: React.FormEvent) => void;
  isSubmitting: boolean;
  serviceName?: string; // Add serviceName as an optional prop
}

const PaymentCheckout = ({ price, onSubmit, isSubmitting, serviceName }: PaymentCheckoutProps) => {
  return (
    <form onSubmit={onSubmit}>
      <Card className="backdrop-blur-md bg-card/60 border-highlight-purple/10 shadow-lg">
        <CardHeader className="space-y-1">
          <CardTitle className="text-xl flex items-center">
            <Lock className="mr-2 h-5 w-5 text-highlight-purple" />
            Secure Payment
          </CardTitle>
          <CardDescription>
            Complete your payment to confirm your booking
            {serviceName && ` for ${serviceName}`}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="cardNumber">Card Number</Label>
            <div className="relative">
              <Input 
                id="cardNumber" 
                placeholder="1234 5678 9012 3456" 
                className="pl-10" 
                maxLength={19}
                pattern="[0-9\s]{13,19}"
                required
              />
              <CreditCard className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="expiry">Expiry Date</Label>
              <Input 
                id="expiry" 
                placeholder="MM/YY" 
                maxLength={5}
                pattern="(0[1-9]|1[0-2])\/[0-9]{2}"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="cvc">CVC</Label>
              <Input 
                id="cvc" 
                placeholder="123" 
                maxLength={3}
                pattern="[0-9]{3,4}"
                required
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="name">Name on Card</Label>
            <Input id="name" placeholder="J. Smith" required />
          </div>
          
          <div className="rounded-lg bg-muted/50 p-3">
            <div className="flex justify-between">
              <span>Total amount:</span>
              <span className="font-semibold">${price.toFixed(2)}</span>
            </div>
          </div>
          
          <FormActions 
            isSubmitting={isSubmitting} 
            showPayment={true}
            price={price}
          />
        </CardContent>
      </Card>
    </form>
  );
};

export default PaymentCheckout;

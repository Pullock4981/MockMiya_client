
"use client";

import { useState } from "react";
import { useStripe, useElements, CardElement } from "@stripe/react-stripe-js";
import { Button } from "@/components/ui/button";
import { toast } from "react-toastify";

interface Plan {
  name: string;
  price: string;
  period: string;
  description: string;
  features: string[];
  cta: string;
  popular: boolean;
}

interface PaymentModalProps {
  plan: Plan;
  onClose: () => void;
}

export default function PaymentModal({ plan, onClose }: PaymentModalProps) {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setLoading(true);

    try {
      const res = await fetch("/api/create-payment-intent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan }),
      });

      const data = await res.json();

      const result = await stripe.confirmCardPayment(data.clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement)!,
        },
      });

      if (result.error) {
        alert(result.error.message);
      } else if (result.paymentIntent?.status === "succeeded") {
        toast.success("Your payment has been completed successfully.!");
        window.location.href = "/dashboard";
      }
    } catch (error) {
      toast.error("Something went wrong during payment. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-2xl w-full max-w-md shadow-lg">
        <h2 className="text-2xl font-bold mb-4 text-center">
          Pay for {plan.name}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <CardElement className="border p-3 rounded-md" />
          <Button type="submit" disabled={loading} className="w-full">
            {loading ? "Processing..." : "Pay Now"}
          </Button>
        </form>
        <button
          onClick={onClose}
          className="mt-3 text-gray-500 hover:text-gray-700 text-sm block mx-auto"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}

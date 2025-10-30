

// import Stripe from "stripe";
// import { NextResponse } from "next/server";

// // Initialize Stripe
// const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

// interface Plan {
//   name: string;
//   description: string;
//   price: number;
// }

// export async function POST(req: Request): Promise<NextResponse> {
//   try {
//     const { plan }: { plan: Plan } = await req.json();

//     const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

//     // ✅ Create checkout session for yearly subscription
//     const session = await stripe.checkout.sessions.create({
//       payment_method_types: ["card"],
//       mode: "subscription",
//       line_items: [
//         {
//           price_data: {
//             currency: "usd",
//             recurring: { interval: "year" },
//             unit_amount: plan.price * 100, // Convert to cents
//             product_data: {
//               name: plan.name,
//               description: plan.description,
//             },
//           },
//           quantity: 1,
//         },
//       ],
//       success_url: `${appUrl}/dashboard?session_id={CHECKOUT_SESSION_ID}`,
//       cancel_url: `${appUrl}/pricing`,
//     });

//     return NextResponse.json({ url: session.url });
//   } catch (error) {
//     // console.error("Stripe Checkout Error:", error);
//     return NextResponse.json(
//       { error: "Failed to create checkout session." },
//       { status: 500 }
//     );
//   }
// }









// src/app/api/create-checkout-session/route.ts (or whichever file you used)
import Stripe from "stripe";
import { NextResponse } from "next/server";
import { logAdminActivity } from "@/lib/logAdminActivity";

// Initialize Stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

interface Plan {
  name: string;
  description: string;
  price: number;
}

export async function POST(req: Request): Promise<NextResponse> {
  try {
    const { plan }: { plan: Plan } = await req.json();

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

    // ✅ Create checkout session for yearly subscription
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "subscription",
      line_items: [
        {
          price_data: {
            currency: "usd",
            recurring: { interval: "year" },
            unit_amount: plan.price * 100, // Convert to cents
            product_data: {
              name: plan.name,
              description: plan.description,
            },
          },
          quantity: 1,
        },
      ],
      success_url: `${appUrl}/dashboard?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${appUrl}/pricing`,
    });

    await logAdminActivity(`Created checkout session for plan: ${plan.name}`, "info", "billing", null, { planName: plan.name, price: plan.price });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("Stripe Checkout Error:", error);
    await logAdminActivity(`Stripe checkout error: ${(error as Error).message}`, "error", "billing", null);
    return NextResponse.json(
      { error: "Failed to create checkout session." },
      { status: 500 }
    );
  }
}

import { NextRequest, NextResponse } from "next/server";

/**
 * Payment Intent Creation Endpoint
 * This endpoint creates a Stripe Payment Intent for testing purposes
 * Using Stripe test keys (STRIPE_SECRET_KEY)
 */
export async function POST(request: NextRequest) {
  const { amount, currency = "usd", description } = await request.json();

  if (!amount || amount <= 0) {
    return NextResponse.json(
      { error: "Invalid amount" },
      { status: 400 }
    );
  }

  try {
    // Use test API key from environment
    const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
    if (!stripeSecretKey) {
      return NextResponse.json(
        { error: "Stripe secret key not configured" },
        { status: 500 }
      );
    }

    // Make request to Stripe API to create PaymentIntent
    const response = await fetch("https://api.stripe.com/v1/payment_intents", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${stripeSecretKey}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        amount: Math.round(amount * 100).toString(), // Convert to cents
        currency,
        description: description || "RideForward Payment",
      }).toString(),
    });

    if (!response.ok) {
      const error = await response.json();
      return NextResponse.json(
        { error: error.error?.message || "Failed to create payment intent" },
        { status: response.status }
      );
    }

    const paymentIntent = await response.json();

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
      intentId: paymentIntent.id,
      status: paymentIntent.status,
    });
  } catch (error) {
    console.error("Payment error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

import { NextRequest, NextResponse } from "next/server";

/**
 * Payment Method Management Endpoint
 * Handles saving payment methods using Stripe test cards
 */
export async function POST(request: NextRequest) {
  const { action, paymentMethodId } = await request.json();

  if (!action || !["attach", "detach"].includes(action)) {
    return NextResponse.json(
      { error: "Invalid action" },
      { status: 400 }
    );
  }

  try {
    const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
    if (!stripeSecretKey) {
      return NextResponse.json(
        { error: "Stripe secret key not configured" },
        { status: 500 }
      );
    }

    // For testing purposes, we'll use a mock customer ID
    // In production, this should be saved per user in your database
    const customerId = "cus_test_user";

    let url: string;
    let method: string;

    if (action === "attach") {
      // Attach payment method to customer
      url = `https://api.stripe.com/v1/payment_methods/${paymentMethodId}/attach`;
      method = "POST";
      
      const response = await fetch(url, {
        method,
        headers: {
          "Authorization": `Bearer ${stripeSecretKey}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          customer: customerId,
        }).toString(),
      });

      if (!response.ok) {
        const error = await response.json();
        return NextResponse.json(
          { error: error.error?.message || "Failed to attach payment method" },
          { status: response.status }
        );
      }

      const paymentMethod = await response.json();
      return NextResponse.json({
        success: true,
        paymentMethod,
      });
    } else if (action === "detach") {
      // Detach payment method from customer
      url = `https://api.stripe.com/v1/payment_methods/${paymentMethodId}/detach`;
      method = "POST";
      
      const response = await fetch(url, {
        method,
        headers: {
          "Authorization": `Bearer ${stripeSecretKey}`,
        },
      });

      if (!response.ok) {
        const error = await response.json();
        return NextResponse.json(
          { error: error.error?.message || "Failed to detach payment method" },
          { status: response.status }
        );
      }

      return NextResponse.json({
        success: true,
        message: "Payment method removed",
      });
    }

    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  } catch (error) {
    console.error("Payment method error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

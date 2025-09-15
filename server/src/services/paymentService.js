import { ENV } from "../config/env.js";
import { v4 as uuidv4 } from "uuid";
import Stripe from "stripe";

let stripeClient;

//initialize stripe if secret provided
if (ENV.STRIPE_SECRET) {
  stripeClient = new Stripe(ENV.STRIPE_SECRET, { apiVersion: "2024-06-20" });
}

//Create a payment intent
export const createPaymentIntent = async ({
  amount,
  currency = "inr",
  orderId,
}) => {
  if (stripeClient) {
    //real stripe flow
    const intent = await stripeClient.paymentIntents.create({
      amount: Math.round(amount * 100),
      currency,
      metadata: { orderId: orderId.toString() },
      description: `Payment for order ${orderId}`,
    });

    return {
      id: intent.id,
      client_secret: intent.client_secret,
      amount: intent.amount,
      currency: intent.currency,
      status: intent.status,
    };
  }

  //fallback: simulate payment intent
  return {
    id: "sim_" + uuidv4(),
    amount,
    currency,
    status: "requires_action",
  };
};

//verify webhook signature (stripe only)
export const verifyWebhookSignature = (rawBody, signature, endpointSecret) => {
  if (!stripeClient || !endpointSecret) return true;
  try {
    const event = stripeClient.webhooks.constructEvent(
      rawBody,
      signature,
      endpointSecret
    );
    return event;
  } catch (error) {
    throw new Error("Invalid Stripe webhook signature");
  }
};

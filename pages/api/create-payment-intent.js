const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

export default async function handler(request, response) {
  const  data  = request.body;
  console.log('!!!data', data)
  // Create a PaymentIntent with the order amount and currency
  const paymentIntent = await stripe.paymentIntents.create({
    amount: data.amount,
    currency: "usd",
    payment_method_types: ['card'],
    // automatic_payment_methods: {
    //   enabled: true,
    // },
  });

  response.send({
    clientSecret: paymentIntent.client_secret,
  });
};

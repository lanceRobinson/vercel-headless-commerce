import {FC, useState, useEffect} from "react";
import Payment from "./Payment";
import CartSidebarView from "./cart/CartSidebarView";
// import CartTotal from "./CartTotal";
import {loadStripe} from "@stripe/stripe-js";
import {Elements} from "@stripe/react-stripe-js";
import {useCart} from '../lib/shopify/storefront-data-hooks'
import {Grid, jsx} from 'theme-ui'
import {Box} from "@theme-ui/components";


const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);

export default function Cart() {
  const [showProducts, setShowProducts] = useState(true);
  const [products, setProducts] = useState([]);
  const [cost, setCost] = useState({});
  const [cartId, setCartId] = useState(null);
  const [clientSecret, setClientSecret] = useState("");
  const cart = useCart()

  useEffect(() => {
    async function fetchContent() {
      // const localCart = cartId;

      console.log('!!!cart: ', cart)
      console.log('!!!cart.lineItems: ', cart.lineItems)

      if (cart === null) {
        setShowProducts(false);
      } else {

        // setCartId(localCart);

        setProducts(cart.lineItems);
        setCartId(cart.id);
        setCost(cart.estimatedCost);
        console.log('!!!products',products)

        fetch("/api/create-payment-intent", {
          method: "POST",
          headers: {"Content-Type": "application/json"},
          body: JSON.stringify({amount: 100, currency: 'usd'}),
        })
          .then((res) => res.json())
          .then((data) => setClientSecret(data.clientSecret));

        // return json;
      }
    }
    fetchContent()
    },[cart?.lineItems]);

  const appearance = {
    theme: 'stripe',
  };
  const options = {
    clientSecret,
    appearance,
  };

  return (
    <Box>
      {showProducts && products?.length > 0 ? (
        <Grid gap={6} columns={2} >

          <CartSidebarView showCheckoutButton={false}/>

          {clientSecret && (
            <Elements options={options} stripe={stripePromise}>
              <Payment clientSecret={clientSecret}/>
            </Elements>
          )}
        </Grid>
      ) : (
        <div className="cart-page-message">
          No products to show! Get shopping!
        </div>
      )}
    </Box>
  );
}

import Head from 'next/head';
import CartCheckout from '../components/CartCheckout';

export default function CartPage() {

  return (
    <>
      <Head>
        <title>Noir Triangle | Cart</title>
      </Head>
      <main className="checkout-page">
        <article className="cart-page-content">
          <h1>Your cart</h1>
          <CartCheckout />
        </article>
      </main>
    </>
  );
}

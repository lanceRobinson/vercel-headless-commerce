export default function CartTable({ cartItems, cartId, removeItem }) {
  console.log('CartTable.cartItems[0]', cartItems[0])
  return (
    <table className="cart-table">
      <thead>
        <tr>
          <th className="cart-table-heading">Item</th>
          <th className="cart-table-heading">Price</th>
          <th className="cart-table-heading">Quantity</th>
          <th className="cart-table-heading">Total</th>
          <th className="cart-table-heading">Actions</th>
        </tr>
      </thead>
      <tbody>
        {cartItems.map((item, index) => {
          console.log('cartTable.item',item)
          console.log('cartTable.item.node',item.node)

          // let merchandiseTitle =
          //   !item.title
          //     ? ""
          //     : `(${item.title})`;
          return (
            <tr className="cart-table-row" key={`cartItem${index}`}>
              <td className="cart-table-cell">
                {item.title}
              </td>
              <td className="cart-table-cell">
                {formatPrice(
                  item.variant.priceV2.amount,
                  item.variant.priceV2.currencyCode
                )}
              </td>
              <td className="cart-table-cell">{item.quantity}</td>
              <td className="cart-table-cell">
                {itemTotal(item.variant.priceV2, item.quantity)}
              </td>
              <td className="cart-table-cell">
                <button
                  onClick={() => {
                    // removeItemFromCart(item.id);
                  }}
                >
                  Remove Item
                </button>
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}

function formatPrice(num, currency) {
  return parseFloat(num).toLocaleString('en-US', {
    style: 'currency',
    currency: currency || 'USD',
  });
}

function formatPriceWithDefault(num, currency) {
  if (num === null) {
    return '$0.00';
  }
  return parseFloat(num).toLocaleString('en-US', {
    style: 'currency',
    currency: currency || 'USD',
  });
}

function itemTotal(price, quantity) {
  const totalPrice = parseFloat(price.amount) * parseInt(quantity);

  return formatPrice(totalPrice, price.currencyCode);
}


/** @jsxRuntime classic */
/** @jsx jsx */
import React from 'react'
import { Box, jsx, Text, Card, Grid, Divider, NavLink } from 'theme-ui'
import { FC, useEffect, useState } from 'react'
import { Bag } from '@components/icons'
import { useCart, useCheckoutUrl } from '@lib/shopify/storefront-data-hooks'
import CartItem from '../CartItem'
import { BuilderComponent, builder } from '@builder.io/react'
import env from '@config/env'

const CartSidebarView: FC<{showCheckoutButton:boolean}> = ({showCheckoutButton=true}) => {
  const checkoutUrl = useCheckoutUrl()
  const cart = useCart()
  const [totalTax, setTotalTax] = useState("0.00");
  const [paymentDue, setPaymentDue] = useState("0.00");
  const subTotal = cart?.subtotalPrice
  console.log('!!cart.attrs',cart?.attrs)

  const items = cart?.lineItems ?? []
  const isEmpty = items.length === 0
  const [cartUpsell, setCartUpsell] = useState()

  useEffect(() => {
    async function fetchContent() {
      const items = cart?.lineItems || []
      const cartUpsellContent = await builder
        .get('cart-upsell-sidebar', {
          cacheSeconds: 120,
          userAttributes: {
            itemInCart: items.map((item: any) => item.variant.product.handle),
          } as any,
        })
        .toPromise()
      setCartUpsell(cartUpsellContent)
    }
    fetchContent()
    setTotalTax(cart.totalTax || "0.00")
    setPaymentDue(cart.paymentDue || "0.00")
  }, [cart?.lineItems])

  return (
    <Box
      sx={{
        height: '100%',
        overflow: 'visable',
        paddingBottom: 5,
        bg: 'text',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        px: 2,
        color: 'background',
        ...(isEmpty && { justifyContent: 'center' }),
      }}
    >
      {isEmpty ? (
        <>
          <Bag />
          Your cart is empty
          <Text>
            You should do something about that.
          </Text>
        </>
      ) : (
        <>
          {items.map((item: any) => (
            <CartItem
              key={item.id}
              item={item}
              // todo update types
              currencyCode={item.variant?.priceV2?.currencyCode || 'USD'}
            />
          ))}
          <Card sx={{ marginLeft: 'auto', minWidth: '10rem', paddingLeft: 5 }}>
            <Grid gap={1} columns={2} sx={{ my: 3 }}>
              <Text>Subtotal:</Text>
              <Text sx={{ marginLeft: 'auto' }}>{subTotal}</Text>
              <Text>Shipping:</Text>
              <Text sx={{ marginLeft: 'auto' }}> Free </Text>
              <Text>Tax: </Text>
              <Text sx={{ marginLeft: 'auto' }}> {totalTax} </Text>
            </Grid>

            <Divider />
            <Grid gap={1} columns={2}>
              <Text variant="bold">Estimated Total:</Text>
              <Text variant="bold" sx={{ marginLeft: 'auto' }}>
                {paymentDue}
              </Text>
            </Grid>
          </Card>
          <BuilderComponent content={cartUpsell} model="cart-upsell-sidebar" />
          {checkoutUrl && showCheckoutButton && (
            <NavLink
              variant="nav"
              sx={{ width: '100%', m: 2, p: 12, textAlign: 'center' }}
              href={'/checkout'}
              // href={checkoutUrl!}
            >
              Proceed to Checkout
            </NavLink>
          )}
        </>
      )}
    </Box>
  )
}

export default CartSidebarView

import React, { useContext } from 'react';
import { render, act, screen, within as withinQuery } from '@testing-library/react';
import { CartProvider, CartContext } from './CartContext';

const TestConsumer = () => {
  const { cartItems, addToCart, removeFromCart, clearCart, cartItemsCount } = useContext(CartContext);

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  return (
    <div>
      <div data-testid="item-count">{cartItemsCount}</div>
      <div data-testid="cart-total">{calculateTotal()}</div>
      <ul data-testid="cart-items">
        {cartItems.map(item => (
          <li key={item.id}>
            {item.name} - Qty: {item.quantity} - Price: {item.price}
            <button onClick={() => removeFromCart(item.id)}>Remove</button>
          </li>
        ))}
      </ul>
      <button onClick={() => addToCart({ id: 1, name: 'Test Product 1', price: 10 })}>Add P1</button>
      <button onClick={() => addToCart({ id: 2, name: 'Test Product 2', price: 25 })}>Add P2</button>
      <button onClick={() => addToCart({ id: 3, name: 'Freebie', price: 0 })}>Add Freebie</button>
      <button onClick={() => clearCart()}>Clear Cart</button>
    </div>
  );
};

const renderCart = () => {
  return render(
    <CartProvider>
      <TestConsumer />
    </CartProvider>
  );
};

describe('CartContext', () => {
  // Test 1: Initial State
  test('should have an empty cart initially', () => {
    renderCart();
    expect(screen.getByTestId('item-count').textContent).toBe('0'); // Assertion 1
    expect(screen.getByTestId('cart-total').textContent).toBe('0'); // Assertion 2
    expect(screen.queryAllByRole('listitem').length).toBe(0); // Assertion 3
  });

  // Test 2: Add Single Item
  test('should add a single item to the cart', () => {
    const { getByText } = renderCart();
    act(() => { getByText('Add P1').click(); });
    expect(screen.getByTestId('item-count').textContent).toBe('1'); // Assertion 4
    expect(screen.getByTestId('cart-total').textContent).toBe('10'); // Assertion 5
    expect(screen.getAllByRole('listitem').length).toBe(1); // Assertion 6
    expect(screen.getByText(/Test Product 1/)).toBeInTheDocument(); // Assertion 7
    expect(screen.getByText(/Qty: 1/)).toBeInTheDocument(); // Assertion 8
  });

  // Test 3: Add Multiple Different Items
  test('should add multiple different items to the cart', () => {
    const { getByText } = renderCart();
    act(() => { getByText('Add P1').click(); });
    act(() => { getByText('Add P2').click(); });
    expect(screen.getByTestId('item-count').textContent).toBe('2'); // Assertion 9
    expect(screen.getByTestId('cart-total').textContent).toBe('35'); // Assertion 10
    expect(screen.getAllByRole('listitem').length).toBe(2); // Assertion 11
    expect(screen.getByText(/Test Product 1/)).toBeInTheDocument(); // Assertion 12
    expect(screen.getByText(/Test Product 2/)).toBeInTheDocument(); // Assertion 13
  });

  // Test 4: Add Same Item Multiple Times (Increase Quantity)
  test('should increase quantity when adding the same item multiple times', () => {
    const { getByText } = renderCart();
    act(() => { getByText('Add P1').click(); });
    act(() => { getByText('Add P1').click(); });
    expect(screen.getByTestId('item-count').textContent).toBe('2'); // Assertion 14
    expect(screen.getByTestId('cart-total').textContent).toBe('20'); // Assertion 15
    expect(screen.getAllByRole('listitem').length).toBe(1); // Assertion 16
    expect(screen.getByText(/Qty: 2/)).toBeInTheDocument(); // Assertion 17
  });

   // Test 5: Remove Item Completely
  test('should remove an item from the cart', () => {
    const { getByText } = renderCart();
    act(() => { getByText('Add P1').click(); });
    act(() => { getByText('Add P2').click(); });
    expect(screen.getByTestId('item-count').textContent).toBe('2'); // Assertion 18 (pre-check)
    expect(screen.getByTestId('cart-total').textContent).toBe('35'); // Assertion 19 (pre-check)

    const product1ListItem = screen.getByText(/Test Product 1/).closest('li');
    const removeButton = withinQuery(product1ListItem).getByRole('button', { name: /Remove/i });
    act(() => { removeButton.click(); });

    expect(screen.getByTestId('item-count').textContent).toBe('1'); // Assertion 20
    expect(screen.getByTestId('cart-total').textContent).toBe('25'); // Assertion 21
    expect(screen.getAllByRole('listitem').length).toBe(1); // Assertion 22
    expect(screen.queryByText(/Test Product 1/)).not.toBeInTheDocument(); // Assertion 23
    expect(screen.getByText(/Test Product 2/)).toBeInTheDocument(); // Assertion 24
  });

  // Test 6: Remove item completely even if quantity > 1
  test('should remove item completely even if quantity > 1', () => {
    const { getByText } = renderCart();
    act(() => { getByText('Add P1').click(); });
    act(() => { getByText('Add P1').click(); });
    expect(screen.getByText(/Qty: 2/)).toBeInTheDocument(); // Assertion 25 (pre-check)
    expect(screen.getByTestId('cart-total').textContent).toBe('20'); // Assertion 26 (pre-check)

    const product1ListItem = screen.getByText(/Test Product 1/).closest('li');
    const removeButton = withinQuery(product1ListItem).getByRole('button', { name: /Remove/i });
     act(() => { removeButton.click(); });

    expect(screen.getByTestId('item-count').textContent).toBe('0'); // Assertion 27
    expect(screen.getByTestId('cart-total').textContent).toBe('0'); // Assertion 28
    expect(screen.queryAllByRole('listitem').length).toBe(0); // Assertion 29
    expect(screen.queryByText(/Test Product 1/)).not.toBeInTheDocument(); // Assertion 30
  });

  // Test 7: Clear Cart
  test('should clear the cart completely', () => {
    const { getByText } = renderCart();
    act(() => { getByText('Add P1').click(); });
    act(() => { getByText('Add P2').click(); });
    expect(screen.getByTestId('item-count').textContent).toBe('2'); // Assertion 31 (pre-check)

    act(() => { getByText('Clear Cart').click(); });

    expect(screen.getByTestId('item-count').textContent).toBe('0'); // Assertion 32
    expect(screen.getByTestId('cart-total').textContent).toBe('0'); // Assertion 33
    expect(screen.queryAllByRole('listitem').length).toBe(0); // Assertion 34
  });

  // Test 8: Add item with zero price
  test('should handle adding an item with zero price', () => {
    const { getByText } = renderCart();
    act(() => { getByText('Add Freebie').click(); });
    expect(screen.getByTestId('item-count').textContent).toBe('1'); // Assertion 35
    expect(screen.getByTestId('cart-total').textContent).toBe('0'); // Assertion 36

    // Find the list first, then query within it
    const cartList = screen.getByTestId('cart-items'); // Find the <ul>
    const freebieTextElement = withinQuery(cartList).getByText(/Freebie/); // Find text *within* the list

    const freebieListItem = freebieTextElement.closest('li'); // Find the nearest ancestor <li>

    expect(freebieListItem).toBeInTheDocument(); // Assertion 37 - Check if the <li> was found
    expect(withinQuery(freebieListItem).getByText(/Qty: 1/)).toBeInTheDocument();
  });

   // Test 9: Add item, remove it, then add it again
  test('should handle adding, removing, and re-adding an item', () => {
    const { getByText } = renderCart();
    act(() => { getByText('Add P1').click(); });
    expect(screen.getByText(/Test Product 1/)).toBeInTheDocument(); // Assertion 38 (pre-check)

    const product1ListItem = screen.getByText(/Test Product 1/).closest('li');
    const removeButton = withinQuery(product1ListItem).getByRole('button', { name: /Remove/i });
    act(() => { removeButton.click(); });
    expect(screen.queryByText(/Test Product 1/)).not.toBeInTheDocument(); // Assertion 39 (pre-check)
    expect(screen.getByTestId('item-count').textContent).toBe('0'); // Assertion 40 (pre-check)

    act(() => { getByText('Add P1').click(); });
    expect(screen.getByText(/Test Product 1/)).toBeInTheDocument(); // Assertion 41
    expect(screen.getByText(/Qty: 1/)).toBeInTheDocument(); // Assertion 42
    expect(screen.getByTestId('item-count').textContent).toBe('1'); // Assertion 43
    expect(screen.getByTestId('cart-total').textContent).toBe('10'); // Assertion 44
  });

  // Test 10: Cart total with multiple quantities
  test('should calculate cart total correctly with multiple quantities', () => {
    const { getByText } = renderCart();
    act(() => { getByText('Add P1').click(); });
    act(() => { getByText('Add P1').click(); });
    act(() => { getByText('Add P2').click(); });
    act(() => { getByText('Add P2').click(); });
    act(() => { getByText('Add P2').click(); });
    expect(screen.getByTestId('cart-total').textContent).toBe('95'); // Assertion 45
    expect(screen.getByTestId('item-count').textContent).toBe('5'); // Assertion 46
    expect(screen.getAllByRole('listitem').length).toBe(2); // Assertion 47
  });

  // Test 11: Remove non-existent item (should do nothing)
  test('should not change cart when trying to remove a non-existent item', () => {
      const { getByText } = renderCart();
      act(() => { getByText('Add P1').click(); });
      const initialCount = screen.getByTestId('item-count').textContent; // "1"
      const initialTotal = screen.getByTestId('cart-total').textContent; // "10"

      act(() => {
          getByText('Add P2').click();
      });
      const product2ListItem = screen.getByText(/Test Product 2/).closest('li');
      const removeButton = withinQuery(product2ListItem).getByRole('button', { name: /Remove/i });
      act(() => { removeButton.click(); });

      expect(screen.getByTestId('item-count').textContent).toBe(initialCount); // Assertion 48
      expect(screen.getByTestId('cart-total').textContent).toBe(initialTotal); // Assertion 49
      expect(screen.getAllByRole('listitem').length).toBe(1); // Assertion 50
      expect(screen.getByText(/Test Product 1/)).toBeInTheDocument(); // Assertion 51
  });

});
// src/contexts/CartContext.test.jsx
import React from 'react';
import '@testing-library/jest-dom'; // matchers (asegúrate de tener esto en tu setup)
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect } from 'vitest';
import { CartProvider, CartContext } from '../context/CartContext';

// Un componente de prueba que consume el contexto
function TestConsumer() {
  const { cartItems, addToCart, removeFromCart, cartCount } = React.useContext(CartContext);

  const sampleProduct = { id: 'p1', name: 'Producto 1', price: 100 };

  return (
    <div>
      <div data-testid="count">Count: {cartCount}</div>
      <ul data-testid="list">
        {cartItems.map((it) => (
          <li key={it.id} data-testid={`item-${it.id}`}>
            {it.name} - {it.price}
            <button onClick={() => removeFromCart(it.id)} aria-label={`remove-${it.id}`}>Remove</button>
          </li>
        ))}
      </ul>

      <button onClick={() => addToCart(sampleProduct)} aria-label="add">Add sample</button>
    </div>
  );
}

describe('CartContext', () => {
  it('inicia vacío y muestra count 0', () => {
    render(
      <CartProvider>
        <TestConsumer />
      </CartProvider>
    );

    expect(screen.getByTestId('count')).toHaveTextContent('Count: 0');
    expect(screen.getByTestId('list').children.length).toBe(0);
  });

  it('agrega un producto al carrito y actualiza el count', async () => {
    const user = userEvent.setup();

    render(
      <CartProvider>
        <TestConsumer />
      </CartProvider>
    );

    const addBtn = screen.getByRole('button', { name: /add/i });
    await user.click(addBtn);

    // Ahora debe haber un item y count 1
    expect(screen.getByTestId('count')).toHaveTextContent('Count: 1');
    expect(screen.getByTestId('item-p1')).toBeInTheDocument();
    expect(screen.getByTestId('list').children.length).toBe(1);
  });

  it('elimina un producto del carrito y actualiza el count', async () => {
    const user = userEvent.setup();

    render(
      <CartProvider>
        <TestConsumer />
      </CartProvider>
    );

    const addBtn = screen.getByRole('button', { name: /add/i });
    await user.click(addBtn);
    // confirmar agregado
    expect(screen.getByTestId('count')).toHaveTextContent('Count: 1');

    // click en remove del item agregado
    const removeBtn = screen.getByRole('button', { name: /remove-p1/i });
    await user.click(removeBtn);

    // debe quedar vacío otra vez
    expect(screen.getByTestId('count')).toHaveTextContent('Count: 0');
    expect(screen.queryByTestId('item-p1')).not.toBeInTheDocument();
    expect(screen.getByTestId('list').children.length).toBe(0);
  });
});

import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import PurchasePages from '../pages/PurchasePages.jsx';
import { CartContext } from '../context/CartContext.jsx';


// Helper para renderizar con Router y contexto opcional
function renderWithProviders(ui, { cartItems = [] } = {}) {
  // Función auxiliar que envuelve el componente (ui) en los Providers necesarios.
  return render(
    <BrowserRouter>
      {/* Provee el contexto de enrutamiento. */}
      <CartContext.Provider value={{ cartItems }}>
        {/* Provee el contexto del carrito con la lista de items simulada. */}
        {ui}
      </CartContext.Provider>
    </BrowserRouter>
  );
}

describe('Componentes PurchasePages', () => {
  // Bloque principal que agrupa todas las pruebas para el componente PurchasePages.

  it('Renderiza los títulos principales', () => {
    // Prueba si los títulos principales de la página están presentes en el DOM después de renderizar.
    renderWithProviders(<PurchasePages />);

    expect(screen.getByText('Resumen de Compra')).toBeInTheDocument();
    expect(screen.getByText('Tu Carrito')).toBeInTheDocument();
    expect(screen.getByText('Datos de la Tarjeta')).toBeInTheDocument();
  });

  it('Renderiza los textfields y permite escribir', () => {
    // Prueba si los campos de entrada de datos de la tarjeta se renderizan y si se puede simular la entrada de datos.
    renderWithProviders(<PurchasePages />);

    const nombreInput = screen.getByLabelText(/Nombre del titular/i);
    const numeroInput = screen.getByLabelText(/Número de tarjeta/i);
    const fechaInput = screen.getByLabelText(/Fecha de vencimiento \(MM\/YY\)/i);
    const cvvInput = screen.getByLabelText(/^CVV/i);

    expect(nombreInput).toBeInTheDocument();
    expect(numeroInput).toBeInTheDocument();
    expect(fechaInput).toBeInTheDocument();
    expect(cvvInput).toBeInTheDocument();

    // Simula la escritura y verifica que los valores se actualicen (incluyendo el formateo del número de tarjeta).
    fireEvent.change(nombreInput, { target: { value: 'Barbara Arancibia' } });
    expect(nombreInput.value).toBe('Barbara Arancibia');

    // El número se formatea en grupos de 4
    fireEvent.change(numeroInput, { target: { value: '1111222233334444' } });
    expect(numeroInput.value).toBe('1111 2222 3333 4444');

    fireEvent.change(fechaInput, { target: { value: '12/30' } });
    expect(fechaInput.value).toBe('12/30');

    fireEvent.change(cvvInput, { target: { value: '123' } });
    expect(cvvInput.value).toBe('123');
  });

  it('Renderiza el botón "Pagar" y está deshabilitado con carrito vacío', () => {
    // Prueba la existencia del botón "Pagar" y verifica que esté deshabilitado si no hay productos en el carrito.
    renderWithProviders(<PurchasePages />, { cartItems: [] });

    const payButton = screen.getByRole('button', { name: /Pagar/i });
    expect(payButton).toBeInTheDocument();
    expect(payButton).toBeDisabled();
    // Verifica el mensaje de información cuando el carrito está vacío.
    expect(screen.getByText(/Agrega productos al carrito para poder pagar/i)).toBeInTheDocument();
  });

  it('Muestra mensajes de validación cuando los datos son inválidos', () => {
    // Prueba que se muestren mensajes de error de validación cuando se intenta pagar sin completar campos obligatorios.
    // Agregar un item en el carrito para habilitar el botón
    const mockCart = [{ id: 1, name: 'Producto Test', price: 10000 }];
    renderWithProviders(<PurchasePages />, { cartItems: mockCart });

    const payButton = screen.getByRole('button', { name: /Pagar/i });

    // Simula el click en "Pagar" sin llenar los campos.
    fireEvent.click(payButton);

    // Verifica que el mensaje de error para el número de tarjeta (u otro campo) esté presente.
    expect(
      screen.getByText('Por favor ingrese el número de tarjeta.')
    ).toBeInTheDocument();
  });

  it('Valida que el número de tarjeta sea exactamente de 16 dígitos', () => {
    // Prueba específicamente la validación de la longitud del número de tarjeta.
    const mockCart = [{ id: 2, name: 'Otro Producto', price: 20000 }];
    renderWithProviders(<PurchasePages />, { cartItems: mockCart });

    const nombreInput = screen.getByLabelText(/Nombre del titular/i);
    const numeroInput = screen.getByLabelText(/Número de tarjeta/i);
    const fechaInput = screen.getByLabelText(/Fecha de vencimiento \(MM\/YY\)/i);
    const cvvInput = screen.getByLabelText(/^CVV/i);
    const payButton = screen.getByRole('button', { name: /Pagar/i });

    // Simula la entrada de datos, incluyendo un número de tarjeta con 15 dígitos (inválido).
    fireEvent.change(nombreInput, { target: { value: 'Barbara Arancibia' } });
    fireEvent.change(numeroInput, { target: { value: '123456789012345' } }); // 15 dígitos
    fireEvent.change(fechaInput, { target: { value: '12/30' } });
    fireEvent.change(cvvInput, { target: { value: '123' } });

    // Simula el click en "Pagar".
    fireEvent.click(payButton);

    // Verifica que el mensaje de error por longitud incorrecta esté presente.
    expect(
      screen.getByText('El número de tarjeta debe tener 16 dígitos.')
    ).toBeInTheDocument();
  });

  it('Simula compra exitosa y muestra mensaje de éxito', () => {
    // Prueba la funcionalidad de pago exitoso al llenar todos los campos correctamente.
    const mockCart = [{ id: 99, name: 'Producto Final', price: 5000 }];
    // Define un carrito simulado con un producto para asegurar que el botón de pago esté habilitado.
    renderWithProviders(<PurchasePages />, { cartItems: mockCart });
    // Renderiza el componente con el carrito simulado.

    // Obtiene referencias a todos los campos de entrada de la tarjeta.
    const nombreInput = screen.getByLabelText(/Nombre del titular/i);
    const numeroInput = screen.getByLabelText(/Número de tarjeta/i);
    const fechaInput = screen.getByLabelText(/Fecha de vencimiento \(MM\/YY\)/i);
    const cvvInput = screen.getByLabelText(/^CVV/i);
    const payButton = screen.getByRole('button', { name: /Pagar/i });

    // Simula la entrada de datos válidos en todos los campos (incluyendo 16 dígitos en el número de tarjeta).
    fireEvent.change(nombreInput, { target: { value: 'Barbara Arancibia' } });
    fireEvent.change(numeroInput, { target: { value: '1234567890123451' } }); // 16 dígitos
    fireEvent.change(fechaInput, { target: { value: '12/30' } });
    fireEvent.change(cvvInput, { target: { value: '123' } });

    // Simula el click en el botón de pago.
    fireEvent.click(payButton);

    // Verifica que el mensaje de éxito de la compra (simulada) esté visible en la pantalla.
    expect(
      screen.getByText('Pago simulado exitosamente. ¡Gracias por tu compra!')
    ).toBeInTheDocument();
  });
});
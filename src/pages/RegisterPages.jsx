import React, { useState, useContext, useMemo } from "react";
import { Container, Form, Button, Alert, Spinner } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import "../App.css";

function RegisterPages() {
  const { register } = useContext(AuthContext);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    nombre: "",
    email: "",
    fechaNacimiento: "",
    password: "",
    password2: "",
  });

  const [touched, setTouched] = useState({
    nombre: false,
    email: false,
    fechaNacimiento: false,
    password: false,
    password2: false,
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  // Fecha máxima (hoy) para el date input sin tocar el DOM directamente
  const maxDate = useMemo(() => new Date().toISOString().split("T")[0], []);

  const handleChange = (e) =>
    setFormData((s) => ({ ...s, [e.target.name]: e.target.value }));

  const handleBlur = (field) =>
    setTouched((s) => ({ ...s, [field]: true }));

  // Validaciones
  const validateEmail = (email) => /\S+@\S+\.\S+/.test(email);
  const validatePassword = (password) =>
    /^(?=.*[0-9])(?=.*[!@#$%^&*-])(?=.{8,})/.test(password);
// Validar edad mínima (+18 años)
const validateAge = (birthDate) => {
  if (!birthDate) return false;
  const today = new Date();
  const birth = new Date(birthDate);
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();

  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--;
  }

  return age >= 18; // ✅ Solo mayores de 18
};

  const validateForm = () => {
    setError("");
    // Campo nombre
    if (touched.nombre && !formData.nombre)
      return setError("Por favor ingrese su nombre completo"), false;

    // Email
    if (touched.email && !formData.email)
      return setError("Por favor ingrese su correo electrónico"), false;

    if (touched.email && formData.email && !validateEmail(formData.email))
      return setError("Por favor ingrese un correo electrónico válido"), false;

    // Fecha nacimiento (solo validación en front)
    if (touched.fechaNacimiento && !formData.fechaNacimiento)
      return setError("Por favor ingrese su fecha de nacimiento"), false;

    if (touched.fechaNacimiento && formData.fechaNacimiento && !validateAge(formData.fechaNacimiento))
      return setError("Debes tener al menos 18 años para registrarte"), false;

    // Password
    if (touched.password && !formData.password)
      return setError("Por favor ingrese una contraseña"), false;

    if (touched.password && formData.password && !validatePassword(formData.password))
      return setError("La contraseña debe tener al menos 8 caracteres, incluir un número y un símbolo"), false;

    // Confirmación
    if (touched.password2 && !formData.password2)
      return setError("Por favor confirme su contraseña"), false;

    if (touched.password2 && formData.password2 && formData.password !== formData.password2)
      return setError("Las contraseñas no coinciden"), false;

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Tocar todo para mostrar mensajes si falta algo
    setTouched({
      nombre: true,
      email: true,
      fechaNacimiento: true,
      password: true,
      password2: true,
    });

    if (!validateForm()) return;

    setError("");
    setSuccess("");
    setLoading(true);
    try {
      // Backend espera: { name, email, password }
      await register({
        name: formData.nombre.trim(),
        email: formData.email.trim(),
        password: formData.password,
      });

      setSuccess("¡Registro exitoso! Ya puedes usar tu cuenta.");
      // Limpia el formulario
      setFormData({
        nombre: "",
        email: "",
        fechaNacimiento: "",
        password: "",
        password2: "",
      });
      setTouched({
        nombre: false,
        email: false,
        fechaNacimiento: false,
        password: false,
        password2: false,
      });

      // Opcional: redirigir al perfil o login
      // navigate("/perfil");
      // navigate("/login");
    } catch (err) {
      setError(err?.message || "No se pudo completar el registro");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="main-container">
      <div className="form-container">
        <h2>Formulario de Registro</h2>

        {error && <Alert variant="danger" id="errorMsg">{error}</Alert>}
        {success && <Alert variant="success" id="successMsg">{success}</Alert>}

        <Form id="registroForm" onSubmit={handleSubmit} noValidate>
          <Form.Group className="mb-3">
            <Form.Label htmlFor="nombre">Nombre completo</Form.Label>
            <Form.Control
              type="text"
              id="nombre"
              name="nombre"
              value={formData.nombre}
              onChange={handleChange}
              onBlur={() => handleBlur("nombre")}
              required
              disabled={loading}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label htmlFor="email">Correo electrónico</Form.Label>
            <Form.Control
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              onBlur={() => handleBlur("email")}
              required
              disabled={loading}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label htmlFor="fechaNacimiento">Fecha de nacimiento</Form.Label>
            <Form.Control
              type="date"
              id="fechaNacimiento"
              name="fechaNacimiento"
              value={formData.fechaNacimiento}
              onChange={handleChange}
              onBlur={() => handleBlur("fechaNacimiento")}
              required
              disabled={loading}
              max={maxDate}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label htmlFor="password">Contraseña</Form.Label>
            <Form.Control
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              onBlur={() => handleBlur("password")}
              required
              disabled={loading}
            />
            <Form.Text className="text-light">
              La contraseña debe tener al menos 8 caracteres, incluir un número y un símbolo.
            </Form.Text>
          </Form.Group>

          <Form.Group className="mb-4">
            <Form.Label htmlFor="password2">Confirmar contraseña</Form.Label>
            <Form.Control
              type="password"
              id="password2"
              name="password2"
              value={formData.password2}
              onChange={handleChange}
              onBlur={() => handleBlur("password2")}
              required
              disabled={loading}
            />
          </Form.Group>

          <Button type="submit" className="btn-register w-100" disabled={loading}>
            {loading ? (
              <>
                <Spinner size="sm" animation="border" className="me-2" /> Registrando...
              </>
            ) : (
              "Registrarse"
            )}
          </Button>

          <div className="text-center mt-3">
            <p className="text-light">
              ¿Ya tienes cuenta?{" "}
              <Link to="/login" className="text-success fw-bold">Inicia sesión</Link>
            </p>
          </div>
        </Form>
      </div>
    </Container>
  );
}

export default RegisterPages;

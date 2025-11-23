import React, { useState } from 'react'
import { Container, Form, Button, Alert, Spinner } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'
import { registerUser } from '../api/users'

const ROLES = [
  { value: 'ADMIN', label: 'ADMIN' },
  { value: 'BODEGUERO', label: 'BODEGUERO' },
  { value: 'VENTAS', label: 'VENTAS' },
]

export default function AddAdminPages() {
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [password2, setPassword2] = useState('')
  const [role, setRole] = useState('ADMIN')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const onSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    if (!name || !email || !password || !password2) { setError('Completa todos los campos'); return }
    const nameOk = /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/.test(name)
    if (!nameOk) { setError('El nombre solo debe contener letras y espacios'); return }
    const emailOk = /\S+@\S+\.\S+/.test(email)
    if (!emailOk) { setError('Por favor ingresa un correo electrónico válido'); return }
    const passOk = /^(?=.*[0-9])(?=.*[!@#$%^&*-])(?=.{8,})/.test(password)
    if (!passOk) { setError('La contraseña debe tener mínimo 8 caracteres, incluir un número y un símbolo'); return }
    if (password !== password2) { setError('Las contraseñas no coinciden'); return }
    setLoading(true)
    try {
      const r = await registerUser({ name, email, password, role })
      setSuccess(`Usuario creado: ${r?.email || email}`)
      setName('')
      setEmail('')
      setPassword('')
      setPassword2('')
      setRole('ADMIN')
    } catch (err) {
      setError(err?.message || 'No se pudo crear el administrador')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Container className="page-container" style={{ maxWidth: 520 }}>
      <h2>Agregar Administrador</h2>
      {error && <Alert variant="danger">{error}</Alert>}
      {success && <Alert variant="success">{success}</Alert>}
      <Form onSubmit={onSubmit}>
        <Form.Group className="mb-3">
          <Form.Label>Nombre</Form.Label>
          <Form.Control value={name} onChange={(e) => { const v = e.target.value.replace(/[^A-Za-zÁÉÍÓÚáéíóúÑñ\s]/g, ''); setName(v); }} disabled={loading} isInvalid={!!name && !(/^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/.test(name))} />
          <Form.Control.Feedback type="invalid">Solo letras y espacios</Form.Control.Feedback>
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Email</Form.Label>
          <Form.Control type="email" value={email} onChange={(e) => setEmail(e.target.value)} disabled={loading} isInvalid={!!email && !(/\S+@\S+\.\S+/.test(email))} />
          <Form.Control.Feedback type="invalid">Correo electrónico inválido</Form.Control.Feedback>
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Contraseña</Form.Label>
          <Form.Control type="password" value={password} onChange={(e) => setPassword(e.target.value)} disabled={loading} isInvalid={!!password && !(/^(?=.*[0-9])(?=.*[!@#$%^&*-])(?=.{8,})/.test(password))} />
          <Form.Control.Feedback type="invalid">La contraseña debe tener mínimo 8 caracteres, incluir un número y un símbolo</Form.Control.Feedback>
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Confirmar contraseña</Form.Label>
          <Form.Control type="password" value={password2} onChange={(e) => setPassword2(e.target.value)} disabled={loading} isInvalid={!!password2 && password !== password2} />
          <Form.Control.Feedback type="invalid">Las contraseñas no coinciden</Form.Control.Feedback>
        </Form.Group>
        <Form.Group className="mb-4">
          <Form.Label>ROL</Form.Label>
          <Form.Select value={role} onChange={(e) => setRole(e.target.value)} disabled={loading}>
            {ROLES.map(r => (<option key={r.value} value={r.value}>{r.label}</option>))}
          </Form.Select>
        </Form.Group>
        <div className="d-flex">
          <Button variant="secondary" type="button" onClick={() => navigate('/admin/usuarios')}>Volver</Button>
          <div className="ms-auto">
            <Button variant="success" type="submit" disabled={loading || !name || !email || !password || !password2 || !(/^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/.test(name)) || !(/\S+@\S+\.\S+/.test(email)) || !(/^(?=.*[0-9])(?=.*[!@#$%^&*-])(?=.{8,})/.test(password)) || password !== password2}>
              {loading ? (<><Spinner size="sm" animation="border" className="me-2" /> Guardando...</>) : 'Guardar nuevo administrador'}
            </Button>
          </div>
        </div>
      </Form>
    </Container>
  )
}
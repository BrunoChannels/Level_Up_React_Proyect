import React, { useContext } from 'react'
import { Container, Row, Col, Button } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext'

const AdminPages = () => {
  const navigate = useNavigate()
  const { logout, user } = useContext(AuthContext) || {}

  const go = (path) => navigate(path)
  const handleExit = () => {
    try { logout && logout() } finally { navigate('/') }
  }

  return (
    <Container className="page-container">
      <h1>Panel de Administración</h1>
      <p>Bienvenido {user?.name ?? user?.email ?? 'Administrador'}</p>
      <Row className="justify-content-center mt-4">
        <Col xs={12} md={8}>
          <div className="d-grid gap-3">
            <Button variant="primary" onClick={() => go('/admin/inventario')}>Gestionar Inventario</Button>
            <Button variant="primary" onClick={() => go('/admin/ventas')}>Gestionar Ventas</Button>
            <Button variant="primary" onClick={() => go('/admin/productos/nuevo')}>Agregar Productos Nuevos</Button>
            <Button variant="primary" onClick={() => go('/admin/usuarios')}>Gestionar Usuarios</Button>
            <Button variant="outline-danger" onClick={handleExit}>Salir</Button>
          </div>
        </Col>
      </Row>
    </Container>
  )
}

export default AdminPages
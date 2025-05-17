import { insertUser } from '../../services/users/users.js'
import { useState } from 'react';
import { Container, Form, Button, Row, Col } from 'react-bootstrap';
import Swal from 'sweetalert2'

export const Register = () => {
  const [formData, setFormData] = useState({
    user_name: '',
    user_last_name: '',
    user_document: '',
    user_email: '',
    user_password: '',
    user_phone_number: '',
    user_birthdate: '',
    user_eps: '',
  });

  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const toggleShowPassword = () => setShowPassword(!showPassword);

  const handleSubmit = async(e) => {
    e.preventDefault()
    Swal.fire({
      title:"Procesando...",
      allowEscapeKey:false,
      allowOutsideClick:false,
      didOpen:()=>{
        Swal.showLoading()
      }
    })

    const request = await insertUser(formData)
    Swal.close()

    Swal.fire({
      title:request.status ? "Completado" : "Error",
      icon:request.status ? "success" : "error",
      text:request.message,
      allowEscapeKey:false,
      allowOutsideClick:false
    }).then((res)=>{
      if (request.status && res.isConfirmed) {
        window.location.href = "/login" 
      }
    })
  }

  return (
    <main style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #dbeafe 0%, #ffffff 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '30px'
    }}>
      <Container style={{ maxWidth: '720px' }}>
        <Form onSubmit={handleSubmit} className="p-5 rounded-4 shadow" style={{ backgroundColor: '#ffffff' }}>
          <div className="text-center mb-4">
            <h2 className="fw-bold text-dark">Registro de Usuario</h2>
            <p className="text-muted">Complete los campos para crear su cuenta</p>
          </div>

          <Row className="mb-3">
            <Col md={6}>
              <Form.Label className="fw-semibold">Nombre</Form.Label>
              <Form.Control
                type="text"
                name="user_name"
                value={formData.user_name}
                onChange={handleChange}
                required
                placeholder="Ej: Juan"
              />
            </Col>
            <Col md={6}>
              <Form.Label className="fw-semibold">Apellido</Form.Label>
              <Form.Control
                type="text"
                name="user_last_name"
                value={formData.user_last_name}
                onChange={handleChange}
                required
                placeholder="Ej: Pérez"
              />
            </Col>
          </Row>

          <Row className="mb-3">
            <Col md={6}>
              <Form.Label className="fw-semibold">Documento (C.C)</Form.Label>
              <Form.Control
                type="text"
                name="user_document"
                value={formData.user_document}
                onChange={handleChange}
                required
                minLength={10}
                maxLength={10}
                placeholder="Ej: 1234567890"
              />
            </Col>
            <Col md={6}>
              <Form.Label className="fw-semibold">Correo electrónico</Form.Label>
              <Form.Control
                type="email"
                name="user_email"
                value={formData.user_email}
                onChange={handleChange}
                required
                placeholder="Ej: correo@dominio.com"
              />
            </Col>
          </Row>

          <Row className="mb-3">
            <Col md={6}>
              <Form.Label className="fw-semibold">Contraseña</Form.Label>
              <div style={{ position: 'relative' }}>
                <Form.Control
                  type={showPassword ? 'text' : 'password'}
                  name="user_password"
                  value={formData.user_password}
                  onChange={handleChange}
                  required
                  minLength={6}
                  placeholder="Mínimo 6 caracteres"
                />
                <div
                  onClick={toggleShowPassword}
                  style={{
                    position: 'absolute',
                    top: '50%',
                    right: '10px',
                    transform: 'translateY(-50%)',
                    cursor: 'pointer',
                    color: '#6c757d',
                  }}
                >
                  <i className={`bi ${showPassword ? 'bi-eye-slash' : 'bi-eye'}`} />
                </div>
              </div>
            </Col>
            <Col md={6}>
              <Form.Label className="fw-semibold">Teléfono</Form.Label>
              <Form.Control
                type="tel"
                name="user_phone_number"
                value={formData.user_phone_number}
                onChange={handleChange}
                required
                placeholder="Ej: 3101234567"
              />
            </Col>
          </Row>

          <Row className="mb-3">
            <Col md={6}>
              <Form.Label className="fw-semibold">Fecha de nacimiento</Form.Label>
              <Form.Control
                type="date"
                name="user_birthdate"
                value={formData.user_birthdate}
                onChange={handleChange}
                required
              />
            </Col>
            <Col md={6}>
              <Form.Group>
                <Form.Label className="text-dark">EPS</Form.Label>
                <Form.Select
                    required
                    name="user_eps"
                    defaultValue=""
                    onChange={handleChange}>
                    <option value="">Selecciona una EPS</option>
                    {[
                    "Nueva EPS", "Sanitas", "Sura", "Salud Total", "Coosalud", "Famisanar", "Mutual Ser",
                    "Compensar", "Emssanar", "Savia Salud", "Asmet Salud", "Cajacopi", "Capital Salud",
                    "Servicio Occidental de Salud", "Asociación Indígena del Cauca", "Mallamás",
                    "Comfenalco Valle", "Aliansalud", "Anaswayuu", "Familiar de Colombia", "Dusakawi",
                    "Comfaoriente", "Capresoca", "Comfachocó", "Pijaos", "Salud Mía", "Salud Bolívar"
                    ].map((eps) => (
                    <option key={eps} value={eps}>
                        {eps}
                    </option>
                    ))}
                </Form.Select>
              </Form.Group>
            </Col>
          </Row>

          <Button
            type="submit"
            className="w-100 mt-3"
            size="lg"
            style={{
              backgroundColor: '#0d6efd',
              borderRadius: '8px',
              fontWeight: '600',
              letterSpacing: '0.5px',
              border: 'none'
            }}
          >
            Crear cuenta
          </Button>
        </Form>
      </Container>
    </main>
  )
  
}


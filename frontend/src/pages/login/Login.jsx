import React, { useState } from 'react'
import { Container, Form, Button } from 'react-bootstrap'
import { API_URL } from '../../API_URL.js'

import Swal from 'sweetalert2'

export const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      const response = await fetch(API_URL+'/login', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      })

      const data = await response.json();

      if (response.ok) {
        Swal.fire({
          icon:"success",
          title:"Completado",
          text:"Sesión iniciada correctamente!",
          allowOutsideClick:false,
          allowEscapeKey:false
        }).then((res)=>{
        
          if(res.isConfirmed){
            sessionStorage.setItem("session",JSON.stringify(data.data))
            window.location.href = "/home"
          }

        })
        
      } else {
        Swal.fire({
          icon:"error",
          title:"Error",
          text:data.message,
          allowOutsideClick:false,
          allowEscapeKey:false
        })
      }
    } catch (error) {
      alert('Error al conectar con el servidor: ' + error.message)
    }
  }

  const toggleShowPassword = () => setShowPassword(!showPassword);

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #dbeafe 0%, #ffffff 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px'
    }}>
      <Container className="p-0" style={{ maxWidth: '500px' }}>
        <Form onSubmit={handleSubmit} className="p-4 rounded-4 shadow-lg" style={{ backgroundColor: '#ffffff' }}>
          <div className="text-center mb-4">
            <h3 className="fw-bold text-primary">Bienvenido a Hospisoft</h3>
            <p className="text-muted small">Por favor ingresa tus datos</p>
          </div>

          <Form.Group className="mb-3" controlId="formEmail">
            <Form.Label className="fw-semibold">Correo electrónico</Form.Label>
            <Form.Control
              type="email"
              placeholder="Ingrese su correo"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              size="lg"
              style={{ borderRadius: '10px', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)' }}
            />
          </Form.Group>

          <Form.Group className="mb-4" controlId="formPassword">
            <Form.Label className="fw-semibold">Contraseña</Form.Label>
            <div style={{ position: 'relative' }}>
              <Form.Control
                type={showPassword ? 'text' : 'password'}
                placeholder="Ingrese su contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                size="lg"
                style={{ paddingRight: '45px', borderRadius: '10px', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)' }}
              />
              <div
                onClick={toggleShowPassword}
                style={{
                  position: 'absolute',
                  top: '0',
                  right: '15px',
                  height: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  cursor: 'pointer',
                  color: '#6c757d',
                }}
              >
                <i className={`bi ${showPassword ? 'bi-eye-slash' : 'bi-eye'}`}></i>
              </div>
            </div>
          </Form.Group>

          <Button
            variant="primary"
            type="submit"
            className="w-100"
            size="lg"
            style={{
              borderRadius: '10px',
              transition: 'transform 0.2s ease'
            }}
          >
            Iniciar sesión
          </Button>
          <div className="d-flex flex-row justify-content-between">
            <div className="text-center mt-3">
              <a href='#' className="link-secondary">¿Olvidaste tu contraseña?</a>
            </div>

            <div className="text-center mt-3">
              <a href='/registro' className="link-primary">Crea tu cuenta aquí</a>
            </div>

          </div>
          
        </Form>
      </Container>
    </div>
  );
};

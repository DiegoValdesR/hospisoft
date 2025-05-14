import {Button, Card,Col,Form, Row} from 'react-bootstrap'
import { useState,useEffect } from 'react'

import { getUserById,updateUser } from '../../services/users/users.js'
import { getWorkerById,updateWorker } from '../../services/workers/workers.js'
import Swal from 'sweetalert2'

export const ProfileForm = ({session})=>{

    const [profileData,setProfileData] = useState({})

    const getProfileData = async()=>{
        const request = ["usuario"].includes(session.role) ? await getUserById(session["id"]) : await getWorkerById(session["id"])

        if (typeof request === "string") {
            Swal.fire({
                title:"Error",
                icon:"error",
                text:request,
                allowEscapeKey:false,
                allowOutsideClick:false
            }).then((res)=>{
                if (res.isConfirmed) {
                    return window.location.href = "/home"
                }
            })
        }

        let data
        if (["usuario"].includes(session.role) ) {
            data = {
                name:request.data.user_name,
                last_name:request.data.user_last_name,
                email:request.data.user_email,
                phone_number:request.data.user_phone_number,
                eps:request.data.user_eps
            }

            setProfileData(data)
            return
        }

        data = {
            name:request.data.worker_name,
            last_name:request.data.worker_last_name,
            email:request.data.worker_email,
            phone_number:request.data.worker_phone_number,
            speciality:request.data.worker_speciality
        }
        
        setProfileData(data)
    }

    const handleSubmit = async(e)=>{
        e.preventDefault()
        const form = e.target.closest('form')
        const formData = new FormData(form)
        
        let data
        if (["usuario"].includes(session.role)) {
            data = {
                user_name:formData.get('name'),
                user_last_name:formData.get('last_name'),
                user_email:formData.get('email'),
                user_phone_number:formData.get('phone_number'),
                user_eps:formData.get('eps')
            }            
        }else{
            data = {
                worker_name:formData.get('name'),
                worker_last_name:formData.get('last_name'),
                worker_email:formData.get('email'),
                worker_phone_number:formData.get('phone_number'),
                worker_speciality:formData.get('speciality')
            }
        }

        const request = ["usuario"].includes(session.role) ? await updateUser(session["id"],data) : await updateWorker(session["id"],data) 
        Swal.fire({
            title:request.status ? "Completado" : "Error",
            icon:request.status ? "success" : "error",
            text:request.message
        })
    }

    useEffect(()=>{
        getProfileData()
    },[])

    return (
        <>
            <Card>
                <Card.Body className='p-3'>
                    <Form className='mt-2' onSubmit={handleSubmit}>
                        <Row className='mb-3'>
                            <Col>
                                <Form.Group>
                                    <Form.Label className='text-black'>Nombre</Form.Label>
                                    <Form.Control
                                    type='text'
                                    name='name' required defaultValue={profileData.name}></Form.Control>
                                </Form.Group>
                            </Col>

                            <Col>
                                <Form.Group>
                                    <Form.Label className='text-black'>Apellido</Form.Label>
                                    <Form.Control
                                    type='text'
                                    name='last_name' required defaultValue={profileData.last_name}></Form.Control>
                                </Form.Group>
                            </Col>
                        </Row>

                        <Row className='mb-3'>
                            <Col>
                                <Form.Group>
                                    <Form.Label className='text-black'>Correo electrónico</Form.Label>
                                    <Form.Control
                                    type='text'
                                    name='email' required defaultValue={profileData.email}></Form.Control>
                                </Form.Group>
                            </Col>
                        </Row>

                        <Row className='mb-3'>
                            <Col>
                                <Form.Group>
                                    <Form.Label className='text-black'>Número telefónico</Form.Label>
                                    <Form.Control
                                    type='number'
                                    minLength={10}
                                    maxLength={10}
                                    name='phone_number' required defaultValue={profileData.phone_number}></Form.Control>
                                </Form.Group>
                            </Col>
                        </Row>
                        {console.log(profileData.eps)}
                        {["usuario"].includes(session.role) && profileData.eps && (
                            <Row className='mb-3'>
                                <Col>
                                    <Form.Group>
                                        <Form.Label className='text-black'>EPS</Form.Label>
                                        <Form.Select required name="eps" defaultValue={profileData.eps}>
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
                        )}

                        {!["usuario"].includes(session.role) && (
                            <Row className='mb-3'>
                                <Col>
                                    <Form.Group>
                                        <Form.Label className='text-black'>Especialidad</Form.Label>
                                        <Form.Control
                                        type='text'
                                        name='phone_number' defaultValue={profileData.speciality}
                                        disabled={["medico"].includes(session.role) ? false : true}></Form.Control>
                                    </Form.Group>
                                </Col>
                            </Row>
                        )}

                        <Card.Footer>
                            <Button variant='primary' type='submit'>Actualizar</Button>
                        </Card.Footer>
                    </Form>
                </Card.Body>
            </Card>
        </>
    )
}
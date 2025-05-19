import { Card,Col,Form, Row} from 'react-bootstrap'
import { useState,useEffect } from 'react'

import { getUserById,updateUser } from '../../services/users/users.js'
import { getWorkerById,updateWorker } from '../../services/workers/workers.js'
import Swal from 'sweetalert2'

import { FloatLabel } from 'primereact/floatlabel'
import { InputText } from 'primereact/inputtext'
import { InputNumber } from 'primereact/inputnumber'
import { Dropdown } from 'primereact/dropdown'
import { Button } from 'primereact/button'

export const ProfileForm = ({session})=>{

    const [profileData,setProfileData] = useState({})
    const [userEps,setUserEps] = useState("")
    
    const epsArray = [
        { label: "Nueva EPS", value: "Nueva EPS" },
        { label: "Sanitas", value: "Sanitas" },
        { label: "Sura", value: "Sura" },
        { label: "Salud Total", value: "Salud Total" },
        { label: "Coosalud", value: "Coosalud" },
        { label: "Famisanar", value: "Famisanar" },
        { label: "Mutual Ser", value: "Mutual Ser" },
        { label: "Compensar", value: "Compensar" },
        { label: "Emssanar", value: "Emssanar" },
        { label: "Savia Salud", value: "Savia Salud" },
        { label: "Asmet Salud", value: "Asmet Salud" },
        { label: "Cajacopi", value: "Cajacopi" },
        { label: "Capital Salud", value: "Capital Salud" },
        { label: "Servicio Occidental de Salud", value: "Servicio Occidental de Salud" },
        { label: "Asociación Indígena del Cauca", value: "Asociación Indígena del Cauca" },
        { label: "Mallamás", value: "Mallamás" },
        { label: "Comfenalco Valle", value: "Comfenalco Valle" },
        { label: "Aliansalud", value: "Aliansalud" },
        { label: "Anaswayuu", value: "Anaswayuu" },
        { label: "Familiar de Colombia", value: "Familiar de Colombia" },
        { label: "Dusakawi", value: "Dusakawi" },
        { label: "Comfaoriente", value: "Comfaoriente" },
        { label: "Capresoca", value: "Capresoca" },
        { label: "Comfachocó", value: "Comfachocó" },
        { label: "Pijaos", value: "Pijaos" },
        { label: "Salud Mía", value: "Salud Mía" },
        { label: "Salud Bolívar", value: "Salud Bolívar" }
    ]

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
            text:request.message,
            allowEscapeKey:false,
            allowOutsideClick:false
        }).then((res)=>{
            if (res.isConfirmed && request.status) {
                if (!["admin"].includes(session.role)) {
                    window.location.href = '/home'
                }else{
                    window.location.href = '/dashboard'
                }
            }
        })
    }

    useEffect(()=>{
        getProfileData()
    },[])

    useEffect(()=>{
        if (["usuario"].includes(session.role)) {
            setUserEps(profileData.eps)
        }   
    },[profileData])

    return (
        <>
            <Card>
                <Card.Body className='p-3'>
                    <Form className='mt-2' onSubmit={handleSubmit}>
                        <Row className='mt-4'>
                            <Col>
                                <FloatLabel>
                                    <label htmlFor="name">Nombre</label>
                                    <InputText defaultValue={profileData.name}
                                    name='name'
                                    id='name'
                                    required
                                    ></InputText>
                                </FloatLabel>
                            </Col>
                        </Row>

                        <Row style={{marginTop:"40px"}}>
                            <Col>
                                <FloatLabel>
                                    <label htmlFor="last_name">Apellido</label>
                                    <InputText defaultValue={profileData.last_name}
                                    name='last_name'
                                    id='last_name'
                                    required
                                    ></InputText>
                                </FloatLabel>
                            </Col>
                        </Row>

                        <Row style={{marginTop:"40px"}}>
                            <Col>
                                <FloatLabel>
                                    <label htmlFor="email">Correo electrónico</label>
                                    <InputText defaultValue={profileData.email}
                                    name='email'
                                    id='email'
                                    required
                                    ></InputText>
                                </FloatLabel>
                            </Col>
                        </Row>
                        
                        <Row style={{marginTop:"40px"}}>
                            <Col>
                                <FloatLabel>
                                    <label htmlFor="phone_number">Número de teléfono</label>
                                    <InputNumber
                                    style={{width:"100%"}}
                                    name='phone_number'
                                    id='phone_number'
                                    value={profileData.phone_number}
                                    maxLength={10}
                                    useGrouping={false}
                                    required
                                    ></InputNumber>
                                </FloatLabel>
                            </Col>
                        </Row>

                        {["usuario"].includes(session.role) && profileData.eps && (
                            <Row style={{marginTop:"30px"}}>
                                <Col>
                                    <Dropdown
                                    style={{width:"100%"}}
                                    placeholder='Selecciona una EPS'
                                    name='eps'
                                    required options={epsArray}
                                    optionLabel='label' optionValue='value'
                                    value={userEps}
                                    onChange={(e)=>{setUserEps(e.value)}}
                                    ></Dropdown>
                                </Col>
                            </Row>
                        )}

                        {!["usuario"].includes(session.role) && (
                            <Row style={{marginTop:"40px"}}>
                                <Col>
                                    <FloatLabel>
                                        <label htmlFor="speciality">Especialidad</label>
                                        <InputText defaultValue={profileData.speciality}
                                        name='speciality'
                                        id='speciality'
                                        required
                                        disabled={["medico"].includes(session.role) ? false : true}
                                        ></InputText>
                                    </FloatLabel>
                                </Col>
                            </Row>
                        )}

                        <Card.Footer style={{marginTop:"20px"}}>
                            <Button severity='info' className='rounded rounded-2' type='submit'>Actualizar</Button>
                        </Card.Footer>
                    </Form>
                </Card.Body>
            </Card>
        </>
    )
}
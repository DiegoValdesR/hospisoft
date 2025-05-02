import { Button,Modal,ListGroup } from "react-bootstrap"
import { useState,useEffect } from "react"
import { API_URL } from "../../../API_URL.js"
import moment from "moment-timezone"
import { deactivateAppointment } from "../../../services/appointments/appointments.js"
import Swal from "sweetalert2"
import { UpdateAppointment } from "./UpdateAppointment.jsx"

export const ShowAppointment = ({getEvents,appointmentData,setAppointmentData})=>{
    
    const [show,setShow] = useState(false)
    const [patient,setPatient] = useState({})
    const [doctor,setDoctor] = useState({})
    const [showUpdate,setShowUpdate] = useState(false)

    const getDoctor = async()=>{
        const doctor = await fetch(API_URL + '/workers/byid/'+appointmentData.doctor_id,{
            credentials:"include"
        })

        if (doctor.ok) {
            const doctorJSON = await doctor.json()
            setDoctor(doctorJSON.data) 
            return  
        }
    }

    const getPatient = async()=>{
        const patient = await fetch(API_URL + '/users/byid/'+appointmentData.patient_id,{
            credentials:"include"
        })

        if (patient.ok) {
            const patientJSON = await patient.json()
            setPatient(patientJSON.data) 
            return  
        }
    }
    
    const handleDelete = (appointmentId)=>{
        Swal.fire({
            title:"¿Está seguro de cancelar esta cita?",
            icon:"question",
            showCancelButton:true,
            cancelButtonText:"Cancelar",
            confirmButtonText:"Aceptar",
            confirmButtonColor:"#dc3545"
        }).then(async(res)=>{
            if (res.isConfirmed) {
                const response = await deactivateAppointment(appointmentId)
                if (response.status) {
                    await getEvents()
                    handleHide()
                }

                Swal.fire({
                    title: response.status ? "Completado" : "Error",
                    icon: response.status ? "success" : "error",
                    text:response.message
                })
            }
        })
    }

    const handleShow = ()=>{
        setShow(true)
    }

    const handleHide = ()=>{
        setAppointmentData({})
        setShow(false)
    }

    useEffect(()=>{
        if (Object.keys(appointmentData).length > 0) {
            handleShow()
            getDoctor()
            getPatient()
        }
    },[appointmentData])

    return(
        <>
            <UpdateAppointment
            showUpdate={showUpdate}
            setShowUpdate={setShowUpdate}
            appointmentData={appointmentData}
            setAppointmentData={setAppointmentData}
            getEvents={getEvents}></UpdateAppointment>

            <Modal centered className="fade" show={show} onHide={handleHide}>
                <Modal.Header className="d-flex flex-row justify-content-between">
                    <Modal.Title>Detalles de la cita</Modal.Title>
                    <i role="button" className="text-danger fs-4 bi bi-x-circle"
                    onClick={handleHide}></i>
                </Modal.Header>
                <Modal.Body>
                    <ListGroup>
                        <ListGroup.Item>
                            <strong>Fecha: </strong> 
                            {
                            moment(appointmentData.start_date).format("DD MMMM YYYY")
                            }
                        </ListGroup.Item>

                        <ListGroup.Item>
                            <strong>Hora de inicio: </strong> 
                            {
                            moment.utc(appointmentData.start_date).format("hh:mm a")
                            }
                        </ListGroup.Item>

                        <ListGroup.Item>
                            <strong>Hora de finalización: </strong> 
                            {
                            moment.utc(appointmentData.end_date).format("hh:mm a")
                            }
                        </ListGroup.Item>

                        <ListGroup.Item>
                            <strong>Médico encargado:</strong> {`${doctor.worker_name} ${doctor.worker_last_name}`}
                        </ListGroup.Item>

                        <ListGroup.Item>
                            <strong>Paciente:</strong> {`${patient.user_name} ${patient.user_last_name}`}
                        </ListGroup.Item>
                    </ListGroup>
                </Modal.Body>

                <Modal.Footer className="d-flex justify-content-between">
                    <section>
                        <Button variant="primary me-3" title="Actualizar"
                        onClick={()=>{
                            setShow(false)
                            setShowUpdate(true)
                        }}>
                            <i className="bi bi-pencil-square"></i>
                        </Button>

                        <Button variant="danger me-3" title="Eliminar"
                        onClick={()=>{handleDelete(appointmentData["_id"])}}>
                            <i className="bi bi-trash3"></i>
                        </Button>
                    </section>

                    <section>
                        <Button variant="success" onClick={handleHide}>Aceptar</Button>
                    </section>
                </Modal.Footer>
            </Modal>
        </>
    )
}
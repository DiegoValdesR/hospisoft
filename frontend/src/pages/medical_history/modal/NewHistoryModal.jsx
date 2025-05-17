import { Col, Form, Modal, Row , Button} from "react-bootstrap"
import { useState,useEffect } from "react"
import { byDoctorAndPatient } from "../../../services/appointments/appointments.js"
import { getAllUsers } from "../../../services/users/users.js"
import { getAllDoctors } from "../../../services/workers/workers.js"
import { insertHistory } from "../../../services/medical_history/history.js"
import Swal from "sweetalert2"
import moment from "moment-timezone";

export const NewHistoryModal = ({showInsert,setShowInsert,getHistories})=>{
    const [patients,setPatients] = useState([])
    const [patientId,setPatientId] = useState("")
    const [doctorId,setDoctorId] = useState("")
    const [disabled,setDisabled] = useState(true)
    const [doctors,setDoctors] = useState([])
    const [dates,setDates] = useState([])

    const getPatients = async()=>{
        const request = await getAllUsers()
            
        if (request.status) {
            setPatients(request.data)
            return
        }

        console.error(request)
    }

    const getDoctors = async()=>{
        const request = await getAllDoctors()
            
        if (request.status) {
            setDoctors(request.data)
            return   
        }

        console.error(request)
    }

    const getDates = async()=>{
        const request = await byDoctorAndPatient(doctorId,patientId)
        if (request.status && request.data.length > 0) {
            setDates(request.data)
            setDisabled(false)
            return
        }
    }

    const handleSubmit = async(e)=>{
        e.preventDefault()

        Swal.fire({
            title:"Procesando información...",
            allowEscapeKey:false,
            allowOutsideClick:false,
            didOpen:()=>{
                Swal.showLoading()
            }
        })

        const form = e.target.closest('form')
        const formData = new FormData(form)

        const data = {
            patient_id:formData.get("patient_id"),
            doctor_id:formData.get("doctor_id"),
            reason:formData.get("reason"),
            diagnosis:formData.get("diagnosis"),
            appointment_id:formData.get("appointment_id"),
            treatment:formData.get("treatment")
        }

        const request = await insertHistory(data)
        if (request.status) {
            await getHistories()
            handleHide()
        }

        Swal.close()
        Swal.fire({
            title:request.status ? "Completado" : "Error",
            icon:request.status ? "success" : "error",
            text:request.message
        })
    }

    
    useEffect(()=>{
        getPatients()
        getDoctors()
    },[])

    useEffect(()=>{
        if (doctorId.length === 24 && patientId.length === 24) {
           getDates() 
        }else{
            setDisabled(true)
        }
    },[doctorId,patientId])
    
    const handleHide = ()=>{
        setShowInsert(false)
    }

    return (
        <Modal show={showInsert} centered className="fade">
            <Modal.Header className="d-flex flex-row justify-content-between">
                <Modal.Title>Nueva historial médico</Modal.Title>
                <i role="button" className="text-danger fs-4 bi bi-x-circle"
                onClick={handleHide}></i>
            </Modal.Header>
            <Modal.Body>
                <Form onSubmit={handleSubmit}>
                    <Row className="mb-3">
                        <Col>
                            <Form.Group>
                                <Form.Label className="text-black">Paciente</Form.Label>
                                <Form.Select
                                required
                                name="patient_id"
                                onChange={({target})=>{
                                    setPatientId(target ? target.value : "0")
                                }}
                                defaultValue={""}>
                                    <option value="">Selecciona un paciente</option>
                                    {patients.map((patient)=>{
                                        return (
                                            <option key={patient["_id"]} value={patient["_id"]}>
                                                {patient.user_name} {patient.user_last_name}
                                            </option>
                                        )
                                    })}
                                </Form.Select>
                            </Form.Group>
                        </Col>
                        <Col>
                            <Form.Group>
                                <Form.Label className="text-black">Médico encargado</Form.Label>
                                <Form.Select
                                name="doctor_id"
                                onChange={({target})=>{setDoctorId(target ? target.value : "0")}}
                                required
                                defaultValue={""}>
                                    <option value="">Selecciona un médico</option>
                                    {doctors.map((doctor)=>{
                                        return (
                                            <option key={doctor["_id"]} value={doctor["_id"]}>
                                                {doctor.worker_name} {doctor.worker_last_name}
                                            </option>
                                        )
                                    })}
                                </Form.Select>
                            </Form.Group>
                        </Col>
                    </Row>

                    <Row className="mb-3">
                        <Form.Group>
                            <Form.Label className="text-black">Cita asignada</Form.Label>
                            <Form.Select
                            required
                            disabled={disabled}
                            name="appointment_id"
                            >
                                <option>Seleccione la fecha de la cita</option>
                                {dates.length > 0 ? dates.map((date)=>{
                                    return(
                                        <option key={date["_id"]} value={date["_id"]}>
                                            {moment(date["start_date"]).format('DD/MM/YYYY')}
                                        </option>
                                    )
                                }) : ""}
                            </Form.Select>
                        </Form.Group>
                    </Row>

                    <Row className="mb-3">
                        <Form.Group>
                            <Form.Label className="text-black">Razón</Form.Label>
                            <Form.Control
                            required
                            as={"textarea"}
                            name="reason"
                            >
                            </Form.Control>
                        </Form.Group>
                    </Row>

                    <Row className="mb-3">
                        <Form.Group>
                            <Form.Label className="text-black">Diagnostico</Form.Label>
                            <Form.Control
                            as={"textarea"}
                            required
                            name="diagnosis"
                            >
                            </Form.Control>
                        </Form.Group>
                    </Row>

                    <Row className="mb-3">
                        <Form.Group>
                            <Form.Label className="text-black">Tratamiento</Form.Label>
                            <Form.Control
                            as={"textarea"}
                            required
                            name="treatment"
                            >
                            </Form.Control>
                        </Form.Group>
                    </Row>

                    <Modal.Footer>
                        <Button variant="secondary"
                            onClick={handleHide}>Cancelar</Button>
                            <Button variant="primary" type="submit">Aceptar</Button>
                    </Modal.Footer>
                </Form>
            </Modal.Body>
        </Modal>
    )
}
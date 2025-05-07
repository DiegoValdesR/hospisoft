import { Form, Modal, Row } from "react-bootstrap"
import { useState } from "react"

const NewHistoryModal = ()=>{
    const [patients,setPatients] = useState([])
    const [doctors,setDoctors] = useState([])

    const handleHide = ()=>{

    }

    return (
        <Modal>
            <Modal.Header>
                <Modal.Title>Nueva historial médico</Modal.Title>
                <i role="button" className="text-danger fs-4 bi bi-x-circle"
                onClick={handleHide}></i>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Row>
                        <Form.Group>
                            <Form.Label className="text-black">Paciente</Form.Label>
                            <Form.Select
                            name="patient_id"
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
                    </Row>

                    <Row>
                        <Form.Group>
                            <Form.Label className="text-black">Razón</Form.Label>
                            <Form.Control
                            type="text"
                            name="reason"
                            >
                            </Form.Control>
                        </Form.Group>
                    </Row>

                    <Row>
                        <Form.Group>
                            <Form.Label className="text-black">Diagnostico</Form.Label>
                            <Form.Control
                            type="text"
                            name="diagnosis"
                            >
                            </Form.Control>
                        </Form.Group>
                    </Row>

                    <Row>
                        <Form.Group>
                            <Form.Label className="text-black">Tratamiento</Form.Label>
                            <Form.Control
                            type="text"
                            name="treatment"
                            >
                            </Form.Control>
                        </Form.Group>
                    </Row>

                    <Row>
                        <Form.Group>
                            <Form.Label className="text-black">Médico encargado</Form.Label>
                            <Form.Select
                            name="doctor_id"
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
                    </Row>

                    <Modal.Footer>
                        
                    </Modal.Footer>
                </Form>
            </Modal.Body>
        </Modal>
    )
}
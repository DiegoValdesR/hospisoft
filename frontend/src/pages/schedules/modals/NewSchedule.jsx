import { Button, Col, Form, Modal, Row } from "react-bootstrap"
import Swal from "sweetalert2"

export const NewSchedule = ({API_URL,workers = [],showModal,setShowModal,getEvents})=>{
    const handleHide = ()=>{
        setShowModal(false)
    }

    const handleSubmit = async(e)=>{
        e.preventDefault()
        try {
            Swal.fire({
                text:"Procesando...",
                didOpen:()=>{
                    Swal.showLoading()
                }
            })

            const form = e.target.closest('form')
            const formData = new FormData(form)
            
            const data = {
                title:formData.get("title"),
                worker_id:formData.get("worker_id"),
                schedule_start_date:formData.get("schedule_start_date"),
                schedule_final_date:formData.get("schedule_final_date"),
                hour_start:formData.get("hour_start"),
                hour_end:formData.get("hour_end"),
                schedule_area:formData.get("schedule_area"),
            }

            const insert = await fetch(API_URL + `/schedules/new`,{
                method:"POST",
                credentials: 'include',
                headers:{
                    "Content-Type":"application/json"
                },
                body:JSON.stringify(data)
            })

            if (!insert.ok) {
                throw new Error(insert.statusText)
            }

            const insertJSON = await insert.json()
            Swal.close()

            handleHide()
            await getEvents()
            
            Swal.fire({
                title:"Completado",
                icon:"success",
                text:insertJSON.message
            })

            return

        } catch (error) {
            Swal.fire({
                title:"Error",
                icon:"error",
                text:error.message
            })
        }
    }
    
    return (
        <Modal centered onHide={handleHide} className="fade" show={showModal}>
            <Modal.Header className="d-flex flex-row justify-content-between">
                <Modal.Title>Nuevo Horario</Modal.Title>
                <i role="button" className="text-danger fs-4 bi bi-x-circle"
                onClick={handleHide}></i>
            </Modal.Header>
            <Modal.Body>
                <Form onSubmit={handleSubmit}>

                    <Row className="mb-3">
                        <Form.Group>
                            <Form.Label className="text-black">Título</Form.Label>
                            <Form.Control type="text" required
                            name="title"
                            ></Form.Control>
                        </Form.Group>
                    </Row>

                    <Row className="mb-3">
                        <Form.Group>
                            <Form.Label className="text-black">Empleado</Form.Label>
                            <Form.Select required name="worker_id">
                                <option value="">Selecciona un empleado</option>
                                {workers.map((worker)=>{
                                    return (
                                        <option key={worker["_id"]} value={worker["_id"]}>
                                            {worker.worker_name} {worker.worker_last_name}
                                        </option>
                                    )
                                })}
                            </Form.Select>
                        </Form.Group>
                    </Row>

                    <Row className="mb-3">
                        <Col>
                            <Form.Group>
                                <Form.Label className="text-black">Fecha de inicio</Form.Label>
                                <Form.Control type="date" required
                                name="schedule_start_date"
                                ></Form.Control>
                            </Form.Group>
                        </Col>

                        <Col>
                            <Form.Group>
                                <Form.Label className="text-black">Fecha de finalización</Form.Label>
                                <Form.Control type="date" required
                                name="schedule_final_date"
                                ></Form.Control>
                            </Form.Group>
                        </Col>
                    </Row>

                    <Row className="mb-3">
                        <Col>
                            <Form.Group>
                            <Form.Label className="text-black">Hora de inicio</Form.Label>
                            <Form.Control type="time" required
                            name="hour_start"
                            ></Form.Control>
                            </Form.Group>
                        </Col>
                        <Col>
                            <Form.Group>
                            <Form.Label className="text-black">Hora de finalización</Form.Label>
                            <Form.Control type="time" required
                            name="hour_end"
                            ></Form.Control>
                            </Form.Group>
                        </Col>
                    </Row>

                    <Row className="mb-3">
                        <Form.Group>
                            <Form.Label className="text-black">Área</Form.Label>
                            <Form.Control as={"textarea"} type="text" required
                            name="schedule_area"
                            ></Form.Control>
                        </Form.Group>
                    </Row>

                    <Modal.Footer>
                        <Button variant="secondary"
                        onClick={handleHide}>Cancelar</Button>
                        <Button type="submit" variant="primary"
                        >
                            Aceptar
                        </Button>
                    </Modal.Footer>
                </Form>
            </Modal.Body>
        </Modal>
    )
}
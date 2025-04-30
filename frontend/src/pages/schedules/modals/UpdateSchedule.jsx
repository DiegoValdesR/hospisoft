import { useState,useEffect } from "react"
import Swal from "sweetalert2"
import { Modal,Form,Row,Col,Button } from "react-bootstrap"

export const UpdateSchedule = ({API_URL, scheduleData, setScheduleData, workers = [], getEvents, showUpdate, setShowUpdate})=>{

    const handleSubmit = async(e)=>{
        e.preventDefault()
        Swal.fire({
            title:"Procesando...",
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

        const update = await fetch(API_URL + `/schedules/update/${scheduleData._id}`,{
            method:"PUT",
            credentials: 'include',
            headers:{
                "Content-Type":"application/json"
            },
            body:JSON.stringify(data)
        })

        if (!update.ok) {
            console.error(update.statusText)
            Swal.close()

            Swal.fire({
                title:"Error",
                icon:"error",
                text:"Ocurrió un error al intentar actualizar el horario, por favor, intentelo más tarde."
            })
            return 
        }

        const updateJSON = await update.json()
        Swal.close()

        if(updateJSON.status === "completed"){
            await getEvents()
            handleHide()
        } 

        Swal.fire({
            title:updateJSON.status === "completed" ? "Completado" : "Error",
            icon:updateJSON.status === "completed" ? "success" : "error",
            text:updateJSON.message
        })

    }

    const handleHide = ()=>{
        setShowUpdate(false)
        setScheduleData({})
    }

    return (
        <Modal centered onHide={handleHide} className="fade" show={showUpdate}>
            <Modal.Header className="d-flex flex-row justify-content-between">
                <Modal.Title>Actualizar Horario</Modal.Title>
                <i role="button" className="text-danger fs-4 bi bi-x-circle"
                onClick={handleHide}></i>
            </Modal.Header>
            <Modal.Body>
                <Form onSubmit={handleSubmit}>
                    <Row className="mb-3">
                        <Form.Group>
                            <Form.Label className="text-black">Título</Form.Label>
                            <Form.Control type="text" required
                            name="title" defaultValue={scheduleData.title}
                            ></Form.Control>
                        </Form.Group>
                    </Row>

                    <Row className="mb-3">
                        <Form.Group>
                            <Form.Label className="text-black">Empleado</Form.Label>
                            <Form.Select required name="worker_id"
                            defaultValue={scheduleData.worker_id}>
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
                                defaultValue={scheduleData.schedule_start_date}
                                ></Form.Control>
                            </Form.Group>
                        </Col>

                        <Col>
                            <Form.Group>
                                <Form.Label className="text-black">Fecha de finalización</Form.Label>
                                <Form.Control type="date" required
                                name="schedule_final_date"
                                defaultValue={scheduleData.schedule_final_date}
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
                            defaultValue={scheduleData.hour_start}
                            ></Form.Control>
                            </Form.Group>
                        </Col>
                        <Col>
                            <Form.Group>
                            <Form.Label className="text-black">Hora de finalización</Form.Label>
                            <Form.Control type="time" required
                            name="hour_end"
                            defaultValue={scheduleData.hour_end}
                            ></Form.Control>
                            </Form.Group>
                        </Col>
                    </Row>

                    <Row className="mb-3">
                        <Form.Group>
                            <Form.Label className="text-black">Área</Form.Label>
                            <Form.Control as={"textarea"} type="text" required
                            name="schedule_area"
                            defaultValue={scheduleData.schedule_area}
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
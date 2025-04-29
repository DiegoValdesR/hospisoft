import { Modal,Button } from "react-bootstrap"

export const NewAppointment = ()=>{
    return(
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
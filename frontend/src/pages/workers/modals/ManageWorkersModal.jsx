import { useState,useEffect } from "react"
import { insertWorker,updateWorker } from "../../../services/workers/workers.js"
import Swal from "sweetalert2"
import { API_URL } from "../../../API_URL.js"
import {Modal,Button,ModalBody,ModalHeader,Form,Row,Col} from 'react-bootstrap'
/**
 * @param modalData Variable bool que maneja si se muestra o no la modal
 * @param setModalData Funcion que cambia de true a false y viceversa la variable 'showModal'
 * @param workerId self explanatory
 * @param setworkerId Método de 'WorkersTable' que cambia el id del empleado, lo uso para cuando cierro la modal
 * @param getAllWorkers Método de 'WorkersTable', lo uso para volver a cargar la tabla con los nuevos cambios
 */
export const ManageWorkersModal = ({modalData, setModalData, workerId = "", setWorkerId, getAllWorkers})=>{
    const [workerById,setWorkerById] = useState({})
    const [disabled,setDisabled] = useState(true)

    const GetWorkerById = async() =>{
        Swal.fire({
            title:"Cargando empleado...",
            allowEscapeKey:false,
            allowOutsideClick:false,
            didOpen:()=>{
                Swal.showLoading()
            }
        })

        const worker = await fetch(API_URL + '/workers/byid/'+workerId,{credentials: 'include'})
        if (!worker.ok) {
            Swal.close()
            Swal.fire({
                title:"Error",
                icon:"error",
                text:"Error interno del servidor, por favor intentelo más tarde.",
                allowEscapeKey:false,
                allowOutsideClick:false
            }).then((res)=>{
                if (res.isConfirmed) {
                    window.location.href = "/home"
                }
            })
            return
        }
        const workerJSON = await worker.json()
        setWorkerById(workerJSON.data)
        setModalData(true)
        Swal.close()
    }

    const handleHide = ()=>{
        setModalData(false)
        setWorkerId("")
        return
    }

    const handleShow = ()=>{
        if (workerId.length === 24 && workerById.worker_role === "medico") {
            setDisabled(false)
            return
        }
        setDisabled(true)
    }

    const handleRole = (e)=>{
        const role = e.target.value
        if(role === "medico"){
            setDisabled(false)
            return 
        }

        setDisabled(true)
    }

    useEffect(()=>{
        if (workerId.length === 24) {
            GetWorkerById()
        }
    },[workerId])

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
            worker_document:formData.get("worker_document"),
            worker_name:formData.get("worker_name"),
            worker_last_name:formData.get("worker_last_name"),
            worker_email:formData.get("worker_email"),
            worker_password:formData.get("worker_password"),
            worker_phone_number:formData.get("worker_phone_number"),
            worker_birthdate:formData.get("worker_birthdate"),
            worker_role:formData.get("worker_role"),
            worker_speciality:formData.get("worker_speciality")
        }

        if (workerId.length === 24) {
            delete data.worker_document
            delete data.worker_birthdate
            delete data.worker_role
        }

        const request = workerId.length !== 24 ? await insertWorker(data) : await updateWorker(workerId,data)
        Swal.close()

        if (request.status) {
            await getAllWorkers()
            handleHide()
        }

        Swal.fire({
            title:request.status ? 'Completado' : "Error",
            icon:request.status ? 'success' : "error",
            text:request.message
        })
    }

    return (
        <Modal centered className="fade" onHide={handleHide} show={modalData} size="xl"
        onShow={handleShow}>
            <ModalHeader className="d-flex flex-row justify-content-between">
                <Modal.Title>
                    {workerId === "" ? "Insertar" : "Actualizar"} empleado
                </Modal.Title>
                <i role="button" className="text-danger fs-4 bi bi-x-circle"
                onClick={handleHide}></i>
            </ModalHeader>
            <ModalBody>
                <Form onSubmit={handleSubmit}>

                    {workerId === "" ? (
                        <Row className="mb-3">
                            <Col>
                                <Form.Label className="text-black">Número de documento</Form.Label>
                                <Form.Control
                                type="number"
                                minLength={10}
                                maxLength={10}
                                required
                                name="worker_document"></Form.Control>
                            </Col>
                            
                        </Row>
                    ) : ""}

                    <Row className="mb-3">
                        <Col>
                        <Form.Group>
                            <Form.Label className="text-dark">Nombre(s)</Form.Label>
                            <Form.Control
                            required
                            name="worker_name"
                            type="text"
                            placeholder="Ej: Paco"
                            defaultValue={workerId !== "" ? workerById.worker_name : ""} 
                            ></Form.Control>
                        </Form.Group>
                        </Col>

                        <Col>
                        <Form.Group>
                            <Form.Label className="text-dark">Apellidos</Form.Label>
                            <Form.Control
                            required
                            name="worker_last_name"
                            type="text"
                            placeholder="Ej: García"
                            defaultValue={workerId !== "" ? workerById.worker_last_name : ""} 
                            ></Form.Control>
                        </Form.Group>
                        </Col>

                    </Row>

                    {workerId.length === 0 ? (
                        <Row className="mb-3">
                            <Col>
                            <Form.Group>
                                <Form.Label className="text-dark">Fecha de nacimiento</Form.Label>
                                <Form.Control
                                required
                                name="worker_birthdate"
                                type="date"
                                ></Form.Control>
                            </Form.Group>
                            </Col>
                            
                            <Col>
                            <Form.Group>
                            <Form.Label className="text-dark">Número telefónico</Form.Label>
                            <Form.Control
                            required
                            name="worker_phone_number"
                            type="text"
                            minLength={10}
                            maxLength={10}
                            placeholder="Ej: 321801****"
                            defaultValue={workerId !== "" ? workerById.worker_phone_number : ""} 
                            ></Form.Control>
                        </Form.Group>
                            </Col>

                        </Row>
                    ) : ""}

                    {workerId.length === 0 ? (
                        <Row className="mb-3">
                        <Form.Group>
                            <Form.Label className="text-dark">Contraseña</Form.Label>
                            <Form.Control
                            required
                            minLength={6}
                            name="worker_password"
                            type="password"
                            ></Form.Control>
                            <small className="mt-2">Debe tener al menos 6 digitos.</small>
                        </Form.Group>
                        </Row>
                    ) : ""}
                   
                    <Row className="mb-3">
                    <Form.Group>
                            <Form.Label className="text-dark">Correo</Form.Label>
                            <Form.Control
                            required
                            name="worker_email"
                            type="email"
                            placeholder="Ej: example@gmail.com"
                            defaultValue={workerId !== "" ? workerById.worker_email : ""} 
                            ></Form.Control>
                        </Form.Group>

                    </Row>
                    
                    <Row className="mb-3">
                        <Col>
                        <Form.Group>
                            <Form.Label className="text-dark">Rol</Form.Label>
                            <Form.Select name="worker_role"
                            defaultValue={workerId.length === 24 ? workerById.worker_role : ""}
                            onChange={handleRole}>
                                <option value = "">Seleccione un rol</option>
                                <option value="medico">Médico</option>
                                <option value="secretaria">Secretaria</option>
                                <option value="farmaceutico">Farmacéutico </option>
                            </Form.Select>
                        </Form.Group>
                        </Col>
                        <Col>
                        <Form.Group>
                            <Form.Label className="text-dark">Especialidad</Form.Label>
                            <Form.Control disabled={disabled} type="text" placeholder="..."
                            defaultValue={workerId.length === 24 ? workerById.worker_speciality : ''}
                            name="worker_speciality">
                            </Form.Control>
                        </Form.Group>
                        </Col>

                    </Row>

                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleHide}>Cerrar</Button>
                        <Button type="submit" variant="primary">Enviar</Button>
                    </Modal.Footer>
                </Form>
            </ModalBody>
        </Modal>
    )
}
import { useState,useEffect } from "react"
import Swal from "sweetalert2"
import { API_URL } from "../../../API_URL.js"
import {Modal,Button,ModalBody,ModalHeader,Form,Row,Col} from 'react-bootstrap'
/**
 * @param modalData Variable bool que maneja si se muestra o no la modal
 * @param setModalData Funcion que cambia de true a false y viceversa la variable 'showModal'
 * @param workerId self explanatory
 * @param setworkerId Método de 'WorkersTable' que cambia el id del empleado, lo uso para cuando cierro la modal
 * @param setWorkers Método de 'WorkersTable', la uso 
 * para volver a cargar la tabla con los nuevos cambios
 */
export const ManageWorkersModal = ({modalData, setModalData, workerId = "", setWorkerId, setWorkers})=>{
    const [workerById,setWorkerById] = useState({})
    const [disabled,setDisabled] = useState(true)

    const GetWorkerById = async() =>{
        Swal.fire({
            title:"Cargando empleado...",
            didOpen:()=>{
                Swal.showLoading()
            }
        })

        const worker = await fetch(API_URL + '/workers/byid/'+workerId).then(res => res.json())
        if (worker && worker.status === "completed") {
            setWorkerById(worker.data)
            setModalData(true)
            Swal.close()
            return
        }
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
        const form = e.target.closest('form')
        const formData = new FormData(form)

        const data = {
            worker_name:formData.get("worker_name"),
            worker_last_name:formData.get("worker_last_name"),
            worker_email:formData.get("worker_email"),
            worker_password:formData.get("worker_password"),
            worker_phone_number:formData.get("worker_phone_number"),
            worker_birthdate:formData.get("worker_birthdate"),
            worker_role:formData.get("worker_role"),
            worker_speciality:formData.get("worker_speciality")
        }

        switch (workerId.length) {
            case 0:
                Swal.fire({
                    title:"Procesando información...",
                    didOpen:()=>{
                        Swal.showLoading()
                    }
                })
                const insert = await fetch(API_URL + `/workers/new`,{
                    method:"POST",
                    headers:{
                        "Content-Type":"application/json"
                    },
                    body:JSON.stringify(data)
                })
                const insertJSON = await insert.json()
                Swal.close()

                if (insertJSON) {
                    Swal.fire({
                        title:insertJSON.status === "completed" ? 'Completado' : "Error",
                        icon:insertJSON.status === "completed" ? 'success' : "error",
                        text:insertJSON.message
                    })

                    if (insertJSON.status === "completed") {
                        const allWorkers = await fetch(API_URL + '/workers/all').then(res => res.json())
                        if (allWorkers && allWorkers.status === "completed") {
                            setWorkers(allWorkers.data)
                            handleHide()
                            return
                        }
                    }
                }
                break;
            
            case 24:
                delete data.worker_password
                delete data.worker_birthdate
                Swal.fire({
                    title:"Procesando información...",
                    didOpen:()=>{
                        Swal.showLoading()
                    }
                })
                const update = await fetch(API_URL + `/workers/update/${workerId}`,{
                    method:"PUT",
                    headers:{
                        "Content-Type":"application/json"
                    },
                    body:JSON.stringify(data)
                })
                const updateJSON = await update.json()
                Swal.close()

                if (updateJSON) {
                    Swal.fire({
                        title:updateJSON.status === "completed" ? 'Completado' : "Error",
                        icon:updateJSON.status === "completed" ? 'success' : "error",
                        text:updateJSON.message
                    })

                    if (updateJSON.status === "completed") {
                        const allWorkers = await fetch(API_URL + '/workers/all').then(res => res.json())
                        if (allWorkers && allWorkers.status === "completed") {
                            setWorkers(allWorkers.data)
                            handleHide()
                            return
                        }
                    }
                }
                break
        
            default:
                Swal.fire({
                    title:"Error",
                    icon:"error",
                    text:"Ocurrió un error, intentelo más tarde",
                    showCancelButton:false,
                    showConfirmButton:false,
                    timer:3000
                })
                break;
        }
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
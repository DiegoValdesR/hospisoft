import { useState,useEffect } from "react"
import { API_URL } from "../../../API_URL"
import Swal from "sweetalert2"
import { Modal,ListGroup, Button} from "react-bootstrap"
/**
 * 
 * @param modalInfo Bool que determina si se muestra o no la modal
 * @param setModalInfo Metodo de 'WorkersTable' que cambia el valor de 'modalInfo'
 * @param idInfo String que representa el id del usuario
 * @param setIdInfo Metodo de 'WorkersTable' que cambia el valor de 'idInfo', lo uso para cambiar el id a vacío para
 * que el useEffect detecte un cambio y pueda mostrar multiples veces la misma modal
 * @returns 
 */
export const ShowWorkersModal = ({modalInfo,setModalInfo,idInfo,setIdInfo})=>{

    const [worker,setWorker] = useState({})

    const getWorkerById = async() =>{
        Swal.fire({
            title:"Cargando empleado...",
            didOpen:()=>{
                Swal.showLoading()
            }
        })
    
        const workerById = await fetch(API_URL + '/workers/byid/'+idInfo,{credentials: 'include'}).then(res => res.json())
        if (workerById && workerById.status === "completed") {
            setWorker(workerById.data)
            setModalInfo(true)
            Swal.close()
            return
        }
    }

    const handleHide = ()=>{
        setModalInfo(false)
        setIdInfo("")
    }

    useEffect(()=>{
        if (idInfo && idInfo.length === 24) {
            getWorkerById()
        }
    },[idInfo])

    return (
        <Modal centered className="fade" show={modalInfo} onHide={handleHide}>
                <Modal.Header className="d-flex justify-content-between">
                    <Modal.Title>
                        Detalles del empleado
                    </Modal.Title>
                    
                    <i role="button" className="text-danger fs-4 bi bi-x-circle"
                    onClick={handleHide}></i>
                </Modal.Header>

                <Modal.Body>
                    <ListGroup>
                        <ListGroup.Item>
                            <strong>Nombre: </strong>{worker.worker_name}
                        </ListGroup.Item>

                        <ListGroup.Item>
                            <strong>Apellido: </strong>{worker.worker_last_name}
                        </ListGroup.Item>

                        <ListGroup.Item>
                            <strong>Fecha de nacimiento: </strong>
                            {Object.keys(worker).length !== 0 ? worker.worker_birthdate.split("T")[0] : ""}
                        </ListGroup.Item>

                        <ListGroup.Item>
                            <strong>Correo electrónico: </strong>{worker.worker_email}
                        </ListGroup.Item>

                        <ListGroup.Item>
                            <strong>Número telefónico: </strong>{worker.worker_phone_number}
                        </ListGroup.Item>

                        <ListGroup.Item>
                            <strong>Especialidad: </strong>{worker.worker_speciality}
                        </ListGroup.Item>
                        
                        <ListGroup.Item>
                            <strong>Rol: </strong>{worker.worker_role}
                        </ListGroup.Item>

                    </ListGroup>
                </Modal.Body>

                <Modal.Footer>
                    <Button variant="primary" type="button" onClick={handleHide}>Aceptar</Button>
                </Modal.Footer>
        </Modal>
    )
}
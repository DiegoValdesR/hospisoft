import { useState,useEffect } from "react"
import { API_URL } from "../../../API_URL"
import Swal from "sweetalert2"
import { Modal,ListGroup, Button, Col} from "react-bootstrap"
/**
 * 
 * @param modalInfo Bool que determina si se muestra o no la modal
 * @param setModalInfo Metodo de 'UsersTable' que cambia el valor de 'modalInfo'
 * @param idInfo String que representa el id del usuario
 * @param setIdInfo Metodo de 'UsersTable' que cambia el valor de 'idInfo', lo uso para cambiar el id a vacío para
 * que el useEffect detecte un cambio y pueda mostrar multiples veces la misma modal
 * @returns 
 */
export const ShowUserModal = ({modalInfo,setModalInfo,idInfo,setIdInfo})=>{

    const [user,setUser] = useState({})

    const GetUserById = async() =>{
        Swal.fire({
            title:"Cargando usuario...",
            didOpen:()=>{
                Swal.showLoading()
            }
        })
    
        const user = await fetch(API_URL + '/users/byid/'+idInfo,{credentials: 'include'}).then(res => res.json())
        if (user && user.status === "completed") {
            setUser(user.data)
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
            GetUserById()
        }
    },[idInfo])

    return (
        <Modal centered className="fade" show={modalInfo} onHide={handleHide}>
                <Modal.Header className="d-flex justify-content-between">
                    <Modal.Title>
                        Detalles del usuario
                    </Modal.Title>
                    
                    <i role="button" className="text-danger fs-4 bi bi-x-circle"
                    onClick={handleHide}></i>
                </Modal.Header>

                <Modal.Body>
                    <ListGroup>
                        <ListGroup.Item>
                            <strong>Nombre: </strong>{user.user_name}
                        </ListGroup.Item>
                        <ListGroup.Item>
                            <strong>Apellido: </strong>{user.user_last_name}
                        </ListGroup.Item>
                        <ListGroup.Item>
                            <strong>Correo electrónico: </strong>{user.user_email}
                        </ListGroup.Item>
                        <ListGroup.Item>
                            <strong>Número telefónico: </strong>{user.user_phone_number}
                        </ListGroup.Item>
                        <ListGroup.Item>
                            <strong>Fecha de nacimiento: </strong>
                            {Object.keys(user).length !== 0 ? user.user_birthdate.split("T")[0] : ""}
                        </ListGroup.Item>
                        <ListGroup.Item>
                            <strong>EPS: </strong>{user.user_eps}
                        </ListGroup.Item>
                    </ListGroup>
                </Modal.Body>

                <Modal.Footer>
                    <Button variant="primary" type="button" onClick={handleHide}>Aceptar</Button>
                </Modal.Footer>
        </Modal>
    )
}
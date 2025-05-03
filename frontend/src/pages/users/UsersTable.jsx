import { useState,useEffect } from "react"
import { API_URL } from "../../API_URL.js"
import { ShowUserModal } from "./modals/ShowUserModal.jsx"
import { ManageUsersModal } from "./modals/ManageUsersModal.jsx"
import Swal from 'sweetalert2'
import { Button, Card, Row, Table } from "react-bootstrap"

export const UsersTable = ()=>{
    const session = JSON.parse(sessionStorage.getItem("session"))

    const [users,setUsers] = useState([])
    const [userId,setUserId] = useState("")
    const [idInfo,setIdInfo] = useState("")
    //para mostrar la modal de insertar/actualizar usuario
    const [modalData,setModalData] = useState(false)
    //modal para mostrar toda la informacion del usuario
    const [modalInfo,setModalInfo] = useState(false)
    
    const getAllUsers = async()=>{
        Swal.fire({
            title:"Cargando...",
            didOpen:()=>{
                Swal.showLoading()
            }
        })

        const allUsers = await fetch(API_URL + '/users/all', {credentials: 'include'}).then(res => res.json());
        if (allUsers && allUsers.status === "completed") {
            setUsers(allUsers.data)
            Swal.close()
            return
        }
    }

    const deactivateUser = async(userId)=>{
        Swal.fire({
            title:"¿Está seguro de desactivar este usuario?",
            showCancelButton:true,
            showConfirmButton:true,
            confirmButtonColor:"#dc3545",
            confirmButtonText:"Aceptar"
        }).then(async result =>{
            if (result.isConfirmed) {
                Swal.fire({
                    title:"Procesando...",
                    didOpen:()=>{
                        Swal.showLoading()
                    }
                })

                const deleteUser = await fetch(API_URL + '/users/delete/'+userId,{
                    method:"PATCH",
                    credentials: 'include'
                })
                const responseJSON = await deleteUser.json()
                
                Swal.close()
                if (responseJSON) {
                    if (responseJSON.status === "completed") {
                        await getAllUsers()
                    }

                    Swal.fire({
                        title:"Completado",
                        text:responseJSON.message
                    })
                }

            }
        })
    }

    useEffect(()=>{
        getAllUsers()
    },[])
    
    return (
        <>
            <ShowUserModal
            modalInfo={modalInfo}
            setModalInfo={setModalInfo}
            idInfo={idInfo}
            setIdInfo={setIdInfo}
            >
            </ShowUserModal>

            <ManageUsersModal
            modalData={modalData}
            setModalData={setModalData}
            userId={userId}
            setUserId={setUserId}
            setUsers={setUsers}
            >
            </ManageUsersModal>

            <Card>
                <Card.Title className="d-flex">
                    <Row className="ms-4">
                        {session && ["admin"].includes(session.role) && (
                        <Button variant="primary" type="button"
                        onClick={()=>{setModalData(true)}}>
                            <i className="bi bi-plus-lg"></i>
                            <span className="p-1 text-white">
                                Nuevo
                            </span>
                        </Button>
                        )}
                    </Row>
                </Card.Title>

                <Card.Body>
                    {users.length > 0 ? (
                    <Row className="table-responsive text-center">
                        <Table hover>
                            <thead>
                                <tr>
                                    <th>NOMBRE</th>
                                    <th>APELLIDO</th>
                                    <th>ACCIONES</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.map(user =>{
                                return (
                                <tr key={user._id}>
                                    <td>{user.user_name}</td>
                                    <td>{user.user_last_name}</td>
                                    <td>
                                    {/* VER DETALLES USUARIO */}
                                    <span className="p-1">
                                        <button className="btn btn-secondary" title="Ver más detalles"
                                        onClick={()=>{
                                            setIdInfo(user["_id"])
                                        }}>
                                             <i className="bi bi-eye"></i>
                                        </button>
                                    </span>
                                    
                                    {session && ["admin"].includes(session.role) && (
                                        <>
                                        <span className="p-1">
                                            <button className="btn btn-primary" title="Editar usuario"
                                            onClick={()=>{
                                                setUserId(user["_id"])
                                            }}>
                                                <i className="bi bi-pencil-square"></i>
                                            </button>
                                        </span>
                                                    
                                        <span className="p-1">
                                            <button className="btn btn-danger" title="Eliminar usuario"
                                            onClick={()=>{deactivateUser(user["_id"])}}>
                                                <i className="bi bi-trash3"></i>
                                            </button>
                                        </span>
                                        </>
                                    )}
                                    
                                    </td>
                                </tr>
                                    )
                                })}
                            </tbody>
                        </Table>
                    </Row>
                    ) : (
                        <p className="text-center text-dark">No hay usuarios...</p>
                    )}
                </Card.Body>
            </Card> 
        </>
    )

}
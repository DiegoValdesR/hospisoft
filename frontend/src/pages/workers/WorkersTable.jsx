import { useState,useEffect } from "react"
import { API_URL } from "../../API_URL.js"
import { ShowWorkersModal } from "./modals/ShowWorkersModal.jsx"
import { ManageWorkersModal } from "./modals/ManageWorkersModal.jsx"
import { Button, Card, Row, Table } from "react-bootstrap"
import Swal from "sweetalert2"

export const WorkersTable = ({session})=>{
    const [workers,setWorkers] = useState([])
    const [workerId,setWorkerId] = useState("")
    const [idInfo,setIdInfo] = useState("")
    //para mostrar la modal de insertar/actualizar
    const [modalData,setModalData] = useState(false)
    //modal para mostrar toda la informacion del registro
    const [modalInfo,setModalInfo] = useState(false)
    
    const getAllWorkers = async()=>{
        Swal.fire({
            title:"Cargando...",
            allowEscapeKey:false,
            allowOutsideClick:false,
            didOpen:()=>{
                Swal.showLoading()
            }
        })
        const allWorkers = await fetch(API_URL + '/workers/all',{credentials: 'include'})
        if (!allWorkers.ok) {
            Swal.close()
            Swal.fire({
                title:"Error",
                icon:"error",
                text:"Ocurrió un error, por favor, intentelo más tarde",
                allowEscapeKey:false,
                allowOutsideClick:false,
            }).then((res)=>{
                if (res.isConfirmed) {
                    window.location.href = "/home"
                }
            })
            return
        }
        const allWorkersJSON = await allWorkers.json()
        setWorkers(allWorkersJSON.data)
        Swal.close()
    }

    const deactivateWorker = async(workerId)=>{
        Swal.fire({
            title:"¿Está seguro de desactivar este empleado?",
            showCancelButton:true,
            showConfirmButton:true,
            confirmButtonColor:"#dc3545",
            confirmButtonText:"Aceptar"
        }).then(async result =>{
            if (result.isConfirmed) {
                Swal.fire({
                    title:"Procesando...",
                    allowEscapeKey:false,
                    allowOutsideClick:false,
                    didOpen:()=>{
                        Swal.showLoading()
                    }
                })
                const deactivateWorker = await fetch(API_URL + '/workers/delete/'+workerId,{
                    method:"PATCH",
                    credentials: 'include'
                })

                if (!deactivateWorker.ok) {
                    Swal.close()
                    Swal.fire({
                        title:"Error",
                        icon:"error",
                        text:"Ocurrió un error, por favor, intentelo más tarde",
                        allowEscapeKey:false,
                        allowOutsideClick:false,
                    }).then((res)=>{
                        if (res.isConfirmed) {
                            window.location.href = "/home"
                        }
                    })
                    return
                }

                const responseJSON = await deactivateWorker.json()
                Swal.close()

                await getAllWorkers()
                Swal.fire({
                    title:"Completado",
                    text:responseJSON.message
                })
            }
        })
    }

    useEffect(()=>{
        getAllWorkers()
    },[])
    
    return (
        <>
            {session && ["admin"].includes(session.role) ? (
                <>
                    <ShowWorkersModal
                    modalInfo={modalInfo}
                    setModalInfo={setModalInfo}
                    idInfo={idInfo}
                    setIdInfo={setIdInfo}
                    >
                    </ShowWorkersModal>

                    <ManageWorkersModal
                    modalData={modalData}
                    setModalData={setModalData}
                    workerId={workerId}
                    setWorkerId={setWorkerId}
                    setWorkers={setWorkers}
                    getAllWorkers={getAllWorkers}>
                    </ManageWorkersModal>
                </>
                
            ) : ""}
            
            <Card>
                {session && ["admin"].includes(session.role) ? (
                <Card.Header>
                    <Card.Title className="d-flex">
                        <Row className="ms-4">
                            <Button variant="primary" type="button"
                            onClick={()=>{setModalData(true)}}>
                                <i className="bi bi-plus-lg"></i>
                                <span className="p-1 text-white">
                                    Nuevo
                                </span>
                            </Button>
                        </Row>
                    </Card.Title>
                </Card.Header>
                ) : ""}
                
                <Card.Body className="mt-2">
                    {workers.length > 0 ? (
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
                                {workers.map(worker =>{
                                return (
                                <tr key={worker._id}>
                                    <td>{worker.worker_name}</td>
                                    <td>{worker.worker_last_name}</td>
                                    <td>
                                    {/* VER DETALLES EMPLEADO */}
                                    <span className="p-1">
                                        <button className="btn btn-secondary" title="Ver más detalles"
                                        onClick={()=>{
                                            setIdInfo(worker["_id"])
                                        }}>
                                             <i className="bi bi-eye"></i>
                                        </button>
                                    </span>
                                    
                                    {session && ["admin"].includes(session.role) ? (
                                        <>
                                        {/* EDITAR EMPLEADO */}
                                        <span className="p-1">
                                            <button className="btn btn-primary" title="Editar empleado"
                                            onClick={()=>{
                                                setWorkerId(worker["_id"])
                                            }}>
                                                <i className="bi bi-pencil-square"></i>
                                            </button>
                                        </span>
                                                        
                                        {/* DESACTIVAR EMPLEADO */}
                                        <span className="p-1">
                                            <button className="btn btn-danger" title="Eliminar empleado"
                                            onClick={()=>{deactivateWorker(worker["_id"])}}>
                                                <i className="bi bi-trash3"></i>
                                            </button>
                                        </span>
                                        </>
                                    ) : ""}
                                    
                                    </td>
                                </tr>
                                    )
                                })}
                            </tbody>
                        </Table>
                    </Row>
                    ) : (
                        <p className="mt-3 text-center text-dark">No hay empleados...</p>
                    )}
                </Card.Body>
            </Card> 
        </>
    )

}
import { useState,useEffect } from "react"
import { API_URL } from "../../API_URL.js"
import { ShowWorkersModal } from "./modals/ShowWorkersModal.jsx"
import { ManageWorkersModal } from "./modals/ManageWorkersModal.jsx"
import Swal from 'sweetalert2'
import { Button, Card, Row, Table } from "react-bootstrap"

export const WorkersTable = ()=>{
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
            didOpen:()=>{
                Swal.showLoading()
            }
        })

        const allWorkers = await fetch(API_URL + '/workers/all').then(res => res.json())
        if (allWorkers && allWorkers.status === "completed") {
            setWorkers(allWorkers.data)
            Swal.close()
            return
        }
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
                     didOpen:()=>{
                        Swal.showLoading()
                    }
                })
                const deactivateWorker = await fetch(API_URL + '/workers/delete/'+workerId,{
                    method:"PATCH"
                })
                const responseJSON = await deactivateWorker.json()
                Swal.close()
                
                if (responseJSON) {
                    if (responseJSON.status === "completed") {
                        await getAllWorkers()
                    }

                    Swal.fire({
                        title:responseJSON.status === "completed" ? "Completado" : "Error",
                        text:responseJSON.message
                    })
                    
                }
                
            }
        })
    }

    useEffect(()=>{
        getAllWorkers()
    },[])
    
    return (
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
            >
            </ManageWorkersModal>

            <Card>
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

                <Card.Body>
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
                                    </td>
                                </tr>
                                    )
                                })}
                            </tbody>
                        </Table>
                    </Row>
                    ) : (
                        <p className="text-center text-dark">No hay empleados...</p>
                    )}
                </Card.Body>
            </Card> 
        </>
    )

}
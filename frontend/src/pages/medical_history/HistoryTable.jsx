import { Table ,Button, Card, Row } from "react-bootstrap"
import { useState, useEffect} from 'react'
import { getAllHistories } from "../../services/medical_history/history.js"
import Swal from 'sweetalert2'

export const HistoryTable = ()=>{
    const session = JSON.parse(sessionStorage.getItem("session"))
    const [history,setHistory] = useState([])

    const getHistory = async()=>{
        Swal.fire({
            title:"Cargando",
            allowEscapeKey:false,
            allowOutsideClick:false,
            didOpen:()=>{
                Swal.showLoading()
            }
        })

        const request = await getAllHistories()
        
        if (!request.status) {
            Swal.close()
            Swal.fire({
                title:"Error",
                icon:"error",
                text:request.message,
                allowEscapeKey:false,
                allowOutsideClick:false,
            }).then((res)=>{
                if (res.isConfirmed) {
                    window.location.href = "/home"
                }
            })
            return
        }
        
        setHistory(request.data)
        Swal.close()
    }

    useEffect(()=>{
        getHistory()
    },[])

    return (
        <>
        <Card>
            {session && ["admin","medico"].includes(session.role) ? (
                <Card.Header>
                    <Card.Title className="d-flex">
                        <Row className="ms-4">
                            <Button variant="primary" type="button"
                            >
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
                {history.length > 0 ? (
                <Row className="table-responsive text-center">
                        <Table hover>
                            <thead>
                                <tr>
                                    <th>PACIENTE</th>
                                    <th>MÉDICO ENCARGADO</th>
                                    {session && ["admin","medico"].includes(session.role) ? (
                                    <th>ACCIONES</th>
                                    ) : ""}
                                </tr>
                            </thead>
                            <tbody>
                            {history.map(element =>{
                                return (
                                <tr key={element["_id"]}>
                                    <td>{element.patient}</td>
                                    <td>{element.doctor}</td>
                                    <td>
                                    {session && ["admin","medico"].includes(session.role) ? (
                                        <>
                                        {/* VER DETALLES*/}
                                        <span className="p-1">
                                            <button className="btn btn-secondary" title="Ver más detalles"
                                            onClick={()=>{
                                                setIdInfo(element["_id"])
                                            }}>
                                                <i className="bi bi-eye"></i>
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
                    <p className="mt-3 text-center text-black h5">No hay historiales médicos...</p>
                )}
            </Card.Body>
        </Card>
        
        </>
    )
}
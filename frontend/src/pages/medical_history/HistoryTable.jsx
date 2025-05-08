import { Table ,Button, Card, Row, Form } from "react-bootstrap"
import { useState, useEffect} from 'react'
import { getAllHistories,getHistoriesByPatient } from "../../services/medical_history/history.js"
import { getAllUsers } from "../../services/users/users.js"
import Swal from 'sweetalert2'
import { NewHistoryModal } from "./modal/NewHistoryModal.jsx"
import { ShowHistoryModal } from "./modal/ShowHistoryModal.jsx"
import moment from "moment-timezone"
import '../../assets/css/scheduler/scheduler.css'

export const HistoryTable = ()=>{
    const session = JSON.parse(sessionStorage.getItem("session"))
    const [history,setHistory] = useState([])
    const [patients,setPatients] = useState([])
    const [patientId,setPatientId] = useState("")
    const [historyId, setHistoryId] = useState("")
    const [showInsert,setShowInsert] = useState(false)

    const getHistories = async()=>{
        Swal.fire({
            title:"Cargando",
            allowEscapeKey:false,
            allowOutsideClick:false,
            didOpen:()=>{
                Swal.showLoading()
            }
        })

        if (patientId.length !== 24 && session && (session.role && ["usuario"].includes(session.role))) {
            setPatientId(session["id"])
        }

        let request
        if (patientId.length === 24 || (session && session.role && !["admin"].includes(session.role))) {
            request = await getHistoriesByPatient(patientId)
        }else{
            request = await getAllHistories()
        }

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

    const getPatients = async()=>{
        const request = await getAllUsers()
        if (request.status) {
            setPatients(request.data)
            return
        }
        console.error(request.message)
    }

    const getHistoryId = (id)=>{
        setHistoryId(id)
    }

    const handleChange = async({target})=>{
        setPatientId(target.value)
    }

    useEffect(()=>{
        if (patients.length < 1) {
            getPatients()
        }

        getHistories()
    },[patientId])

    return (
        <>

        {session && ["admin","medico","usuario"].includes(session.role) ? (
            <>
                <NewHistoryModal
                showInsert={showInsert}
                setShowInsert={setShowInsert}
                getHistories={getHistories}></NewHistoryModal>

                <ShowHistoryModal
                historyId={historyId}
                setHistoryId={setHistoryId}></ShowHistoryModal>
            </>

        ) : ""}

        <Card>
            {session && ["admin","medico","usuario"].includes(session.role) ? (
                <Card.Header>
                    <Card.Title>
                        <div className='d-flex flex-row justify-content-between sche-header'>
                            {["admin","medico"].includes(session.role) ? (
                                <div className='d-flex flex-row align-items-center'>
                                    <span className='text-black text-break'>Seleccionar paciente</span>

                                    <Form.Select className='ms-3 border-dark-subtle select'
                                    defaultValue={""} onChange={handleChange}>
                                        <option value=""></option>
                                        {patients.map((patient)=>{
                                            return (
                                                <option key={patient["_id"]} value={patient["_id"]}>
                                                    {patient.user_name} {patient.user_last_name}
                                                </option>
                                            )
                                        })}
                                    </Form.Select>
                                </div>
                            ) : ""}
                            
                            <div className="d-flex flex-row align-items-center">
                                <span className='text-black text-break'>Buscar por fechas:</span>

                                <Form.Select className='ms-3 border-dark-subtle select'
                                defaultValue={""} onChange={handleChange}>
                                    <option value=""></option>
                                    {history.map((element)=>{
                                        return (
                                            <option key={element["date"]} value={element["date"]}>
                                                {moment(element["date"]).format("DD/MM/YYYY")}
                                            </option>
                                        )
                                    })}
                                </Form.Select>
                            </div>
                            <div className='btn-new'>
                                    <Button variant='primary'
                                    onClick={()=>{setShowModal(true)}}>
                                        <i className="bi bi-plus-lg"></i>
                                        <span className="p-1 text-white">
                                            Nuevo
                                        </span>
                                    </Button>
                            </div>
                        </div>
                    </Card.Title>
                </Card.Header>
            ) : ""}

            <Card.Body className="mt-3">
                {history.length > 0 ? (
                <Row className="table-responsive text-center">
                        <Table hover>
                            <thead>
                                <tr>
                                    <th>PACIENTE</th>
                                    <th>MÉDICO ENCARGADO</th>
                                    {session && ["admin","medico","usuario"].includes(session.role) ? (
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
                                    {session && ["admin","medico","usuario"].includes(session.role) ? (
                                        <>
                                        {/* VER DETALLES*/}
                                        <span className="p-1">
                                            <button className="btn btn-secondary" title="Ver más detalles"
                                            onClick={()=>{
                                                getHistoryId(element["_id"])
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
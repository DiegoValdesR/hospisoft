import { Modal,ListGroup, Button } from "react-bootstrap"
import { useState,useEffect } from "react"
import { UpdateSchedule } from "./UpdateSchedule"
import moment from "moment-timezone"
import Swal from "sweetalert2"

export const ShowSchedule = ({API_URL,scheduleData = {},setScheduleData, workers = [], getEvents})=>{
    const [show,setShow] = useState(false)
    const [showUpdate,setShowUpdate] = useState(false)
    const [worker,setWorker] = useState("")
    const session = JSON.parse(sessionStorage.getItem("session"))

    const workerById = async()=>{
        const getWorker = await fetch(API_URL + `/workers/byid/${scheduleData.worker_id}`,{credentials: 'include'})
        if (!getWorker.ok) {
            console.error(getWorker.statusText)
        }
        const workerJSON = await getWorker.json()
        if (workerJSON.status === "completed") {
            const workerName = `${workerJSON.data.worker_name} ${workerJSON.data.worker_last_name}`
            setWorker(workerName)
        }
    }

    const deactivateSchedule = (schedule_id)=>{
        Swal.fire({
            title:"¿Está seguro de eliminar este horario?",
            icon:"question",
            showCancelButton:true,
            cancelButtonText:"Cancelar",
            confirmButtonText:"Aceptar",
            confirmButtonColor:"#dc3545"
        }).then(async(response)=>{
            if (response.isConfirmed === true) {
                Swal.fire({
                    title:"Procesando...",
                    didOpen:()=>{
                        Swal.showLoading()
                    }
                })

                const deactivate = await fetch(API_URL + `/schedules/deactivate/${schedule_id}`,{
                    method:"PATCH",
                    credentials: 'include'
                })

                if (!deactivate.ok) {
                    console.error(deactivate.statusText)
                    Swal.close()
                    Swal.fire({
                        title:"Error",
                        icon:"error",
                        text:"Ocurrió un error al momento de borrar el horario."
                    })
                    return
                }

                const deactivateJSON = await deactivate.json()
                Swal.close()
                if (deactivateJSON.status === "completed") {
                    setShow(false)
                    await getEvents()
                }

                Swal.fire({
                    title:deactivateJSON.status === "completed" ? "Completado" : "Error",
                    icon:deactivateJSON.status === "completed" ? "success" : "error",
                    text:deactivateJSON.message
                })

            }
        })
    }
    
    const handleShow = ()=>{
        setShow(true)
    }

    const handleHide = ()=>{
        setShow(false)
        setScheduleData({})
    }

    const handleModalUpdate = ()=>{
        setShow(false)
        setShowUpdate(true)
    }

    useEffect(()=>{
        if (Object.keys(scheduleData).length > 0) {
            handleShow()
            workerById()
        }
    },[scheduleData])

    return (
        <>
            {session && ["admin"].includes(session.role) ? (
                <UpdateSchedule
                API_URL={API_URL}
                scheduleData={scheduleData}
                setScheduleData={setScheduleData}
                workers={workers}
                getEvents={getEvents}
                showUpdate={showUpdate}
                setShowUpdate={setShowUpdate}></UpdateSchedule>
            ) : ""}
            
            <Modal centered className="fade" show={show} onHide={handleHide}>
                <Modal.Header className="d-flex flex-row justify-content-between">
                    <Modal.Title>Detalles del horario</Modal.Title>
                    <i role="button" className="text-danger fs-4 bi bi-x-circle"
                    onClick={handleHide}></i>
                </Modal.Header>
                <Modal.Body>
                    <ListGroup>
                        <ListGroup.Item>
                            <strong>Titulo:</strong> {scheduleData.title}
                        </ListGroup.Item>
                        <ListGroup.Item>
                            <strong>Trabajador:</strong> {worker}
                        </ListGroup.Item>
                        <ListGroup.Item>
                            <strong>Fecha de inicio: </strong> 
                            {
                            moment(scheduleData.schedule_start_date).format("DD MMMM YYYY")
                            }
                        </ListGroup.Item>
                        <ListGroup.Item>
                            <strong>Fecha de finalización: </strong> 
                            {moment(scheduleData.schedule_final_date).format("DD MMMM YYYY")}
                        </ListGroup.Item>
                        <ListGroup.Item>
                            <strong>Hora de inicio: </strong> 
                            {
                            moment(`${scheduleData.schedule_start_date}T${scheduleData.hour_start}`).format('hh:mm a')
                            }
                        </ListGroup.Item>
                        <ListGroup.Item>
                            <strong>Hora de finalización: </strong>
                            {
                            moment(`${scheduleData.schedule_final_date}T${scheduleData.hour_end}`).format('hh:mm a')
                            }
                        </ListGroup.Item>
                        <ListGroup.Item>
                            <strong>Área:</strong> {scheduleData.schedule_area}
                        </ListGroup.Item>
                    </ListGroup>
                </Modal.Body>

                <Modal.Footer className={`d-flex ${session && session && ["admin"].includes(session.role) ? 'justify-content-between' : 'justify-content-end'}`}>
                    {session && ["admin"].includes(session.role) ? (
                        <>
                        <section>
                            <Button variant="primary me-3" title="Actualizar"
                            onClick={handleModalUpdate}>
                                <i className="bi bi-pencil-square"></i>
                            </Button>
                            <Button variant="danger me-3" title="Eliminar"
                            onClick={()=>{deactivateSchedule(scheduleData._id)}}>
                                <i className="bi bi-trash3"></i>
                            </Button>
                        </section>
                        </>
                    ) : ""}

                    <section>
                        <Button variant="success" onClick={handleHide}>Aceptar</Button>
                    </section>
                </Modal.Footer>
            </Modal>
        </>
        
    )
}
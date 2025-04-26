import { Modal,ListGroup, Button } from "react-bootstrap"
import { useState,useEffect } from "react"
import { UpdateSchedule } from "./UpdateSchedule"
import moment from "moment-timezone"
import Swal from "sweetalert2"

export const ShowSchedule = ({API_URL,scheduleData = {},setScheduleData, workers = [], getEvents})=>{
    const [show,setShow] = useState(false)
    const [showUpdate,setShowUpdate] = useState(false)
    const [worker,setWorker] = useState("")

    const workerById = async()=>{
        const getWorker = await fetch(API_URL + `/workers/byid/${scheduleData.worker_id}`)
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
            confirmButtonText:"Aceptar"
        }).then(async(response)=>{
            if (response.isConfirmed === true) {
                const deactivate = await fetch(API_URL + `/schedules/deactivate/${schedule_id}`,{
                    method:"PATCH"
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
            <UpdateSchedule
            API_URL={API_URL}
            scheduleData={scheduleData}
            setScheduleData={setScheduleData}
            workers={workers}
            getEvents={getEvents}
            showUpdate={showUpdate}
            setShowUpdate={setShowUpdate}></UpdateSchedule>

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
                            <strong>Fecha de inicio:</strong> {scheduleData.schedule_start_date}
                        </ListGroup.Item>
                        <ListGroup.Item>
                            <strong>Fecha de finalización:</strong> {scheduleData.schedule_final_date}
                        </ListGroup.Item>
                        <ListGroup.Item>
                            <strong>Hora de inicio:</strong> {scheduleData.hour_start}
                        </ListGroup.Item>
                        <ListGroup.Item>
                            <strong>Hora de finalización:</strong> {scheduleData.hour_end}
                        </ListGroup.Item>
                        <ListGroup.Item>
                            <strong>Área:</strong> {scheduleData.schedule_area}
                        </ListGroup.Item>
                    </ListGroup>
                </Modal.Body>

                <Modal.Footer className="d-flex justify-content-between">
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

                    <section>
                        <Button variant="success" onClick={handleHide}>Aceptar</Button>
                    </section>
                </Modal.Footer>
            </Modal>
        </>
        
    )
}
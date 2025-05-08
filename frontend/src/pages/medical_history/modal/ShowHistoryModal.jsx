import { useState,useEffect } from "react"
import { Modal,ListGroup,Button } from "react-bootstrap"
import { getHistoryById } from "../../../services/medical_history/history.js"
import Swal from "sweetalert2"
import moment from "moment-timezone"

export const ShowHistoryModal = ({historyId = "",setHistoryId})=>{
    const [history,setHistory] = useState({})
    const [showInfo,setShowInfo] = useState(false)

    const getHistory = async()=>{
        Swal.fire({
            title:"Cargando...",
            allowEscapeKey:false,
            allowOutsideClick:false,
            didOpen:()=>{
                Swal.showLoading()
            }
        })

        const request = await getHistoryById(historyId)
        if (!request.status) {
            Swal.close()
            Swal.fire({
                title:"Error",
                icon:"error",
                text:request.message
            })
            return
        }

        Swal.close()
        setHistory(request.data)
        setShowInfo(true)
    }

    const handleHide = ()=>{
        setHistoryId("")
        setShowInfo(false)
    }

    useEffect(()=>{
        if (historyId.length === 24) {
            getHistory()
        }
        
    },[historyId])

    return (
            <>
            {Object.keys(history).length > 0 ? (
                <Modal centered className="fade" show={showInfo} onHide={handleHide}>
                    <Modal.Header className="d-flex justify-content-between">
                        <Modal.Title>
                            Detalles de la historia
                        </Modal.Title>
                        
                        <i role="button" className="text-danger fs-4 bi bi-x-circle"
                        onClick={handleHide}></i>
                    </Modal.Header>

                    <Modal.Body>
                        <ListGroup>
                            <ListGroup.Item>
                                <strong>Nombre del paciente: </strong>{history.patient}
                            </ListGroup.Item>
                            <ListGroup.Item>
                                <strong>Médico encargado: </strong>{history.doctor}
                            </ListGroup.Item>
                            <ListGroup.Item>
                                <strong>Razón: </strong>{history.reason}
                            </ListGroup.Item>
                            <ListGroup.Item>
                                <strong>Diagnóstico: </strong>{history.diagnosis}
                            </ListGroup.Item>
                            <ListGroup.Item>
                                <strong>Tratamiento: </strong>{history.treatment}
                            </ListGroup.Item>
                            <ListGroup.Item>
                                <strong>Fecha de creación: </strong> {moment.utc(history.date).format("DD MMMM YYYY")}
                            </ListGroup.Item>
                            <ListGroup.Item>
                                <strong>Hora de creación: </strong> {moment(history.date).format("hh:mm a")}
                            </ListGroup.Item>
                        </ListGroup>
                    </Modal.Body>

                    <Modal.Footer>
                        <Button variant="primary" type="button" onClick={handleHide}>Aceptar</Button>
                    </Modal.Footer>
                </Modal>
            ) : ""}
            </>
    )
}
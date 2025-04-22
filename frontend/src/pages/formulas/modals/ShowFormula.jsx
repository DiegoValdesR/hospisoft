import { useState,useEffect } from "react"
import { API_URL } from "../../../API_URL.js"
import { Modal,ListGroup, Button, Row } from "react-bootstrap"
import moment from "moment"
import Swal from "sweetalert2"

export const ShowFormula = ({modalInfo,setModalInfo,formulaId = "",setFormulaId})=>{
    const [formula,setFormula] = useState({})

    const getFormulaById = async()=>{
        Swal.fire({
            title:"Cargando fórmula...",
            showConfirmButton:false,
            didOpen:()=>{
                Swal.showLoading()
            }
        })

        const formula = await fetch(API_URL + `/formulas/byid/${formulaId}`)
        const formulaJSON = await formula.json()
        if (formulaJSON && formulaJSON.status === "completed") {
            const paciente = await fetch(API_URL + `/users/byid/${formulaJSON.data.patient_id}`)
            const pacienteJSON = await paciente.json()
            //información del médico encargado
            const medico = await fetch(API_URL + `/workers/byid/${formulaJSON.data.doctor_id}`)
            const medicoJSON = await medico.json()

            const formulaDate = moment(formulaJSON.data.formula_date).format('DD/MM/YYYY')
            const hourDate = moment(formulaJSON.data.formula_date).format('LT')
            //items asociados a la formula
            const itemsArray = []
            for(const object of formulaJSON.data.items){
                const {item_id,item_amount} = object
                const itemById = await fetch(API_URL + `/items/byid/${item_id}`)
                const itemJSON = await itemById.json()

                const itemInfo = {
                    name: itemJSON.data.item_name,
                    amount:item_amount
                }
                itemsArray.push(itemInfo)
            }

            const data = {
                date : formulaDate,
                time : hourDate,
                items:itemsArray,
                patient:`${pacienteJSON.data.user_name} ${pacienteJSON.data.user_last_name}`,
                doctor:`${medicoJSON.data.worker_name} ${medicoJSON.data.worker_last_name}`,
                posology:formulaJSON.data.posology
            }
            
            setFormula(data)
            setModalInfo(true)
        }

        Swal.close()

        if (!formulaJSON || formulaJSON.status === "error") {
            Swal.fire({
                title:"Error",
                icon:"error",
                text:"No se encontró la fórmula"
            })
        }
        
    }

    const handleHide = ()=>{
        setFormulaId("")
        setModalInfo(false)
    }

    useEffect(()=>{
        if (formulaId.length === 24) {
            getFormulaById()
        }
        
    },[formulaId])

    return (
        <Modal className="fade" onHide={handleHide} centered show={modalInfo}>
            <Modal.Header className="d-flex flex-row justify-content-between">
                <Modal.Title>
                   Detalles de la fórmula
                </Modal.Title>
                <i role="button" className="text-danger fs-4 bi bi-x-circle"
                onClick={handleHide}></i>
            </Modal.Header>
            <Modal.Body>
                <ListGroup>
                    <ListGroup.Item>
                        <strong>Fecha de creación: </strong>{formula.date}
                    </ListGroup.Item>

                    <ListGroup.Item>
                        <strong>Hora: </strong>{formula.time}
                    </ListGroup.Item>

                    <ListGroup.Item>
                        <strong>Paciente: </strong>{formula.patient}
                    </ListGroup.Item>

                    <ListGroup.Item>
                        <strong>Medicamentos recetados: </strong>
                        {formula.items !== undefined ? (
                            
                            formula.items.map((item)=>{
                                return (
                                   <div key={item.name}>
                                     <span className="badge text-bg-primary">{item.name} x{item.amount}</span>
                                   </div>
                                )
                            })
                            
                        ) : ''}
                    </ListGroup.Item>

                    <ListGroup.Item>
                        <strong>Médico encargado: </strong>{formula.doctor}
                    </ListGroup.Item>
                    
                    <ListGroup.Item>
                        <strong>Instrucciones: </strong>{formula.posology}
                    </ListGroup.Item>
                </ListGroup>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="primary" type="button"
                onClick={handleHide}>Aceptar</Button>
            </Modal.Footer>
        </Modal>
    )
}
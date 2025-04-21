import { useState,useEffect } from "react"
import { API_URL } from "../../API_URL.js"
import Swal from 'sweetalert2'
import { Button, Card, Row, Table } from "react-bootstrap"
import { ManageFormulaModal } from "./modals/ManageFormulaModal.jsx"
//libreria para manejar fechas, se llama momentjs
import moment from 'moment'

export const FormulasTable = ()=>{
    const [formulas,setFormulas] = useState([])
    const [formulaId,setFormulaId] = useState("")
    //para mostrar la modal de insertar/actualizar
    const [modalData,setModalData] = useState(false)

    const getAllFormulas = async()=>{
        Swal.fire({
            title:"Cargando...",
            didOpen:()=>{
                Swal.isLoading()
            }
        })

        const allFormulas = await fetch(API_URL + '/formulas/all').then(res => res.json())
        if (allFormulas && allFormulas.status === "completed") {

            if (allFormulas.data.length > 0) {
                const arrayFormulas = []
            
                allFormulas.data.map(async(element)=>{
                    //información del paciente
                    const paciente = await fetch(API_URL + `/users/byid/${element.patient_id}`)
                    const pacienteJSON = await paciente.json()
                    //información del médico encargado
                    const medico = await fetch(API_URL + `/workers/byid/${element.doctor_id}`)
                    const medicoJSON = await medico.json()

                    const formulaDate = moment(element.formula_date).format('YYYY/MM/DD')
                    const hourDate = moment(element.formula_date).format('LT')

                    const data = {
                        _id:element._id,
                        date : formulaDate,
                        time : hourDate,
                        patient:`${pacienteJSON.data.user_name} ${pacienteJSON.data.user_last_name}`,
                        doctor:`${medicoJSON.data.worker_name} ${medicoJSON.data.worker_last_name}`,
                    }
    
                    //Añadimos el objeto al array
                    arrayFormulas.push(data)
                    setFormulas(arrayFormulas)
                    
                })
    
                Swal.close()
            }
           
            return
        }
    }

    const deactivateFormula = async(formulaId)=>{
        Swal.fire({
            title:"¿Está seguro de eliminar esta fórmula?",
            showCancelButton:true,
            showConfirmButton:true,
            confirmButtonColor:"#dc3545",
            confirmButtonText:"Aceptar"

        }).then(async result =>{
            if (result.isConfirmed) {
                const deactivateFormula = await fetch(API_URL + '/formulas/delete/'+formulaId,{
                    method:"PATCH"
                })
                const responseJSON = await deactivateFormula.json()

                if (responseJSON) {
                    if (responseJSON.status === "completed") {
                        await getAllFormulas()
                    }

                    Swal.fire({
                        title:responseJSON.status === "completed" ? "Completado" : "Error",
                        text:responseJSON.message
                    })

                    return
                }
            }
        })
    }

    useEffect(()=>{
        getAllFormulas()
    },[])
    
    return (
        <>
            <ManageFormulaModal
            modalData={modalData}
            setModalData={setModalData}
            getAllFormulas={getAllFormulas}>
            </ManageFormulaModal>
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
                    {formulas.length > 0 ? (
                    <Row className="table-responsive text-center">
                        <Table hover>
                            <thead>
                                <tr>
                                    <th>FECHA</th>
                                    <th>HORA</th>
                                    <th>PACIENTE</th>
                                    <th>MÉDICO</th>
                                    <th>ACCIONES</th>
                                </tr>
                            </thead>
                            <tbody>
                                {formulas.map((formula)=>{
                                    return(
                                    <tr key={formula["_id"]}>
                                        <td>{formula.date}</td>
                                        <td>{formula.time}</td>
                                        <td>{formula.patient}</td>
                                        <td>{formula.doctor}</td>
                                        <td>
                                            <span className="p-1">
                                                <Button variant="secondary"
                                                title="Ver detalles de la formula">
                                                    <i className="bi bi-eye"></i>
                                                </Button>
                                            </span>
                                        
                                            <span className="p-1">
                                                <Button variant="danger"
                                                title="Eliminar formula"
                                                onClick={()=>{deactivateFormula(formula["_id"])}}>
                                                    <i className="bi bi-trash"></i>
                                                </Button>
                                            </span>
                                            
                                        </td>
                                    </tr>
                                    )
                                })}
                            </tbody>
                        </Table>
                    </Row>
                    ) : (
                        <p className="text-center text-dark">No hay formulas...</p>
                    )}
                </Card.Body>
            </Card>
        </>
    )

}
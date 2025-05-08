import { useState,useEffect } from "react"
import { API_URL } from "../../API_URL.js"
import Swal from 'sweetalert2'
import { Button, Card, Row, Table } from "react-bootstrap"
import { ManageFormulaModal } from "./modals/ManageFormulaModal.jsx"
import { ShowFormula } from "./modals/ShowFormula.jsx"
//libreria para manejar fechas, se llama momentjs
import moment from 'moment-timezone'

export const FormulasTable = ()=>{

    const session = JSON.parse(sessionStorage.getItem("session"))

    const [formulas,setFormulas] = useState([])
    const [formulaId,setFormulaId] = useState("")
    //para mostrar la modal de insertar/actualizar
    const [modalData,setModalData] = useState(false)
    const [modalInfo,setModalInfo] = useState(false)

    const getAllFormulas = async()=>{
        Swal.fire({
            title:"Cargando...",
            allowEscapeKey:false,
            allowOutsideClick:false,
            didOpen:()=>{
                Swal.showLoading()
            }
        })

        const allFormulas = await fetch(API_URL + '/formulas/all',{credentials: 'include'})
        if (!allFormulas.ok) {
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

        const allFormulasJSON = await allFormulas.json()
        const arrayFormulas = []

        if (allFormulasJSON.data.length > 0) {
            for(const object of allFormulasJSON.data){
                //información del paciente
                const paciente = await fetch(API_URL + `/users/byid/${object.patient_id}`,{credentials: 'include'})
                const pacienteJSON = await paciente.json()
                //información del médico encargado
                const medico = await fetch(API_URL + `/workers/byid/${object.doctor_id}`,{credentials: 'include'})
                const medicoJSON = await medico.json()

                const formulaDate = moment(object.formula_date).format('DD/MM/YYYY')
                
                const hourDate = moment(object.formula_date).format('hh:mm a')

                const data = {
                    _id:object._id,
                    date : formulaDate,
                    time : hourDate,
                    patient:`${pacienteJSON.data.user_name} ${pacienteJSON.data.user_last_name}`,
                    doctor:`${medicoJSON.data.worker_name} ${medicoJSON.data.worker_last_name}`,
                }

                //Añadimos el objeto al array
                arrayFormulas.push(data)
            }
        }

        setFormulas(arrayFormulas)

        Swal.close()
        return
    }

    const deactivateFormula = async(formulaId)=>{
        Swal.fire({
            title:"¿Está seguro de desactivar esta fórmula?",
            showCancelButton:true,
            showConfirmButton:true,
            confirmButtonColor:"#dc3545",
            confirmButtonText:"Aceptar",
        }).then(async result =>{
            if (result.isConfirmed) {
                
                Swal.fire({
                    title:"Procesando...",
                    didOpen:()=>{
                        Swal.showLoading()
                    }
                })

                const deactivateFormula = await fetch(API_URL + '/formulas/delete/'+formulaId,{
                    method:"PATCH",
                    credentials: 'include'
                })

                if (!deactivateFormula.ok) {
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
                const responseJSON = await deactivateFormula.json()
                Swal.close()

                await getAllFormulas()

                Swal.fire({
                    title:"Completado",
                    text:responseJSON.message
                })
            }
        })
    }

    useEffect(()=>{
        getAllFormulas()
    },[])
    
    return (
        <>  
            {session && ["admin","medico"].includes(session.role) ? (
                <>
                    <ManageFormulaModal
                    modalData={modalData}
                    setModalData={setModalData}
                    getAllFormulas={getAllFormulas}>
                    </ManageFormulaModal>

                    <ShowFormula formulaId={formulaId} 
                    setFormulaId={setFormulaId}
                    modalInfo={modalInfo} setModalInfo={setModalInfo}>
                    </ShowFormula>
                </>
            ) : ""}
            
            <Card>
                {session && ["admin","farmaceutico"].includes(session.role) ? (
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
                    {formulas.length > 0 ? (
                    <Row className="table-responsive text-center">
                        <Table hover>
                            <thead>
                                <tr>
                                    <th>FECHA</th>
                                    <th>HORA</th>
                                    <th>PACIENTE</th>
                                    <th>MÉDICO</th>
                                    {session && ["admin","secretaria"].includes(session.role) ? (
                                        <th>ACCIONES</th>
                                    ) : ""}
                                    
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
                                        {session && ["admin","farmaceutico"].includes(session.role) ? (
                                        <td>
                                           <span className="p-1">
                                                <Button variant="secondary"
                                                title="Ver detalles de la formula"
                                                onClick={()=>{setFormulaId(formula["_id"])}}>
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
                                        ) : ""}
                                    </tr>
                                    )
                                })}
                            </tbody>
                        </Table>
                    </Row>
                    ) : (
                        <div>
                            <p className="text-center text-black mt-2 h5">No hay formulas...</p>
                        </div>
                        
                    )}
                </Card.Body>
            </Card>
        </>
    )

}
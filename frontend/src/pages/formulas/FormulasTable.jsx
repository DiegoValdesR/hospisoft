import { useState,useEffect } from "react"
import { API_URL } from "../../API_URL.js"
import Swal from 'sweetalert2'
import { Card } from "react-bootstrap"
import { ManageFormulaModal } from "./modals/ManageFormulaModal.jsx"
import { ShowFormula } from "./modals/ShowFormula.jsx"
//libreria para manejar fechas, se llama momentjs
import moment from 'moment-timezone'
//PRIME REACT THINGS
import { DataTable } from 'primereact/datatable';
import { InputText } from 'primereact/inputtext';
import { FilterMatchMode } from 'primereact/api';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
//END PRIME REACT

export const FormulasTable = ({session})=>{
    //FILTERS PRIME REACT 
    const [searchFilter,setSearchFilter] = useState('')
    const [filters,setFilters] =useState(
        {
            global: { value: null, matchMode: FilterMatchMode.CONTAINS }
        }
    )
    //END FILTERS PRIME REACT 
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
            cancelButtonText:"Cancelar"
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
    
    //PRIME REACT DATATABLE
    const onGlobalFilterChange = (e) => {
        const value = e.target.value;
        let _filters = { ...filters };

        _filters['global'].value = value;

        setFilters(_filters);
        setSearchFilter(value);
    }

    const RowActions = (rowData)=>{
        return (
            <div className="d-flex flex-row">
                <>
                    <div className="p-1">
                        <Button title="Ver detalles de la fórmula" severity="secondary" icon="pi pi-eye"
                        onClick={()=>{setFormulaId(rowData["_id"])}} className="rounded rounded-2 table-btn">
                        </Button>
                    </div>
                                                    
                    <div className="p-1">
                        <Button title="Eliminar fórmula" severity="danger" icon="pi pi-trash"
                        onClick={()=>{deactivateFormula(rowData["_id"])}} className="rounded rounded-2 table-btn">
                        </Button>
                    </div>
                </>
            </div>
        )
    }

    const TableHeader = ()=>{
        return(
            <>
                <div className="d-flex justify-content-between align-items-center text-center table-header">
                    <div>
                        <p>Administrar Formulas</p>
                    </div>

                    <div>
                        <InputText value={searchFilter} type="search" placeholder="Buscar..."
                        onChange={onGlobalFilterChange}></InputText>
                    </div>
                    
                </div>
            </>
        )
    }
    //END PRIME REACT DATATABLE

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
                {session && ["admin","medico"].includes(session.role) && (
                 <Card.Header>
                    <Button severity="info" className="rounded rounded-5" icon="pi pi-plus" onClick={()=>{setModalData(true)}} label="Nuevo" iconPos="left"></Button>
                </Card.Header>
                )}

                <Card.Body>

                    <DataTable value={formulas} stripedRows header={TableHeader} paginator rows={5} filters={filters}
                    className="mt-2 p-4 text-center" emptyMessage="No hay fórmulas registradas...">
                        <Column field="date" header="Fecha" sortable></Column>
                        <Column field="time" header="Hora" sortable></Column>
                        <Column field="patient" header="Nombre paciente" sortable></Column>
                        <Column field="doctor" header="Médico encargado" sortable></Column>

                        {session && ["admin","medico"].includes(session.role) && (
                            <Column body={RowActions} header="Acciones"></Column>
                        )}
                    </DataTable>
                </Card.Body>
            </Card>
        </>
    )

}
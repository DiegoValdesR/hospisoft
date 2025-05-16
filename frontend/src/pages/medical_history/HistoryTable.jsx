import { useState, useEffect} from 'react'
import { getAllHistories} from "../../services/medical_history/history.js"
import { getAllUsers } from "../../services/users/users.js"
//MODALS
import { NewHistoryModal } from "./modal/NewHistoryModal.jsx"
import { ShowHistoryModal } from "./modal/ShowHistoryModal.jsx"
//END MODALS
import moment from "moment-timezone"
import Swal from 'sweetalert2'
import { Table, Card, Row, Form } from "react-bootstrap"
//PRIME REACT THINGS
import { DataTable } from 'primereact/datatable';
import { InputText } from 'primereact/inputtext';
import { FilterMatchMode } from 'primereact/api';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Dropdown } from 'primereact/dropdown';

//END PRIME REACT

export const HistoryTable = ({session})=>{
    //FILTERS PRIME REACT 
    const [searchFilter,setSearchFilter] = useState('')
    const [filters,setFilters] =useState(
        {
            global: { value: null, matchMode: FilterMatchMode.CONTAINS }
        }
    )
    //END FILTERS PRIME REACT 
    const [histories,setHistories] = useState([])
    const [date,setDate] = useState('')
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

        if (session && (["usuario"].includes(session.role))) {
            setPatientId(session["id"])
        }

        let request
        if (patientId.length === 24 || (["usuario"].includes(session.role))) {
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
        
        setHistories(request.data)
        Swal.close()
    }

    const getHistoryId = (id)=>{
        setHistoryId(id)
    }

    const getPatients = async()=>{
        const request = await getAllUsers()
        const arrayPatients = []
        if (request.status) {
            for (const object of request.data) {
                const data = {
                    name: `${object.user_name} ${object.user_last_name}`,
                    id:object["_id"]
                }
                arrayPatients.push(data)
            }
            
            setPatients(arrayPatients)
            return
        }
        console.error(request.message)
    }

    const allHistoryDates = async()=>{
        let request
        if (patientId.length !== 24) {
            request = await getDates()
        }else{
            request = await getDatesByPatient(patientId)
        }
        
        if (request.status) {
            const arrayDates = []

            for (const object of request.data) {
                const data = {
                    date:moment(object["_id"]).format('DD/MM/YYYY')
                }
                arrayDates.push(data)
            }

            setDates(arrayDates)
            return
        }
        console.error(request)
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
                        onClick={()=>{setHistoryId(rowData["_id"])}} className="rounded rounded-2 table-btn">
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
                        <p>Administrar Historiales</p>
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
        if (patients.length < 1) {
            getPatients()
        }
        allHistoryDates()
        getHistories()
    },[patientId])

    return (
        <>
        {session && ["admin","medico","usuario"].includes(session.role) ? (
            <>
                <NewHistoryModal
                showInsert={showInsert}
                setShowInsert={setShowInsert}
                getHistories={getHistories}
                allHistoryDates={allHistoryDates}></NewHistoryModal>

                <ShowHistoryModal
                historyId={historyId}
                setHistoryId={setHistoryId}></ShowHistoryModal>
            </>

        ) : ""}

        <Card>
            
            {session && ["admin","medico"].includes(session.role) && (
                <Card.Header>
                    <Button severity='info' label='Nuevo' className='rounded rounded-5'
                        icon="pi pi-plus" 
                        onClick={()=>{setShowInsert(true)}}>
                    </Button>
                </Card.Header>
            )}

            <Card.Body>
                    <DataTable value={histories} stripedRows header={TableHeader} paginator rows={5} filters={filters}
                    className="mt-2 p-4 text-center" emptyMessage="No hay fórmulas registradas...">
                        <Column field="date" header="Fecha" sortable style={{maxWidth:"250px"}}></Column>
                        <Column field="patient" header="Nombre paciente" sortable></Column>
                        <Column field="doctor" header="Médico encargado" sortable></Column>

                        {session && ["admin","medico","usuario"].includes(session.role) && (
                            <Column body={RowActions} header="Acciones"></Column>
                        )}
                    </DataTable>
            </Card.Body>
        </Card>
        
        </>
    )
}
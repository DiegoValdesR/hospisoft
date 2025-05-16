import { useState,useEffect } from "react"
import { API_URL } from "../../API_URL.js"
import { ShowWorkersModal } from "./modals/ShowWorkersModal.jsx"
import { ManageWorkersModal } from "./modals/ManageWorkersModal.jsx"
import {Card} from "react-bootstrap"
import Swal from "sweetalert2"
//PRIME REACT THINGS
import { DataTable } from 'primereact/datatable';
import { InputText } from 'primereact/inputtext';
import { FilterMatchMode } from 'primereact/api';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
//END PRIME REACT

export const WorkersTable = ({session})=>{
    //FILTERS PRIME REACT 
    const [searchFilter,setSearchFilter] = useState('')
    const [filters,setFilters] =useState(
        {
            global: { value: null, matchMode: FilterMatchMode.CONTAINS }
        }
    )
    //END FILTERS PRIME REACT 
    const [workers,setWorkers] = useState([])
    const [workerId,setWorkerId] = useState("")
    const [idInfo,setIdInfo] = useState("")
    //para mostrar la modal de insertar/actualizar
    const [modalData,setModalData] = useState(false)
    //modal para mostrar toda la informacion del registro
    const [modalInfo,setModalInfo] = useState(false)
    
    const getAllWorkers = async()=>{
        Swal.fire({
            title:"Cargando...",
            allowEscapeKey:false,
            allowOutsideClick:false,
            didOpen:()=>{
                Swal.showLoading()
            }
        })
        const allWorkers = await fetch(API_URL + '/workers/all',{credentials: 'include'})
        if (!allWorkers.ok) {
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
        const allWorkersJSON = await allWorkers.json()
        setWorkers(allWorkersJSON.data)
        Swal.close()
    }

    const deactivateWorker = async(workerId)=>{
        Swal.fire({
            title:"¿Está seguro de desactivar este empleado?",
            showCancelButton:true,
            showConfirmButton:true,
            confirmButtonColor:"#dc3545",
            confirmButtonText:"Aceptar",
            cancelButtonText:"Cancelar"
        }).then(async result =>{
            if (result.isConfirmed) {
                Swal.fire({
                    title:"Procesando...",
                    allowEscapeKey:false,
                    allowOutsideClick:false,
                    didOpen:()=>{
                        Swal.showLoading()
                    }
                })
                const deactivateWorker = await fetch(API_URL + '/workers/delete/'+workerId,{
                    method:"PATCH",
                    credentials: 'include'
                })

                if (!deactivateWorker.ok) {
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

                const responseJSON = await deactivateWorker.json()
                Swal.close()

                await getAllWorkers()
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
                        <Button type="button" icon="pi pi-eye" severity="secondary" title="Ver informacion del empleado"
                        onClick={()=>{setIdInfo(rowData["_id"])}} className="rounded rounded-2 table-btn">
                        </Button>
                    </div>

                    <div className="p-1">
                        <Button title="Editar empleado" severity="info" icon="pi pi-pen-to-square"
                        onClick={()=>{setWorkerId(rowData["_id"])}} className="rounded rounded-2 table-btn">
                        </Button>
                    </div>
                                                    
                    <div className="p-1">
                        <Button title="Eliminar empleado" severity="danger" icon="pi pi-trash"
                        onClick={()=>{deactivateWorker(rowData["_id"])}} className="rounded rounded-2 table-btn">
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
                        <p>Administrar empleados</p>
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
        getAllWorkers()
    },[])
    
    return (
        <>
            {session && ["admin"].includes(session.role) ? (
                <>
                    <ShowWorkersModal
                    modalInfo={modalInfo}
                    setModalInfo={setModalInfo}
                    idInfo={idInfo}
                    setIdInfo={setIdInfo}
                    >
                    </ShowWorkersModal>

                    <ManageWorkersModal
                    modalData={modalData}
                    setModalData={setModalData}
                    workerId={workerId}
                    setWorkerId={setWorkerId}
                    setWorkers={setWorkers}
                    getAllWorkers={getAllWorkers}>
                    </ManageWorkersModal>
                </>
                
            ) : ""}
            
            <Card>
                {session && ["admin"].includes(session.role) ? (
                <Card.Header>
                    <Button severity="info" className="rounded rounded-5" icon="pi pi-plus"                 onClick={()=>{setModalData(true)}} label="Nuevo" iconPos="left"></Button>
                </Card.Header>
                ) : ""}

                <Card.Body>
                    <DataTable value={workers} stripedRows header={TableHeader} paginator rows={5} filters={filters}
                    className="mt-2 p-4 text-center" emptyMessage="No hay empleados registrados...">
                        <Column field="worker_name" header="Nombre" sortable></Column>
                        <Column field="worker_last_name" header="Apellido" sortable></Column>
                        {["admin"].includes(session.role) && (
                            <Column body={RowActions} header="Acciones"></Column>
                        )}
                    </DataTable>
                </Card.Body>
            </Card> 
        </>
    )

}
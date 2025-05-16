import { useState,useEffect } from "react"
import { API_URL } from "../../API_URL.js"
import { ShowUserModal } from "./modals/ShowUserModal.jsx"
import { ManageUsersModal } from "./modals/ManageUsersModal.jsx"
import Swal from 'sweetalert2'
import { Card} from "react-bootstrap"

import { DataTable } from 'primereact/datatable';
import { InputText } from 'primereact/inputtext';
import { FilterMatchMode } from 'primereact/api';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';

export const UsersTable = ({session})=>{
    const [searchFilter,setSearchFilter] = useState('')
    const [users,setUsers] = useState([])
    const [userId,setUserId] = useState("")
    const [idInfo,setIdInfo] = useState("")

    //para mostrar la modal de insertar/actualizar usuario
    const [modalData,setModalData] = useState(false)
    //modal para mostrar toda la informacion del usuario
    const [modalInfo,setModalInfo] = useState(false)
    
    const [filters,setFilters] =useState(
        {
            global: { value: null, matchMode: FilterMatchMode.CONTAINS }
        }
    )

    const getAllUsers = async()=>{
        Swal.fire({
            title:"Cargando...",
            allowEscapeKey:false,
            allowOutsideClick:false,
            didOpen:()=>{
                Swal.showLoading()
            }
        })

        const allUsers = await fetch(API_URL + '/users/all', {credentials: 'include'})
        if (!allUsers.ok) {
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

        const allUsersJSON = await allUsers.json()
        setUsers(allUsersJSON.data)

        Swal.close()
    }

    const deactivateUser = async(userId)=>{
        Swal.fire({
            title:"¿Está seguro de desactivar este usuario?",
            showCancelButton:true,
            showConfirmButton:true,
            confirmButtonColor:"#dc3545",
            confirmButtonText:"Aceptar"
        }).then(async result =>{
            if (result.isConfirmed) {
                Swal.fire({
                    title:"Procesando...",
                    didOpen:()=>{
                        Swal.showLoading()
                    }
                })

                const deleteUser = await fetch(API_URL + '/users/delete/'+userId,{
                    method:"PATCH",
                    credentials: 'include'
                })

                if (!deleteUser.ok) {
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
                }

                const responseJSON = await deleteUser.json()
                Swal.close()

                if (responseJSON.status === "completed") {
                    await getAllUsers()
                }

                Swal.fire({
                    title:"Completado",
                    text:responseJSON.message
                })
            }
        })
    }

    useEffect(()=>{
        getAllUsers()
    },[])

    const onGlobalFilterChange = (e) => {
        const value = e.target.value;
        let _filters = { ...filters };

        _filters['global'].value = value;

        setFilters(_filters);
        setSearchFilter(value);
    }

    const ActionsRow = (rowData)=>{
        return (
            <>
            <span className="p-1">
                <Button type="button" icon="pi pi-eye" severity="secondary" title="Ver informacion del usuario"
                onClick={()=>{setIdInfo(rowData["_id"])}} className="rounded rounded-2 table-btn">
                </Button>
            </span>

            {session && ["admin"].includes(session.role) && (
                <>
                    <span className="p-1">
                        <Button title="Editar usuario" severity="info" icon="pi pi-pen-to-square"
                        onClick={()=>{setUserId(rowData["_id"])}} className="rounded rounded-2 table-btn">
                        </Button>
                    </span>
                                                    
                    <span className="p-1">
                        <Button title="Eliminar usuario" severity="danger" icon="pi pi-trash"
                        onClick={()=>{deactivateUser(rowData["_id"])}} className="rounded rounded-2 table-btn">
                        </Button>
                    </span>
                </>
            )}
            </>
        )
    }

    const TableHeader = ()=>{
        return(
            <>
                <div className="d-flex justify-content-between align-items-center text-center table-header">
                    <div>
                        Administrar usuarios
                    </div>

                    <div>
                        <InputText value={searchFilter} type="search" placeholder="Buscar..."
                        onChange={onGlobalFilterChange}></InputText>
                    </div>
                    
                </div>
            </>
        )
    }

    return (
        <>

            {session && ["admin","secretaria"].includes(session.role) ? (
                <>
                    <ShowUserModal
                    modalInfo={modalInfo}
                    setModalInfo={setModalInfo}
                    idInfo={idInfo}
                    setIdInfo={setIdInfo}
                    >
                    </ShowUserModal>

                    {}
                    <ManageUsersModal
                    modalData={modalData}
                    setModalData={setModalData}
                    userId={userId}
                    setUserId={setUserId}
                    setUsers={setUsers}
                    getAllUsers={getAllUsers}
                    >
                    </ManageUsersModal>
                </>
            ) : ""}
            
            <Card>

                    <div className="card-header">
                        <Button severity="info" className="rounded rounded-5" icon="pi pi-plus"                 onClick={()=>{setModalData(true)}}
                        label="Nuevo" iconPos="left"></Button>
                    </div>
                    <DataTable value={users} stripedRows header={["admin","secretaria"].includes(session.role) && TableHeader} paginator rows={5} filters={filters}
                    className="mt-2 p-4 text-center" emptyMessage="No hay usuarios registrados...">
                        <Column field="user_name" header="Nombre"></Column>
                        <Column field="user_last_name" header="Apellido"></Column>
                        <Column body={ActionsRow} header="Acciones"></Column>
                    </DataTable>
            </Card> 

        </>
    )

}
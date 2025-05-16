import { useState,useEffect } from "react"
import { API_URL } from "../../API_URL.js"
import { ManageItemsModal } from "./modals/ManageItemsModal.jsx"
import Swal from 'sweetalert2'
import { Card } from "react-bootstrap"
//PRIME REACT THINGS
import { DataTable } from 'primereact/datatable';
import { InputText } from 'primereact/inputtext';
import { FilterMatchMode } from 'primereact/api';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
//END PRIME REACT

export const ItemsTable = ({session})=>{
    //FILTERS PRIME REACT 
    const [searchFilter,setSearchFilter] = useState('')
    const [filters,setFilters] =useState(
        {
            global: { value: null, matchMode: FilterMatchMode.CONTAINS }
        }
    )
    //END FILTERS PRIME REACT 

    const [items,setItems] = useState([])
    const [itemId,setItemId] = useState("")
    //para mostrar la modal de insertar/actualizar
    const [modalData,setModalData] = useState(false)

    const getAllItems = async()=>{
        Swal.fire({
            title:"Cargando...",
            allowEscapeKey:false,
            allowOutsideClick:false,
            didOpen:()=>{
                Swal.showLoading()
            }
        })

        const allItems = await fetch(API_URL + '/items/all',{credentials: 'include'})
        if (!allItems.ok) {
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
        const allItemsJSON = await allItems.json()
        setItems(allItemsJSON.data)

        Swal.close()
    }

    const deleteItem = async(itemId)=>{
        Swal.fire({
            title:"¿Está seguro de eliminar este medicamento?",
            text:"Esta acción no se puede deshacer",
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

                const deleteItems = await fetch(API_URL + '/items/delete/'+itemId,{
                    method:"DELETE",
                    credentials: 'include'
                })

                if (!deleteItems.ok) {
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

                const responseJSON = await deleteItems.json()
                Swal.close()
                await getAllItems()

                Swal.fire({
                    title:"Completado",
                    icon:"success",
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
                        <Button title="Editar medicamento" severity="info" icon="pi pi-pen-to-square"
                        onClick={()=>{setItemId(rowData["_id"])}} className="rounded rounded-2 table-btn">
                        </Button>
                    </div>
                                                    
                    <div className="p-1">
                        <Button title="Eliminar medicamento" severity="danger" icon="pi pi-trash"
                        onClick={()=>{deleteItem(rowData["_id"])}} className="rounded rounded-2 table-btn">
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
                        <p>Administrar medicamentos</p>
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
        getAllItems()
    },[])
    
    return (
        <>
            {session && ["admin","farmaceutico"].includes(session.role) ? (
                <ManageItemsModal
                modalData={modalData}
                setModalData={setModalData}
                itemId={itemId}
                setItemId={setItemId}
                getAllItems={getAllItems}
                >
                </ManageItemsModal>
            ) : ""}
            
            <Card>
                {session && ["admin","farmaceutico"].includes(session.role) ? (
                <Card.Header>
                    <Button severity="info" className="rounded rounded-5" icon="pi pi-plus"                 onClick={()=>{setModalData(true)}} label="Nuevo" iconPos="left"></Button>
                </Card.Header>
                ) : ""}

                <Card.Body>
                    <DataTable value={items} stripedRows header={TableHeader} paginator rows={5} filters={filters}
                    className="mt-2 p-4 text-center" emptyMessage="No hay medicamentos disponibles...">
                        <Column field="item_name" header="Nombre" sortable></Column>
                        <Column field="item_description" header="Descripción" sortable></Column>
                        <Column field="item_stock" header="Stock disponible" sortable></Column>
                        <Column field="item_price" header="Precio" sortable></Column>
                        {session && ["admin","farmaceutico"].includes(session.role) && (
                            <Column body={RowActions} header="Acciones"></Column>
                        )}
                    </DataTable>
                </Card.Body>
            </Card> 
        </>
    )

}
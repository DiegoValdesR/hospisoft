import { useState,useEffect } from "react"
import { API_URL } from "../../API_URL.js"
import { ManageItemsModal } from "./modals/ManageItemsModal.jsx"
import Swal from 'sweetalert2'
import { Button, Card, Row, Table } from "react-bootstrap"

export const ItemsTable = ()=>{
    const [items,setItems] = useState([])
    const [itemId,setItemId] = useState("")
    const session = JSON.parse(sessionStorage.getItem("session"))
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
            confirmButtonText:"Aceptar"
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
                    {items.length > 0 ? (
                    <Row className="table-responsive text-center">
                        <Table hover>
                            <thead>
                                <tr>
                                    <th>NOMBRE</th>
                                    <th>DESCRIPCIÓN</th>
                                    <th>STOCK</th>
                                    <th>PRECIO</th>
                                    {session && ["admin","farmaceutico"].includes(session.role) ? (
                                        <th>ACCIONES</th>
                                    ) : ""}
                                    
                                </tr>
                            </thead>
                            <tbody>
                                {items.map(item =>{
                                return (
                                <tr key={item._id}>
                                    <td>{item.item_name}</td>
                                    <td>{item.item_description}</td>
                                    <td>{item.item_stock}</td>
                                    <td>{item.item_price}</td>
                                    
                                    {session && ["admin","farmaceutico"].includes(session.role) ? (
                                    <td>
                                        {/* EDITAR ITEM */}
                                        <span className="p-1">
                                            <button className="btn btn-primary" title="Editar medicamento"
                                            onClick={()=>{
                                                setItemId(item["_id"])
                                            }}>
                                                <i className="bi bi-pencil-square"></i>
                                            </button>
                                        </span>
                                                        
                                        {/* ELIMINAR ITEM */}
                                        <span className="p-1">
                                            <button className="btn btn-danger" title="Eliminar medicamento"
                                            onClick={()=>{deleteItem(item["_id"])}}>
                                                <i className="bi bi-trash3"></i>
                                            </button>
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
                        <p className="mt-2 text-center text-dark">No hay medicamentos...</p>
                    )}
                </Card.Body>
            </Card> 
        </>
    )

}
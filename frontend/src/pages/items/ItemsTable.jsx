import { useState,useEffect } from "react"
import { API_URL } from "../../API_URL.js"
import { ManageItemsModal } from "./modals/ManageItemsModal.jsx"
import Swal from 'sweetalert2'
import { Button, Card, Row, Table } from "react-bootstrap"

export const ItemsTable = ()=>{
    const [items,setItems] = useState([])
    const [itemId,setItemId] = useState("")
    //para mostrar la modal de insertar/actualizar
    const [modalData,setModalData] = useState(false)

    const getAllItems = async()=>{
        Swal.fire({
            title:"Cargando...",
            didOpen:()=>{
                Swal.isLoading()
            }
        })

        const allItems = await fetch(API_URL + '/items/all').then(res => res.json())
        if (allItems && allItems.status === "completed") {
            setItems(allItems.data)
            Swal.close()
            return
        }
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
                const deleteItems = await fetch(API_URL + '/items/delete/'+itemId,{
                    method:"DELETE"
                })
                const responseJSON = await deleteItems.json()

                if (responseJSON) {
                    if (responseJSON.status === "completed") {
                        await getAllItems()
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
        getAllItems()
    },[])
    
    return (
        <>
            <ManageItemsModal
            modalData={modalData}
            setModalData={setModalData}
            itemId={itemId}
            setItemId={setItemId}
            setItems={setItems}
            >
            </ManageItemsModal>

            <Row className="w-100">
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
                    {items.length > 0 ? (
                    <Row className="table-responsive text-center">
                        <Table hover>
                            <thead>
                                <tr>
                                    <th>NOMBRE</th>
                                    <th>DESCRIPCIÓN</th>
                                    <th>STOCK</th>
                                    <th>PRECIO</th>
                                    <th>ACCIONES</th>
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
                                </tr>
                                    )
                                })}
                            </tbody>
                        </Table>
                    </Row>
                    ) : (
                        <p className="text-center text-dark">No hay medicamentos...</p>
                    )}
                </Card.Body>
            </Card> 
            </Row>
        </>
    )

}
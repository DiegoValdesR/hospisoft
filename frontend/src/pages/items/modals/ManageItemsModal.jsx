import { useState,useEffect } from "react"
import Swal from "sweetalert2"
import { API_URL } from "../../../API_URL.js"
import {Modal,Button,ModalBody,ModalHeader,Form,Row,Col} from 'react-bootstrap'
/**
 * @param modalData Variable bool que maneja si se muestra o no la modal
 * @param setModalData Funcion que cambia de true a false y viceversa la variable 'showModal'
 * @param itemId self explanatory
 * @param setItemId Método de 'ItemsTable' que cambia el id del empleado, lo uso para cuando cierro la modal
 * @param setItems Método de 'ItemsTable', la uso 
 * para volver a cargar la tabla con los nuevos cambios
 */
export const ManageItemsModal = ({modalData, setModalData, itemId = "", setItemId, setItems})=>{
    const [itemById,setItemById] = useState({})

    const getItemById = async() =>{
        Swal.fire({
            title:"Cargando medicamento...",
            didOpen:()=>{
                Swal.showLoading()
            }
        })

        const item = await fetch(API_URL + '/items/byid/'+itemId).then(res => res.json())
        if (item && item.status === "completed") {
            setItemById(item.data)
            setModalData(true)
            Swal.close()
            return
        }
    }

    const handleHide = ()=>{
        setModalData(false)
        setItemId("")
        
        return
    }
    
    useEffect(()=>{
        if (itemId.length === 24) {
            getItemById()
        }
    },[itemId])

    const handleSubmit = async(e)=>{
        e.preventDefault()
        const form = e.target.closest('form')
        const formData = new FormData(form)

        const data = {
            item_name:formData.get("item_name"),
            item_description:formData.get("item_description"),
            item_stock:formData.get("item_stock"),
            item_price:formData.get("item_price"),
        }

        Swal.fire({
            title:"Procesando información...",
            didOpen:()=>{
                Swal.showLoading()
            }
        })

        switch (itemId.length) {
            case 0:
                const insert = await fetch(API_URL + `/items/new`,{
                    method:"POST",
                    headers:{
                        "Content-Type":"application/json"
                    },
                    body:JSON.stringify(data)
                })
                const insertJSON = await insert.json()
                Swal.close()

                if (insertJSON) {
                    Swal.fire({
                        title:insertJSON.status === "completed" ? 'Completado' : "Error",
                        icon:insertJSON.status === "completed" ? 'success' : "error",
                        text:insertJSON.message
                    })

                    if (insertJSON.status === "completed") {
                        const allItems = await fetch(API_URL + '/items/all').then(res => res.json())
                        if (allItems && allItems.status === "completed") {
                            setItems(allItems.data)
                            handleHide()
                            return
                        }
                    }
                }
                break
            
            case 24:
                const update = await fetch(API_URL + `/items/update/${itemId}`,{
                    method:"PUT",
                    headers:{
                        "Content-Type":"application/json"
                    },
                    body:JSON.stringify(data)
                })
                const updateJSON = await update.json()
                Swal.close()

                if (updateJSON) {
                    Swal.fire({
                        title:updateJSON.status === "completed" ? 'Completado' : "Error",
                        icon:updateJSON.status === "completed" ? 'success' : "error",
                        text:updateJSON.message
                    })

                    if (updateJSON.status === "completed") {
                        const allItems = await fetch(API_URL + '/items/all').then(res => res.json())
                        if (allItems && allItems.status === "completed") {
                            setItems(allItems.data)
                            handleHide()
                            return
                        }
                    }
                }
                break
        
            default:
                Swal.fire({
                    title:"Error",
                    icon:"error",
                    text:"Ocurrió un error, intentelo más tarde",
                    showCancelButton:false,
                    showConfirmButton:false,
                    timer:3000
                })
                break;
        }
    }

    return (
        <Modal centered className="fade" onHide={handleHide} show={modalData} size="lg">
            <ModalHeader className="d-flex flex-row justify-content-between">
                <Modal.Title>
                    {itemId === "" ? "Insertar" : "Actualizar"} medicamento
                </Modal.Title>
                <i role="button" className="text-danger fs-4 bi bi-x-circle"
                onClick={handleHide}></i>
            </ModalHeader>
            <ModalBody>
                <Form onSubmit={handleSubmit}>

                    <Row className="mb-3">
                        <Col>
                        <Form.Group>
                            <Form.Label className="text-dark">Nombre</Form.Label>
                            <Form.Control
                            required
                            name="item_name"
                            type="text"
                            placeholder="Ej: Ibuprofeno"
                            defaultValue={itemId !== "" ? itemById.item_name : ""} 
                            ></Form.Control>
                        </Form.Group>
                        </Col>
                        <Col>
                        <Form.Group>
                            <Form.Label className="text-dark">Stock</Form.Label>
                            <Form.Control
                            required
                            name="item_stock"
                            type="number"
                            placeholder="0"
                            min={1}
                            defaultValue={itemId !== "" ? itemById.item_stock : ""} 
                            ></Form.Control>
                        </Form.Group>
                        </Col>
                        <Col>
                        <Form.Group>
                            <Form.Label className="text-dark">Precio</Form.Label>
                            <Form.Control
                            required
                            name="item_price"
                            type="number"
                            placeholder="0"
                            min={1}
                            defaultValue={itemId !== "" ? itemById.item_price : ""} 
                            ></Form.Control>
                        </Form.Group>
                        </Col>
                    </Row>

                    <Row className="mb-3">
                        <Form.Group>
                            <Form.Label className="text-dark">Descripción <small className="text-secondary">(Opcional)</small></Form.Label>
                            <Form.Control
                            as="textarea"
                            name="item_description"
                            type="text"
                            defaultValue={itemId !== "" ? itemById.item_description : ""} 
                            ></Form.Control>
                        </Form.Group>
                    </Row>

                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleHide}>Cerrar</Button>
                        <Button type="submit" variant="primary">Enviar</Button>
                    </Modal.Footer>
                </Form>
            </ModalBody>
        </Modal>
    )
}
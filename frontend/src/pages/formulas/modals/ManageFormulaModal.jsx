import { useState,useEffect } from "react"
import Swal from "sweetalert2"
import { API_URL } from "../../../API_URL.js"
import {Modal,Button,ModalBody,ModalHeader,Form,Row, Card,} from 'react-bootstrap'

export const ManageFormulaModal = ({modalData, setModalData, getAllFormulas})=>{
    const [users,setUsers] = useState([])
    const [doctors,setDoctors] = useState([])
    const [items,setItems] = useState([])

    const getUsers = async()=>{
        const allUsers = await fetch(API_URL + '/users/all')
        .catch((err)=>{if(err) console.error(err)})

        const usersJSON = await allUsers.json()
        if (usersJSON && usersJSON.status === "completed") {
            setUsers(usersJSON.data)
        }
    }

    const getDoctors = async()=>{
        const allDoctors = await fetch(API_URL + '/workers/alldoctors')
        .catch((err)=>{if(err) console.error(err)})

        const doctorsJSON = await allDoctors.json()
        if (doctorsJSON && doctorsJSON.status === "completed") {
            setDoctors(doctorsJSON.data)
        }
    }

    const getItems = async()=>{
        const arrayItems = []
        const allItems = await fetch(API_URL + '/items/all')
        .catch((err)=>{if(err) console.error(err)})

        const itemsJSON = await allItems.json()
        if (itemsJSON && itemsJSON.status === "completed") {

            for(const object of itemsJSON.data){
                if (object.item_stock > 0) {
                    arrayItems.push(object)
                }
            }
            
        }

        setItems(arrayItems)
    }

    const handleCheck = (e)=>{
        const checkContainer = e.target.parentElement
        //capturamos el contenedor padre del check
        const container = checkContainer.parentElement
        //obtenemos el input tipo numerico más cercano
        const amountInput = container.children[1]
        if (amountInput.disabled) {
            amountInput.disabled = false
            return
        }
        amountInput.value = ''
        amountInput.disabled = true
    }

    const handleSubmit = async(e)=>{
        e.preventDefault()
        const form = e.target.closest('form')
        const formData = new FormData(form)
        //conseguimos todos los items que fueron marcados
        const items = document.querySelectorAll('#items:checked')
        
        if (!items || items.length < 1) {
            Swal.fire({
                title:"Error",
                icon:'error',
                text:"Debe seleccionar un medicamento."
            })
            return
        }

        //conseguimos todos los inputs con la cantidad del item que no esten inhabilitados
        const amounts = document.querySelectorAll('input[type=number]:not([disabled])')
        //array de objetos para guardarlos en la base de datos
        const itemsArray = []

        for (let index = 0; index < items.length; index++) {

            const objectItems = {
                item_id:items[index].value,
                item_amount:amounts[index].value
            }

            if (isNaN(objectItems.item_amount) || objectItems.item_amount < 1) {
                Swal.fire({
                    title:"Error",
                    icon:'error',
                    text:"Debe seleccionar la cantidad del medicamento."
                })
                return
            }
            itemsArray.push(objectItems)
        }
        
        const data = {
            patient_id:formData.get("paciente"),
            doctor_id:formData.get("medico"),
            items:itemsArray,
            posology:formData.get("posology")
        }
        
        Swal.fire({
            title:"Procesando información...",
            didOpen:()=>{
                Swal.isLoading()
            }
        })

        const insert = await fetch(API_URL + `/formulas/new`,{
            method:"POST",
            headers:{
                "Content-Type":"application/json"
            },
            body:JSON.stringify(data)
        })

        const insertJSON = await insert.json()
        Swal.close()

        if (insertJSON) {

            if (insertJSON.status === "completed") {
                const allItems = await fetch(API_URL + '/items/all').then(res => res.json())
                if (allItems && allItems.status === "completed") {
                    await getAllFormulas()
                    handleHide()
                }
            }

            Swal.fire({
                title:insertJSON.status === "completed" ? 'Completado' : "Error",
                icon:insertJSON.status === "completed" ? 'success' : "error",
                text:insertJSON.message
            })
        }
    }

    const handleHide = ()=>{
        setModalData(false)
        return
    }

    useEffect(()=>{
        getUsers()
        getDoctors()
        getItems()
    },[])

    return (
        <Modal centered className="fade" show={modalData}>
            <ModalHeader className="d-flex flex-row justify-content-between">
                <Modal.Title>
                    Nueva fórmula
                </Modal.Title>
                <i role="button" className="text-danger fs-4 bi bi-x-circle"
                onClick={handleHide}></i>
            </ModalHeader>
            <ModalBody>
                <Form onSubmit={handleSubmit}>
                    <Row className="mb-3">
                        <Form.Group>
                            <Form.Label className="text-black">Paciente</Form.Label>
                            <Form.Select name="paciente"
                            defaultValue={""} required>
                                <option value="">Seleccione un paciente</option>
                                {users.map((user)=>{
                                    return(
                                        <option key={user["_id"]} value={user["_id"]}>
                                            {user.user_name} {user.user_last_name}
                                        </option>
                                    )
                                })}
                            </Form.Select>
                        </Form.Group>
                    </Row>

                    <Row className="mb-3">
                        <Form.Group>
                            <Form.Label className="text-black">Médico encargado</Form.Label>
                            <Form.Select name="medico"
                            defaultValue={""} required>
                                <option value="">Seleccione el médico encargado</option>
                                {doctors.map((doctor)=>{
                                    return(
                                        <option key={doctor["_id"]} value={doctor["_id"]}>
                                            {doctor.worker_name} {doctor.worker_last_name}
                                        </option>
                                    )
                                })}
                            </Form.Select>
                        </Form.Group>
                    </Row>

                    {items.length > 0 ? (
                        <>
                        <Form.Label className="text-black">Medicamentos</Form.Label>
                            <div className="mb-3">
                            {items.map((item)=>{

                                return (
                                    <div key={item["_id"]} className="mb-3">
                                        <Form.Check type="checkbox"
                                        id="items"
                                        name="items"
                                        label={item.item_name}
                                        onChange={handleCheck}
                                        value={item["_id"]}>
                                        </Form.Check>

                                        <Form.Control type="number" placeholder="0" name={"cantidad"}
                                        min={1} disabled required>
                                        </Form.Control>
                                        
                                    </div>
                                )
                                
                            })}
                            </div>
                        </>
                        
                    
                    ) : (
                        <div className="mb-2 text-center">
                            <p className="text-black">No hay medicamentos</p>
                            <a href="/medicamentos" className="link-primary">Click aquí para añadir uno</a>
                        </div>
                    )}

                    <Row className="mb-3">
                        <Form.Group>
                            <Form.Label className="text-black">Instrucciones</Form.Label>
                            <Form.Control as={"textarea"} required name="posology"></Form.Control>
                        </Form.Group>
                    </Row>

                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleHide}>Cerrar</Button>
                        <Button type="submit" variant="primary"
                        disabled={users.length > 0 && doctors.length > 0 && items.length > 0 ? false : true}>
                            Enviar
                        </Button>
                    </Modal.Footer>
                </Form>
            </ModalBody>
        </Modal>
    )
}
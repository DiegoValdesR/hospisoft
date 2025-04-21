import { useState,useEffect } from "react"
import Swal from "sweetalert2"
import { API_URL } from "../../../API_URL.js"
import {Modal,Button,ModalBody,ModalHeader,Form,Row} from 'react-bootstrap'

export const ManageFormulaModal = ({modalData, setModalData, getAllFormulas})=>{
    const [users,setUsers] = useState([])
    const [doctors,setDoctors] = useState([])
    const [items,setItems] = useState([])

    const handleHide = ()=>{
        setModalData(false)
        return
    }

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
        const allItems = await fetch(API_URL + '/items/all')
        .catch((err)=>{if(err) console.error(err)})

        const itemsJSON = await allItems.json()
        if (itemsJSON && itemsJSON.status === "completed") {
            setItems(itemsJSON.data)
        }
    }

    const handleSubmit = async(e)=>{
        e.preventDefault()
        const form = e.target.closest('form')
        const formData = new FormData(form)

        const data = {
            patient_id:formData.get("patient_id"),
            doctor_id:formData.get("doctor_id")
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
            Swal.fire({
                title:insertJSON.status === "completed" ? 'Completado' : "Error",
                icon:insertJSON.status === "completed" ? 'success' : "error",
                text:insertJSON.message
            })

            if (insertJSON.status === "completed") {
                const allItems = await fetch(API_URL + '/items/all').then(res => res.json())
                if (allItems && allItems.status === "completed") {
                    await getAllFormulas()
                    handleHide()
                    return
                }
            }
        }
    }

    const handleCheck = (e)=>{
        const checked = e.target.closest('input')
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
                            <Form.Label className="text-dark">Paciente</Form.Label>
                            <Form.Select name="paciente"
                            defaultValue={""}>
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
                            <Form.Label className="text-dark">Médico encargado</Form.Label>
                            <Form.Select name="medico"
                            defaultValue={""}>
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

                    <Form.Label className="text-dark">Medicamentos</Form.Label>
                    <div className="mb-3">
                    {items.map((item)=>{
                        return (
                            <div key={item["_id"]} className="mb-3">
                                <Form.Check type="checkbox"
                                name="items"
                                label={item.item_name}
                                onChange={handleCheck}
                                value={item["_id"]}>
                                </Form.Check>

                                <Form.Control type="number" placeholder="0" name="cantidad[]"></Form.Control>
                            </div>
                        )  
                    })}
                    </div>
                    

                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleHide}>Cerrar</Button>
                        <Button type="submit" variant="primary">Enviar</Button>
                    </Modal.Footer>
                </Form>
            </ModalBody>
        </Modal>
    )
}
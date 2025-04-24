import { Button, Card, Col, Form, Row } from 'react-bootstrap'
import moment from 'moment'
import { useState,useEffect } from 'react'
import { API_URL } from '../../API_URL.js'
import Swal from 'sweetalert2'

import '../../assets/css/scheduler/scheduler.css'

export const Scheduler = ()=>{
    const [workers,setWorkers] = useState([])

    const getWorkers = async()=>{
        try {
            Swal.fire({
                title:"Cargando...",
                didOpen:()=>{
                    Swal.showLoading()
                }
            })
            const allWorkers = await fetch(API_URL + '/workers/all')
            if (!allWorkers.ok) {
                console.error("Error en el fecth: "+allWorkers.statusText)
            }
            
            const workersJSON = await allWorkers.json()
            if (workersJSON && workersJSON.status === "completed") {
                setWorkers(workersJSON.data)
            }

        } catch (err) {
            console.error(err)
            Swal.fire({
                title:"Error",
                icon:"error",
                text:"No se pudieron encontrar los empleados."
            })
        }finally{
            Swal.close()
        }
    }

    useEffect(()=>{
        getWorkers()
    },[])

    return (
        <Card>
            <Card.Header className='p-3'>
                <Row>
                    <div className='d-flex flex-row justify-content-between sche-header'>
                        <div className='d-flex flex-row align-items-center'>
                            <span className='text-black text-break'>Seleccionar empleado</span>

                            <Form.Select className='ms-3 border-dark-subtle select'
                            defaultValue={""}>
                                <option value=""></option>
                                {workers.map((worker)=>{
                                    return (
                                        <option key={worker["_id"]} value={worker["_id"]}>
                                            {worker.worker_name} {worker.worker_last_name}
                                        </option>
                                    )
                                })}
                            </Form.Select>
                        </div>

                        <div className='btn-new'>
                            <Button variant='primary'>
                                <i className="bi bi-plus-lg"></i>
                                <span className="p-1 text-white">
                                    Nuevo
                                </span>
                            </Button>
                        </div>
                    </div>
                </Row>

            </Card.Header>

            <Card.Body className='mt-2'>
                <section className='table-responsive'>
                    <table className='table table-hover text-center'>
                        <thead>
                            <tr>
                                <th>HORA</th>
                                <th>LUNES</th>
                                <th>MARTES</th>
                                <th>MIÉRCOLES</th>
                                <th>JUEVES</th>
                                <th>VIERNES</th>
                                <th>SÁBADO</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>8:00 AM</td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                            </tr>
                        </tbody>
                    </table>
                </section>
            </Card.Body>
        </Card>
    )
}
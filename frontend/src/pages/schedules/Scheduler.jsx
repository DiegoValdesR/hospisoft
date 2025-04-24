import { Button, Card, Form, Row } from 'react-bootstrap'
import { useState,useEffect } from 'react'
import { API_URL } from '../../API_URL.js'
import Swal from 'sweetalert2'
//libreria para el calendario
import {Calendar,momentLocalizer} from 'react-big-calendar'
import { NewSchedule } from './modals/NewSchedule.jsx'
//libreria para manjear fechas
import moment from 'moment-timezone'
//css
import 'react-big-calendar/lib/css/react-big-calendar.css'
import '../../assets/css/scheduler/scheduler.css'

export const Scheduler = ()=>{
    //valor para obtener la fecha actual para el calendario
    const localizer = momentLocalizer(moment)
    const [workers,setWorkers] = useState([])
    const [showModal,setShowModal] = useState(false)
    const [events,setEvents] = useState([])

    const getWorkers = async()=>{
        const allWorkers = await fetch(API_URL + '/workers/all')
        if (!allWorkers.ok) {
            console.error("Error en el fecth: "+allWorkers.statusText)
        }
        const workersJSON = await allWorkers.json()
        if (workersJSON && workersJSON.status === "completed") {
            setWorkers(workersJSON.data)
        }
    }

    const getEvents = async()=>{
        Swal.fire({
            title:"Cargando",
            didOpen:()=>{
                Swal.showLoading()
            }
        })

        const events = await fetch(API_URL + `/schedules/all`)
        if (!events.ok) {
            Swal.close()
            Swal.fire({
                icon:"error",
                title:"Error",
                text:"Ocurrió un error al cargar los eventos."
            })
            console.error(events.statusText)
            return
        }
        const eventsJSON = await events.json()
        
        if (!eventsJSON || eventsJSON.status !== "completed") {
            Swal.close()
            Swal.fire({
                icon:"error",
                title:"Error",
                text:"Ocurrió un error al cargar los eventos",
                backdrop:false,
                allowEscapeKey:false
            })
            console.error(eventsJSON)
            return
        }

        const arrayEvents = []
        for(const schedule of eventsJSON.data){
            const {schedule_start_date,schedule_final_date} = schedule

            const startDate = {
                year:moment.utc(schedule_start_date).format('YYYY'),
                month:moment.utc(schedule_start_date).format('MM'),
                day:moment.utc(schedule_start_date).format('DD'),
            }
            
            const endDate = {
                year:moment.utc(schedule_final_date).format('YYYY'),
                month:moment.utc(schedule_final_date).format('MM'),
                day:moment.utc(schedule_final_date).format('DD'),
            }

            const hourStart = schedule.hour_start
            const hourEnd = schedule.hour_end

            //armamos las distintas partes del objeto
            const start = moment(`${startDate.year}-${startDate.month}-${startDate.day}T${hourStart}`).toDate()
            const end = moment(`${endDate.year}-${endDate.month}-${endDate.day}T${hourEnd}`).toDate()
            const title = `${schedule.title} ${moment(start).format('hh:mm a')} a ${moment(end).format('hh:mm a')}`

            const data = {
                title:title,
                start:start,
                end:end,
            }
            
            arrayEvents.push(data)
        }

        setEvents(arrayEvents)
        Swal.close()
    }

    const messages = {
        allDay: "Todo el día",
        previous: "Anterior",
        next: "Siguiente",
        today: "Hoy",
        month: "Mes",
        week: "Semana",
        day: "Día",
        agenda: "Agenda",
        date: "Fecha",
        time: "Hora",
        event: "Evento",
        noEventsInRange: "Sin eventos"
    }

    useEffect(()=>{
        getWorkers(),
        getEvents()
    },[])
    console.log(events);
    
    return (
        <>
        <NewSchedule API_URL={API_URL}
        showModal={showModal}
        setShowModal={setShowModal}
        workers={workers}
        getEvents={getEvents}></NewSchedule>
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
                            <Button variant='primary'
                            onClick={()=>{setShowModal(true)}}>
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
                <Calendar
                style={{width:"100%",height:"100vh"}}
                localizer={localizer}
                views={["month"]}
                messages={messages}
                events={events}
                ></Calendar>
            </Card.Body>
        </Card>
        </>
    )
}
import { Button, Card, Form, Row } from 'react-bootstrap'
import { useState,useEffect } from 'react'
import { API_URL } from '../../API_URL.js'
import { allSchedules,scheduleByWorker } from '../../services/schedule/schedule.js'
import Swal from 'sweetalert2'
//libreria para el calendario
import {Calendar,momentLocalizer} from 'react-big-calendar'
import { NewSchedule } from './modals/NewSchedule.jsx'
import { ShowSchedule } from './modals/ShowSchedule.jsx'
//libreria para manjear fechas
import moment from 'moment-timezone'
//css
import 'react-big-calendar/lib/css/react-big-calendar.css'
import '../../assets/css/scheduler/scheduler.css'

export const Scheduler = ()=>{
    //Ajustamos la zona horaria
    moment.tz.setDefault('America/Bogota')
    //valor para obtener la fecha actual para el calendario
    const localizer = momentLocalizer(moment)
    const session = JSON.parse(sessionStorage.getItem("session"))

    const [workers,setWorkers] = useState([])
    const [workerId,setWorkerId] = useState("")
    const [scheduleData,setScheduleData] = useState({})
    const [showModal,setShowModal] = useState(false)
    const [events,setEvents] = useState([])

    const getWorkers = async()=>{
        const allWorkers = await fetch(API_URL + '/workers/all',{credentials: 'include'})
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

        let events

        if (workerId.length === 24 || (session && session.id && session.role && session.role !== "admin") ) {
            events = await scheduleByWorker(workerId.length === 24 ? workerId : session.id)
        }else{
            events = await Promise.resolve(allSchedules())
        }
        
        if (!Array.isArray(events)) {
            Swal.close()
            Swal.fire({
                icon:"error",
                title:"Error",
                text:events.err_message
            })
            return
        }
        setEvents(events)
        
        Swal.close()
    }

    const handleEventClick = (data)=>{
        setScheduleData(data)
    }

    const handleChange = async({target})=>{
        setWorkerId(target.value)
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
        if (workers.length === 0) {
            getWorkers()
        }
        getEvents()
    },[workerId])
    
    return (
        <>
        {session && ["admin"].includes(session.role) ? (
            <>
                {/* Modal nuevo horario */}
                <NewSchedule API_URL={API_URL}
                showModal={showModal}
                setShowModal={setShowModal}
                workers={workers}
                getEvents={getEvents}></NewSchedule>
            </>
        ) : ""}

        {session && ["admin","medico","secretaria","farmaceutico"].includes(session.role) ? (
            <>
            {/* Mostrar detalles del horario */}
            <ShowSchedule
            API_URL={API_URL}
            scheduleData={scheduleData}
            setScheduleData={setScheduleData}
            workers={workers}
            getEvents={getEvents}></ShowSchedule>
            </>
        ) : ""}
        
        <Card>
            {session && ["admin"].includes(session.role) ? (
                <Card.Header className='p-3'>
                    <Card.Title>
                        <div className='d-flex flex-row justify-content-between sche-header'>
                            <div className='d-flex flex-row align-items-center'>
                                <span className='text-black text-break'>Seleccionar empleado</span>

                                <Form.Select className='ms-3 border-dark-subtle select'
                                defaultValue={""} onChange={handleChange}>
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
                            {session && ["admin"].includes(session.role) ? (
                                <div className='btn-new'>
                                    <Button variant='primary'
                                    onClick={()=>{setShowModal(true)}}>
                                        <i className="bi bi-plus-lg"></i>
                                        <span className="p-1 text-white">
                                            Nuevo
                                        </span>
                                    </Button>
                                </div>
                            ) : ""}
                            
                        </div>
                    </Card.Title>
                </Card.Header>
            ) : ""}
            

            <Card.Body className='mt-2 p-3'>

                {events.length > 0 ? (
                    <Calendar
                    style={{width:"100%",height:"100vh"}}
                    localizer={localizer}
                    views={["month","week","day"]}
                    messages={messages}
                    events={events}
                    min={moment('2025-04-26T06:00:00').toDate()}
                    max={moment('2025-04-26T19:00:00').toDate()}
                    onSelectEvent={(event)=>{
                        handleEventClick(event.schedule_data)
                    }}
                    formats={{
                        timeGutterFormat:"hh:mm a",
                        eventTimeRangeFormat: ({ start, end }, culture, local) =>{
                            return local.format(start, 'hh:mm a') + ' - ' + local.format(end, 'hh:mm a')
                        }
                    }}
                    ></Calendar>
                ) : (
                    <p className='text-center text-black h5'>No existen horarios registrados...</p>
                )}
                
            </Card.Body>
        </Card>
        </>
    )
}
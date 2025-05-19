import {  Card } from 'react-bootstrap'
import { useState,useEffect } from 'react'
import { API_URL } from '../../API_URL.js'

import { allSchedules,scheduleByWorker } from '../../services/schedule/schedule.js'
import { getAllWorkers } from '../../services/workers/workers.js'

import Swal from 'sweetalert2'
//libreria para el calendario
import {Calendar,momentLocalizer} from 'react-big-calendar'
import { NewSchedule } from './modals/NewSchedule.jsx'
import { ShowSchedule } from './modals/ShowSchedule.jsx'

import {Button} from 'primereact/button'
import {Dropdown} from 'primereact/dropdown'

//libreria para manjear fechas
import moment from 'moment-timezone'

export const Scheduler = ({session})=>{
    //valor para obtener la fecha actual para el calendario
    const localizer = momentLocalizer(moment)

    const [workers,setWorkers] = useState([])
    const [workerId,setWorkerId] = useState("")
    const [scheduleData,setScheduleData] = useState({})
    const [showModal,setShowModal] = useState(false)
    const [events,setEvents] = useState([])

    const getWorkers = async()=>{
        const request = await getAllWorkers()
        if (!request.status) {
            console.error(request.message)
            return
        }

        const arrayWorkers = []
        for(const object of request.data){
            const data = {
                id:object["_id"],
                name:`${object["worker_name"]} ${object["worker_last_name"]}`
            }
            arrayWorkers.push(data)
        }
        setWorkers(arrayWorkers)
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
           <NewSchedule API_URL={API_URL}
            showModal={showModal}
            setShowModal={setShowModal}
            workers={workers}
            getEvents={getEvents}></NewSchedule>
        ) : ""}

        {session && ["admin","medico","secretaria","farmaceutico"].includes(session.role) && events.length > 0 ? (
            <ShowSchedule
            API_URL={API_URL}
            scheduleData={scheduleData}
            setScheduleData={setScheduleData}
            workers={workers}
            session={session}
            getEvents={getEvents}></ShowSchedule>
        ) : ""}
        
        <Card>
            {session && ["admin"].includes(session.role) ? (
                <Card.Header className='p-3'>
                    <div className='d-flex flex-row justify-content-between sche-header'>
                        <div className="d-flex flex-row gap-2">
                            <Dropdown placeholder='Selecciona un empleado'
                            value={workerId} onChange={handleChange} options={workers}
                            optionLabel='name' optionValue='id'
                            ></Dropdown>

                            {workerId.length === 24 && (
                                <Button severity="info" className="rounded rounded-5" 
                                aria-label='Botón para mostrar todos los horarios' icon="pi pi-refresh" 
                                onClick={async()=>{
                                    setWorkerId("")
                                    await getEvents()
                                }}>
                                </Button>
                            )}
                        </div>
                       
                        
                        <div className='btn-new'>
                            <Button severity="info" className="rounded rounded-5" 
                                icon="pi pi-plus" onClick={()=>{setShowModal(true)}} label="Nuevo" iconPos="left">
                            </Button>
                        </div>
                    </div>
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
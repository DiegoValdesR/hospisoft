import moment from 'moment-timezone'
import { getApointments,appointmentByDoctor } from '../../services/appointments/appointments.js'
import { useState,useEffect } from 'react'
import { Button, Card } from 'react-bootstrap'
import { Calendar, momentLocalizer} from 'react-big-calendar'
import 'react-big-calendar/lib/css/react-big-calendar.css'
import '../../assets/css/scheduler/scheduler.css'
import Swal from 'sweetalert2'
import { NewAppointment } from './modals/NewAppointment.jsx'
import { ShowAppointment } from './modals/ShowAppointments.jsx'

export const AppontmentsCalendar = ()=>{
    const localizer = momentLocalizer(moment)
    const [events,setEvents] = useState([])
    const [appointmentData,setAppointmentData] = useState({})
    const [showModal,setShowModal] = useState(false)
    const session = JSON.parse(sessionStorage.getItem("session"))

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

    const getEvents = async()=>{
        Swal.fire({
            title:"Cargando...",
            allowEscapeKey:false,
            allowOutsideClick:false,
            didOpen:()=>{
                Swal.showLoading()
            }
        })

        let appointments
        if (session && session.id.length === 24 && session.role && session.role === "medico") {
            appointments = await Promise.resolve(appointmentByDoctor(session.id))
        }else{
            appointments = appointments = await Promise.resolve(getApointments())
        }
        
        if (!Array.isArray(appointments)) {
            Swal.close()

            Swal.fire({
                title:"Error",
                icon:"error",
                text:appointments
            })
        }

        setEvents(appointments)
        Swal.close()
    }

    const handleSelect = (event)=>{
        setAppointmentData(event.appointment_data)
    }

    useEffect(()=>{
        getEvents()
    },[])
    
    return (
        <>
            {session && ["admin","secretaria"].includes(session.role) ? (
                <>
                    <NewAppointment showModal={showModal} setShowModal={setShowModal}
                    getEvents={getEvents}></NewAppointment>
                </>
            ) : ""}
            
            {session && ["admin","secretaria","medico"].includes(session.role) ? (
                <>
                    <ShowAppointment appointmentData={appointmentData}
                    setAppointmentData={setAppointmentData}
                    getEvents={getEvents}
                    ></ShowAppointment>
                </>
            ) : ""}

            <Card>
                {session && ["admin","secretaria"].includes(session.role) ? (
                    <Card.Header>
                        <Card.Title>
                            {session && ["admin","secretaria"].includes(session.role) ? (
                            <Button variant='primary' className='ms-4'
                            onClick={()=>{setShowModal(true)}}>
                                <i className="bi bi-plus-lg"></i>
                                <span className="p-1 text-white">
                                    Nuevo
                                </span>
                            </Button>
                            ) : ""}
                        </Card.Title>
                    </Card.Header>
                ) : ""}
                
                    <Card.Body className='mt-2 p-3'>
                        {events.length > 0 ? (
                        <Calendar
                        events={events}
                        localizer={localizer}
                        views={["month","week","day"]}
                        messages={messages}
                        min={moment("2025-04-23T06:00").toDate()}
                        max={moment("2025-04-23T19:00").toDate()}
                        formats={{
                            timeGutterFormat:"hh:mm a",
                            eventTimeRangeFormat: ({ start, end }, culture, local) =>{
                                return local.format(start, 'hh:mm a') + ' - ' + local.format(end, 'hh:mm a')
                            }
                            
                        }}
                        selectable
                        onSelectEvent={handleSelect}
                        style={{width:"100%",height:"100vh"}}
                        defaultView='month'
                        ></Calendar>
                        ) : (
                            <p className='text-center text-black h5'>
                                No existen citas pendientes.
                            </p>
                        )}
                    </Card.Body>
            </Card>
        </>
    )
}
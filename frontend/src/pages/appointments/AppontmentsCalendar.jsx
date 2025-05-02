import moment from 'moment-timezone'
import { getApointments } from '../../services/appointments/appointments.js'
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
            didOpen:()=>{
                Swal.showLoading()
            }
        })

        const appointments = await Promise.resolve(getApointments())
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
            <NewAppointment showModal={showModal} setShowModal={setShowModal}
            getEvents={getEvents}></NewAppointment>

            <ShowAppointment appointmentData={appointmentData}
            setAppointmentData={setAppointmentData}
            getEvents={getEvents}
            ></ShowAppointment>

            <Card>
                <Card.Header>
                    <Button variant='primary'
                    onClick={()=>{setShowModal(true)}}>
                        <i className="bi bi-plus-lg"></i>
                        <span className="p-1 text-white">
                            Nuevo
                        </span>
                    </Button>
                </Card.Header>
                <Card.Body className='mt-2'>
                    <Calendar
                    events={events}
                    localizer={localizer}
                    views={["month","week","day"]}
                    messages={messages}
                    min={moment("2025-04-23T06:00").toDate()}
                    max={moment("2025-04-23T19:00").toDate()}
                    formats={{
                        timeGutterFormat:"hh:mm a"
                    }}
                    selectable
                    onSelectEvent={handleSelect}
                    style={{width:"100%",height:"100vh"}}
                    defaultView='month'
                    ></Calendar>
                </Card.Body>
            </Card>
        </>
    )
}
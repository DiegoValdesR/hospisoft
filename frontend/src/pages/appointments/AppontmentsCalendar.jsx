import moment from 'moment-timezone'
import { getApointments,appointmentByDoctor,appointmentByPatient } from '../../services/appointments/appointments.js'
import { useState,useEffect } from 'react'
import { Card } from 'react-bootstrap'
import { Calendar, momentLocalizer} from 'react-big-calendar'
import Swal from 'sweetalert2'
import { NewAppointment } from './modals/NewAppointment.jsx'
import { ShowAppointment } from './modals/ShowAppointments.jsx'

import {Button} from 'primereact/button'


export const AppontmentsCalendar = ({session})=>{
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
            allowEscapeKey:false,
            allowOutsideClick:false,
            didOpen:()=>{
                Swal.showLoading()
            }
        })

        let appointments

        if (["usuario"].includes(session.role)) {
            appointments = await appointmentByPatient(session["id"])

            if (!appointments.status) {
                Swal.close()
                Swal.fire({
                    title:"Error",
                    icon:"error",
                    text:appointments.message,
                    allowEscapeKey:false,
                    allowOutsideClick:false
                })
                return
            }

            setEvents(appointments.data)
            Swal.close()
            return
        }

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
                text:appointments,
                allowEscapeKey:false,
                allowOutsideClick:false
            })

            return  
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
            
            {session && ["admin","secretaria","medico","usuario"].includes(session.role) && events.length > 0 ? (
                <>
                    <ShowAppointment appointmentData={appointmentData}
                    setAppointmentData={setAppointmentData}
                    getEvents={getEvents}
                    session={session}
                    ></ShowAppointment>
                </>
            ) : ""}

            <Card>
                {session && ["admin","secretaria"].includes(session.role) ? (
                    <Card.Header>
                        <Button severity='info' label='Nuevo' icon='pi pi-plus'
                        className='rounded rounded-5'
                        onClick={()=>{setShowModal(true)}}>       
                        </Button>
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
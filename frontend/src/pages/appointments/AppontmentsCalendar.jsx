import moment from 'moment-timezone'
import { Button, Card } from 'react-bootstrap'
import { Calendar, momentLocalizer} from 'react-big-calendar'
import '../../assets/css/scheduler/scheduler.css'

export const AppontmentsCalendar = ()=>{
    const localizer = momentLocalizer(moment)

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

    const events = [
        {
            title:"Esclavismo parte 3: ahora es personal",
            start:moment.utc("2025-04-28T06:00").toDate(),
            end:moment.utc("2025-04-28T18:00").toDate()
        }
    ]

    return (
        <>
            <Card>
                <Card.Header>
                    <Button variant='primary'
                    >
                        <i className="bi bi-plus-lg"></i>
                        <span className="p-1 text-white">
                            Nuevo
                        </span>
                    </Button>
                </Card.Header>
                <Card.Body className='mt-2'>
                    <Calendar
                    events={events}
                    messages={messages}
                    style={{width:"100%",height:"100vh"}}
                    views={["month","week","day"]}
                    defaultView='month'
                    localizer={localizer}
                    ></Calendar>
                </Card.Body>
            </Card>
        </>
    )
}
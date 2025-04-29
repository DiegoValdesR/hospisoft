import { AppontmentsCalendar } from "./AppontmentsCalendar"

export const AppointmentsPage = ()=>{
    return(
        <main className="main" id="main">
            <div className="pagetitle">
                <h1>Citas</h1>
                <nav>
                    <ol className="breadcrumb">
                    <li className="breadcrumb-item"><a href="/">Inicio</a></li>
                    <li className="breadcrumb-item active">Citas</li>
                    </ol>
                </nav>
            </div>

            <AppontmentsCalendar></AppontmentsCalendar>
        </main>
    )
}
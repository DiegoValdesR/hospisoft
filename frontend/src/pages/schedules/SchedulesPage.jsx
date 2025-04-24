import { Scheduler } from "./Scheduler"

export const SchedulesPage = ()=>{

    return (
        <main className="main" id="main">
            <div className="pagetitle">
                <h1>Horarios</h1>
                <nav>
                    <ol className="breadcrumb">
                    <li className="breadcrumb-item"><a href="/">Inicio</a></li>
                    <li className="breadcrumb-item active">Horarios</li>
                    </ol>
                </nav>
            </div>

            <Scheduler></Scheduler>
        </main>
    )
}
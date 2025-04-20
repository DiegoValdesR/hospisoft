import {WorkersTable} from './WorkersTable.jsx'

export const WorkersPage = ()=>{
    return(
        <main className="main" id="main">
            <div className="pagetitle">
                <h1>Empleados</h1>
                <nav>
                    <ol className="breadcrumb">
                    <li className="breadcrumb-item"><a href="/">Inicio</a></li>
                    <li className="breadcrumb-item active">Empleados</li>
                    </ol>
                </nav>
            </div>

            <WorkersTable></WorkersTable>
        </main>
       
    )
}
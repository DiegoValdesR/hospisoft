import { UsersTable } from "./usersTable"


export const UsersPage = ({session})=>{
    return(
        <main className="main" id="main">
            <div className="pagetitle">
                <h1>Usuarios</h1>
                <nav>
                    <ol className="breadcrumb">
                    <li className="breadcrumb-item"><a href="/">Inicio</a></li>
                    <li className="breadcrumb-item active">Usuarios</li>
                    </ol>
                </nav>
            </div>

            <UsersTable session={session}></UsersTable>
        </main>
       
    )
}
import { API_URL } from '../API_URL.js'

export const AsideBar = ()=>{
    const session = JSON.parse(sessionStorage.getItem("session"))
    
    const LogOut = async()=>{
        const logOut = await fetch(API_URL + '/logout',{
            method:"POST",
            credentials:"include"
        })

        if (logOut.ok) {
            sessionStorage.removeItem("session")
            return window.location.href = "/login"
        }
    }

    return (
    <aside id="sidebar" className="sidebar">
        
        {session && (
            <ul className="sidebar-nav" id="sidebar-nav">

                <li className="nav-item">
                    <a className="nav-link collapsed" href="/home">
                        <i className="bi bi-grid"></i>
                        <span>Dashboard</span>
                    </a>
                </li>

                <li className="nav-heading">SECCIONES</li>
                {["admin","secretaria"].includes(session.role) && (
                    <li className="nav-item">
                    <a className="nav-link collapsed" href="/usuarios">
                        <i className="bi bi-people"></i>
                        <span>Usuarios</span>
                    </a>
                    </li>
                )}
                
                {["admin"].includes(session.role) && (
                    <li className="nav-item">
                    <a className="nav-link collapsed" href="/empleados">
                        <i className="bi bi-person-vcard"></i>
                        <span>Empleados</span>
                    </a>
                    </li>
                )}

                {["admin","medico","farmaceutico"].includes(session.role) && (
                    <li className="nav-item">
                    <a className="nav-link collapsed" href="/medicamentos">
                        <i className="bi bi-capsule"></i>
                        <span>Medicamentos</span>
                    </a>
                    </li>
                )}

                {["admin","medico"].includes(session.role) && (
                    <li className="nav-item">
                    <a className="nav-link collapsed" href="/formulas">
                        <i className="bi bi-clipboard-pulse"></i>
                        <span>Formulas</span>
                    </a>
                    </li>
                )}

                {["admin","medico","secretaria","farmaceutico"].includes(session.role) && (
                    <li className="nav-item">
                    <a className="nav-link collapsed" href="/horarios">
                        <i className="bi bi-calendar-plus"></i>
                        <span>Horarios</span>
                    </a>
                    </li>
                )}

                {["admin","medico","secretaria"].includes(session.role) && (
                    <li className="nav-item">
                    <a className="nav-link collapsed" href="/citas">
                        <i className="bi bi-calendar-check"></i>
                        <span>Citas</span>
                    </a>
                    </li>
                )}
            
                <li className="nav-heading">SESIÓN</li>

                <li className="nav-item">
                    <button className="nav-link collapsed"
                    onClick={LogOut}>
                        <i className="bi bi-door-open"></i>
                        <span>Cerrar sesión</span>
                    </button>
                </li>

            </ul>
        )}
    </aside>
    )
}
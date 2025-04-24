
export const AsideBar = (select)=>{

    return (
    <aside id="sidebar" className="sidebar">

        <ul className="sidebar-nav" id="sidebar-nav">

            <li className="nav-item">
                <a className="nav-link collapsed" href="/">
                    <i className="bi bi-grid"></i>
                    <span>Dashboard</span>
                </a>
            </li>

            <li className="nav-heading">SECCIONES</li>

            <li className="nav-item">
                <a className="nav-link collapsed" href="/usuarios">
                    <i className="bi bi-people"></i>
                    <span>Usuarios</span>
                </a>
            </li>

            <li className="nav-item">
                <a className="nav-link collapsed" href="/empleados">
                    <i className="bi bi-person-vcard"></i>
                    <span>Empleados</span>
                </a>
            </li>

            <li className="nav-item">
                <a className="nav-link collapsed" href="/medicamentos">
                    <i className="bi bi-capsule"></i>
                    <span>Medicamentos</span>
                </a>
            </li>

            <li className="nav-item">
                <a className="nav-link collapsed" href="/formulas">
                    <i className="bi bi-clipboard-pulse"></i>
                    <span>Formulas</span>
                </a>
            </li>

            <li className="nav-item">
                <a className="nav-link collapsed" href="/horarios">
                    <i className="bi bi-calendar-plus"></i>
                    <span>Horarios</span>
                </a>
            </li>

            <li className="nav-heading">SESIÓN</li>

            <li className="nav-item">
                <a className="nav-link collapsed" href="/usuarios">
                    <i className="bi bi-door-open"></i>
                    <span>Cerrar sesión</span>
                </a>
            </li>

        </ul>

    </aside>
    )
}
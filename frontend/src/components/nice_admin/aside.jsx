export const AsideBar = ()=>{
    return (
    <aside id="sidebar" className="sidebar">

        <ul className="sidebar-nav" id="sidebar-nav">

        <li className="nav-item">
            <a className="nav-link " href="index.php">
            <i className="bi bi-grid"></i>
            <span>Dashboard</span>
            </a>
        </li>

        <li className="nav-item">
            <a className="nav-link collapsed" data-bs-target="#tables-nav" data-bs-toggle="collapse" href="#">
                <i className="bi bi-layout-text-window-reverse"></i><span>Paginas</span><i className="bi bi-chevron-down ms-auto">
                </i>
            </a>

            <ul id="tables-nav" className="nav-content collapse " data-bs-parent="#sidebar-nav">

            <li>
                <a href="#">
                <i className="bi bi-circle"></i><span>Placeholder</span>
                </a>
            </li>
            

            </ul>
        </li>


        <li className="nav-heading">Sesión</li>


        <li className="nav-item">
            <a className="nav-link collapsed" href="index.php?pagina=logout">
            <i className="bi bi-box-arrow-in-right"></i>
            <span>Iniciar sesión</span>
            </a>
        </li>

        <li className="nav-item">
            <a className="nav-link collapsed" href="index.php?pagina=logout">
            <i className="bi bi-box-arrow-in-right"></i>
            <span>Registrarse</span>
            </a>
        </li>

        </ul>

    </aside>
    )
}
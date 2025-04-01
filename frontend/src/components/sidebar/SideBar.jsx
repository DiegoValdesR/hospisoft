export const SideBar = () =>{
    return(
        <>
        <ul className="navbar-nav bg-gradient-primary sidebar sidebar-dark accordion" id="accordionSidebar">

            <a className="sidebar-brand d-flex align-items-center justify-content-center" href="index.html">
                <div className="sidebar-brand-icon rotate-n-15">
                    <i class="bi bi-emoji-smile-fill"></i>
                </div>
                <div className="sidebar-brand-text mx-3">Hospisoft</div>
            </a>


            <hr className="sidebar-divider my-0">
            </hr>

            <li className="nav-item active">
                <a className="nav-link" onClick={(e)=>{e.preventDefault();location.reload()}} href="#">
                    <i className="bi bi-speedometer2"></i>
                    <span>Dashboard</span>
                </a>
            </li>


            <hr className="sidebar-divider">
            </hr>


            <div className="sidebar-heading">
                Interfaz
            </div>


            <li className="nav-item">
                <a className="nav-link collapsed" href="#" data-toggle="collapse" data-target="#collapseTwo"
                    aria-expanded="true" aria-controls="collapseTwo">
                    <i className="bi bi-journal-medical"></i>
                    <span>Paginas</span>
                </a>
                <div id="collapseTwo" className="collapse" aria-labelledby="headingTwo" data-parent="#accordionSidebar">
                    <div className="bg-white py-2 collapse-inner rounded">
                       
                        <a className="collapse-item" href="buttons.html">Ejemplo 1</a>
                        <a className="collapse-item" href="cards.html">Ejemplo 2</a>
                    </div>
                </div>
            </li>

            <hr className="sidebar-divider"></hr>

        </ul>
        
        </>
    )
}
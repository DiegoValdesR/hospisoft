import { Footer } from "../footer/footer"

export const MainContent = () =>{
    return(<>

    <div id="content-wrapper" className="d-flex flex-column">
        <div id="content">
            {/**START NAVBAR */}
            <nav className="navbar navbar-expand navbar-light bg-white topbar mb-4 static-top shadow">
                <button id="sidebarToggleTop" className="btn btn-link d-md-none rounded-circle mr-3">
                    <i className="bi bi-list"></i>
                </button>            
                            
                <ul className="navbar-nav ml-auto">
                    <div className="topbar-divider d-none d-sm-block"></div>
                    <li className="nav-item dropdown no-arrow">
                                    <a className="nav-link dropdown-toggle" role="button" id="userDropdown"
                                        data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                        <span className="mr-2 d-none d-lg-inline text-gray-600 small">Test Usuario</span>
                                        <img className="img-profile rounded-circle"
                                            src="https://startbootstrap.github.io/startbootstrap-sb-admin-2/img/undraw_profile.svg">
                                        </img>
                                    </a>

                                    <div className="dropdown-menu dropdown-menu-right shadow animated--grow-in"
                                        aria-labelledby="userDropdown">
                                        <button className="dropdown-item">
                                            <i className="fas fa-user fa-sm fa-fw mr-2 text-gray-400"></i>
                                            Perfil
                                        </button>
                                        
                                        <div className="dropdown-divider"></div>
                                        <button className="dropdown-item">
                                            <i className="fas fa-sign-out-alt fa-sm fa-fw mr-2 text-gray-400"></i>
                                            Cerrar sesión
                                        </button>
                                    </div>
                    </li>         
                </ul>
            </nav>
            {/**END NAVBAR */} 

            {/**Aqui va el contenido principal de la pagina*/}
            <main className="container-fluid">
                <h1>Hospisoft</h1>
            </main>
            {/**END MAIN CONTENT */}

            {/**FOOTER */}
            <Footer></Footer>
            {/**END FOOTER */}
        </div>
    </div>
        
    </>)

}
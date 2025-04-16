import { useState } from "react"
export const Header = ()=>{
    const [toggle,setToggle] = useState(Boolean)

    const ToggleSideBar = ()=>{
        if (toggle === true) {
            document.body.classList.remove('toggle-sidebar')
            setToggle(false)
            return
        }

        document.body.classList.toggle('toggle-sidebar')
        setToggle(true)
    }

    return (
    <header id="header" className="header fixed-top d-flex align-items-center">

        <div className="d-flex align-items-center justify-content-between">
            <a href="#" className="logo d-flex align-items-center">
            <span className="d-none d-lg-block">NiceAdmin</span>
            </a>
            <i onClick={ToggleSideBar} className="bi bi-list toggle-sidebar-btn"></i>
        </div>


        <nav className="header-nav ms-auto">
            <ul className="d-flex align-items-center">


            <li className="nav-item dropdown pe-3">

                <a className="nav-link nav-profile d-flex align-items-center pe-0" href="#" data-bs-toggle="dropdown">
                    <span className="d-none d-md-block dropdown-toggle ps-2">Placeholder nombre usuario</span>
                </a>

                <ul className="dropdown-menu dropdown-menu-end dropdown-menu-arrow profile">
                    <li className="dropdown-header">
                        <h6>Placeholder</h6>
                        <span>Placeholder</span>
                    </li>
                    <li>
                        <hr className="dropdown-divider"></hr>
                    </li>


                    <li>
                        <a className="dropdown-item d-flex align-items-center" href="#">
                        <i className="bi bi-box-arrow-right"></i>
                        <span>Cerrar sesión</span>
                        </a>
                    </li>
                </ul>
            </li>

            </ul>
        </nav>

    </header>
    )
}
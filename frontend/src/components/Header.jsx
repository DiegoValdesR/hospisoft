import { useState,useEffect } from "react"
import { getSessionData } from "../services/session/session.js"
import {API_URL} from '../API_URL.js'

export const Header = ()=>{
    const [toggle,setToggle] = useState(false)
    const [session,setSession] = useState({})

    const ToggleSideBar = ()=>{
        if (toggle === true) {
            document.body.classList.remove('toggle-sidebar')
            setToggle(false)
            return
        }

        document.body.classList.toggle('toggle-sidebar')
        setToggle(true)
    }

    const getSession = async()=>{
        const request = await getSessionData()
        if (request.status) {
            setSession(request.data)
            return
        }
    
        setSession({})
        console.error(request.message)
    }

    useEffect(()=>{
        getSession()
    },[])
    
    const LogOut = async()=>{
        const logOut = await fetch(API_URL + '/logout',{
            method:"POST",
            credentials:"include"
        })

        if (logOut.ok) {
            return window.location.href = "/login"
        }
    }

    return (
    <header id="header" className="header fixed-top d-flex align-items-center">

        <div className="d-flex align-items-center justify-content-between">
            <a href="/" className="logo d-flex align-items-center">
            <span className="d-none d-lg-block">NiceAdmin</span>
            </a>
            <i onClick={ToggleSideBar} className="bi bi-list toggle-sidebar-btn"></i>
        </div>

        {session && (
            <nav className="header-nav ms-auto">
                <ul className="d-flex align-items-center">
                    <li className="nav-item dropdown pe-3">

                        <a className="nav-link nav-profile d-flex align-items-center pe-0" href="#" data-bs-toggle="dropdown">
                            <span className="d-none d-md-block dropdown-toggle ps-2">
                                { session && session.name ? session.name : "?"}  { session && session.last_name ? session.last_name : "?"}
                            </span>
                        </a>

                        <ul className="dropdown-menu dropdown-menu-end dropdown-menu-arrow profile">
                            <li className="dropdown-header">
                                <h6>
                                    { session && session.name ? session.name : "?"}  { session && session.last_name ? session.last_name : "?"}
                                </h6>
                                <span>{session && session.role ? session.role.toUpperCase() : "?"}</span>
                            </li>
                            <li>
                                <hr className="dropdown-divider"></hr>
                            </li>
                            
                            <li>
                                <a className="dropdown-item d-flex align-items-center"
                                href="/perfil">
                                    <i className="bi bi-person"></i>
                                    <span>Perfil</span>
                                </a>
                            </li>

                            <li>
                                <button className="dropdown-item d-flex align-items-center"
                                onClick={LogOut}>
                                <i className="bi bi-box-arrow-right"></i>
                                <span>Cerrar sesión</span>
                                </button>
                            </li>

                            
                        </ul>
                    </li>
                </ul>
            </nav>
        )}
        

    </header>
    )
}
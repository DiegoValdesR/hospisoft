import { API_URL } from '../API_URL.js'
import { useState,useEffect } from 'react'
import { getSessionData } from "../services/session/session.js"

export const AsideBar = ()=>{
    const [session,setSession] = useState({})

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
        <>
        
        <aside id="sidebar" className="sidebar">
            
            {Object.keys(session).length > 0 && (
                <ul className="sidebar-nav" id="sidebar-nav">
                    {["admin"].includes(session.role) ? (
                        <a className="nav-link collapsed" href="/dashboard"
                        >
                            <i className="bi bi-grid"></i>
                            <span>Dashboard</span>
                        </a> 
                    ) : ""}
                       

                    <li className="nav-heading">SECCIONES</li>
                    {["admin","secretaria"].includes(session.role) && (
                        <a className="nav-link collapsed" href="/usuarios"
                        >
                            <i className="bi bi-people"></i>
                            <span>Usuarios</span>
                        </a>
                    )}
                    
                    {["admin"].includes(session.role) && (
                        <a className="nav-link collapsed" href="/empleados"
                        >
                            <i className="bi bi-person-vcard"></i>
                            <span>Empleados</span>
                        </a>
                    )}

                    {["admin","medico","farmaceutico"].includes(session.role) && (
                        <a className="nav-link collapsed" href="/medicamentos"
                        >
                            <i className="bi bi-capsule"></i>
                            <span>Medicamentos</span>
                        </a>
                    )}

                    {["admin","medico"].includes(session.role) && (
                        <a className="nav-link collapsed" href="/formulas"
                        >
                            <i className="bi bi-clipboard-pulse"></i>
                            <span>Formulas</span>
                        </a>
                    )}

                    {["admin","medico","secretaria","farmaceutico"].includes(session.role) && (
                        <a className="nav-link collapsed" href="/horarios"
                        >
                            <i className="bi bi-calendar-plus"></i>
                            <span>Horarios</span>
                        </a>
                    )}

                    {["admin","medico","secretaria"].includes(session.role) && (
                        <a className="nav-link collapsed" href="/citas"
                        >
                            <i className="bi bi-calendar-check"></i>
                            <span>Citas</span>
                        </a>
                    )}

                    {["admin","medico","usuario"].includes(session.role) && (
                        <a className="nav-link collapsed" href="/historial_medico"
                        >
                            <i className="bi bi-clipboard-plus"></i>
                            <span>Historial médico</span>
                        </a>
                    )}
                
                    <li className="nav-heading">SESIÓN</li>

                    <a className="nav-link collapsed"
                    href='/perfil'>
                            <i className="bi bi-person-circle"></i>
                            <span>Perfil</span>
                    </a>

                    <a className="nav-link collapsed"
                    role='button'
                    onClick={LogOut}>
                            <i className="bi bi-door-open"></i>
                            <span>Cerrar sesión</span>
                    </a>

                </ul>
            )}
        </aside>

        </>
    )
}
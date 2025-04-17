import { useState } from "react"
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
                <a className="nav-link collapsed" href="/users">
                    <i className="bi bi-people"></i>
                    <span>Usuarios</span>
                </a>
            </li>

        </ul>

    </aside>
    )
}
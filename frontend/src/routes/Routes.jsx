import { useState, useEffect } from "react"
import { Route, Routes, Navigate, useLocation } from "react-router-dom"

// PAGES
import { HomePage } from "../pages/home/HomePage"
import { UsersPage } from "../pages/users/usersPage"
import { WorkersPage } from '../pages/workers/WorkersPage'
import { ItemsPage } from "../pages/items/ItemsPage"
import { FormulasPage } from "../pages/formulas/FormulasPage"
import { SchedulesPage } from "../pages/schedules/SchedulesPage"
import { AppointmentsPage } from "../pages/appointments/AppointmentsPage"
import { Login } from '../pages/login/Login'
import { NotFound } from "../pages/404/NotFound"

import { API_URL } from "../API_URL.js"

export const PagesRoutes = () => {
    const [loggedIn, setLoggedIn] = useState(false)
    const location = useLocation()

    const routes = [
        "/", "/home", "/login", "/registro",
        "/usuarios", "/empleados", "/medicamentos",
        "/formulas", "/horarios", "/citas",
    ]

    const isLoggedIn = async () => {
        try {
            const response = await fetch(`${API_URL}/workers/all`, {
                credentials: "include"
            })
            if (response.ok) {
                setLoggedIn(true)
            } else {
                setLoggedIn(false)
            }
        } catch (error) {
            setLoggedIn(false)
        }
    }

    useEffect(() => {
        isLoggedIn()
    }, [location.pathname])

    return (
        <>
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/home" element={<HomePage />} />
                <Route path="/" element={<HomePage />} />
                <Route path="/usuarios" element={<UsersPage />} />
                <Route path="/empleados" element={<WorkersPage />} />
                <Route path="/medicamentos" element={<ItemsPage />} />
                <Route path="/formulas" element={<FormulasPage />} />
                <Route path="/horarios" element={<SchedulesPage />} />
                <Route path="/citas" element={<AppointmentsPage />} />
                <Route path="/404" element={<NotFound />} />
            </Routes>

            {/* Redirigir al login si no está logueado y no está en /login */}
            {!loggedIn && location.pathname !== "/login" && <Navigate to="/login" replace />}

            {/* Redirigir a 404 si la ruta no está en la lista */}
            {!routes.includes(location.pathname) && <Navigate to="/404" replace />}
        </>
    )
}

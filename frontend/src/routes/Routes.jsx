import { useState, useEffect } from "react"
import { Route, Routes, Navigate, useLocation } from "react-router-dom"
import { getSessionData } from "../services/session/session.js"

// PAGES
import { HomePage } from "../pages/home/HomePage.jsx"
import { DashboardPage } from "../pages/dashboard/DashboardPage.jsx"
import { UsersPage } from "../pages/users/usersPage"
import { WorkersPage } from '../pages/workers/WorkersPage'
import { ItemsPage } from "../pages/items/ItemsPage"
import { FormulasPage } from "../pages/formulas/FormulasPage"
import { SchedulesPage } from "../pages/schedules/SchedulesPage"
import { AppointmentsPage } from "../pages/appointments/AppointmentsPage"
import { Login } from '../pages/login/Login'
import { NotFound } from "../pages/404/NotFound"
import { Register } from "../pages/register/register.jsx"
import { HistoryPage } from "../pages/medical_history/HistoryPage.jsx"
import { ProfilePage } from "../pages/profile/ProfilePage.jsx"
import { PassRecoverPage } from "../pages/password_recover/PassRecover.jsx"
//END PAGES

import { API_URL } from "../API_URL.js"

export const PagesRoutes = () => {
    const [loggedIn, setLoggedIn] = useState(false)
    const [checkingLogin, setCheckingLogin] = useState(true)
    const [session,setSession] = useState({})
    const location = useLocation()

    const isLoggedIn = async () => {
        try {
            const response = await fetch(`${API_URL}/checklogin`, {
                method:"POST",
                credentials: "include"
            })
            if (response.ok) {
                setLoggedIn(true)
                await getSession()
            }
            
        } catch (error) {
            setLoggedIn(false)
        } finally {
            setCheckingLogin(false)
        }
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

    useEffect(() => {
        setCheckingLogin(true)
        isLoggedIn()
    }, [location.pathname])

    const publicRoutes = ["/login", Object.keys(session).length === 0 ? "/registro" : null,
        Object.keys(session).length === 0 ? "/recuperar_pass" : null
    ]

    let knownRoutes = [
        ...publicRoutes,
        session.role ? "/" : null, session  && session.role ? "/home" : null, 
        ["admin","secretaria"].includes(session.role) ? "/usuarios" : null, 
        ["admin"].includes(session.role) ? "/empleados" : null, 
        ["admin"].includes(session.role) ? "/dashboard" : null, 
        ["admin","medico","farmaceutico"].includes(session.role) ? "/medicamentos" : null,
        ["admin","medico"].includes(session.role) ? "/formulas" : null, 
        ["admin","medico","secretaria","farmaceutico"].includes(session.role) ? "/horarios" : null, 
        ["admin","medico","secretaria","usuario"].includes(session.role) ? "/citas" : null,
        ["admin","usuario","medico"].includes(session.role) ? "/historial_medico" : null,
        Object.keys(session).length > 0 ? "/perfil" : null
    ]

    knownRoutes = knownRoutes.filter(route => route)
    
    if (checkingLogin) return null

    if (!loggedIn && !publicRoutes.includes(location.pathname)) {
        return <Navigate to="/login" replace />
    }

    if (!knownRoutes.includes(location.pathname)) {
        return <Navigate to="/404" replace />
    }

    return (
        <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/404" element={<NotFound />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/" element={<HomePage />} />
            <Route path="/home" element={<HomePage />} />
            <Route path="/usuarios" element={<UsersPage session={session}/>} />
            <Route path="/empleados" element={<WorkersPage session={session}/>} />
            <Route path="/medicamentos" element={<ItemsPage session={session}/>} />
            <Route path="/formulas" element={<FormulasPage session={session}/>} />
            <Route path="/horarios" element={<SchedulesPage session={session}/>} />
            <Route path="/citas" element={<AppointmentsPage session={session}/>} />
            <Route path="/registro" element={<Register />} />
            <Route path="/historial_medico" element={<HistoryPage session={session}/>} />
            <Route path="/perfil" element={<ProfilePage session={session}/>} />
            <Route path="/recuperar_pass" element={<PassRecoverPage/>} />
        </Routes>
    )
}

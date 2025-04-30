//MAIN COMPONENTS
import { AsideBar } from "./components/Aside"
import { Footer } from "./components/Footer"
import { Header } from "./components/Header"
//PAGES
import { HomePage } from "./pages/home/HomePage"
import { UsersPage } from "./pages/users/usersPage"
import { WorkersPage } from './pages/workers/WorkersPage'
import { ItemsPage } from "./pages/items/ItemsPage"
import { FormulasPage } from "./pages/formulas/FormulasPage"
import { SchedulesPage } from "./pages/schedules/SchedulesPage"
import { AppointmentsPage } from "./pages/appointments/AppointmentsPage"
import { Login } from './pages/login/Login'; 
//REACT-ROUTER-DOM THINGS
import {Routes, Route} from 'react-router-dom'
import { useLocation } from 'react-router-dom';

//importamos idioma español
import 'moment/dist/locale/es'

function App() {
  const location = useLocation();
  return (
    <>
          {location.pathname !== "/login" && (
        <>
          <Header />
          <AsideBar />
        </>
      )}

      <Routes>
        <Route path="/" element={<HomePage />}/>
        <Route path="/login" element={<Login />} />
        <Route path="/usuarios" element={<UsersPage />}/>
        <Route path="/empleados" element={<WorkersPage />}/>
        <Route path="/medicamentos" element={<ItemsPage />}/>
        <Route path="/formulas" element={<FormulasPage />}/>
        <Route path="/horarios" element={<SchedulesPage />}/>
        <Route path="/citas" element={<AppointmentsPage />}/>
      </Routes>

      {location.pathname !== "/login" && <Footer />}
    </>
  )
}

export default App

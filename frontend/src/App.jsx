//MAIN COMPONENTS
import { AsideBar } from "./components/Aside"
import { Footer } from "./components/Footer"
import { Header } from "./components/Header"
//PAGES
import { HomePage } from "./pages/home/HomePage"
import { UsersPage } from "./pages/users/usersPage"
import { WorkersPage } from './pages/workers/WorkersPage'
import { ItemsPage } from "./pages/items/ItemsPage"
//REACT-ROUTER-DOM THINGS
import {Routes, Route} from 'react-router-dom'

function App() {

  return (
    <>
      <Header></Header>
      <AsideBar></AsideBar>

      <Routes>
        <Route path="/" element={<HomePage />}/>
        <Route path="/usuarios" element={<UsersPage />}/>
        <Route path="/empleados" element={<WorkersPage />}/>
        <Route path="/medicamentos" element={<ItemsPage />}/>
        <Route path="/formulas" element={<ItemsPage />}/>
      </Routes>
      
      <Footer></Footer>
    </>
  )
}

export default App

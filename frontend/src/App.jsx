//MAIN COMPONENTS
import { AsideBar } from "./components/Aside"
import { Footer } from "./components/Footer"
import { Header } from "./components/Header"
//PAGES
import { HomePage } from "./pages/home/HomePage"
import { UsersPage } from "./pages/users/usersPage"
//REACT-ROUTER-DOM THINGS
import {Routes, Route} from 'react-router-dom'

function App() {

  return (
    <>
      <Header></Header>
      <AsideBar></AsideBar>

      <Routes>
        <Route path="/" element={<HomePage />}/>
        <Route path="/users" element={<UsersPage />}/>
      </Routes>
      
      <Footer></Footer>
    </>
  )
}

export default App

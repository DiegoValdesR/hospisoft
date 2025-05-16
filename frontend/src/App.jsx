
//MAIN COMPONENTS
import { AsideBar } from "./components/Aside"
import { Footer } from "./components/Footer"
import { Header } from "./components/Header"
//RUTAS
import { PagesRoutes } from "./routes/Routes"
//REACT-ROUTER-DOM THINGS
import {useLocation} from 'react-router-dom'

function App() {
  
  const location = useLocation()
  
  return (
    <>
      {!["/404","/login","/registro"].includes(location.pathname) && (
        <>
          <Header />
          <AsideBar />
        </>
      )}

      <PagesRoutes></PagesRoutes>

      {!["/404","/login","/registro"].includes(location.pathname) && <Footer />}
    </>
  )
}

export default App

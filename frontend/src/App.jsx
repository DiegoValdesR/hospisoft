//MAIN COMPONENTS
import { AsideBar } from "./components/Aside"
import { Footer } from "./components/Footer"
import { Header } from "./components/Header"
//RUTAS
import { PagesRoutes } from "./routes/Routes"

//REACT-ROUTER-DOM THINGS
import {useLocation} from 'react-router-dom'

//importamos idioma español
import 'moment/dist/locale/es'

function App() {
  const location = useLocation()
  
  return (
    <>
      {location.pathname !== "/login" && location.pathname !== "/404" && (
        <>
          <Header />
          <AsideBar />
        </>
      )}

      <PagesRoutes></PagesRoutes>

      {location.pathname !== "/login" && location.pathname !== "/404" && <Footer />}
    </>
  )
}

export default App

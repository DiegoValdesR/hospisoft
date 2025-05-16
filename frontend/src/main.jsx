import { createRoot } from 'react-dom/client'
import {BrowserRouter} from 'react-router-dom'
import App from './App.jsx'

//importamos idioma español para la libreria 'moment-timezone'
import moment from 'moment-timezone'
import 'moment/dist/locale/es'
moment.tz.setDefault('America/Bogota')

/*CSS */
  //PRIME REACT CSS
  import "primereact/resources/themes/lara-light-cyan/theme.css"
  import 'primeicons/primeicons.css'
  //REACT-BIG-CALENDAR
  import 'react-big-calendar/lib/css/react-big-calendar.css'
  //CUSTOM CSS
  import './assets/css/style.css'
/*END CSS */

createRoot(document.getElementById('root')).render(
    <BrowserRouter>
            <App />
    </BrowserRouter>
)

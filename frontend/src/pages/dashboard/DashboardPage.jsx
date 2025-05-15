import { Bar } from "react-chartjs-2";
import { API_URL } from "../../API_URL"
import '../../assets/css/nice_admin/dashboard.css';
import { useState,useEffect } from "react"
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export const DashboardPage = () => {
  const pacientesData = {
    labels: ["Enero", "Febrero", "Marzo", "Abril","Mayo","Junio","Julio","Agosto","Septiembre", "Octubre", "Noviembre", "Diciembre"],
    datasets: [
      {
        label: "Pacientes atendidos - 2025",
        data: [6,1,2,1,2,3,1,2,5,2,1,3],
        backgroundColor: ["#a3e4d7", "#a3d0e4", "#a3b0e4", "#b6a3e4"],
      },
    ],
  }

  const chartOptionsPaciente = {
    responsive: true,
    plugins: {
      legend: { position: "none" },
      title: { display: false },
    },
  }

  const medicoData = {
    labels: ["Dr. Goku", "Dra. Skill Issue", "Dr. Schweisteiger"],
    datasets: [
      {
        label: "Dr. Goku",
        data: [14],
        backgroundColor: ["#bddeb4"],
      },
      {
        label: "Dra. Skill Issue",
        data: [0,6],
        backgroundColor: ["#b4ded5"],
      },
      {
        label: "Dr. Schweisteiger",
        data: [0,0,9],
        backgroundColor: ["#a3d8b9"],
      },
    ],
  }
  
  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { position: "top" },
      title: { display: false },
    },
  }
  

  const [item,setItem] = useState({})

  const getItemsAndStock = async()=>{
    try {
        const items = await fetch(API_URL + '/dash/all',{credentials:"include"})
        const itemsJSON = await items.json()
        setItem(itemsJSON.data)
        
    } catch (error) {
        console.error(error)
    }
  }

    useEffect(() => {
      getItemsAndStock()
  }, [])



  return (
    <>

    <main className="main" id="main">
        <div className="pagetitle">
          <h1>Dashboard</h1>
          <nav>
            <ol className="breadcrumb">
              <li className="breadcrumb-item">
                <a href="/">Inicio</a>
              </li>
              <li className="breadcrumb-item active">Dashboard</li>
            </ol>
          </nav>
        </div>

        {item && Object.keys(item).length > 0 ? (
          <>
          {/* Row 1: Card */}
          <div className="row mb-4">
            {/* Card: Facturación */}
            <div className="col-xxl-7 col-md-7">
              <div className="card info-card sales-card">
                <div className="card-body">
                  <h5 className="card-title">Facturación total del mes <span>| Hoy</span></h5>
                  <div className="d-flex align-items-center">
                    <div className="card-icon rounded-circle d-flex align-items-center justify-content-center bg-success text-white">
                      <i className="bi bi-cash-stack"></i>
                    </div>
                    <div className="ps-3">
                      <h6><strong>$145.400</strong></h6>
                      <span className="text-success small pt-1 fw-bold">+12%</span>
                      <span className="text-muted small pt-2 ps-1">más que ayer</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Card: Medicamento con menor stock */}
            <div className="col-xxl-5 col-md-5">
              <div className="card info-card customers-card">
                <div className="card-body">
                  <h5 className="card-title">Medicamento con menor stock <span>| Hoy</span></h5>
                  <div className="d-flex align-items-center">
                    <div className="card-icon rounded-circle d-flex align-items-center justify-content-center bg-danger text-white">
                      <i className="bi bi-capsule"></i>
                    </div>
                    <div className="ps-3">
                      <h6><strong>{item.item_name}</strong></h6>
                      <span className={`small pt-1 fw-bold ${item.item_stock < 10 ? 'text-danger ' : 'text-success'}`}>{item.item_stock} unidades</span>
                      <span className="text-muted small pt-2 ps-1">{item.item_stocl < 10 ? 'Inventario Crítico' : 'Inventario Estable' }</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Row 2: Gráficas */}
          <div className="row">
            <div className="col-md-6 mb-4">
              <div className="card">
                <div className="card-body">
                  <h5 className="card-title">
                    Pacientes atendidos al mes <span>| Hoy</span>
                  </h5>
                  <Bar data={pacientesData} options={chartOptionsPaciente} />
                </div>
              </div>
            </div>
            <div className="col-md-6 mb-4">
              <div className="card">
                <div className="card-body">
                  <h5 className="card-title">
                    Médicos con más consultas <span>| Hoy</span>
                  </h5>
                  <Bar data={medicoData} options={chartOptions} />
                </div>
              </div>
            </div>
          </div>
          </>
        ) : ""}
        
    </main>
      
    </>
   
  )
}

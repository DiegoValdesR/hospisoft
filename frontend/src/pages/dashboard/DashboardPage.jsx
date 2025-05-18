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

const [medicos, setMedicos] = useState([]);
const [item,setItem] = useState({})
const [price, setPrice] = useState({ data: 0, difference: 0 });
const [monthlyPatients, setMonthlyPatients] = useState([]);


const getTopDoctors = async () => {
  try {
    const response = await fetch(API_URL + '/dash/doctors', { credentials: "include" });
    const json = await response.json();
    setMedicos(json.data);
  } catch (error) {
    console.error(error);
  }
};

  const getItemsAndStock = async()=>{
    try {
        const items = await fetch(API_URL + '/dash/all',{credentials:"include"})
        const itemsJSON = await items.json()
        setItem(itemsJSON.data)
        
    } catch (error) {
        console.error(error)
    }
  }

const getPrice = async () => {
  try {
    const response = await fetch(API_URL + '/dash/facture', { credentials: "include" });
    const json = await response.json();
    setPrice({
      data: json.data,
      difference: parseFloat(json.difference)
    });
  } catch (error) {
    console.error(error);
  }
};

const getMonthlyPatients = async () => {
  try {
    const res = await fetch(API_URL + '/dash/patients', { credentials: "include" });
    const json = await res.json();
    setMonthlyPatients(json.data);
  } catch (error) {
    console.error(error);
  }
};


const colores = ["#bddeb4", "#b4ded5", "#a3d8b9", "#f4bfbf", "#f7d794", "#d1d8e0"];

const medicoLabels = medicos.map(m => m.doctor);

const medicoData = {
  labels: medicoLabels,
  datasets: medicos.map((medico, i) => ({
    label: medico.doctor,
    data: medicoLabels.map((_, j) => (i === j ? medico.appointments : 0)),
    backgroundColor: colores[i % colores.length],
  }))
};

  const pacientesData = {
    labels: ["Enero", "Febrero", "Marzo", "Abril","Mayo","Junio","Julio","Agosto","Septiembre", "Octubre", "Noviembre", "Diciembre"],
    datasets: [
      {
        label: "Pacientes atendidos - 2025",
        data: monthlyPatients,
        backgroundColor: "#a3e4d7"
      }
    ]
  };


  const chartOptionsPaciente = {
    responsive: true,
    plugins: {
      legend: { position: "none" },
      title: { display: false },
    },
  }

  
  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { position: "top" },
      title: { display: false },
    },
  }

    useEffect(() => {
      getItemsAndStock()
  }, [])

    useEffect(() => {
      getPrice()
  }, [])

    useEffect(() => {
      getTopDoctors();
  }, []);

  useEffect(() => {
    getMonthlyPatients();
  }, []);



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
                      <h6><strong>${price.data.toLocaleString()}</strong></h6>

                      {typeof price.difference === "number" && !isNaN(price.difference) ? (
                        <>
                          <span className={`small pt-1 fw-bold ${price.difference >= 0 ? 'text-success' : 'text-danger'}`}>
                            {price.difference}%
                          </span>
                          <span className="text-muted small pt-2 ps-1">
                            {price.difference >= 0 ? 'más que el mes pasado' : 'menos que el mes pasado'}
                          </span>
                        </>
                      ) : null}
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
                      <span className="text-muted small pt-2 ps-1">{item.item_stock < 10 ? 'Inventario Crítico' : 'Inventario Estable' }</span>
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

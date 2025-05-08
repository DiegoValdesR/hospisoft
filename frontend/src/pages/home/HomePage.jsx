import { Bar } from "react-chartjs-2";
import '../../assets/css/nice_admin/dashboard.css';
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

export const HomePage = () => {
  const pacientesData = {
    labels: ["Enero", "Febrero", "Marzo", "Abril","Mayo","Junio","Julio","Agosto","Septiembre", "Octubre", "Noviembre", "Diciembre"],
    datasets: [
      {
        label: "Pacientes atendidos",
        data: [9, 1, 2, 1],
        backgroundColor: "#0d6efd",
      },
    ],
  };

  const medicoData = {
    labels: ["Dr. Goku", "Dra. Skill Issue"],
    datasets: [
      {
        label: "Consulta",
        data: [10, 3],
        backgroundColor: "#198754",
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { position: "top" },
      title: { display: false },
    },
  };

  return (
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
            <h6><strong>Acetaminofén</strong></h6>
            <span className="text-danger small pt-1 fw-bold">7 unidades</span>
            <span className="text-muted small pt-2 ps-1">nivel crítico</span>
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
              <Bar data={pacientesData} options={chartOptions} />
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
    </main>
  );
};

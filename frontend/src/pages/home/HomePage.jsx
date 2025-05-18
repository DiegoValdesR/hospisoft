export const HomePage = () => {
  return (
    <>
      <main className="main py-4" id="main">
        <div className="container">
          {/* Card Bienvenida */}
          <div className="col-md-12 col-lg-12 mb-3">
            <div className="gradient-card p-4 card-welcome h-100 text-center">
              <div className="d-flex flex-column align-items-center">
                <div className="icon-circle mb-2">
                  <i className="bi bi-house-heart text-white opacity-100"></i>
                </div>
                <h2 className="card-title mb-2 text-white">Bienvenido a Hospisoft</h2>
                <p className="card-text px-4">Tu espacio confiable para gestionar tu salud y bienestar.</p>
              </div>
            </div>
          </div>
          
          <div className="row g-2 mt-0">
            {/* Card Agenda */}
            <div className="col-md-6 col-lg-6">
              <div className="gradient-card p-4 card-agenda h-100">
                <div className="d-flex flex-column h-100">
                  {/* <div className="icon-circle mb-3">
                    <i className="bi bi-calendar-check"></i>
                  </div> */}
                  <h2 className="card-title mb-3 text-white">Ver tus citas</h2>
                  <p className="card-text mb-4">Consulta el historial y el estado de tus citas médicas rápidamente.</p>
                  <div className="mt-auto opacity-75">
                    <a href="/citas" className="card-link text-white">
                      Ver mis citas <span className="arrow-icon">➔</span>
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Card Historial */}
            <div className="col-md-6 col-lg-6">
              <div className="gradient-card p-4 card-history h-100">
                <div className="d-flex flex-column h-100">
                  {/* <div className="icon-circle mb-3">
                    <i className="bi bi-journal-text"></i>
                  </div> */}
                  <h2 className="card-title mb-3 text-white">Historial médico</h2>
                  <p className="card-text mb-4">Revisa tu historial completo de citas médicas y resultados.</p>
                  <div className="mt-auto opacity-75">
                    <a href="/historial_medico" className="card-link text-white">
                      Ver mi historial<span className="arrow-icon">➔</span>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <style jsx>{`
          .gradient-card {
            border: none;
            border-radius: 20px;
            overflow: hidden;
            color:rgb(235, 235, 235);
            position: relative;
            transition: all 0.4s ease;
            box-shadow: 0 8px 24px rgba(0,0,0,0.08);
            backdrop-filter: blur(10px);
            background: rgba(255,255,255,0.15);
            border: 1px solid rgba(255,255,255,0.2);
          }
          
          .gradient-card::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: linear-gradient(135deg, var(--color1), var(--color2));
            opacity: 0.8;
            z-index: -1;
          }
          
          .gradient-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 12px 28px rgba(0,0,0,0.15);
          }
          
          .icon-circle {
            width: 70px;
            height: 70px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            background: rgba(255,255,255,0.2);
            backdrop-filter: blur(5px);
            font-size: 2rem;
          }
          
          .card-title {
            font-weight: 700;
            font-size: 1.8rem;
            margin-bottom: 1rem;
            text-shadow: 0 2px 4px rgba(0,0,0,0.1);
          }
          
          .card-text {
            opacity: 0.9;
            line-height: 1.7;
            margin-bottom: 1.5rem;
            font-weight: 300;
            font-size: 1.1rem;
          }
          
          .card-link {
            display: inline-flex;
            align-items: center;
            color: #505050;
            font-weight: 600;
            text-decoration: none !important;
            background: rgba(255,255,255,0.2);
            padding: 10px 20px;
            border-radius: 50px;
            backdrop-filter: blur(5px);
            transition: all 0.3s ease;
            border: 1px solid rgba(255,255,255,0.3);
          }
          
          .card-link:hover {
            background: rgba(255,255,255,0.3);
            transform: translateX(5px);
          }
          
          .arrow-icon {
            margin-left: 8px;
            transition: transform 0.3s ease;
          }
          
          .card-link:hover .arrow-icon {
            transform: translateX(5px);
          }
          
          /* Colores hechos por VictorNiby, Diego deje de ser tan rata*/
          .card-welcome {
            --color1:rgba(202, 17, 137, 0.65);
            --color2:rgba(148, 15, 101, 0.74);
          }
          
          .card-agenda {
            --color1:rgba(24, 137, 197, 0.76);
            --color2:rgba(10, 80, 117, 0.72);
          }
          
          .card-history {
            --color1:rgba(133, 182, 43, 0.83);
            --color2:rgba(100, 146, 16, 0.77);
          }
          
          /* Ajustes para los íconos */
          .bi {
            font-size: 1.8em;
          }
        `}</style>
      </main>
    </>
  );
};
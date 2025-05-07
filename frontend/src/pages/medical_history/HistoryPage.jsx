import { HistoryTable } from "./HistoryTable"
export const HistoryPage = ()=>{
    return (
        <>
        <main className="main" id="main">
            <div className="pagetitle">
                    <h1>Historial médico</h1>
                    <nav>
                        <ol className="breadcrumb">
                        <li className="breadcrumb-item"><a href="/">Inicio</a></li>
                        <li className="breadcrumb-item active">Historial médico</li>
                        </ol>
                    </nav>
            </div>

            <HistoryTable></HistoryTable>
        </main>
        </>
    )
}
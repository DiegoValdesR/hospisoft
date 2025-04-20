import { ItemsTable } from "./ItemsTable"

export const ItemsPage = ()=>{
    return(
        <main className="main" id="main">
            <div className="pagetitle">
                <h1>Medicamentos</h1>
                <nav>
                    <ol className="breadcrumb">
                    <li className="breadcrumb-item"><a href="/">Inicio</a></li>
                    <li className="breadcrumb-item active">Medicamentos</li>
                    </ol>
                </nav>
            </div>

            <ItemsTable></ItemsTable>
        </main>
       
    )
}
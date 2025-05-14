import { FormulasTable } from "./FormulasTable"

export const FormulasPage = ({session})=>{
    return(
        <main className="main" id="main">
            <div className="pagetitle">
                <h1>Formulas</h1>
                <nav>
                    <ol className="breadcrumb">
                    <li className="breadcrumb-item"><a href="/">Inicio</a></li>
                    <li className="breadcrumb-item active">Formulas</li>
                    </ol>
                </nav>
            </div>
            <FormulasTable session={session}></FormulasTable>
        </main>
       
    )
}
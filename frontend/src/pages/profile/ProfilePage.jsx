import { ProfileForm } from "./ProfileForm"

export const ProfilePage = ({session})=>{
    return (
        <>
            <main className="main" id="main">
                <div className="pagetitle">
                    <h1>Perfil</h1>
                    <nav>
                        <ol className="breadcrumb">
                        <li className="breadcrumb-item"><a href="/">Inicio</a></li>
                        <li className="breadcrumb-item active">Perfil</li>
                        </ol>
                    </nav>
                </div>

                <ProfileForm session={session}></ProfileForm>
            </main>

            
        </>
    )
    
}
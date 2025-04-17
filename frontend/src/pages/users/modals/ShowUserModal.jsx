
export const ShowUserModal = ({user})=>{
    
    return (
        <div className="modal fade" id="ShowUserModal" tabIndex="-1">
            <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content">
                    <div className="modal-header d-flex justify-content-between">
                        <h1 className="modal-title fs-5">Detalles del usuario</h1>
                        <i role="button" className="bi bi-x-circle"
                        data-bs-dismiss="modal"></i>
                    </div>
                    <div className="modal-body">
                        {console.log(user)
                        }
                        <ul className="list-group">
                            <li className="list-group-item">
                                <strong>Nombre: </strong>{user.user_name}
                            </li>
                            <li className="list-group-item">
                                <strong>Apellido: </strong>{user.user_last_name}
                            </li>
                            <li className="list-group-item">
                                <strong>Correo electrónico: </strong>{user.user_email}
                            </li>
                            <li className="list-group-item">
                                <strong>Número telefónico: </strong>{user.user_phone_number}
                            </li>
                            <li className="list-group-item">
                                <strong>Fecha de nacimiento: </strong> {user.user_birthdate}
                            </li>
                            <li className="list-group-item">
                                <strong>EPS: </strong>{user.user_eps}
                            </li>
                            <li className="list-group-item">
                                <strong>Estado: </strong>{user.user_state === "active" ? 'Activo' : 'Inactivo'}
                            </li>
                        </ul>
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
                    </div>
                </div>
            </div>
        </div>

    )
}
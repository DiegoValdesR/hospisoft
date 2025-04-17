import { useState,useEffect } from "react"
import { API_URL } from "../../API_URL.js"
import { ShowUserModal } from "./modals/ShowUserModal.jsx"
export const UsersTable = ()=>{
    const [users,setUsers] = useState([])
    const [userById,setUserById] = useState({})
    
    const GetAllUsers = async()=>{
        const allUsers = await fetch(API_URL + '/users/all').then(res => res.json())
        if (allUsers && allUsers.status === "completed") {
            setUsers(allUsers.data)
            return
        }
        
    }

    const GetUserById = async(user_id) =>{
        const user = await fetch(API_URL + '/users/byid/'+user_id).then(res => res.json())
        if (user && user.status === "completed") {
            setUserById(user.data)
            return
        }
    }

    useEffect(()=>{
        GetAllUsers()
    },[])
    
    return (
        <>
            <ShowUserModal user={userById}></ShowUserModal>
            <div className="card shadow p-2 mb-5 rounded-4">
                <div className="card-title d-flex justify-content-between">
                    <div className="ms-4">
                        <button className="btn btn-primary">
                            <i className="bi bi-plus-lg"></i>
                            <span className="p-1 text-white">
                                Nuevo
                            </span>
                        </button>
                    </div>
                </div>
                
                <div className="card-body">
                    {users.length > 0 ? 
                    (
                        <div className="table-responsive text-center">
                            <table className="table table-hover">
                                <thead>
                                    <tr>
                                        <th>NOMBRE</th>
                                        <th>APELLIDO</th>
                                        <th>ACCIONES</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {users.map(user =>{
                                        return (
                                        <tr key={user._id}>
                                            <td>{user.user_name}</td>
                                            <td>{user.user_last_name}</td>
                                            <td>
                                                <span className="p-1">
                                                    <button className="btn btn-secondary" title="Ver más detalles"
                                                    data-bs-toggle="modal" data-bs-target="#ShowUserModal"
                                                    onClick={()=>{GetUserById(user["_id"])}}>
                                                        <i className="bi bi-eye"></i>
                                                    </button>
                                                </span>

                                                <span className="p-1">
                                                    <button className="btn btn-primary" title="Editar usuario"
                                                    >
                                                        <i className="bi bi-pencil-square"></i>
                                                    </button>
                                                </span>
                                                

                                                <span className="p-1">
                                                    <button className="btn btn-danger" title="Eliminar usuario"
                                                    >
                                                        <i className="bi bi-trash3"></i>
                                                    </button>
                                                </span>
                                            </td>
                                        </tr>
                                        )
                                    })}
                                    
                                </tbody>
                            </table>
                        </div> 
                    )
                    :
                    (
                        <p className="text-center">No hay Usuarios</p>
                    )

                    }
                    
                </div>
            </div>
        </>
    )
}
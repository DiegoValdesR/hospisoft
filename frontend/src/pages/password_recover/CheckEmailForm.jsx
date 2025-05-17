import { useState } from 'react'
import { GenToken } from '../../services/tokens/tokens.js' 
import { Form } from 'react-bootstrap'
import { InputText } from 'primereact/inputtext'
import { FloatLabel } from 'primereact/floatlabel'
import { Button } from 'primereact/button'
import { ProgressBar } from 'primereact/progressbar'

import Swal from 'sweetalert2'

export const CheckEmailForm = ({setUser,setContentPage})=>{
    const [loading,setLoading] = useState(false)

    const handleSubmit = async(e)=>{
        e.preventDefault()
        const form = e.target.closest('form')
        const email = new FormData(form).get("email")

        setLoading(true)
        try {
            const request = await GenToken(email)
            
            if (!request.status) {
                throw new Error(request.message)
            }

            setUser(request.data)
            setContentPage("check_code")

        } catch (error) {
            Swal.fire({
                icon:"error",
                title:"Error",
                text:error.message
            })
        }finally{
            setLoading(false)
        }
        
    }
    
    return (
        <Form className='mb-2' onSubmit={handleSubmit}>
            <FloatLabel>
               <InputText name='email'
                id='email'
                style={{width:"100%"}} 
                disabled={loading ? true : false}
                required
                ></InputText>
                <label htmlFor="email">Correo electrónico</label>
            </FloatLabel>

            <div className='mt-2 mb-2'>
                <small style={{color:"#6c757d"}}>Ingresa tu correo electrónico para continuar con el proceso de recuperación de tu contraseña.</small>
            </div>

            {loading && (
                <ProgressBar mode="indeterminate" style={{ height: '6px'}}></ProgressBar>
            )}

            <div className='mt-4 text-center'>
                <Button className='rounded rounded-2'label='Enviar' severity='info' icon="pi pi-send" disabled={loading ? true : false} ></Button>
            </div>
        </Form>
    )
}
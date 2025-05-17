import { ValidateToken } from '../../services/tokens/tokens.js'
import { GenToken } from '../../services/tokens/tokens.js'

import { FloatLabel } from 'primereact/floatlabel'
import {InputText} from 'primereact/inputtext'
import { Button } from 'primereact/button'
import { Form } from 'react-bootstrap'
import { useState } from 'react'
import { ProgressBar } from 'primereact/progressbar'
import Swal from 'sweetalert2'
        
export const CheckCodeForm = ({user,setContentPage})=>{
    const [isLoading,setIsLoading] = useState(false)

    const handleSubmit = async(e)=>{
        e.preventDefault()
        const form = e.target.closest('form')
        const token = new FormData(form).get("token")

        setIsLoading(true)
        try {
            const request = await ValidateToken(token)
            if (!request.status) {
                throw new Error(request.message)
            }

            setContentPage("change_password")

        } catch (error) {
            Swal.fire({
                icon:"error",
                title:"Error",
                text:error.message
            })
        }finally{
            setIsLoading(false)
        }
    }

    const sendCode = async()=>{
        setIsLoading(true)
        try {
            const sendToken = await GenToken(user["email"])
            if (!sendToken.status) {
                throw new Error(sendToken.message)
            }
        } catch (error) {
            Swal.fire({
                title:"Error",
                icon:"error",
                text:error.message
            })
        }finally{
            setIsLoading(false)
        }
    }


    return (
        <>
            <div className='mt-2 mb-4'>
                <p style={{color:"#333333"}}>
                    Hemos enviado el código de recuperación a tu correo, para continuar, debes escribirlo aquí 
                    (si por algún motivo no te llegó, puedes clickear <a role='button' onClick={sendCode} className='link-primary'>aquí</a> para solicitar un reenvío).
                </p>
            </div>

            {isLoading && (
                <ProgressBar mode="indeterminate" style={{ height: '6px'}}></ProgressBar>
            )}

            <Form style={{marginTop:"40px"}} onSubmit={handleSubmit}>
                <FloatLabel>
                    <InputText name='token'
                        id='token'
                        style={{width:"100%"}} 
                        disabled={isLoading ? true : false}
                        required
                        minLength={6}
                        maxLength={6}
                    ></InputText>
                    <label htmlFor="token">Código de recuperación</label>
                </FloatLabel>

                <div className='mt-4 text-center'>
                    <Button className='rounded rounded-2'label='Enviar' severity='info' icon="pi pi-send" disabled={isLoading ? true : false} ></Button>
                </div>

                
            </Form>            
        </>
    )
}
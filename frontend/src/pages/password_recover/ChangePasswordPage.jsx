import { useState } from 'react'

import { Form } from 'react-bootstrap'

import { RecoverPassword } from '../../services/session/session.js'

import { InputText } from 'primereact/inputtext'
import { FloatLabel } from 'primereact/floatlabel'
import { Button } from 'primereact/button'
import { ProgressBar } from 'primereact/progressbar'

import Swal from 'sweetalert2'

export const ChangePasswordPage = ({user})=>{
    const [isLoading,setIsLoading] = useState(false)
    const [showPassword,setShowPassword] = useState(false)
    const [showConfirmPassword,setShowConfirmPassword] = useState(false)

    const handleSubmit = async(e)=>{
        e.preventDefault()
        setIsLoading(true)
        const form = e.target.closest('form')
        const password = new FormData(form).get("new_password")
        const confirm_password = new FormData(form).get("confirm_password")

        try {
            const request = await RecoverPassword(password,confirm_password,user["email"])
            
            if(!request.status) {
                throw new Error(request.message)
            }
            
            Swal.fire({
                title:"Completado",
                icon:"success",
                text:request.message,
                allowEscapeKey:false,
                allowOutsideClick:false
            }).then((res)=>{
                if (res.isConfirmed) {
                    window.location.href = "/login"
                }
            })

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
        <Form className='mb-2' onSubmit={handleSubmit}>
            <FloatLabel>
                <div style={{position:"relative"}}>
                    <InputText name='new_password'
                    id='new_password'
                    type={showPassword ? "text" : "password"}
                    style={{width:"100%"}} 
                    disabled={isLoading ? true : false}
                    minLength={6}
                    required
                    ></InputText>

                    <div
                        onClick={()=>{
                            setShowPassword(showPassword ? false : true)
                        }}
                        style={{
                        position: 'absolute',
                        top: '0',
                        right: '15px',
                        height: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        cursor: 'pointer',
                        color: '#6c757d',
                        }}
                    >
                        <i className={`pi ${showPassword ? 'pi-eye-slash' : 'pi-eye'}`}></i>
                    </div>
                </div>
                <label htmlFor="new_password">Nueva contraseña</label>
            </FloatLabel>

            <div className='mt-2 mb-5'>
                <small style={{color:"#6c757d"}}>Debe contener al menos 6 carácteres.</small>
            </div>

            <FloatLabel className='mb-3'>
                <div style={{position:"relative"}}>
                    <InputText name='confirm_password'
                    id='confirm_password'
                    type={showConfirmPassword ? "text" : "password"}
                    style={{width:"100%"}} 
                    disabled={isLoading ? true : false}
                    minLength={6}
                    required
                    ></InputText>

                    <div
                        onClick={()=>{
                            setShowConfirmPassword(showConfirmPassword ? false : true)
                        }}
                        style={{
                        position: 'absolute',
                        top: '0',
                        right: '15px',
                        height: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        cursor: 'pointer',
                        color: '#6c757d',
                        }}
                    >
                        <i className={`pi ${showConfirmPassword ? 'pi-eye-slash' : 'pi-eye'}`}></i>
                    </div>
                </div>
                <label htmlFor="confirm_password">Confirmar contraseña</label>
            </FloatLabel>

            {isLoading && (
                <ProgressBar mode="indeterminate" style={{ height: '6px'}}></ProgressBar>
            )}

            <div className='mt-4 text-center'>
                <Button className='rounded rounded-2'label='Enviar' severity='info' icon="pi pi-send" disabled={isLoading ? true : false} ></Button>
            </div>
        </Form>
    )
}
import { useState } from 'react'
import { Col, Row } from 'react-bootstrap'
import { CheckEmailForm } from './CheckEmailForm'
import { CheckCodeForm } from './CheckCodeForm'
import { ChangePasswordPage } from './ChangePasswordPage'

export const PassRecoverPage = ()=>{
    const [user,setUser] = useState({})

    const [contentPage,setContentPage] = useState("check_email")
    
    const lockImg = new URL('../../../public/lock.png',import.meta.url).href

    const getContentPage = ()=>{
        switch (contentPage) {
            case "check_email":
                return <CheckEmailForm setUser={setUser} setContentPage={setContentPage}/>
            case "check_code":
                return <CheckCodeForm user={user} setContentPage={setContentPage}/>
            case "change_password":
                return <ChangePasswordPage user={user}/>
            default:
                break
        }
    }
    
    return (
        <div style={{
            minHeight: '100vh',
            background: 'linear-gradient(135deg, #dbeafe 0%, #ffffff 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px'
        }}>
            <main style={{
                width:"50%",
                backgroundColor:"#FFFFFF"
            }} className='rounded rounded-3 p-4 shadow recover-password-container'>
                <Row className='mb-3'>
                    <h2 className='text-center'>Recuperar contraseña</h2>
                </Row>

                <Row className='text-center text-black mb-5'
                >
                    <Col>
                        <img src={lockImg} alt="Imágen de un candado" className='img-fluid' width="150px"/>
                    </Col>
                </Row>

                {getContentPage()}

            </main>
        </div>
    )
}
import { Modal } from "react-bootstrap"

const handleHide = ()=>{
    
}

const NewHistoryModal = ()=>{
    return (
        <Modal>
            <Modal.Header>
                <Modal.Title>Nueva historial médico</Modal.Title>
                <i role="button" className="text-danger fs-4 bi bi-x-circle"
                onClick={handleHide}></i>
            </Modal.Header>
            <Modal.Body>

            </Modal.Body>
        </Modal>
    )
}
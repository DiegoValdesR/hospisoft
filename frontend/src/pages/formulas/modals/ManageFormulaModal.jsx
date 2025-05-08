import { useState, useEffect, useMemo } from "react";
import Swal from "sweetalert2";
import { API_URL } from "../../../API_URL.js";
import { Modal, Button, ModalBody, ModalHeader, Form, Row, Col, InputGroup, Badge } from 'react-bootstrap';

export const ManageFormulaModal = ({ modalData, setModalData, getAllFormulas }) => {
    const [users, setUsers] = useState([]);
    const [doctors, setDoctors] = useState([]);
    const [items, setItems] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedItems, setSelectedItems] = useState([]);
    const [searchResults, setSearchResults] = useState([]);
    const [showResults, setShowResults] = useState(false);

    // Filtrar medicamentos basados en el término de búsqueda
    useEffect(() => {
        if (searchTerm.length > 0) {
            const results = items.filter(item =>
                item.item_name.toLowerCase().includes(searchTerm.toLowerCase())
            );
            setSearchResults(results);
            setShowResults(true);
        } else {
            setSearchResults([]);
            setShowResults(false);
        }
    }, [searchTerm, items]);

    const getUsers = async () => {
        const allUsers = await fetch(API_URL + '/users/all',{credentials: 'include'})
            .catch((err) => { if (err) console.error(err) });

        const usersJSON = await allUsers.json();
        if (usersJSON && usersJSON.status === "completed") {
            setUsers(usersJSON.data);
        }
    };

    const getDoctors = async () => {
        const allDoctors = await fetch(API_URL + '/workers/alldoctors',{credentials: 'include'})
            .catch((err) => { if (err) console.error(err) });

        const doctorsJSON = await allDoctors.json();
        if (doctorsJSON && doctorsJSON.status === "completed") {
            setDoctors(doctorsJSON.data);
        }
    };

    const getItems = async () => {
        const arrayItems = [];
        const allItems = await fetch(API_URL + '/items/all',{credentials: 'include'})
            .catch((err) => { if (err) console.error(err) });

        const itemsJSON = await allItems.json();
        if (itemsJSON && itemsJSON.status === "completed") {
            for (const object of itemsJSON.data) {
                if (object.item_stock > 0) {
                    arrayItems.push(object);
                }
            }
        }
        setItems(arrayItems);
    };

    const handleAddItem = (item) => {
        // Verificar si el item ya fue agregado
        if (!selectedItems.some(selected => selected.item_id === item._id)) {
            setSelectedItems([...selectedItems, {
                item_id: item._id,
                item_name: item.item_name,
                amount: 1,
                posology: ""
            }]);
        }
        setSearchTerm("");
        setShowResults(false);
    };

    const handleRemoveItem = (itemId) => {
        setSelectedItems(selectedItems.filter(item => item.item_id !== itemId));
    };

    const handleAmountChange = (itemId, value) => {
        setSelectedItems(selectedItems.map(item => 
            item.item_id === itemId ? { ...item, amount: value } : item
        ))
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (selectedItems.length === 0) {
            Swal.fire({
                title: "Error",
                icon: 'error',
                text: "Debe seleccionar al menos un medicamento."
            });
            return;
        }

        // Validar cantidades
        for (const item of selectedItems) {
            if (isNaN(item.amount)) {
                Swal.fire({
                    title: "Error",
                    icon: 'error',
                    text: `La cantidad para ${item.item_name} no es válida.`
                });
                return;
            }
        }

        const form = e.target.closest('form');
        const formData = new FormData(form);
        
        const data = {
            patient_id: formData.get("paciente"),
            doctor_id: formData.get("medico"),
            items: selectedItems.map(item => ({
                item_id: item.item_id,
                item_amount: item.amount,
                posology: item.posology
            })),
            posology: formData.get("posology")
        };
        
        Swal.fire({
            title: "Procesando información...",
            allowEscapeKey:false,
            allowOutsideClick:false,
            didOpen: () => {
                Swal.isLoading()
            }
        })

        const insert = await fetch(API_URL + `/formulas/new`, {
            method: "POST",
            credentials: 'include',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        })

        if (!insert.ok) {
            Swal.close()
            Swal.fire({
                
            })
        }

        const insertJSON = await insert.json()
        Swal.close()

        if (insertJSON) {
            if (insertJSON.status === "completed") {
                await getAllFormulas();
                handleHide();
            }

            Swal.fire({
                title: insertJSON.status === "completed" ? 'Completado' : "Error",
                icon: insertJSON.status === "completed" ? 'success' : "error",
                text: insertJSON.message
            });
        }
    }

    const handleHide = () => {
        setModalData(false);
        setSelectedItems([]);
        setSearchTerm("");
    };

    useEffect(() => {
        getUsers();
        getDoctors();
        getItems();
    }, []);

    return (
        <Modal centered className="fade" show={modalData} size="lg">
            <ModalHeader className="d-flex flex-row justify-content-between">
                <Modal.Title>
                    Nueva fórmula
                </Modal.Title>
                <i role="button" className="text-danger fs-4 bi bi-x-circle"
                    onClick={handleHide}></i>
            </ModalHeader>
            <ModalBody>
                <Form onSubmit={handleSubmit}>
                    <Row className="mb-3">
                        <Col md={6}>
                            <Form.Group>
                                <Form.Label className="text-black">Paciente</Form.Label>
                                <Form.Select name="paciente" defaultValue={""} required>
                                    <option value="">Seleccione un paciente</option>
                                    {users.map((user) => {
                                        return (
                                            <option key={user["_id"]} value={user["_id"]}>
                                                {user.user_name} {user.user_last_name}
                                            </option>
                                        );
                                    })}
                                </Form.Select>
                            </Form.Group>
                        </Col>
                        <Col md={6}>
                            <Form.Group>
                                <Form.Label className="text-black">Médico encargado</Form.Label>
                                <Form.Select name="medico" defaultValue={""} required>
                                    <option value="">Seleccione el médico encargado</option>
                                    {doctors.map((doctor) => {
                                        return (
                                            <option key={doctor["_id"]} value={doctor["_id"]}>
                                                {doctor.worker_name} {doctor.worker_last_name}
                                            </option>
                                        );
                                    })}
                                </Form.Select>
                            </Form.Group>
                        </Col>
                    </Row>

                    <Form.Group className="mb-3">
                        <Form.Label className="text-black">Agregar medicamentos</Form.Label>
                        <div className="position-relative">
                            <InputGroup>
                                <Form.Control
                                    type="text"
                                    placeholder="Buscar medicamento..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    onFocus={() => searchTerm.length > 0 && setShowResults(true)}
                                />
                                <InputGroup.Text>
                                    <i className="bi bi-search"></i>
                                </InputGroup.Text>
                            </InputGroup>
                            
                            {showResults && (
                                <div className="position-absolute w-100 bg-white shadow-sm rounded mt-1"
                                    style={{ zIndex: 1000, maxHeight: '200px', overflowY: 'auto' }}>
                                    {searchResults.length > 0 ? (
                                        searchResults.map((item) => (
                                            <div key={item._id} 
                                                className="p-2 border-bottom hover-pointer hover-bg-light"
                                                onClick={() => handleAddItem(item)}>
                                                {item.item_name}
                                                <small className="text-muted d-block">Disponible: {item.item_stock}</small>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="p-2 text-muted">No se encontraron resultados</div>
                                    )}
                                </div>
                            )}
                        </div>
                    </Form.Group>

                    {selectedItems.length > 0 ? (
                        <div className="mb-3">
                            <h6 className="text-black">Medicamentos seleccionados</h6>
                            {selectedItems.map((item) => (
                                <div key={item.item_id} className="mb-2 p-2 border rounded">
                                    <div className="d-flex justify-content-between align-items-center mb-2">
                                        <Badge bg="primary" className="me-2">
                                            {item.item_name}
                                            <i className="bi bi-x ms-2" 
                                                onClick={() => handleRemoveItem(item.item_id)}
                                                style={{ cursor: 'pointer' }}></i>
                                        </Badge>
                                        <div className="d-flex align-items-center">
                                            <Form.Control
                                                type="number"
                                                placeholder="Cantidad"
                                                min="1"
                                                value={item.amount}
                                                onChange={(e) => handleAmountChange(item.item_id, e.target.value)}
                                                style={{ width: '80px', marginRight: '10px' }}
                                            />
                                            <span className="text-muted small">Disponible: {
                                                items.find(i => i._id === item.item_id)?.item_stock || 'N/A'
                                            }</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="mb-3 text-center p-3 bg-light rounded">
                            <p className="text-muted">No hay medicamentos seleccionados</p>
                            <small>Busque y seleccione medicamentos para agregarlos</small>
                        </div>
                    )}

                    <Row className="mb-3">
                        <Form.Group>
                            <Form.Label className="text-black">Posología</Form.Label>
                            <Form.Control 
                                as={"textarea"} 
                                name="posology" 
                                rows={3}
                                placeholder="Instrucciones generales para todos los medicamentos"
                            ></Form.Control>
                        </Form.Group>
                    </Row>

                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleHide}>Cerrar</Button>
                        <Button type="submit" variant="primary"
                            disabled={users.length > 0 && doctors.length > 0 ? false : true}>
                            Enviar
                        </Button>
                    </Modal.Footer>
                </Form>
            </ModalBody>
        </Modal>
    );
};
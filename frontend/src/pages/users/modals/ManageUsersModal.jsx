import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import { API_URL } from "../../../API_URL.js";
import {Modal,Button,ModalBody,ModalHeader,Form,Row,Col} from "react-bootstrap";
/**
 * @param modalData Variable bool que maneja si se muestra o no la modal
 * @param setModalData Funcion que cambia de true a false y viceversa la variable 'showModal'
 * @param userId self explanatory
 * @param setUserId Método de 'UsersTable' que cambia el id del usuario, lo uso para cuando cierro la modal
 * @param setUsers Método de 'UsersTable', la uso
 * para volver a cargar la tabla con los nuevos cambios
 */
export const ManageUsersModal = ({
  modalData,
  setModalData,
  userId = "",
  setUserId,
  setUsers,
}) => {
  const [userById, setUserById] = useState({});
  const [birthdate, setBirthdate] = useState(userId !== "" ? new Date(userById.user_birthdate) : null);

  const GetUserById = async () => {
    Swal.fire({
      title: "Cargando usuario...",
      didOpen: () => {
        Swal.showLoading();
      },
    });

    const user = await fetch(API_URL + "/users/byid/" + userId,{credentials: 'include'}).then((res) =>
      res.json()
    );
    if (user && user.status === "completed") {
      setUserById(user.data);
      setModalData(true);
      Swal.close();
    }
  };

  const handleHide = () => {
    setModalData(false);
    setUserId("");
  };

  useEffect(() => {
    if (userId.length === 24) {
      GetUserById();
    }
  }, [userId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = e.target.closest("form");
    const formData = new FormData(form);

    const data = {
      user_document:formData.get("user_document"),
      user_name: formData.get("user_name"),
      user_last_name: formData.get("user_last_name"),
      user_email: formData.get("user_email"),
      user_password: formData.get("user_password"),
      user_phone_number: formData.get("user_phone_number"),
      user_birthdate: formData.get("user_birthdate"),
      user_eps: formData.get("user_eps"),
    };

    switch (userId.length) {
      case 0:
        Swal.fire({
          title: "Procesando información...",
          didOpen: () => {
            Swal.showLoading();
          },
        });
        const insert = await fetch(API_URL + `/users/new`, {
          method: "POST",
          credentials: 'include',
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        });
        const insertJSON = await insert.json();
        Swal.close();

        if (insertJSON) {
          Swal.fire({
            title: insertJSON.status === "completed" ? "Completado" : "Error",
            icon: insertJSON.status === "completed" ? "success" : "error",
            text: insertJSON.message,
          });

          if (insertJSON.status === "completed") {
            const allUsers = await fetch(API_URL + "/users/all",{credentials: 'include'}).then((res) =>
              res.json()
            );
            if (allUsers && allUsers.status === "completed") {
              setUsers(allUsers.data);
              handleHide();
              return;
            }
          }
        }
        break;

      case 24:
        delete data.user_document
        delete data.user_password
        delete data.user_birthdate

        Swal.fire({
          title: "Procesando información...",
          didOpen: () => {
            Swal.showLoading();
          },
        });
        const update = await fetch(API_URL + `/users/update/${userId}`, {
          method: "PUT",
          credentials: 'include',
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        });
        const updateJSON = await update.json();
        Swal.close();

        if (updateJSON) {
          Swal.fire({
            title: updateJSON.status === "completed" ? "Completado" : "Error",
            icon: updateJSON.status === "completed" ? "success" : "error",
            text: updateJSON.message,
          });

          if (updateJSON.status === "completed") {
            const allUsers = await fetch(API_URL + "/users/all",{credentials: 'include'}).then((res) =>
              res.json()
            );
            if (allUsers && allUsers.status === "completed") {
              setUsers(allUsers.data);
              handleHide();
              return;
            }
          }
        }
        break;

      default:
        Swal.fire({
          title: "Error",
          icon: "error",
          text: "Ocurrió un error, intentelo más tarde",
          showCancelButton: false,
          showConfirmButton: false,
          timer: 3000,
        });
        break;
    }
  };

  return (
    <Modal centered className="fade" onHide={handleHide} show={modalData} size="xl">
      <ModalHeader className="d-flex flex-row justify-content-between">
        <Modal.Title>
          {userId === "" ? "Insertar" : "Actualizar"} usuario
        </Modal.Title>
        <i
          role="button"
          className="text-danger fs-4 bi bi-x-circle"
          onClick={handleHide}
        ></i>
      </ModalHeader>
      <ModalBody>
        <Form onSubmit={handleSubmit} id="userForm">
          
          {userId === "" ? (
            <Row className="mb-3">
              <Col>
              <Form.Label className="text-black">Número de documento</Form.Label>
              <Form.Control
              type="number"
              minLength={10}
              maxLength={10}
              required
              name="user_document"></Form.Control>
              </Col>
            </Row>
          ) : ""}
          

          <Row className="mb-3">
            <Col>
            <Form.Group>
              <Form.Label className="text-dark">Nombre(s)</Form.Label>
              <Form.Control
                required
                name="user_name"
                type="text"
                placeholder="Ej: Hannah"
                defaultValue={userId !== "" ? userById.user_name : ""}
              ></Form.Control>
            </Form.Group>
            </Col>

            <Col>
            <Form.Group>
              <Form.Label className="text-dark">Apellidos</Form.Label>
              <Form.Control
                required
                name="user_last_name"
                type="text"
                placeholder="Ej: Montana"
                defaultValue={userId !== "" ? userById.user_last_name : ""}
              ></Form.Control>
            </Form.Group>
            </Col>

          </Row>

          <Row className="mb-3">
            <Form.Group>
              <Form.Label className="text-dark">Correo del usuario</Form.Label>
              <Form.Control
                required
                name="user_email"
                type="email"
                placeholder="Ej: example@gmail.com"
                defaultValue={userId !== "" ? userById.user_email : ""}
              ></Form.Control>
            </Form.Group>
          </Row>

          {userId.length === 0 ? (
            <Row className="mb-3">
              <Form.Group>
                <Form.Label className="text-dark">Contraseña</Form.Label>
                <Form.Control
                  required
                  minLength={6}
                  name="user_password"
                  type="password"
                ></Form.Control>
                <small className="mt-2">Debe tener al menos 6 digitos.</small>
              </Form.Group>
            </Row>
          ) : (
            ""
          )}

          {userId.length === 0 ? (
            <Row className="mb-3">
              <Form.Group>
                  <Form.Label className="text-dark">Fecha de nacimiento</Form.Label>
                  <Form.Control
                  required
                  name="user_birthdate"
                  type="date"
                  ></Form.Control>
              </Form.Group>
            </Row>
          ) : (
            ""
          )}

          <Row className="mb-3">
            <Form.Group>
                <Form.Label className="text-dark">Número telefónico</Form.Label>
                <Form.Control
                  required
                  name="user_phone_number"
                  type="text"
                  minLength={10}
                  maxLength={10}
                  placeholder="Ej: 3108948..."
                  defaultValue={userId !== "" ? userById.user_phone_number : ""}
                ></Form.Control>
            </Form.Group>
          </Row>

          <Row className="mb-3">
          <Form.Group>
            <Form.Label className="text-dark">EPS</Form.Label>
            <Form.Control
                as="select"
                required
                name="user_eps"
                defaultValue={userId !== "" ? userById.user_eps : ""}>
                <option value="">Selecciona una EPS</option>
                {[
                "Nueva EPS", "Sanitas", "Sura", "Salud Total", "Coosalud", "Famisanar", "Mutual Ser",
                "Compensar", "Emssanar", "Savia Salud", "Asmet Salud", "Cajacopi", "Capital Salud",
                "Servicio Occidental de Salud", "Asociación Indígena del Cauca", "Mallamás",
                "Comfenalco Valle", "Aliansalud", "Anaswayuu", "Familiar de Colombia", "Dusakawi",
                "Comfaoriente", "Capresoca", "Comfachocó", "Pijaos", "Salud Mía", "Salud Bolívar"
                ].map((eps) => (
                <option key={eps} value={eps}>
                    {eps}
                </option>
                ))}
            </Form.Control>
            </Form.Group>

          </Row>

          <Modal.Footer>
            <Button variant="secondary" onClick={handleHide}>
              Cerrar
            </Button>
            <Button type="submit" variant="primary">
              Enviar
            </Button>
          </Modal.Footer>
        </Form>
      </ModalBody>
    </Modal>
  );
};

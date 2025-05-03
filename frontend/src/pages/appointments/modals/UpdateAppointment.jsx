import { useState, useEffect } from "react"
import { Modal, Button, Col, Form, Row } from "react-bootstrap"
import moment from "moment-timezone"
import { API_URL } from "../../../API_URL.js"
import Swal from "sweetalert2"
import { updateAppointment } from "../../../services/appointments/appointments.js"

export const UpdateAppointment = ({showUpdate,setShowUpdate,appointmentData,setAppointmentData,getEvents}) => {
  const [patients, setPatients] = useState([])
  const [doctors, setDoctors] = useState([])

  const getPatients = async () => {
    try {
      const patients = await fetch(API_URL + "/users/all", { credentials: "include" })
      const patiensJSON = await patients.json()
      setPatients(patiensJSON.data)
    } catch (error) {
      console.error(error)
    }
  }

  const getDoctors = async () => {
    try {
      const doctors = await fetch(API_URL + "/workers/alldoctors", { credentials: "include" })
      const doctorsJSON = await doctors.json()
      setDoctors(doctorsJSON.data)
    } catch (error) {
      console.error(error)
    }
  }

  const handleHide = () => {
    setShowUpdate(false)
    setAppointmentData({})
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      Swal.fire({
        title: "Procesando...",
        didOpen: () => {
          Swal.showLoading()
        }
      })

      const form = e.target.closest("form")
      const formData = new FormData(form)

      const startDate = `${formData.get("date")}T${formData.get("hour_start")}`
      const endDate = `${formData.get("date")}T${formData.get("hour_end")}`

      const data = {
        start_date: startDate,
        end_date: endDate,
        patient_id: formData.get("patient_id"),
        doctor_id: formData.get("doctor_id")
      }

      const update = await updateAppointment(appointmentData["_id"], data)
      if (!update.status) {
        throw new Error(update.message)
      }

      Swal.close()

      await getEvents()
      handleHide()

      Swal.fire({
        title: "Completado",
        icon: "success",
        text: update.message
      })
    } catch (error) {
      Swal.close()
      Swal.fire({
        title: "Error",
        icon: "error",
        text: error.message
      })
    }
  }

  useEffect(() => {
    getPatients(), getDoctors()
  },[])

  return (
    <>
      <Modal centered show={showUpdate} onHide={handleHide} className="fade modal-lg">
        <Modal.Header className="d-flex flex-row justify-content-between">
          <Modal.Title>Actualizar cita</Modal.Title>
          <i role="button" className="text-danger fs-4 bi bi-x-circle" onClick={handleHide}></i>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Row className="mb-3">
              <Form.Group>
                <Form.Label className="text-black">Fecha</Form.Label>
                <Form.Control
                  type="date"
                  required
                  name="date"
                  defaultValue={moment.utc(appointmentData.start_date).format("YYYY-MM-DD")}
                ></Form.Control>
              </Form.Group>
            </Row>

            <Row className="mb-3">
              <Col>
                <Form.Group>
                  <Form.Label className="text-black">Hora de inicio</Form.Label>
                  <Form.Control
                    type="time"
                    required
                    name="hour_start"
                    defaultValue={appointmentData.hour_start}
                  ></Form.Control>
                </Form.Group>
              </Col>
              <Col>
                <Form.Group>
                  <Form.Label className="text-black">Hora de finalización</Form.Label>
                  <Form.Control
                    type="time"
                    required
                    name="hour_end"
                    defaultValue={appointmentData.hour_end}
                  ></Form.Control>
                </Form.Group>
              </Col>
            </Row>

            <Row className="mb-3">
              <Form.Group>
                <Form.Label className="text-black">Paciente</Form.Label>
                <Form.Select required name="patient_id" defaultValue={appointmentData.patient_id}>
                  <option value="">Selecciona un paciente</option>
                  {patients.map((patient) => {
                    return (
                      <option key={patient["_id"]} value={patient["_id"]}>
                        {patient.user_name} {patient.user_last_name}
                      </option>
                    )
                  })}
                </Form.Select>
              </Form.Group>
            </Row>

            <Row className="mb-3">
              <Form.Group>
                <Form.Label className="text-black">Médico</Form.Label>
                <Form.Select required name="doctor_id" defaultValue={appointmentData.doctor_id}>
                  <option value="">Selecciona un médico</option>
                  {doctors.map((doctor) => {
                    return (
                      <option key={doctor["_id"]} value={doctor["_id"]}>
                        {doctor.worker_name} {doctor.worker_last_name}
                      </option>
                    )
                  })}
                </Form.Select>
              </Form.Group>
            </Row>

            <Modal.Footer>
              <Button variant="secondary" onClick={handleHide}>
                Cancelar
              </Button>
              <Button type="submit" variant="primary">
                Aceptar
              </Button>
            </Modal.Footer>
          </Form>
        </Modal.Body>
      </Modal>
    </>
  )
}

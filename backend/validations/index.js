import { IsDateValid } from "./validateDate.js"
import { IsHourValid } from "./validateHour.js"
import { HasCorrectStock } from "./validateStock.js"
import { validateAppointment } from "./validateAppointment.js"
/*
* Exportamos todas las validaciones como un solo modulo
*/
export const Validations = {
    IsDateValid,
    IsHourValid,
    HasCorrectStock,
    validateAppointment
}
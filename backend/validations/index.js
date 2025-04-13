import { IsIdValid } from "./validateId.js"
import { HasRequiredValues } from "./requiredValues.js"
import { HasCorrectTypes } from "./validateTypes.js"
import { HasMinValue } from "./validateMinValue.js"
import { IsValidDate } from "./validateDate.js"
import { IsValidArray } from "./validateArray.js"
import { HasCorrectStock } from "./validateStock.js"
import { IsFormulaValid } from "./validateFormula/validateFormula.js"
import { IsConsecutiveValid } from "./validateDetails/validateDetails.js"
import { IsAppointmentValid } from "./validateAppointments/validateAppointments.js"
import { IsRequestValid } from "./requestValidation.js"

//exportamos todas las validaciones como un solo modulo
export const Validations = {
    IsIdValid,
    HasRequiredValues,
    HasCorrectTypes,
    HasMinValue,
    IsValidDate,
    IsValidArray,
    HasCorrectStock,
    IsFormulaValid,
    IsConsecutiveValid,
    IsAppointmentValid,
    IsRequestValid
}
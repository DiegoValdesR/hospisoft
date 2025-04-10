import { IsIdValid } from "./validID.js"
import { HasRequiredValues } from "./requiredValues.js"
import { HasCorrectTypes } from "./ValidTypes.js"
import { HasMinValue } from "./minValue.js"
import { IsValidDate } from "./validDate.js"
import { IsValidArray } from "./validArray.js"
import { IsRequestValid } from "./requestValidation.js"

//exportamos todas las validaciones como un solo modulo
export const Validations = {
    IsIdValid,
    HasRequiredValues,
    HasCorrectTypes,
    HasMinValue,
    IsValidDate,
    IsValidArray,
    IsRequestValid
}
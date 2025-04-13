import { FormulaModel } from "../../models/formula/formula.js";
import { Validations } from "../index.js";
export const IsConsecutiveValid = async(consecutive)=>{
    let response = {}
    if (!await Validations.IsIdValid(consecutive,FormulaModel)) {
        response = {
            type:"Error de id",
            message:"No se encontró una formula asociada a ese consecutivo."
        }
    }

    return response
}
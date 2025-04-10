import { Middleware as Errors} from "../middleware/middleware.js"

export const IsRequestValid = (schema,requestBody)=>{
    let response = []

    if (Errors(schema,requestBody).length > 0) response = Errors(schema,requestBody)

    return response
}


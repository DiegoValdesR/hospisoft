import { Middleware as Errors} from "../middleware/middleware.js"

export const IsRequestValid = async(schema,model,requestBody)=>{
    let response = []

    const requestErrors = await Errors(schema,model,requestBody)
    if (requestErrors.length > 0) {
        response = requestErrors
    }

    return response
}


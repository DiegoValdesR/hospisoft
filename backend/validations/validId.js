export const IsIdValid = async(id,model)=>{
    //verificamos que si es un id valido
    if (!id || id.length !== 24 || typeof id !== "string") {
        return false
    }

    let findOne = {}
    findOne = await model.findOne({"_id":id})
    
    //verificamos que si existe ese id
    if (!findOne) {
        return false
    }

    return true
}
const HasEmptyValues = (objectData)=>{
    //revisamos si el objeto tiene campos vacios 
    for (const key in objectData) {
        if (objectData[key] === "" || !objectData[key]) {
            return true
        }        
    }
    return false
}

const IdExists = async(id,model)=>{
    //hacemos una consulta que nos traiga un registro asociado a un id especifico,
    //si retorna null ingresó un id que no esta registrado
    let findOne = {}
    findOne = await model.findOne({"_id":id})
    if (!findOne) {
        return false
    }
    return true
}

const IsCorrectType = (objectData,objectTypes)=>{
    for (const key in objectData) {
        if (typeof objectData[key] !== objectTypes[key]) {
            return false
        }
    }

    return true
}


export const Validations = {
    HasEmptyValues,
    IdExists,
    IsCorrectType
}


export const HasCorrectStock = async(idItem,amount,model)=>{
    const findAll = await model.find({"_id":idItem})
    return true
}
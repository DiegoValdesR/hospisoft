import { DetailsModel, DetailSchema } from "../../models/detailsFormula/details.js";
import { Validations } from "../../validations/validate.js";

const AllFormulas = async(req,res) =>{
    try {
        const find = await DetailsModel.find()
        return res.status(200).send({
            data:find
        })
    } catch (error) {
        return res.status(500).send({
            message:"Error interno del servidor, por favor intentelo más tarde."
        })
    }
}

const FormulaById = async(req,res) =>{
    const {id} = req.params

    if (!id || id.length !== 24) {
        return res.status(400).send({
            message:"No se envío el id, o el enviado es incorrecto."
        })
    }

    if (!Validations.IdExists(id,DetailSchema)) {
        return res.status(404).send({
            message:"No se encontró la formula asociada al id enviado."
        })
    }

    try {
        const findOne = await DetailsModel.findOne({"_id":id})

        return res.status(200).send({
            data:findOne
        })
    } catch (error) {
        return res.status(500).send({
            message:"Error interno del servidor, por favor intentelo más tarde."
        })
    }
}

const InsertFormula = async(req,res)=>{
    const {
        details_posology,
        details_consecutive,
        item 
    } = req.body


    const data = {
        details_posology:details_posology,
        details_consecutive:details_consecutive,
        item:item
    }

    const validation = Validations.IsObjectValid(DetailSchema,data)
    if (validation.length !== 0) {
        return res.status(400).send({
            message:validation
        })
    }

    try {
        const insert = new DetailsModel(data)
        // await insert.save()
        return res.status(201).send({
            message:"Formula insertada!"
        })       
    } catch (error) {
        return res.status(500).send({
            message:"Error interno del servidor, por favor intentelo más tarde."
        })
    }
}

const UpdateFormula = async(req,res)=>{

    const {id} = req.params

    if (!id || id.length !== 24) {
        return res.status(400).send({
            message:"No se envío el id, o el enviado es incorrecto."
        })
    }

    if (!Validations.IdExists(id,DetailsModel)) {
        return res.status(404).send({
            message:"No se encontró la formula asociada a ese id."
        })
    }

    const {
        details_amount,
        details_posology,
        details_consecutive,
        id_item 
    } = req.body


    const data = {
        details_amount:details_amount,
        details_posology:details_posology,
        details_consecutive:details_consecutive,
        id_item:id_item
    }

    const validation = Validations.IsObjectValid(DetailSchema,data)
    if (validation.length !== 0) {
        return res.status(400).send({
            message:validation
        })
    }

    try {
        const insert = new DetailsModel(data)
        await insert.save()
        return res.status(201).send({
            message:"Formula insertada!"
        })       
    } catch (error) {
        return res.status(500).send({
            message:"Error interno del servidor, por favor intentelo más tarde."
        })
    }
}

export const DetailsMethods = {
    AllFormulas,
    FormulaById,
    InsertFormula
}
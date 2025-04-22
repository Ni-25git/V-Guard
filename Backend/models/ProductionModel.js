const mongoose = require('mongoose')

const productionSchema= new mongoose.Schema({
    date:{type:Date , default:Date.now(), unique:true},
    totalHoursWorked:{type:Number , required:true},
    isProductionRunning:{type:Boolean , default:true}
},{versionKey:false})

const ProductionModel = mongoose.model('ProductionHours',productionSchema)

module.exports = ProductionModel

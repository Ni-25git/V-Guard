const express = require('express');
const ProductionModel = require('../models/ProductionModel');
const production = express.Router();

production.get('/' , (req,res)=>{
    res.send('Welcome in production routes')
});

production.post('/post/data/', async (req,res)=>{
    try {
        const {date,totalHoursWorked, isProductionRunning} = req.body
        const postData = new ProductionModel({date,totalHoursWorked, isProductionRunning})
        const savedData = await postData.save();
        res.status(201).json({message:'data saved successfully',savedData})
    } catch (error) {
        res.status(501).json({message:'error in post data',error})
    }
})

module.exports = production
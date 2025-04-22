const express = require('express');
const SafetyModel = require('../models/SafetyModel');
const safetyDashboard = express.Router();
const fs = require('fs');
const path = require('path');
const XLSX = require('xlsx')



safetyDashboard.get('/safety', async (req, res) => {
  try {
      const latestData = await SafetyModel.findOne().sort({ createdAt: -1 }); // Get the latest one
      if (!latestData) {
          return res.status(404).json({ message: 'No safety data found.' });
      }
      res.status(200).json({ message: 'Latest data', data: latestData });
  } catch (error) {
      res.status(500).json({ message: 'Failed to fetch safety dashboard data.', error });
  }
});



safetyDashboard.post('/post/data', async (req, res) => {
    try {
      const {
        daysWithoutLostTimeInjury,
        manHoursWithoutLostTimeInjury,
        lostTimeInjuryRate,
        lostTimeInjurySeverityRate,
        numberOfFirstAidCasesInMonth,
        updatedBy
      } = req.body;
  
      // Save to MongoDB
      const newSafetyEntry = new SafetyModel({
        daysWithoutLostTimeInjury,
        manHoursWithoutLostTimeInjury,
        lostTimeInjuryRate,
        lostTimeInjurySeverityRate,
        numberOfFirstAidCasesInMonth,
        updatedBy
      });
  
      const savedEntry = await newSafetyEntry.save();
  
      // Emit real-time update
      const io = req.app.get('io');
      io.emit('safetyDataCreated', savedEntry);
  
      // === Append to Excel Sheet ===
      const dataFolderPath = path.join(__dirname, '../data');
      const filePath = path.join(dataFolderPath, 'LTIdata.xlsx');
      console.log("Excel file path:", filePath);
  
      // Ensure the /data folder exists
      if (!fs.existsSync(dataFolderPath)) {
        fs.mkdirSync(dataFolderPath);
      }
  
      let sheetData = [];
  
      // If Excel file exists, load existing data
      if (fs.existsSync(filePath)) {
        const workbook = XLSX.readFile(filePath);
        const worksheet = workbook.Sheets[workbook.SheetNames[0]];
        sheetData = XLSX.utils.sheet_to_json(worksheet);
      }
  
      // Append new row
      sheetData.push({
        daysWithoutLostTimeInjury,
        manHoursWithoutLostTimeInjury,
        lostTimeInjuryRate,
        lostTimeInjurySeverityRate,
        numberOfFirstAidCasesInMonth,
        updatedBy,
        timestamp: new Date().toISOString()
      });
  
      // Write to Excel
      const newWorkbook = XLSX.utils.book_new();
      const newWorksheet = XLSX.utils.json_to_sheet(sheetData);
      XLSX.utils.book_append_sheet(newWorkbook, newWorksheet, 'Sheet1');
      XLSX.writeFile(newWorkbook, filePath);
  
      // Respond
      res.status(201).json({
        message: '✅ Safety data posted and written to Excel',
        data: savedEntry
      });
  
    } catch (error) {
      console.error('❌ Error posting safety data:', error);
      res.status(500).json({
        message: '❌ Failed to post safety data',
        error: error.message
      });
    }
  });
  




safetyDashboard.put('/update/data/:id', async (req, res) => {
  try {
      const { id } = req.params;
      const {
          daysWithoutLostTimeInjury,
          manHoursWithoutLostTimeInjury,
          lostTimeInjuryRate,
          lostTimeInjurySeverityRate,
          numberOfFirstAidCasesInMonth,
          updatedBy
      } = req.body;

      const updatedEntry = await SafetyModel.findByIdAndUpdate(
          id,
          {
              daysWithoutLostTimeInjury,
              manHoursWithoutLostTimeInjury,
              lostTimeInjuryRate,
              lostTimeInjurySeverityRate,
              numberOfFirstAidCasesInMonth,
              updatedBy
          },
          { new: true }
      );

      if (!updatedEntry) {
          return res.status(404).json({ message: 'Entry not found' });
      }

      // Emit real-time update
      const io = req.app.get('io');
      io.emit('safetyDataUpdated', updatedEntry);

      res.status(200).json({
          message: '✅ Updated data successfully',
          data: updatedEntry
      });
  } catch (error) {
      res.status(500).json({
          message: '❌ Failed to update data',
          error: error.message
      });
  }
});

  


module.exports = safetyDashboard


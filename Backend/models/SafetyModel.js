const mongoose = require('mongoose')

const safetyDashboardSchema = new mongoose.Schema({
    date: {
        type: Date,
        default: Date.now
      },
      daysWithoutLostTimeInjury: {
        type: Number,
        required: true
      },
      manHoursWithoutLostTimeInjury: {
        type: Number,
        required: true,
      },
      lostTimeInjuryRate: {
        type: Number,
        required: true
      },
      lostTimeInjurySeverityRate: {
        type: Number,
        required: true
      },
      numberOfFirstAidCasesInMonth: {
        type: Number,
        required: true
      },
      updatedBy: {
        type: String,
        default: "HR & Admin"
      }
},{
    versionKey:false ,  timestamps: true 
});

const SafetyModel = mongoose.model('SafetyDashboard' , safetyDashboardSchema)

module.exports = SafetyModel
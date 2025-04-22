import React, { useState } from 'react';
import axios from 'axios';
import {useNavigate} from 'react-router-dom'

const Form = () => {
  const [formData, setFormData] = useState({
    daysWithoutLostTimeInjury: '',
    manHoursWithoutLostTimeInjury: '',
    lostTimeInjuryRate: '',
    lostTimeInjurySeverityRate: '',
    numberOfFirstAidCasesInMonth: '',
    updatedBy: '',
  });

  const [message, setMessage] = useState('');
  const navigate = useNavigate()

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.post('http://localhost:4500/post/data', formData);
      setMessage('✅ Data submitted successfully!');
      setFormData({
        daysWithoutLostTimeInjury: '',
        manHoursWithoutLostTimeInjury: '',
        lostTimeInjuryRate: '',
        lostTimeInjurySeverityRate: '',
        numberOfFirstAidCasesInMonth: '',
        updatedBy: '',
      });
      navigate('/')
    } catch (error) {
      console.error('Error posting data:', error);
      setMessage('❌ Error submitting data. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4 flex justify-center items-start">
      <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-2xl">
        <h2 className="text-2xl font-bold mb-6 text-center text-orange-600">
          📝 Submit Safety Data
        </h2>
        {message && (
          <p className="text-center mb-4 font-medium text-green-600">{message}</p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Days Without LTI"
            name="daysWithoutLostTimeInjury"
            value={formData.daysWithoutLostTimeInjury}
            onChange={handleChange}
          />
          <Input
            label="Man Hours Without LTI"
            name="manHoursWithoutLostTimeInjury"
            value={formData.manHoursWithoutLostTimeInjury}
            onChange={handleChange}
          />
          <Input
            label="LTI Rate"
            name="lostTimeInjuryRate"
            value={formData.lostTimeInjuryRate}
            onChange={handleChange}
          />
          <Input
            label="LTI Severity Rate"
            name="lostTimeInjurySeverityRate"
            value={formData.lostTimeInjurySeverityRate}
            onChange={handleChange}
          />
          <Input
            label="First Aid Cases This Month"
            name="numberOfFirstAidCasesInMonth"
            value={formData.numberOfFirstAidCasesInMonth}
            onChange={handleChange}
          />
          <Input
            label="Updated By"
            name="updatedBy"
            value={formData.updatedBy}
            onChange={handleChange}
          />

          <button
            type="submit"
            className="w-full bg-orange-500 hover:bg-orange-600 text-white py-2 rounded-lg font-semibold transition"
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};

// Reusable Input component
const Input = ({ label, name, value, onChange }) => (
  <div>
    <label className="block text-gray-700 font-medium mb-1">{label}</label>
    <input
      type="text"
      name={name}
      value={value}
      onChange={onChange}
      required
      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400"
    />
  </div>
);

export default Form;

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import io from 'socket.io-client';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LabelList
} from 'recharts';
import Header from './Header';

// Create socket connection
const socket = io('http://localhost:4500'); // ✅ Make sure this URL matches your backend

const Home = () => {
  const [safetyData, setSafetyData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch data initially
  useEffect(() => {
    const fetchSafetyData = async () => {
      try {
        const res = await axios.get('http://localhost:4500/safety');
        setSafetyData(res.data.data);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching safety data:', error);
        setIsLoading(false);
      }
    };

    fetchSafetyData();

    // Listen for real-time safety updates
    socket.on('safetyDataUpdated', (updatedData) => {
      console.log('🔄 Real-time update received:', updatedData);
      setSafetyData(updatedData);
    });

    // Cleanup on unmount
    return () => {
      socket.disconnect();
    };
  }, []);

  const chartData = safetyData
    ? [
        { name: '📅Days Without LTI', value: safetyData.daysWithoutLostTimeInjury },
        { name: '⌚Man Hours Without LTI', value: safetyData.manHoursWithoutLostTimeInjury },
        { name: '⛑️LTI Rate', value: safetyData.lostTimeInjuryRate },
        { name: '👩‍🦼LTI Severity Rate', value: safetyData.lostTimeInjurySeverityRate },
        { name: '🧑‍⚕️First Aid Cases', value: safetyData.numberOfFirstAidCasesInMonth },
      ]
    : [];

  return (
    <>
      <Header /> 
      <div className="max-w-4xl mx-auto px-4 py-6">
        <h1 className="text-3xl font-bold mb-6 text-center text-orange">📊 Latest Safety Overview</h1>

        {isLoading ? (
          <p className="text-center text-gray-400">⛑️Loading safety data...</p>
        ) : safetyData ? (
          <div
            className="bg-black bg-center bg-no-repeat bg-contain rounded-xl shadow-md p-4"
            style={{
              backgroundImage: "url('/vguard-logo.png')",
              backgroundRepeat: 'no-repeat',
              backgroundPosition: 'center',
              backgroundSize: '50%',
            }}
          >
            <h2 className="text-lg font-semibold text-center mb-4 text-white">
              📅Date: {new Date(safetyData.date).toLocaleDateString()}
            </h2>

            <ResponsiveContainer width="100%" height={400}>
              <BarChart
                data={chartData}
                layout="vertical"
                margin={{ top: 20, right: 60, left: 80, bottom: 20 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                <XAxis type="number" stroke="#fff" />
                <YAxis type="category" dataKey="name" stroke="#fff" />
                <Tooltip contentStyle={{ backgroundColor: '#1f2937', borderColor: '#4b5563', color: 'white' }} />
                <Bar dataKey="value" fill="#60a5fa">
                  <LabelList
                    dataKey="value"
                    position="right"
                    style={{ fontSize: 16, fontWeight: 'bold', fill: '#ffffff' }}
                  />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
            <div className="text-right mt-4 text-sm text-gray-300">
              🧔‍♂️Updated By: <span className="font-semibold text-white">{safetyData.updatedBy}</span>
            </div>
          </div>
        ) : (
          <p className="text-center text-gray-400">No safety data available.</p>
        )}
      </div>
    </>
  );
};

export default Home;

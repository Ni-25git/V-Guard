import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './Home';
import Form from './Form';

const AllRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/form" element={<Form />} />
    </Routes>
  );
};

export default AllRoutes;

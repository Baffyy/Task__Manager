import { useState } from 'react';
import Login from './Login';
import Register from './Register';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import axios from "axios";
import '../App.css'

function App() {
return(<BrowserRouter>
    <Routes>
        <Route path="/" element={ <Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
</BrowserRouter>
)
}

export default App;

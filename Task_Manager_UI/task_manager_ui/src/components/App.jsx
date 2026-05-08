import Login from './Login';
import Register from './Register';
import Dashboard from './Dashboard';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import '../App.css'
import Forgot from './Forgot';
import Reset from './Reset';

function App() {
return(<BrowserRouter>
    <Routes>
        <Route path="/" element={ <Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/forgot" element={<Forgot />} />
        <Route path="/reset" element={<Reset />} />
      </Routes>
</BrowserRouter>
)
}

export default App;

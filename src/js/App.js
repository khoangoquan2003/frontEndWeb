import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./Login"; // Đảm bảo đã import Login
import HomePage from "./HomePage";
import Register from "./Register";

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/login" element={<Login />} /> {/* Đảm bảo có Route này */}
                <Route path="/homepage" element={<HomePage />} />
                <Route path="/register" element={<Register />} />
            </Routes>
        </Router>
    );
}

export default App;

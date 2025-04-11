import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./Login";
import HomePage from "./HomePage";
import Register from "./Register";
import DictationPractice from "./DictationPractice"; // <-- Thêm component dictation

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/login" element={<Login />} />
                <Route path="/homepage" element={<HomePage />} />
                <Route path="/register" element={<Register />} />
                <Route path="/dictation" element={<DictationPractice />} /> {/* Thêm route mới */}
            </Routes>
        </Router>
    );
}

export default App;

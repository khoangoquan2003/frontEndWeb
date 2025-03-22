import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./Login";
import HomePage from "./HomePage"; // Trang homepage
import RegisterPage from "./Register"; // Trang đăng ký

function App() {
  return (
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/homepage" element={<HomePage />} />
          <Route path="/register" element={<RegisterPage />} /> {/* Thêm path đúng cho trang đăng ký */}
        </Routes>
      </Router>
  );
}

export default App;

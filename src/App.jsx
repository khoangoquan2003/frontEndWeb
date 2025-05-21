import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import TopicList from "./components/TopicList";
import TopicDetail from "./components/TopicDetail";
import NotesPage from "./components/layout/Notes"; // Import NotesPage

function App() {
    return (
        <Router>
            <div className="flex flex-col min-h-screen">
                <Header />
                <div className="flex-grow">
                    <Routes>
                        <Route path="/notes" element={<NotesPage />} /> {/* Route cho NotesPage */}
                        <Route path="/topics" element={<TopicList />} />
                        <Route path="/topics/:topicId" element={<TopicDetail />} />
                    </Routes>
                </div>
                <Footer />
            </div>
        </Router>
    );
}

export default App;

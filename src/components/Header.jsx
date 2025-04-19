import { Link } from "react-router-dom";

export default function Header() {
    return (
        <header className="bg-white shadow-md p-4 flex justify-between items-center">
            <div className="text-xl font-bold text-blue-700">DailyDictation</div>
            <nav className="flex space-x-4">
                <Link to="/topics" className="hover:underline">All exercises</Link>
                <span>Top users</span>
                <span>Video lessons</span>
                <span className="text-pink-500">💖 Donate</span>
            </nav>
        </header>
    );
}

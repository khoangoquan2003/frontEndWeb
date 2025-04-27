import React from 'react';
import {
    FaHome, FaBook, FaMicrophone, FaCommentDots,
    FaFacebook, FaTiktok, FaDonate, FaFileAlt,
    FaLock, FaClipboardList, FaDownload, FaBlog
} from 'react-icons/fa';

const Footer = () => {
    return (
        <footer className="bg-gray-100 text-blue-600 px-8 py-10 border-t border-gray-200">
            <div className="max-w-screen-xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 text-sm">
                {/* Column 1 */}
                <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                        <FaHome className="text-xl" />
                        <a href="/homepage" className="hover:text-blue-800">Home</a>
                    </div>
                    <div className="flex items-center space-x-2">
                        <FaBook className="text-xl" />
                        <a href="/exercises" className="hover:text-blue-800">All exercises</a>
                    </div>
                    <div className="flex items-center space-x-2">
                        <FaMicrophone className="text-xl" />
                        <a href="/expressions" className="hover:text-blue-800">English expressions</a>
                    </div>
                    <div className="flex items-center space-x-2">
                        <FaMicrophone className="text-xl" />
                        <a href="/pronunciation" className="hover:text-blue-800">English pronunciation</a>
                    </div>
                    <div className="flex items-center space-x-2">
                        <FaMicrophone className="text-xl" />
                        <a href="/fluentpal" className="hover:text-blue-800">FluentPal - English Speaking App</a>
                    </div>
                    <div className="flex items-center space-x-2">
                        <FaDownload className="text-xl" />
                        <a href="/download" className="hover:text-blue-800">Download audio files</a>
                    </div>
                </div>

                {/* Column 2 */}
                <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                        <FaClipboardList className="text-xl" />
                        <a href="/top-users" className="hover:text-blue-800">Top users</a>
                    </div>
                    <div className="flex items-center space-x-2">
                        <FaCommentDots className="text-xl" />
                        <a href="/comments" className="hover:text-blue-800">Latest comments</a>
                    </div>
                    <div className="flex items-center space-x-2">
                        <FaBook className="text-xl" />
                        <a href="/resources" className="hover:text-blue-800">Learning English resources</a>
                    </div>
                    <div className="flex items-center space-x-2">
                        <FaMicrophone className="text-xl" />
                        <a href="/german" className="hover:text-blue-800">Practice German Listening</a>
                    </div>
                </div>

                {/* Column 3 */}
                <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                        <FaBlog className="text-xl" />
                        <a href="/blog" className="hover:text-blue-800">Blog</a>
                    </div>
                    <div className="flex items-center space-x-2">
                        <FaCommentDots className="text-xl" />
                        <a href="/contact" className="hover:text-blue-800">Contact</a>
                    </div>
                    <div className="flex items-center space-x-2">
                        <FaDonate className="text-xl" />
                        <a href="/donate" className="hover:text-blue-800">Donate 💖 💖</a>
                    </div>
                    <div className="flex items-center space-x-2">
                        <FaFileAlt className="text-xl" />
                        <a href="/terms" className="hover:text-blue-800">Terms & rules</a>
                    </div>
                    <div className="flex items-center space-x-2">
                        <FaLock className="text-xl" />
                        <a href="/privacy" className="hover:text-blue-800">Privacy policy</a>
                    </div>
                </div>

                {/* Column 4 - Social Links */}
                <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                        <FaFacebook className="text-xl" />
                        <a href="https://facebook.com" target="_blank" rel="noreferrer" className="hover:text-blue-800">Follow us on Facebook</a>
                    </div>
                    <div className="flex items-center space-x-2">
                        <FaTiktok className="text-xl" />
                        <a href="https://tiktok.com" target="_blank" rel="noreferrer" className="hover:text-blue-800">Follow us on TikTok</a>
                    </div>
                </div>
            </div>


            {/* Footer Bottom */}
            <div className="mt-8 text-center text-black text-base bg-amber-100 py-2 border-t border-gray-400">
                © dailydictation.com · since 2019
            </div>



        </footer>
    );
};

export default Footer;

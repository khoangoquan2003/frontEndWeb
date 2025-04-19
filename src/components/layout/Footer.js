import React from 'react';
import { FaFacebook, FaTiktok } from 'react-icons/fa';

const Footer = () => {
    return (
        <footer className="bg-gray-100 text-blue-600 px-8 py-10 border-t border-gray-200">
            <div className="max-w-screen-xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 text-sm">
                <div className="space-y-2">
                    <a href="/public">Home</a>
                    <a href="/exercises">All exercises</a>
                    <a href="/expressions">English expressions</a>
                    <a href="/pronunciation">English pronunciation</a>
                    <a href="/fluentpal">FluentPal - English Speaking App</a>
                    <a href="/download">Download audio files</a>
                </div>
                <div className="space-y-2">
                    <a href="/top-users">Top users</a>
                    <a href="/comments">Latest comments</a>
                    <a href="/resources">Learning English resources</a>
                    <a href="/german">Practice German Listening</a>
                </div>
                <div className="space-y-2">
                    <a href="/blog">Blog</a>
                    <a href="/contact">Contact</a>
                    <a href="/donate">Donate 💖 💖</a>
                    <a href="/terms">Terms & rules</a>
                    <a href="/privacy">Privacy policy</a>
                </div>
                <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                        <FaFacebook />
                        <a href="https://facebook.com" target="_blank" rel="noreferrer">
                            Follow us on Facebook
                        </a>
                    </div>
                    <div className="flex items-center space-x-2">
                        <FaTiktok />
                        <a href="https://tiktok.com" target="_blank" rel="noreferrer">
                            Follow us on TikTok
                        </a>
                    </div>
                </div>
            </div>
            <div className="mt-8 text-center text-gray-600 text-sm border-t border-gray-300 pt-4">
                © dailydictation.com · since 2019
            </div>
        </footer>
    );
};

export default Footer;

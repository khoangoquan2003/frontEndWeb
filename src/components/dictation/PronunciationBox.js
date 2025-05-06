import React from "react";

// PronunciationBox Component
const PronunciationBox = ({ sentence, wordPronunciations, onWordClick }) => {
    const renderWords = () => {
        return sentence.split(" ").map((word, index) => {
            const pronunciation = wordPronunciations[word.toLowerCase()]; // Get pronunciation for the word

            return (
                <span
                    key={index}
                    onClick={() => pronunciation && onWordClick(pronunciation)}
                    className="text-blue-600 cursor-pointer hover:underline"
                >
                    {word}
                </span>
            );
        });
    };

    return (
        <div className="border p-3 rounded bg-white shadow">
            <h2 className="text-lg font-semibold mb-2">🔊 Phát âm</h2>
            <div className="text-gray-800">
                {renderWords()}
            </div>
        </div>
    );
};

export default PronunciationBox;

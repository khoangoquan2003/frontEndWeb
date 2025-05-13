import React, { useState } from 'react';
import './DictationList.css';

const sampleDictations = [
    {
        id: 1,
        title: 'Lesson 1 - Morning Routine',
        transcript: 'I wake up at 7 am every day...',
        audioUrl: 'https://example.com/audio1.mp3'
    },
    {
        id: 2,
        title: 'Lesson 2 - At the Market',
        transcript: 'The market is crowded and noisy...',
        audioUrl: 'https://example.com/audio2.mp3'
    }
];

export default function DictationList() {
    const [dictations, setDictations] = useState(sampleDictations);
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({ title: '', transcript: '', audioUrl: '' });

    const handleAddNew = () => {
        if (!formData.title || !formData.transcript || !formData.audioUrl) {
            alert('Please fill all fields!');
            return;
        }
        const newDictation = {
            id: dictations.length + 1,
            ...formData
        };
        setDictations([...dictations, newDictation]);
        setFormData({ title: '', transcript: '', audioUrl: '' });
        setShowForm(false);
    };

    return (
        <div className="dictation-container">
            <div className="header">
                <h2>📚 Dictation List</h2>
                <button className="add-btn" onClick={() => setShowForm(true)}>+ Add New</button>
            </div>

            <div className="card-list">
                {dictations.map(dict => (
                    <div key={dict.id} className="card">
                        <h3>{dict.title}</h3>
                        <audio controls src={dict.audioUrl} />
                        <p><strong>Transcript:</strong> {dict.transcript}</p>
                        <div className="btn-group">
                            <button className="edit-btn" onClick={() => alert("Edit feature coming soon")}>Edit</button>
                            <button className="delete-btn" onClick={() => alert("Delete feature coming soon")}>Delete</button>
                        </div>
                    </div>
                ))}
            </div>

            {showForm && (
                <div className="modal">
                    <div className="modal-content">
                        <h3>Add New Dictation</h3>
                        <label>Title:</label>
                        <input
                            type="text"
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        />
                        <label>Transcript:</label>
                        <textarea
                            value={formData.transcript}
                            onChange={(e) => setFormData({ ...formData, transcript: e.target.value })}
                        ></textarea>
                        <label>Audio URL:</label>
                        <input
                            type="text"
                            value={formData.audioUrl}
                            onChange={(e) => setFormData({ ...formData, audioUrl: e.target.value })}
                        />
                        <div className="modal-actions">
                            <button onClick={handleAddNew} className="save-btn">Save</button>
                            <button onClick={() => setShowForm(false)} className="cancel-btn">Cancel</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

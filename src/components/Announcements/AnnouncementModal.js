import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import './AnnouncementModal.css';

const AnnouncementModal = ({ isOpen, onClose }) => {
    const [announcement, setAnnouncement] = useState('');

    useEffect(() => {
        fetch('/announcements/2024_03_update.md')
            .then(response => response.text())
            .then(text => setAnnouncement(text))
            .catch(error => console.error('공지사항을 불러오는데 실패했습니다:', error));
    }, []);

    if (!isOpen) return null;

    return (
        <div className="announcement-modal-overlay">
            <div className="announcement-modal">
                <div className="announcement-modal-content">
                    <div className="announcement-modal-header">
                        <h2 className="announcement-modal-title">공지사항</h2>
                        <button
                            onClick={onClose}
                            className="announcement-modal-close"
                        >
                            ✕
                        </button>
                    </div>
                    <div className="announcement-modal-body">
                        <ReactMarkdown>{announcement}</ReactMarkdown>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AnnouncementModal;

import React from 'react';
import { useNavigate } from 'react-router-dom';
import './SuccessModal.css';

const SuccessModal = ({ isOpen, onClose, onNextProblem }) => {
    const navigate = useNavigate();

    if (!isOpen) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-content success-modal">
                <div className="success-icon">
                    🎉
                </div>
                <h2>Problem Solved!</h2>
                <p>Great job! You've passed all test cases.</p>

                <div className="modal-actions">
                    <button
                        className="btn btn-secondary"
                        onClick={() => {
                            onClose();
                            navigate('/problems');
                        }}
                    >
                        Problem List
                    </button>
                    <button
                        className="btn btn-primary"
                        onClick={onNextProblem}
                    >
                        Next Problem
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SuccessModal;

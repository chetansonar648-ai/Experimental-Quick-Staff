import React, { createContext, useContext, useState, useCallback, useRef, useEffect } from 'react';
import { ToastContainer } from '../components/Toast';

const ToastContext = createContext(null);

/**
 * ToastProvider - Provides toast notification functionality throughout the app
 * Usage: const { showToast } = useToast();
 *        showToast('Message', 'success');
 *        showToast('Message', 'success', { undoAction: () => {...}, undoDuration: 60 });
 */
export const ToastProvider = ({ children }) => {
    const [toasts, setToasts] = useState([]);
    const countdownIntervals = useRef({});

    // Clean up intervals on unmount
    useEffect(() => {
        return () => {
            Object.values(countdownIntervals.current).forEach(clearInterval);
        };
    }, []);

    const removeToast = useCallback((id) => {
        // Clear countdown interval if exists
        if (countdownIntervals.current[id]) {
            clearInterval(countdownIntervals.current[id]);
            delete countdownIntervals.current[id];
        }
        setToasts((prev) => prev.filter((t) => t.id !== id));
    }, []);

    const showToast = useCallback((message, type = 'info', options = {}) => {
        const id = Date.now() + Math.random();
        const {
            duration = 4000,
            undoAction = null,
            undoDuration = 60,  // 60 seconds for undo window
        } = options;

        const toast = {
            id,
            message,
            type,
            undoAction: undoAction ? () => {
                undoAction();
                removeToast(id);
            } : null,
            countdown: undoAction ? undoDuration : undefined,
        };

        setToasts((prev) => [...prev, toast]);

        // If there's an undo action, set up countdown
        if (undoAction) {
            countdownIntervals.current[id] = setInterval(() => {
                setToasts((prev) =>
                    prev.map((t) => {
                        if (t.id === id) {
                            const newCountdown = (t.countdown || 0) - 1;
                            if (newCountdown <= 0) {
                                // Time's up, remove the toast
                                clearInterval(countdownIntervals.current[id]);
                                delete countdownIntervals.current[id];
                                return null;
                            }
                            return { ...t, countdown: newCountdown };
                        }
                        return t;
                    }).filter(Boolean)
                );
            }, 1000);
        } else {
            // Auto-dismiss after duration (only for non-undo toasts)
            setTimeout(() => removeToast(id), duration);
        }

        return id;
    }, [removeToast]);

    return (
        <ToastContext.Provider value={{ showToast, removeToast }}>
            {children}
            <ToastContainer toasts={toasts} removeToast={removeToast} />
        </ToastContext.Provider>
    );
};

export const useToast = () => {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error('useToast must be used within a ToastProvider');
    }
    return context;
};

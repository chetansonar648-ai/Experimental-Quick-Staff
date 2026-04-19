import React from 'react';

/**
 * Toast Component - Lightweight, non-blocking notification
 * Supports types: success, error, info, warning
 * Auto-dismisses after specified duration
 */
const Toast = ({ id, message, type = 'info', onClose, undoAction, countdown }) => {
    const typeStyles = {
        success: 'bg-green-600',
        error: 'bg-red-600',
        warning: 'bg-yellow-600',
        info: 'bg-blue-600',
    };

    const icons = {
        success: 'check_circle',
        error: 'error',
        warning: 'warning',
        info: 'info',
    };

    return (
        <div
            className={`flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg text-white ${typeStyles[type]} animate-slide-in`}
            role="alert"
        >
            <span className="material-symbols-outlined text-xl">{icons[type]}</span>
            <span className="flex-1 text-sm font-medium">{message}</span>

            {/* Undo button with countdown */}
            {undoAction && countdown !== undefined && countdown > 0 && (
                <button
                    onClick={undoAction}
                    className="flex items-center gap-1 px-2 py-1 bg-white/20 hover:bg-white/30 rounded text-xs font-bold transition-colors"
                >
                    <span className="material-symbols-outlined text-sm">undo</span>
                    Undo ({countdown}s)
                </button>
            )}

            <button
                onClick={() => onClose(id)}
                className="p-1 hover:bg-white/20 rounded transition-colors"
                aria-label="Close notification"
            >
                <span className="material-symbols-outlined text-lg">close</span>
            </button>
        </div>
    );
};

/**
 * ToastContainer - Renders all active toasts
 */
export const ToastContainer = ({ toasts, removeToast }) => {
    if (toasts.length === 0) return null;

    return (
        <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-sm">
            {toasts.map((toast) => (
                <Toast
                    key={toast.id}
                    {...toast}
                    onClose={removeToast}
                />
            ))}
        </div>
    );
};

export default Toast;

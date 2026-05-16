import { Alert, AlertDescription } from './alert'

function ErrorAlert({ message, onClose, className = 'mb-4', closeLabel = 'Fechar' }) {
    if (!message) return null

    return (
        <Alert variant="destructive" className={className}>
            <AlertDescription>{message}</AlertDescription>
            {onClose && (
                <button onClick={onClose} aria-label={closeLabel} title={closeLabel}>
                    ✕
                </button>
            )}
        </Alert>
    )
}

export default ErrorAlert

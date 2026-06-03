export function getProgressColor(percentual) {
    if (percentual >= 90) return '[&>div]:bg-red-500'
    if (percentual >= 70) return '[&>div]:bg-yellow-500'
    return '[&>div]:bg-emerald-500'
}
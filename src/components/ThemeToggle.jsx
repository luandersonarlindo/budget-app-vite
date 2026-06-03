import { useState, useEffect } from 'react'
import { Monitor, Sun, Moon } from 'lucide-react'
import { Button } from './ui/button'

function ThemeToggle() {
    const [theme, setTheme] = useState(() => {
        return localStorage.getItem('theme') || 'system'
    })

    useEffect(() => {
        const root = document.documentElement

        if (theme === 'dark') {
            root.classList.add('dark')
        } else if (theme === 'light') {
            root.classList.remove('dark')
        } else {
            const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
            if (prefersDark) {
                root.classList.add('dark')
            } else {
                root.classList.remove('dark')
            }
        }

        localStorage.setItem('theme', theme)
    }, [theme])

    return (
        <div className="flex items-center rounded-lg border bg-muted p-1 gap-1">
            <Button
                variant="ghost"
                size="icon"
                className={`h-7 w-7 ${theme === 'system' ? 'bg-background shadow-sm' : ''}`}
                onClick={() => setTheme('system')}
                title="Sistema"
            >
                <Monitor className="h-4 w-4" />
            </Button>
            <Button
                variant="ghost"
                size="icon"
                className={`h-7 w-7 ${theme === 'light' ? 'bg-background shadow-sm' : ''}`}
                onClick={() => setTheme('light')}
                title="Claro"
            >
                <Sun className="h-4 w-4" />
            </Button>
            <Button
                variant="ghost"
                size="icon"
                className={`h-7 w-7 ${theme === 'dark' ? 'bg-background shadow-sm' : ''}`}
                onClick={() => setTheme('dark')}
                title="Escuro"
            >
                <Moon className="h-4 w-4" />
            </Button>
        </div>
    )
}

export default ThemeToggle
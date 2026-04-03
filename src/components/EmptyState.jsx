import { Button } from './ui/button'
import { Card } from './ui/card'

function EmptyState({ icon: Icon, title, description, actionLabel, onAction }) {
    return (
        <Card className="flex flex-col items-center justify-center p-12 text-center">
            <Icon className="w-16 h-16 text-muted-foreground mb-4" />
            <h3 className="text-xl font-semibold mb-2">{title}</h3>
            <p className="text-muted-foreground mb-6">{description}</p>
            {onAction && (
                <Button onClick={onAction}>{actionLabel}</Button>
            )}
        </Card>
    )
}

export default EmptyState
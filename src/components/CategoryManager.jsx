import { Tag, Pencil, Trash2 } from 'lucide-react'
import { Button } from '../components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card'
import EmptyState from './EmptyState'
import { Badge } from './ui/badge'

const CategoryManager = ({ categories, onEdit, onRemove, onAddNew }) => {
    const hasCategories = Array.isArray(categories) && categories.length > 0
    const hasCustomCategories = categories.some(cat => !cat.isDefault)

    return (
        <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {hasCategories && categories.map((cat) => {
                    const key = cat.id ?? cat.name
                    const isCustom = !cat.isDefault

                    return (
                        <Card
                            key={key}
                            className={`hover:shadow-md transition-shadow duration-200 ${!isCustom ? 'opacity-75' : ''}`}
                        >
                            <CardHeader className="pb-2">
                                <div className="flex items-start justify-between gap-2">
                                    <div>
                                        <CardTitle className="text-base">{cat.name}</CardTitle>
                                        <p className="text-2xl font-bold text-emerald-600 mt-1">
                                            {cat.defaultPercent}%
                                        </p>
                                    </div>
                                    <Badge variant={isCustom ? 'secondary' : 'outline'}>
                                        {isCustom ? 'Personalizada' : 'Padrão'}
                                    </Badge>
                                </div>
                                {cat.description && (
                                    <CardDescription className="mt-2 line-clamp-2">
                                        {cat.description}
                                    </CardDescription>
                                )}
                            </CardHeader>

                            {isCustom && (
                                <CardContent className="pt-2 border-t flex justify-end gap-1">
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => onEdit(cat)}
                                        title="Editar"
                                    >
                                        <Pencil className="h-4 w-4" />
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => onRemove(cat)}
                                        title="Remover"
                                        className="text-destructive hover:text-destructive hover:bg-destructive/10"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </CardContent>
                            )}
                        </Card>
                    )
                })}
            </div>

            {!hasCustomCategories && (
                <EmptyState
                    icon={Tag}
                    title="Nenhuma categoria personalizada"
                    description="Crie categorias personalizadas para organizar melhor seus orçamentos."
                    actionLabel="Adicionar Categoria"
                    onAction={onAddNew}
                />
            )}
        </div>
    )
}

export default CategoryManager
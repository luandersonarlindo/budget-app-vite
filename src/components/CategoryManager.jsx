import { Badge } from './ui/badge';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../components/ui/card';

const CategoryManager = ({ categories, onEdit, onRemove }) => {
    const hasCategories = Array.isArray(categories) && categories.length > 0;

    return (
        <div>
            <Card className="mb-6">
                <CardHeader>
                    <CardTitle>Categorias</CardTitle>
                    <CardDescription>Gerencie suas categorias aqui.</CardDescription>
                </CardHeader>

                <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {hasCategories ? (
                        categories.map((cat) => {
                            const key = cat.id != null ? cat.id : cat.name;
                            const description = cat.description || '';
                            const isCustom = !cat.isDefault;

                            return (
                                <Card key={key} className="flex flex-wrap md:flex-nowrap lg:flex-nowrap max-w-full gap-4 mt-4">
                                    <CardHeader>
                                        <CardTitle>{cat.name} — {cat.defaultPercent}%</CardTitle>
                                        <Badge variant={cat.isDefault ? 'default' : 'secondary'}>{cat.isDefault ? 'Padrão' : 'Personalizada'}</Badge>
                                        <CardDescription className="text-ellipsis md:truncate">{description}</CardDescription>
                                    </CardHeader>

                                    <CardContent className="p-0">
                                        {isCustom && (
                                            <CardFooter className="flex flex-wrap gap-2">
                                                <Button variant="outline" onClick={() => onEdit(cat)}>Editar</Button>
                                                <Button variant="destructive" onClick={() => onRemove(cat)}>Remover</Button>
                                            </CardFooter>
                                        )}
                                    </CardContent>
                                </Card>
                            );
                        })
                    ) : (
                        <CardContent>
                            Nenhuma categoria cadastrada.
                        </CardContent>
                    )}
                </CardContent>
            </Card>
        </div>
    );
};

export default CategoryManager;

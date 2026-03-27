import { useState } from 'react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';

function CategoryForm({ onSave, onCancel, categoryToEdit }) {
    const [name, setName] = useState(categoryToEdit ? categoryToEdit.name : '');
    const [description, setDescription] = useState(categoryToEdit ? categoryToEdit.description : '');
    const [defaultPercent, setDefaultPercent] = useState(categoryToEdit ? categoryToEdit.defaultPercent : 0);
    const [isDefault, setIsDefault] = useState(categoryToEdit ? categoryToEdit.isDefault : false);

    const handleSave = () => {
        const newCategory = { ...categoryToEdit, name, description, defaultPercent, isDefault };
        if (name.trim() === '') return;
        onSave(newCategory);
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>{categoryToEdit ? 'Editar Categoria' : 'Adicionar Categoria'}</CardTitle>
            </CardHeader>

            <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="mb-4">
                    <Label className="mb-2" htmlFor="categoryName">Nome da Categoria</Label>
                    <Input id="categoryName" value={name} onChange={(e) => setName(e.target.value)} />
                </div>

                <div className="mb-4">
                    <Label className="mb-2" htmlFor="categoryDescription">Descrição</Label>
                    <Input id="categoryDescription" value={description} onChange={(e) => setDescription(e.target.value)} />
                </div>

                <div className="mb-4">
                    <Label className="mb-2" htmlFor="categoryDefaultPercent">Percentual Padrão</Label>
                    <div className='relative'>
                        <Input id="categoryDefaultPercent" type="number" min={0} max={100} value={defaultPercent} onChange={(e) => {
                            const val = Math.min(100, Math.max(0, Number(e.target.value)))
                            setDefaultPercent(val)
                        }} />
                        <span className="absolute right-3 top-2.5 text-sm text-muted-foreground">%</span>
                    </div>
                </div>
            </CardContent>

            <CardFooter className="flex justify-end gap-2">
                <Button variant="default" onClick={handleSave}>
                    Salvar
                </Button>
                <Button variant="secondary" onClick={onCancel}>
                    Cancelar
                </Button>
            </CardFooter>
        </Card>
    );
}

export default CategoryForm
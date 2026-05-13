import { useState } from 'react'
import { Button } from '../ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Input } from '../ui/input'
import { Label } from '../ui/label'

export default function PeriodForm({ period, onSave, onCancel }) {
    const [name, setName] = useState(() => period?.name || '')

    return (
        <Card className="max-w-xl">
            <CardHeader>
                <CardTitle>{period ? 'Editar Período' : 'Novo Período'}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                {!period && (
                    <div className="px-1">
                        <p className="text-sm font-medium mb-2">Como cadastrar um período:</p>
                        <ol className="text-sm text-muted-foreground list-decimal list-inside space-y-1">
                            <li>Informe um nome identificador, como "Maio-2026"</li>
                            <li>Depois registre receitas e despesas dentro do período</li>
                            <li>Resultado e margem são calculados automaticamente</li>
                        </ol>
                    </div>
                )}

                <div>
                    <Label className="mb-2" htmlFor="periodName">Nome do período</Label>
                    <Input
                        id="periodName"
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Ex: Maio 2026"
                    />
                </div>

                <div className="flex gap-2">
                    <Button
                        onClick={() => {
                            if (!name.trim()) return
                            onSave(name.trim())
                        }}
                    >
                        Salvar
                    </Button>
                    <Button variant="secondary" onClick={onCancel}>
                        Cancelar
                    </Button>
                </div>
            </CardContent>
        </Card>
    )
}

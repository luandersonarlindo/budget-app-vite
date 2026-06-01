import { useState } from 'react'
import { Button } from '../ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Input } from '../ui/input'
import { Label } from '../ui/label'
import { Info } from 'lucide-react'
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from '../ui/tooltip'

export default function PeriodForm({ period, onSave, onCancel }) {
    const [name, setName] = useState(() => period?.name || '')

    return (
        <Card className="max-w-xl">
            <CardHeader>
                <div className="flex items-center gap-2">
                    <CardTitle>{period ? 'Editar Período' : 'Novo Período'}</CardTitle>
                    {!period && (
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Info className="h-4 w-4 text-muted-foreground cursor-help" />
                                </TooltipTrigger>
                                <TooltipContent className="max-w-xs">
                                    <ol className="text-sm space-y-1 list-decimal list-inside">
                                        <li>Informe um nome identificador, como "Maio-2026"</li>
                                        <li>Depois registre receitas e despesas dentro do período</li>
                                        <li>Resultado e margem são calculados automaticamente</li>
                                    </ol>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    )}
                </div>
            </CardHeader>

            <CardContent className="space-y-4">
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

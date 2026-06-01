import { Card, CardContent, CardFooter, CardHeader } from './ui/card'
import { Button } from './ui/button'
import { formatCurrency } from '../utils/formatters'
import { Pencil, Copy, Trash2 } from 'lucide-react'

function PeriodList({ periods, onSelect, onEdit, onRemove, onCopy }) {
    return (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {periods.map((period) => {
                const totalIncome = period.incomes.reduce((sum, item) => sum + (Number(item.value) || 0), 0)
                const totalExpense = period.expenses.reduce((sum, item) => sum + (Number(item.value) || 0), 0)
                const result = totalIncome - totalExpense
                const margin = totalIncome > 0 ? (result / totalIncome) * 100 : 0
                const isPositive = result >= 0

                return (
                    <Card key={period.id} className="flex flex-col justify-between hover:shadow-md transition-shadow duration-200">
                        <CardHeader className="pb-2">
                            <p className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
                                Período
                            </p>
                            <p className="text-lg font-semibold">{period.name}</p>
                            <p className={`text-3xl font-bold ${isPositive ? 'text-emerald-600' : 'text-red-500'}`}>
                                {formatCurrency(result)}
                            </p>
                            <p className="text-xs text-muted-foreground">Resultado</p>
                        </CardHeader>
                        <CardContent className="space-y-1 pb-3">
                            <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">Receitas</span>
                                <span className="font-medium text-emerald-600">{formatCurrency(totalIncome)}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">Despesas</span>
                                <span className="font-medium text-red-500">{formatCurrency(totalExpense)}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">Margem</span>
                                <span className="font-medium">{margin.toFixed(1)}%</span>
                            </div>
                        </CardContent>
                        <CardFooter className="flex items-center gap-2 pt-4 border-t">
                            <Button className="flex-1" onClick={() => onSelect(period.id)}>
                                Detalhes
                            </Button>
                            <div className="flex gap-1 shrink-0">
                                <Button variant="outline" size="icon" onClick={() => onEdit(period)} title="Editar">
                                    <Pencil className="h-4 w-4" />
                                </Button>
                                <Button variant="outline" size="icon" onClick={() => onCopy && onCopy(period)} title="Copiar">
                                    <Copy className="h-4 w-4" />
                                </Button>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => onRemove(period)}
                                    title="Remover"
                                    className="text-destructive hover:text-destructive hover:bg-destructive/10"
                                >
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </div>
                        </CardFooter>
                    </Card>
                )
            })}
        </div>
    )
}

export default PeriodList
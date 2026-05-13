import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Button } from './ui/button'
import { formatCurrency } from '../utils/formatters'

function PeriodList({ periods, onSelect, onEdit, onRemove }) {
    return (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {periods.map((period) => {
                const totalIncome = period.incomes.reduce((sum, item) => sum + (Number(item.value) || 0), 0)
                const totalExpense = period.expenses.reduce((sum, item) => sum + (Number(item.value) || 0), 0)
                const result = totalIncome - totalExpense
                const margin = totalIncome > 0 ? (result / totalIncome) * 100 : 0

                return (
                    <Card key={period.id}>
                        <CardHeader>
                            <CardTitle>{period.name}</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2">
                            <div className="text-sm text-muted-foreground">
                                Receitas: {formatCurrency(totalIncome)}
                            </div>
                            <div className="text-sm text-muted-foreground">
                                Despesas: {formatCurrency(totalExpense)}
                            </div>
                            <div className="text-sm font-medium">
                                Resultado: {formatCurrency(result)}
                            </div>
                            <div className="text-sm text-muted-foreground">
                                Margem: {margin.toFixed(1)}%
                            </div>

                            <div className="flex flex-wrap gap-2 pt-2">
                                <Button variant="default" onClick={() => onSelect(period.id)}>
                                    Detalhes
                                </Button>
                                <Button variant="secondary" onClick={() => onEdit(period)}>
                                    Editar
                                </Button>
                                <Button variant="destructive" onClick={() => onRemove(period)}>
                                    Remover
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                )
            })}
        </div>
    )
}

export default PeriodList

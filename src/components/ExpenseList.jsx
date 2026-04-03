import { Field, FieldLabel } from "@/components/ui/field"
import { Progress } from "@/components/ui/progress"
import { Receipt } from 'lucide-react'
import {
    Select, SelectContent,
    SelectItem, SelectTrigger, SelectValue
} from '../components/ui/select'
import { formatCurrency } from '../utils/formatters'
import EmptyState from './EmptyState'
import { Button } from './ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'

function ExpenseList({ budget, onDeleteExpense, onEditExpense, onMoveExpense, onUpdateStatus, onAddNew }) {
    return (
        <div>
            {budget.categories.map((category, catIndex) => {
                const limite = budget.value * category.percent / 100
                const totalGasto = category.expenses.reduce((acc, exp) => acc + exp.value, 0)

                const percentualGasto = limite > 0 ? (totalGasto / limite) * 100 : 0
                const disponivel = limite - totalGasto

                return (
                    <Card key={catIndex} className="mb-6">
                        <CardHeader>
                            <CardTitle>{category.name} — {category.percent}%</CardTitle>
                            <CardDescription className="flex flex-wrap md:flex-nowrap lg:flex-nowrap max-w-full gap-4 mt-4">
                                <Field>
                                    <FieldLabel>
                                        Limite: {formatCurrency(limite)}
                                    </FieldLabel>
                                    <Progress value={100} className="mt-2" />
                                </Field>

                                <Field>
                                    <FieldLabel>
                                        Gasto: {formatCurrency(totalGasto)} ({percentualGasto.toFixed(1)}%)
                                    </FieldLabel>
                                    <Progress value={percentualGasto} className="mt-2" />
                                </Field>

                                <Field>
                                    <FieldLabel>
                                        Disponível: {formatCurrency(disponivel)} ({(100 - percentualGasto).toFixed(1)}%)
                                    </FieldLabel>
                                    <Progress value={100 - percentualGasto} className="mt-2" />
                                </Field>
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {category.expenses.length === 0 ? (
                                <EmptyState
                                    icon={Receipt}
                                    title="Nenhuma despesa"
                                    description="Adicione a primeira despesa nesta categoria."
                                    actionLabel="Adicionar Despesa"
                                    onAction={onAddNew}
                                />
                            ) : (category.expenses.map((expense, expIndex) => (
                                <Card key={expIndex}>
                                    <CardHeader>
                                        <CardTitle>{expense.description}</CardTitle>
                                        <CardDescription>{formatCurrency(expense.value)}</CardDescription>
                                    </CardHeader>
                                    <CardContent className="flex flex-wrap gap-2">
                                        <Button variant={'destructive'} className="flex gap-2 items-center" onClick={() => onDeleteExpense(catIndex, expIndex)}>Deletar</Button>
                                        <Button variant={'outline'} className="flex gap-2 items-center" onClick={() => onEditExpense(catIndex, expIndex, expense)}>Editar</Button>
                                        <Select
                                            key={`${catIndex}-${expIndex}-${category.expenses.length}`}
                                            onValueChange={(value) => {
                                                onMoveExpense(catIndex, expIndex, parseInt(value))
                                            }}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Mover para..." />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {budget.categories
                                                    .filter((_, ci) => ci !== catIndex)
                                                    .map((cat, ci) => {
                                                        const realIndex = budget.categories.indexOf(cat)
                                                        return <SelectItem key={ci} value={realIndex.toString()}>{cat.name}</SelectItem>
                                                    })}
                                            </SelectContent>
                                        </Select>

                                        <Select
                                            value={expense.status || 'pendente'}
                                            onValueChange={(value) => onUpdateStatus(catIndex, expIndex, value)}
                                        >
                                            <SelectTrigger className={`w-36 ${getStatusColor(expense.status || 'pendente')}`}>
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="pendente">Pendente</SelectItem>
                                                <SelectItem value="pago">Pago</SelectItem>
                                                <SelectItem value="nao_pago">Cancelado</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </CardContent>
                                </Card>
                            )))
                            }
                        </CardContent>
                    </Card>
                )
            })}
        </div>
    )
}

function getStatusColor(status) {
    if (status === 'pago') return 'border-green-500 text-green-700 bg-green-50'
    if (status === 'nao_pago') return 'border-orange-500 text-orange-700 bg-orange-50'
    return 'border-yellow-500 text-yellow-700 bg-yellow-50'
}

export default ExpenseList
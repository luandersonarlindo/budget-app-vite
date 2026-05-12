import { useMemo, useState } from 'react'

import { Button } from './ui/button'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Input } from './ui/input'
import { Label } from './ui/label'
import ConfirmDialog from './ui/confirm-dialog'
import EmptyState from './EmptyState'
import { formatCurrency, maskCurrency, parseUserValue } from '../utils/formatters'
import useBusiness from '../hooks/useBusiness'
import PeriodCharts from './PeriodCharts'
import PeriodSummary from './PeriodSummary'
import { PiggyBank, TrendingUp, TrendingDown } from 'lucide-react'

function BusinessModule() {
    const {
        periods,
        addPeriod,
        copyPeriod,
        updatePeriod,
        removePeriod,
        addIncome,
        updateIncome,
        removeIncome,
        addExpense,
        updateExpense,
        removeExpense
    } = useBusiness()

    const [tela, setTela] = useState('listaPeriodos')
    const [selectedPeriodId, setSelectedPeriodId] = useState(null)
    const [periodToEdit, setPeriodToEdit] = useState(null)

    const [incomeToEdit, setIncomeToEdit] = useState(null)
    const [expenseToEdit, setExpenseToEdit] = useState(null)

    const [periodToRemove, setPeriodToRemove] = useState(null)
    const [incomeToRemove, setIncomeToRemove] = useState(null)
    const [expenseToRemove, setExpenseToRemove] = useState(null)

    const [periodName, setPeriodName] = useState('')
    const [incomeDescription, setIncomeDescription] = useState('')
    const [incomeValue, setIncomeValue] = useState('')
    const [expenseDescription, setExpenseDescription] = useState('')
    const [expenseValue, setExpenseValue] = useState('')

    const selectedPeriod = useMemo(() => {
        return periods.find(period => period.id === selectedPeriodId) || null
    }, [periods, selectedPeriodId])

    const totals = useMemo(() => {
        if (!selectedPeriod) {
            return { income: 0, expense: 0, result: 0, margin: 0 }
        }
        const totalIncome = selectedPeriod.incomes.reduce((sum, item) => sum + (Number(item.value) || 0), 0)
        const totalExpense = selectedPeriod.expenses.reduce((sum, item) => sum + (Number(item.value) || 0), 0)
        const result = totalIncome - totalExpense
        const margin = totalIncome > 0 ? (result / totalIncome) * 100 : 0
        return { income: totalIncome, expense: totalExpense, result, margin }
    }, [selectedPeriod])

    const chartData = useMemo(() => {
        return periods.map(period => {
            const income = period.incomes.reduce((sum, item) => sum + (Number(item.value) || 0), 0)
            const expense = period.expenses.reduce((sum, item) => sum + (Number(item.value) || 0), 0)
            const result = income - expense

            return {
                name: period.name,
                income,
                expense,
                result
            }
        })
    }, [periods])

    return (
        <div>
            {tela === 'listaPeriodos' && (
                <div className="space-y-4">
                    {periods.length === 0 ? (
                        <EmptyState
                            icon={PiggyBank}
                            title="Nenhum período cadastrado"
                            description="Crie seu primeiro período para acompanhar receitas e despesas."
                            actionLabel="Adicionar Período"
                            onAction={() => {
                                setPeriodToEdit(null)
                                setPeriodName('')
                                setTela('formularioPeriodo')
                            }}
                        />
                    ) : (
                        <>
                            <div className="flex flex-wrap gap-2">
                                <Button onClick={() => {
                                    setPeriodToEdit(null)
                                    setPeriodName('')
                                    setTela('formularioPeriodo')
                                }}>
                                    Adicionar Período
                                </Button>
                            </div>

                            <PeriodCharts chartData={chartData} />

                            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                                {periods.map(period => {
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
                                                    <Button
                                                        variant="default"
                                                        onClick={() => {
                                                            setSelectedPeriodId(period.id)
                                                            setTela('detalhePeriodo')
                                                        }}
                                                    >
                                                        Detalhes
                                                    </Button>
                                                    <Button
                                                        variant="secondary"
                                                        onClick={() => {
                                                            setPeriodToEdit(period)
                                                            setPeriodName(period.name)
                                                            setTela('formularioPeriodo')
                                                        }}
                                                    >
                                                        Editar
                                                    </Button>
                                                    <Button
                                                        variant="secondary"
                                                        onClick={() => copyPeriod(period.id, `${period.name} (Cópia)`)}
                                                    >
                                                        Copiar
                                                    </Button>
                                                    <Button
                                                        variant="destructive"
                                                        onClick={() => setPeriodToRemove(period)}
                                                    >
                                                        Remover
                                                    </Button>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    )
                                })}
                            </div>
                        </>
                    )}
                </div>
            )}

            {tela === 'formularioPeriodo' && (
                <Card className="max-w-xl">
                    <CardHeader>
                        <CardTitle>{periodToEdit ? 'Editar Período' : 'Novo Período'}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {!periodToEdit && (
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
                                value={periodName}
                                onChange={(event) => setPeriodName(event.target.value)}
                                placeholder="Ex: Maio 2026"
                            />
                        </div>

                        <div className="flex gap-2">
                            <Button
                                onClick={() => {
                                    if (!periodName.trim()) return
                                    if (periodToEdit) {
                                        updatePeriod(periodToEdit.id, { name: periodName.trim() })
                                    } else {
                                        addPeriod(periodName.trim())
                                    }
                                    setPeriodToEdit(null)
                                    setPeriodName('')
                                    setTela('listaPeriodos')
                                }}
                            >
                                Salvar
                            </Button>
                            <Button
                                variant="secondary"
                                onClick={() => {
                                    setPeriodToEdit(null)
                                    setPeriodName('')
                                    setTela('listaPeriodos')
                                }}
                            >
                                Cancelar
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            )}

            {tela === 'detalhePeriodo' && selectedPeriod && (
                <div className="space-y-6">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                        <div>
                            <h2 className="text-2xl font-bold">{selectedPeriod.name}</h2>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            <Button
                                onClick={() => {
                                    setIncomeToEdit(null)
                                    setIncomeDescription('')
                                    setIncomeValue('')
                                    setTela('formularioReceita')
                                }}
                            >
                                Adicionar Receita
                            </Button>
                            <Button
                                variant="secondary"
                                onClick={() => {
                                    setExpenseToEdit(null)
                                    setExpenseDescription('')
                                    setExpenseValue('')
                                    setTela('formularioDespesa')
                                }}
                            >
                                Adicionar Despesa
                            </Button>
                            <Button
                                variant="ghost"
                                onClick={() => setTela('listaPeriodos')}
                            >
                                Voltar
                            </Button>
                        </div>
                    </div>

                    <PeriodSummary totals={totals} />

                    <div className="grid gap-4 md:grid-cols-2">
                        <Card>
                            <CardHeader>
                                <CardTitle>Receitas</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                {selectedPeriod.incomes.length === 0 ? (
                                    <EmptyState
                                        icon={TrendingUp}
                                        title="Nenhuma receita registrada"
                                        description="Adicione receitas para acompanhar o desempenho do período."
                                        actionLabel="Adicionar Receita"
                                        onAction={() => {
                                            setIncomeToEdit(null)
                                            setIncomeDescription('')
                                            setIncomeValue('')
                                            setTela('formularioReceita')
                                        }}
                                    />
                                ) : selectedPeriod.incomes.map((income) => (
                                    <div key={income.id} className="flex items-center justify-between gap-3">
                                        <div>
                                            <div className="font-medium">{income.description}</div>
                                            <div className="text-sm text-muted-foreground">{formatCurrency(Number(income.value) || 0)}</div>
                                        </div>
                                        <div className="flex gap-2">
                                            <Button
                                                size="sm"
                                                variant="secondary"
                                                onClick={() => {
                                                    setIncomeToEdit(income)
                                                    setIncomeDescription(income.description)
                                                    setIncomeValue(String(income.value ?? ''))
                                                    setTela('formularioReceita')
                                                }}
                                            >
                                                Editar
                                            </Button>
                                            <Button
                                                size="sm"
                                                variant="destructive"
                                                onClick={() => setIncomeToRemove({ periodId: selectedPeriod.id, income })}
                                            >
                                                Remover
                                            </Button>
                                        </div>
                                    </div>
                                ))}
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Despesas</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                {selectedPeriod.expenses.length === 0 ? (
                                    <EmptyState
                                        icon={TrendingDown}
                                        title="Nenhuma despesa registrada"
                                        description="Adicione despesas para manter o controle do período."
                                        actionLabel="Adicionar Despesa"
                                        onAction={() => {
                                            setExpenseToEdit(null)
                                            setExpenseDescription('')
                                            setExpenseValue('')
                                            setTela('formularioDespesa')
                                        }}
                                    />
                                ) : selectedPeriod.expenses.map((expense) => (
                                    <div key={expense.id} className="flex items-center justify-between gap-3">
                                        <div>
                                            <div className="font-medium">{expense.description}</div>
                                            <div className="text-sm text-muted-foreground">{formatCurrency(Number(expense.value) || 0)}</div>
                                        </div>
                                        <div className="flex gap-2">
                                            <Button
                                                size="sm"
                                                variant="secondary"
                                                onClick={() => {
                                                    setExpenseToEdit(expense)
                                                    setExpenseDescription(expense.description)
                                                    setExpenseValue(String(expense.value ?? ''))
                                                    setTela('formularioDespesa')
                                                }}
                                            >
                                                Editar
                                            </Button>
                                            <Button
                                                size="sm"
                                                variant="destructive"
                                                onClick={() => setExpenseToRemove({ periodId: selectedPeriod.id, expense })}
                                            >
                                                Remover
                                            </Button>
                                        </div>
                                    </div>
                                ))}
                            </CardContent>
                        </Card>
                    </div>
                </div>
            )}

            {tela === 'formularioReceita' && selectedPeriod && (
                <Card className="max-w-xl">
                    <CardHeader>
                        <CardTitle>{incomeToEdit ? 'Editar Receita' : 'Nova Receita'}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {!incomeToEdit && (
                            <div className="px-1">
                                <p className="text-sm font-medium mb-2">Como cadastrar uma receita:</p>
                                <ol className="text-sm text-muted-foreground list-decimal list-inside space-y-1">
                                    <li>Descreva a origem da receita, como "Venda X"</li>
                                    <li>Informe o valor recebido no período</li>
                                    <li>O resultado do período será atualizado automaticamente</li>
                                </ol>
                            </div>
                        )}
                        <div>
                            <Label className="mb-2" htmlFor="incomeDescription">Descrição</Label>
                            <Input
                                id="incomeDescription"
                                type="text"
                                value={incomeDescription}
                                onChange={(event) => setIncomeDescription(event.target.value)}
                            />
                        </div>
                        <div>
                            <Label className="mb-2" htmlFor="incomeValue">Valor</Label>
                            <Input
                                id="incomeValue"
                                type="text"
                                inputMode="numeric"
                                value={incomeValue}
                                placeholder="0,00"
                                onChange={(event) => setIncomeValue(maskCurrency(event.target.value))}
                            />
                        </div>

                        <div className="flex gap-2">
                            <Button
                                onClick={() => {
                                    const value = parseUserValue(incomeValue)
                                    if (!incomeDescription.trim()) return
                                    if (incomeToEdit) {
                                        updateIncome(selectedPeriod.id, incomeToEdit.id, {
                                            description: incomeDescription.trim(),
                                            value: Number.isNaN(value) ? 0 : value
                                        })
                                    } else {
                                        addIncome(selectedPeriod.id, {
                                            description: incomeDescription.trim(),
                                            value: Number.isNaN(value) ? 0 : value
                                        })
                                    }
                                    setIncomeToEdit(null)
                                    setIncomeDescription('')
                                    setIncomeValue('')
                                    setTela('detalhePeriodo')
                                }}
                            >
                                Salvar
                            </Button>
                            <Button
                                variant="secondary"
                                onClick={() => {
                                    setIncomeToEdit(null)
                                    setIncomeDescription('')
                                    setIncomeValue('')
                                    setTela('detalhePeriodo')
                                }}
                            >
                                Cancelar
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            )}

            {tela === 'formularioDespesa' && selectedPeriod && (
                <Card className="max-w-xl">
                    <CardHeader>
                        <CardTitle>{expenseToEdit ? 'Editar Despesa' : 'Nova Despesa'}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {!expenseToEdit && (
                            <div className="px-1">
                                <p className="text-sm font-medium mb-2">Como cadastrar uma despesa:</p>
                                <ol className="text-sm text-muted-foreground list-decimal list-inside space-y-1">
                                    <li>Descreva o custo, como "Fornecedor Y"</li>
                                    <li>Informe o valor gasto no período</li>
                                    <li>O resultado do período será atualizado automaticamente</li>
                                </ol>
                            </div>
                        )}
                        <div>
                            <Label className="mb-2" htmlFor="expenseDescription">Descrição</Label>
                            <Input
                                id="expenseDescription"
                                type="text"
                                value={expenseDescription}
                                onChange={(event) => setExpenseDescription(event.target.value)}
                            />
                        </div>
                        <div>
                            <Label className="mb-2" htmlFor="expenseValue">Valor</Label>
                            <Input
                                id="expenseValue"
                                type="text"
                                inputMode="numeric"
                                value={expenseValue}
                                placeholder="0,00"
                                onChange={(event) => setExpenseValue(maskCurrency(event.target.value))}
                            />
                        </div>

                        <div className="flex gap-2">
                            <Button
                                onClick={() => {
                                    const value = parseUserValue(expenseValue)
                                    if (!expenseDescription.trim()) return
                                    if (expenseToEdit) {
                                        updateExpense(selectedPeriod.id, expenseToEdit.id, {
                                            description: expenseDescription.trim(),
                                            value: Number.isNaN(value) ? 0 : value
                                        })
                                    } else {
                                        addExpense(selectedPeriod.id, {
                                            description: expenseDescription.trim(),
                                            value: Number.isNaN(value) ? 0 : value
                                        })
                                    }
                                    setExpenseToEdit(null)
                                    setExpenseDescription('')
                                    setExpenseValue('')
                                    setTela('detalhePeriodo')
                                }}
                            >
                                Salvar
                            </Button>
                            <Button
                                variant="secondary"
                                onClick={() => {
                                    setExpenseToEdit(null)
                                    setExpenseDescription('')
                                    setExpenseValue('')
                                    setTela('detalhePeriodo')
                                }}
                            >
                                Cancelar
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            )}

            {periodToRemove && (
                <ConfirmDialog
                    open={true}
                    title="Remover período"
                    description={`Tem certeza que deseja remover "${periodToRemove.name}"?`}
                    onCancel={() => setPeriodToRemove(null)}
                    onConfirm={() => {
                        removePeriod(periodToRemove.id)
                        if (selectedPeriodId === periodToRemove.id) {
                            setSelectedPeriodId(null)
                            setTela('listaPeriodos')
                        }
                        setPeriodToRemove(null)
                    }}
                />
            )}

            {incomeToRemove && (
                <ConfirmDialog
                    open={true}
                    title="Remover receita"
                    description={`Tem certeza que deseja remover "${incomeToRemove.income.description}"?`}
                    onCancel={() => setIncomeToRemove(null)}
                    onConfirm={() => {
                        removeIncome(incomeToRemove.periodId, incomeToRemove.income.id)
                        setIncomeToRemove(null)
                    }}
                />
            )}

            {expenseToRemove && (
                <ConfirmDialog
                    open={true}
                    title="Remover despesa"
                    description={`Tem certeza que deseja remover "${expenseToRemove.expense.description}"?`}
                    onCancel={() => setExpenseToRemove(null)}
                    onConfirm={() => {
                        removeExpense(expenseToRemove.periodId, expenseToRemove.expense.id)
                        setExpenseToRemove(null)
                    }}
                />
            )}
        </div>
    )
}

export default BusinessModule

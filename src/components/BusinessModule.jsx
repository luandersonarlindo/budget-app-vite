import { useMemo, useState } from 'react'

import { Button } from './ui/button'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Input } from './ui/input'
import { Label } from './ui/label'
import ConfirmDialog from './ui/confirm-dialog'
import EmptyState from './EmptyState'
import { formatCurrency } from '../utils/formatters'
import PeriodForm from './forms/PeriodForm'
import IncomeForm from './forms/IncomeForm'
import ExpenseFormBusiness from './forms/ExpenseFormBusiness'
import CopyDialog from './ui/copy-dialog'
import useBusiness from '../hooks/useBusiness'
import IncomeList from './IncomeList'
import ExpenseListBusiness from './ExpenseListBusiness'
import PeriodCharts from './PeriodCharts'
import PeriodList from './PeriodList'
import PeriodSummary from './PeriodSummary'
import { PiggyBank } from 'lucide-react'

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
    const [copyTarget, setCopyTarget] = useState(null)



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
                                setTela('formularioPeriodo')
                            }}
                        />
                    ) : (
                        <>
                            <div className="flex flex-wrap gap-2">
                                <Button onClick={() => {
                                    setPeriodToEdit(null)
                                    setTela('formularioPeriodo')
                                }}>
                                    Adicionar Período
                                </Button>
                            </div>

                            <PeriodCharts chartData={chartData} />

                                <PeriodList
                                periods={periods}
                                onSelect={(periodId) => {
                                    setSelectedPeriodId(periodId)
                                    setTela('detalhePeriodo')
                                }}
                                onEdit={(period) => {
                                    setPeriodToEdit(period)

                                    setTela('formularioPeriodo')
                                }}
                                onRemove={(period) => setPeriodToRemove(period)}
                                onCopy={(period) => {
                                    setCopyTarget(period)
                                }}
                            />
                        </>
                    )}
                </div>
            )}

            {tela === 'formularioPeriodo' && (
                <PeriodForm
                    period={periodToEdit}
                    onSave={(name) => {
                        if (periodToEdit) updatePeriod(periodToEdit.id, { name })
                        else addPeriod(name)
                        setPeriodToEdit(null)
                        setTela('listaPeriodos')
                    }}
                    onCancel={() => {
                        setPeriodToEdit(null)
                        setTela('listaPeriodos')
                    }}
                />
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
                                    setTela('formularioReceita')
                                }}
                            >
                                Adicionar Receita
                            </Button>
                            <Button
                                variant="secondary"
                                onClick={() => {
                                    setExpenseToEdit(null)
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
                            <CardContent>
                                <IncomeList
                                    incomes={selectedPeriod.incomes}
                                    onAddNew={() => {
                                        setIncomeToEdit(null)
                                        setTela('formularioReceita')
                                    }}
                                    onEdit={(income) => {
                                        setIncomeToEdit(income)
                                        setTela('formularioReceita')
                                    }}
                                    onRemove={(income) => setIncomeToRemove({ periodId: selectedPeriod.id, income })}
                                />
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Despesas</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <ExpenseListBusiness
                                    expenses={selectedPeriod.expenses}
                                    onAddNew={() => {
                                        setExpenseToEdit(null)
                                        setTela('formularioDespesa')
                                    }}
                                    onEdit={(expense) => {
                                        setExpenseToEdit(expense)
                                        setTela('formularioDespesa')
                                    }}
                                    onRemove={(expense) => setExpenseToRemove({ periodId: selectedPeriod.id, expense })}
                                />
                            </CardContent>
                        </Card>
                    </div>
                </div>
            )}

            {tela === 'formularioReceita' && selectedPeriod && (
                <IncomeForm
                    income={incomeToEdit}
                    onSave={({ description, value }) => {
                        if (incomeToEdit) updateIncome(selectedPeriod.id, incomeToEdit.id, { description, value })
                        else addIncome(selectedPeriod.id, { description, value })
                        setIncomeToEdit(null)
                        setTela('detalhePeriodo')
                    }}
                    onCancel={() => {
                        setIncomeToEdit(null)
                        setTela('detalhePeriodo')
                    }}
                />
            )}

            {tela === 'formularioDespesa' && selectedPeriod && (
                <ExpenseFormBusiness
                    expense={expenseToEdit}
                    onSave={({ description, value }) => {
                        if (expenseToEdit) updateExpense(selectedPeriod.id, expenseToEdit.id, { description, value })
                        else addExpense(selectedPeriod.id, { description, value })
                        setExpenseToEdit(null)
                        setTela('detalhePeriodo')
                    }}
                    onCancel={() => {
                        setExpenseToEdit(null)
                        setTela('detalhePeriodo')
                    }}
                />
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

            {copyTarget && (
                <CopyDialog
                    open={true}
                    initialName={`${copyTarget.name} (cópia)`}
                    onCancel={() => setCopyTarget(null)}
                    onConfirm={(name) => {
                        if (name && name.trim()) {
                            copyPeriod(copyTarget.id, name.trim())
                        } else {
                            copyPeriod(copyTarget.id)
                        }
                        setCopyTarget(null)
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

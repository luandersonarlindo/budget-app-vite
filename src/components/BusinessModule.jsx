import { useMemo, useState } from 'react'
import { ChevronDown, Download, PiggyBank } from 'lucide-react'
import useBusiness from '../hooks/useBusiness'
import { ButtonGroup } from '../components/ui/button-group'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '../components/ui/dropdown-menu'
import { exportCSVBusiness, exportJSON, importJSON } from '../utils/exportImport'
import EmptyState from './EmptyState'
import ExpenseListBusiness from './ExpenseListBusiness'
import ExpenseFormBusiness from './forms/ExpenseFormBusiness'
import IncomeForm from './forms/IncomeForm'
import PeriodForm from './forms/PeriodForm'
import IncomeList from './IncomeList'
import ParetoChart from './ParetoChart'
import PeriodCharts from './PeriodCharts'
import PeriodList from './PeriodList'
import PeriodSummary from './PeriodSummary'
import { Button } from './ui/button'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import ConfirmDialog from './ui/confirm-dialog'
import CopyDialog from './ui/copy-dialog'

function BusinessModule() {
    const {
        periods,
        setPeriods,
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

    const paretoData = useMemo(() => {
        if (!selectedPeriod || selectedPeriod.expenses.length === 0) {
            return []
        }

        // 1. Agrupar despesas por descrição
        const grouped = selectedPeriod.expenses.reduce((acc, expense) => {
            const key = expense.description.toLowerCase().trim()
            if (!acc[key]) {
                acc[key] = {
                    description: key.charAt(0).toUpperCase() + key.slice(1),
                    total: 0
                }
            }
            acc[key].total += Number(expense.value) || 0
            return acc
        }, {})

        // 2. Converter para array e ordenar por valor (decrescente)
        const sorted = Object.values(grouped).sort((a, b) => b.total - a.total)

        // 3. Calcular total de despesas
        const totalExpenses = sorted.reduce((sum, item) => sum + item.total, 0)

        // 4. Calcular percentual e cumulativo
        let cumulativoAcumulado = 0
        const pareto = sorted.map(item => {
            const percentual = totalExpenses > 0 ? (item.total / totalExpenses) * 100 : 0
            cumulativoAcumulado += percentual
            return {
                description: item.description,
                total: item.total,
                percentual: parseFloat(percentual.toFixed(2)),
                cumulativo: parseFloat(cumulativoAcumulado.toFixed(2))
            }
        })

        return pareto
    }, [selectedPeriod])

    const paretoDataReceitas = useMemo(() => {
        if (!selectedPeriod || selectedPeriod.incomes.length === 0) {
            return []
        }

        const grouped = selectedPeriod.incomes.reduce((acc, income) => {
            const key = income.description.toLowerCase().trim()
            if (!acc[key]) {
                acc[key] = {
                    description: key.charAt(0).toUpperCase() + key.slice(1),
                    total: 0
                }
            }
            acc[key].total += Number(income.value) || 0
            return acc
        }, {})

        const sorted = Object.values(grouped).sort((a, b) => b.total - a.total)
        const totalIncomes = sorted.reduce((sum, item) => sum + item.total, 0)

        let cumulativoAcumulado = 0
        return sorted.map(item => {
            const percentual = totalIncomes > 0 ? (item.total / totalIncomes) * 100 : 0
            cumulativoAcumulado += percentual

            return {
                description: item.description,
                total: item.total,
                percentual: parseFloat(percentual.toFixed(2)),
                cumulativo: parseFloat(cumulativoAcumulado.toFixed(2))
            }
        })
    }, [selectedPeriod])

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

                            <div className="flex flex-wrap gap-2 mb-4">
                                <Button onClick={() => { setPeriodToEdit(null); setTela('formularioPeriodo') }}>
                                    Adicionar Período
                                </Button>

                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="outline">
                                            <Download className="h-4 w-4" />
                                            Exportar / Importar
                                            <ChevronDown className="h-4 w-4" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent>
                                        <DropdownMenuItem onClick={() => exportJSON(periods, 'negocios.json')}>
                                            Exportar JSON
                                        </DropdownMenuItem>
                                        <DropdownMenuItem onClick={() => exportCSVBusiness(periods, 'negocios.csv')}>
                                            Exportar CSV
                                        </DropdownMenuItem>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem onClick={() => document.getElementById('import-business').click()}>
                                            Importar JSON
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                                <input
                                    id="import-business"
                                    type="file"
                                    accept=".json"
                                    className="hidden"
                                    onChange={async (e) => {
                                        const file = e.target.files?.[0]
                                        if (!file) return
                                        try {
                                            const data = await importJSON(file)
                                            if (Array.isArray(data)) {
                                                data.forEach(p => {
                                                    const newPeriod = {
                                                        ...p,
                                                        id: crypto.randomUUID(),
                                                        incomes: (p.incomes || []).map(i => ({ ...i, id: crypto.randomUUID() })),
                                                        expenses: (p.expenses || []).map(e => ({ ...e, id: crypto.randomUUID() }))
                                                    }
                                                    setPeriods(prev => [...prev, newPeriod])
                                                })
                                            }
                                        } catch (err) {
                                            alert(err.message)
                                        }
                                        e.target.value = ''
                                    }}
                                />
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

                    <div className="grid gap-4 lg:grid-cols-2">
                        <ParetoChart
                            paretoData={paretoDataReceitas}
                            title="Diagrama de Pareto - Receitas"
                            subtitle="Mostra quais fontes de receita concentram a maior parte do faturamento e ajudam a direcionar crescimento."
                            emptyMessage="Nenhuma receita registrada para este período."
                        />

                        <ParetoChart
                            paretoData={paretoData}
                            title="Diagrama de Pareto - Despesas"
                            subtitle="Mostra quais custos concentram a maior parte do gasto e ajudam a direcionar contenção."
                            emptyMessage="Nenhuma despesa registrada para este período."
                        />
                    </div>

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

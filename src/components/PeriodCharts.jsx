import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { ButtonGroup } from './ui/button-group'
import { Button } from './ui/button'
import { formatCurrency } from '../utils/formatters'

const FILTERS = [
    { label: 'Todos', value: 'all' },
    { label: 'Últimos 3 meses', value: '3m' },
    { label: 'Último mês', value: '1m' },
]

function filterData(data, filter) {
    if (filter === 'all' || data.length === 0) return data
    if (filter === '3m') return data.slice(-3)
    if (filter === '1m') return data.slice(-1)
    return data
}

function PeriodCharts({ chartData }) {
    const [filter, setFilter] = useState('all')

    if (!chartData?.length) return null

    const filtered = filterData(chartData, filter)

    return (
        <div className="space-y-4">
            <Card>
                <CardHeader className="flex flex-row items-start justify-between gap-4">
                    <div>
                        <CardTitle>Receitas vs Despesas</CardTitle>
                        <CardDescription className="mt-1">Comparativo por período</CardDescription>
                    </div>
                    <ButtonGroup>
                        {FILTERS.map(f => (
                            <Button
                                key={f.value}
                                variant={filter === f.value ? 'default' : 'outline'}
                                size="sm"
                                onClick={() => setFilter(f.value)}
                            >
                                {f.label}
                            </Button>
                        ))}
                    </ButtonGroup>
                </CardHeader>
                <CardContent className="p-0">
                    <div className="overflow-x-auto">
                        <div className="min-w-[600px] h-80 px-4 pb-4">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={filtered}>
                                    <defs>
                                        <linearGradient id="gradIncome" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3} />
                                            <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
                                        </linearGradient>
                                        <linearGradient id="gradExpense" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3} />
                                            <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="currentColor" strokeOpacity={0.1} />
                                    <XAxis dataKey="name" tickLine={false} axisLine={false} tick={{ fontSize: 12 }} />
                                    <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 12 }} tickFormatter={(v) => formatCurrency(v)} width={90} />
                                    <Tooltip formatter={(value) => formatCurrency(value)} />
                                    <Area type="monotone" dataKey="income" name="Receitas" stroke="#22c55e" strokeWidth={2} fill="url(#gradIncome)" />
                                    <Area type="monotone" dataKey="expense" name="Despesas" stroke="#ef4444" strokeWidth={2} fill="url(#gradExpense)" />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Evolução do resultado</CardTitle>
                    <CardDescription>Resultado líquido por período</CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                    <div className="overflow-x-auto">
                        <div className="min-w-[600px] h-80 px-4 pb-4">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={filtered}>
                                    <defs>
                                        <linearGradient id="gradResult" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#2563eb" stopOpacity={0.3} />
                                            <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="currentColor" strokeOpacity={0.1} />
                                    <XAxis dataKey="name" tickLine={false} axisLine={false} tick={{ fontSize: 12 }} />
                                    <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 12 }} tickFormatter={(v) => formatCurrency(v)} width={90} />
                                    <Tooltip formatter={(value) => formatCurrency(value)} />
                                    <Area type="monotone" dataKey="result" name="Resultado" stroke="#2563eb" strokeWidth={2} fill="url(#gradResult)" />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}

export default PeriodCharts
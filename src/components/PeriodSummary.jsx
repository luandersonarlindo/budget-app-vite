import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { formatCurrency } from '../utils/formatters'
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts'

function PeriodSummary({ totals }) {
    const pieData = [
        { name: 'Receitas', value: totals.income },
        { name: 'Despesas', value: totals.expense }
    ]

    const isPositive = totals.result >= 0

    return (
        <Card>
            <CardHeader className="pb-2">
                <CardTitle>Resumo do período</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-6 md:grid-cols-2">
                <div className="space-y-4">
                    <div>
                        <p className="text-sm text-muted-foreground">Resultado</p>
                        <p className={`text-4xl font-bold ${isPositive ? 'text-emerald-600' : 'text-red-500'}`}>
                            {formatCurrency(totals.result)}
                        </p>
                        <p className="text-sm text-muted-foreground mt-1">
                            Margem: {totals.margin.toFixed(1)}%
                        </p>
                    </div>

                    <div className="space-y-2 pt-2 border-t">
                        <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Receitas</span>
                            <span className="font-medium text-emerald-600">
                                {formatCurrency(totals.income)}
                            </span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Despesas</span>
                            <span className="font-medium text-red-500">
                                {formatCurrency(totals.expense)}
                            </span>
                        </div>
                    </div>
                </div>

                <div className="h-64">
                    {totals.income === 0 && totals.expense === 0 ? (
                        <p className="text-sm text-muted-foreground">Nenhum dado para exibir.</p>
                    ) : (
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <defs>
                                    <linearGradient id="gradReceitas" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#22c55e" stopOpacity={0.9} />
                                        <stop offset="95%" stopColor="#22c55e" stopOpacity={0.5} />
                                    </linearGradient>
                                    <linearGradient id="gradDespesas" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#ef4444" stopOpacity={0.9} />
                                        <stop offset="95%" stopColor="#ef4444" stopOpacity={0.5} />
                                    </linearGradient>
                                </defs>
                                <Pie
                                    data={pieData}
                                    dataKey="value"
                                    nameKey="name"
                                    innerRadius={60}
                                    outerRadius={90}
                                    paddingAngle={3}
                                    strokeWidth={0}
                                >
                                    <Cell fill="url(#gradReceitas)" />
                                    <Cell fill="url(#gradDespesas)" />
                                </Pie>
                                <Tooltip
                                    formatter={(value) => formatCurrency(value)}
                                    contentStyle={{
                                        borderRadius: '8px',
                                        border: '1px solid var(--border)',
                                        background: 'var(--background)',
                                        fontSize: '13px'
                                    }}
                                />
                                <Legend
                                    iconType="circle"
                                    iconSize={8}
                                    formatter={(value) => (
                                        <span style={{ fontSize: '13px' }}>{value}</span>
                                    )}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                    )}
                </div>
            </CardContent>
        </Card>
    )
}

export default PeriodSummary
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
                                <Pie
                                    data={pieData}
                                    dataKey="value"
                                    nameKey="name"
                                    innerRadius={50}
                                    outerRadius={80}
                                    paddingAngle={4}
                                >
                                    <Cell fill="#22c55e" />
                                    <Cell fill="#ef4444" />
                                </Pie>
                                <Tooltip />
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    )}
                </div>
            </CardContent>
        </Card>
    )
}

export default PeriodSummary
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { formatCurrency } from '../utils/formatters'
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts'

function PeriodSummary({ totals }) {
    const pieData = [
        { name: 'Receitas', value: totals.income },
        { name: 'Despesas', value: totals.expense }
    ]

    return (
        <Card>
            <CardHeader>
                <CardTitle>Resumo do período</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-6 md:grid-cols-2">
                <div className="space-y-3">
                    <div>
                        <div className="text-sm text-muted-foreground">Receitas</div>
                        <div className="text-lg font-semibold">{formatCurrency(totals.income)}</div>
                    </div>
                    <div>
                        <div className="text-sm text-muted-foreground">Despesas</div>
                        <div className="text-lg font-semibold">{formatCurrency(totals.expense)}</div>
                    </div>
                    <div>
                        <div className="text-sm text-muted-foreground">Resultado</div>
                        <div className="text-lg font-semibold">{formatCurrency(totals.result)}</div>
                    </div>
                    <div>
                        <div className="text-sm text-muted-foreground">Margem</div>
                        <div className="text-lg font-semibold">{totals.margin.toFixed(1)}%</div>
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

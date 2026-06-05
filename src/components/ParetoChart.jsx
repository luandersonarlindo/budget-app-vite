import {
    ComposedChart,
    Bar,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    ReferenceLine
} from 'recharts'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import { formatCurrency } from '../utils/formatters'

function ParetoChart({
    paretoData,
    title = 'Diagrama de Pareto',
    subtitle = 'Visualize quais itens concentram o maior impacto.',
    emptyMessage = 'Nenhum registro encontrado para este período.'
}) {
    if (!paretoData || paretoData.length === 0) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>{title}</CardTitle>
                    <CardDescription>{subtitle}</CardDescription>
                </CardHeader>
                <CardContent>
                    <p className="text-sm text-muted-foreground">{emptyMessage}</p>
                </CardContent>
            </Card>
        )
    }

    const CustomTooltip = ({ active, payload }) => {
        if (active && payload && payload.length) {
            const data = payload[0].payload
            return (
                <div className="rounded-lg border bg-background p-3 shadow-md text-sm">
                    <p className="font-medium mb-1">{data.description}</p>
                    <p className="text-blue-500">Valor: {formatCurrency(data.total)}</p>
                    <p className="text-blue-500">{data.percentual.toFixed(2)}% do total</p>
                    <p className="text-orange-500">Cumulativo: {data.cumulativo.toFixed(2)}%</p>
                </div>
            )
        }
        return null
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>{title}</CardTitle>
                <CardDescription>{subtitle}</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
                <div className="px-4 pb-4">
                    <ResponsiveContainer width="100%" height={400}>
                        <ComposedChart
                            data={paretoData}
                            margin={{ top: 20, right: 30, left: 0, bottom: 60 }}
                        >
                            <defs>
                                <linearGradient id="gradPareto" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
                                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.4} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="currentColor" strokeOpacity={0.1} />
                            <XAxis
                                dataKey="description"
                                angle={-45}
                                textAnchor="end"
                                height={100}
                                interval={0}
                                tick={{ fontSize: 12 }}
                                tickLine={false}
                                axisLine={false}
                            />
                            <YAxis
                                yAxisId="left"
                                tickLine={false}
                                axisLine={false}
                                tick={{ fontSize: 12 }}
                                tickFormatter={(v) => formatCurrency(v)}
                                width={90}
                            />
                            <YAxis
                                yAxisId="right"
                                orientation="right"
                                domain={[0, 100]}
                                tickLine={false}
                                axisLine={false}
                                tick={{ fontSize: 12 }}
                                tickFormatter={(v) => `${v}%`}
                                width={45}
                            />
                            <Tooltip content={<CustomTooltip />} />
                            <Legend />
                            <ReferenceLine
                                yAxisId="right"
                                y={80}
                                stroke="#ef4444"
                                strokeDasharray="5 5"
                                label={{
                                    value: '80%',
                                    position: 'insideTopLeft',
                                    fill: '#ef4444',
                                    fontSize: 12
                                }}
                            />
                            <Bar
                                yAxisId="left"
                                dataKey="total"
                                fill="url(#gradPareto)"
                                name="Valor (R$)"
                                radius={[6, 6, 0, 0]}
                            />
                            <Line
                                yAxisId="right"
                                type="linear"
                                dataKey="cumulativo"
                                stroke="#f97316"
                                strokeWidth={2}
                                name="Cumulativo (%)"
                                dot={{ fill: '#f97316', r: 4 }}
                                activeDot={{ r: 6 }}
                            />
                        </ComposedChart>
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>
    )
}

export default ParetoChart
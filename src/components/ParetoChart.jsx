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
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { formatCurrency } from '../utils/formatters'

function ParetoChart({
    paretoData,
    title = 'Diagrama de Pareto',
    subtitle = 'Visualize quais itens concentram o maior impacto. A linha mostra o percentual acumulado.',
    emptyMessage = 'Nenhum registro encontrado para este período.'
}) {
    if (!paretoData || paretoData.length === 0) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>{title}</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-sm text-gray-500">{emptyMessage}</p>
                </CardContent>
            </Card>
        )
    }

    const CustomTooltip = ({ active, payload }) => {
        if (active && payload && payload.length) {
            const data = payload[0].payload
            return (
                <div className="rounded border border-gray-300 bg-white p-3 shadow-lg">
                    <p className="font-semibold">{data.description}</p>
                    <p className="text-sm text-blue-600">
                        Valor: {formatCurrency(data.total)}
                    </p>
                    <p className="text-sm text-blue-600">
                        {data.percentual.toFixed(2)}% do total
                    </p>
                    <p className="text-sm text-orange-600">
                        Cumulativo: {data.cumulativo.toFixed(2)}%
                    </p>
                </div>
            )
        }
        return null
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>{title}</CardTitle>
                <p className="text-sm text-gray-600 mt-2">
                    {subtitle}
                </p>
            </CardHeader>
            <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                    <ComposedChart
                        data={paretoData}
                        margin={{ top: 20, right: 30, left: 0, bottom: 60 }}
                    >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis
                            dataKey="description"
                            angle={-45}
                            textAnchor="end"
                            height={100}
                            interval={0}
                            tick={{ fontSize: 12 }}
                        />
                        <YAxis yAxisId="left" label={{ value: 'Valor (R$)', angle: -90, position: 'insideLeft' }} />
                        <YAxis
                            yAxisId="right"
                            orientation="right"
                            label={{ value: 'Percentual Cumulativo (%)', angle: 90, position: 'insideRight' }}
                            domain={[0, 100]}
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
                            fill="#3b82f6"
                            name="Valor (R$)"
                            radius={[8, 8, 0, 0]}
                        />
                        <Line
                            yAxisId="right"
                            type="linear"
                            dataKey="cumulativo"
                            stroke="#f97316"
                            strokeWidth={3}
                            name="Cumulativo (%)"
                            dot={{ fill: '#f97316', r: 5 }}
                            activeDot={{ r: 7 }}
                        />
                    </ComposedChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    )
}

export default ParetoChart

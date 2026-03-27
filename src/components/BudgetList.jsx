import { Button } from '../components/ui/button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '../components/ui/card'
import { formatCurrency } from '../utils/formatters'

function BudgetList({ budgets, onSelect, onDelete, onEdit, onCopy }) {
    if (budgets.length === 0) {
        return <p>Nenhum orçamento cadastrado.</p>
    }

    return (
        <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {budgets.map((budget, index) => (
                <Card key={index} className="mb-4">
                    <CardHeader>
                        <CardTitle>{budget.name}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p>{formatCurrency(budget.value)}</p>
                    </CardContent>  
                    <CardFooter className="flex flex-wrap gap-2">
                        <Button onClick={() => onSelect(budget, index)}>Ver despesas</Button>
                        <Button variant="outline" onClick={() => onEdit(index)}>Editar</Button>
                        <Button variant="secondary" onClick={() => onCopy(index, `${budget.name} (Cópia)`, budget.value)}>Copiar</Button>
                        <Button variant="destructive" onClick={() => onDelete(index)}>Deletar</Button>
                    </CardFooter>
                </Card>
            ))}
        </ul>
    )
}

export default BudgetList
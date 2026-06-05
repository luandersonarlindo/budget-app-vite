import { ChevronDown, Download } from 'lucide-react'
import BudgetList from '../BudgetList'
import { Button } from '../ui/button'
import { ButtonGroup } from '../ui/button-group'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '../ui/dropdown-menu'

function BudgetListView({
    budgets,
    onNewBudget,
    onManageCategories,
    onSelectBudget,
    onDeleteBudget,
    onEditBudget,
    onCopyBudget,
    onExportJSON,
    onExportCSV,
    onImportJSON
}) {
    return (
        <div>
            <div className="flex flex-wrap gap-2 mb-4">
                <ButtonGroup>
                    <Button variant="default" onClick={onNewBudget}>
                        Adicionar Orçamento
                    </Button>
                    <Button variant="default" onClick={onManageCategories}>
                        Gerenciar Categorias
                    </Button>
                </ButtonGroup>

                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline">
                            <Download className="h-4 w-4" />
                            Exportar / Importar
                            <ChevronDown className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                        <DropdownMenuItem onClick={onExportJSON}>
                            Exportar JSON
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={onExportCSV}>
                            Exportar CSV
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => document.getElementById('import-budget').click()}>
                            Importar JSON
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>

                <input
                    id="import-budget"
                    type="file"
                    accept=".json"
                    className="hidden"
                    onChange={async (e) => {
                        const file = e.target.files?.[0]
                        if (!file) return
                        await onImportJSON(file)
                        e.target.value = ''
                    }}
                />
            </div>

            <BudgetList
                budgets={budgets}
                onSelect={onSelectBudget}
                onDelete={onDeleteBudget}
                onEdit={onEditBudget}
                onCopy={onCopyBudget}
                onAddNew={onNewBudget}
            />
        </div>
    )
}

export default BudgetListView
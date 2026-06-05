# Budget App (React + Vite)

Aplicação de controle financeiro pessoal feita com **React**, com dois módulos principais: **Orçamentos** e **Negócio**.

## Visão geral

**Módulo Orçamentos:**
1. Crie um orçamento com nome e valor total.
2. Defina categorias (padrão ou personalizadas).
3. Adicione despesas dentro das categorias.
4. Acompanhe limite, gasto e saldo restante por categoria.

**Módulo Negócio:**
1. Crie períodos (ex.: Jan-2025).
2. Registre receitas e despesas por período.
3. Visualize gráficos de evolução e Diagrama de Pareto.
4. Acompanhe resultado líquido e margem por período.

## Tecnologias utilizadas

- **React 19**: construção da interface por componentes.
- **Vite 7**: ambiente de desenvolvimento e build.
- **Tailwind CSS v4**: utilitários de estilo.
- **shadcn/ui + Radix UI**: componentes de UI reutilizáveis (Button, Card, Select, ButtonGroup, DropdownMenu, Progress, AlertDialog, etc).
- **Recharts**: gráficos (AreaChart, ComposedChart, PieChart).
- **localStorage**: persistência dos dados no navegador.

Arquivos de configuração relevantes:

- `package.json`
- `vite.config.js`
- `components.json`
- `src/index.css`

## Como executar o projeto

Pré-requisito: Node.js instalado.

```bash
npm install
npm run dev
```

Para build de produção:

```bash
npm run build
npm run preview
```

Lint do projeto:

```bash
npm run lint
```

## Estrutura do projeto

```text
src/
  App.jsx
  main.jsx
  components/
    BudgetModule.jsx
    BusinessModule.jsx
    BudgetList.jsx
    BudgetForm.jsx
    ExpenseForm.jsx
    ExpenseList.jsx
    CategoryForm.jsx
    IncomeList.jsx
    ExpenseListBusiness.jsx
    PeriodList.jsx
    PeriodCharts.jsx
    PeriodSummary.jsx
    ParetoChart.jsx
    EmptyState.jsx
    ThemeToggle.jsx
    budget/
      BudgetListView.jsx
      BudgetDetailView.jsx
      CategoryManagerView.jsx
    forms/
      PeriodForm.jsx
      IncomeForm.jsx
      ExpenseFormBusiness.jsx
    ui/
      button.tsx
      card.tsx
      select.tsx
      progress.tsx
      button-group.tsx
      dropdown-menu.tsx
      alert-dialog.tsx
      confirm-dialog.jsx
      copy-dialog.jsx
      ...
  hooks/
    useBudgets.js
    useCategories.js
    useBusiness.js
  utils/
    formatters.js
    exportImport.js
    progressColor.js
```

### O papel de cada parte

- `App.jsx`: roteamento entre módulos via sidebar.
- `BudgetModule.jsx`: orquestra todas as telas do módulo de orçamentos.
- `BusinessModule.jsx`: orquestra todas as telas do módulo de negócio.
- `components/budget/`: views específicas de orçamento (lista, detalhe, categorias).
- `components/forms/`: formulários do módulo de negócio.
- `hooks/`: regras de negócio e persistência.
- `utils/formatters.js`: formatação e parsing de moeda.
- `utils/exportImport.js`: exportação (JSON/CSV) e importação (JSON).
- `utils/progressColor.js`: cor dinâmica das barras de progresso.

## Arquitetura e organização

O projeto separa responsabilidades em camadas:

1. **UI (Componentes)**: exibe e coleta dados.
2. **Lógica (Hooks)**: altera dados de orçamento/categoria/despesa/período.
3. **Persistência**: hooks salvam no `localStorage` via `useEffect`.
4. **Utilitários**: funções puras sem efeitos colaterais.

## Conceitos de React aplicados

### 1) `useState`

Controla tela atual, item em edição, mensagens de erro, itens pendentes de confirmação.

```jsx
const [tela, setTela] = useState('lista')
```

### 2) `useEffect`

Sincroniza estado com `localStorage` sempre que os dados mudam.

```jsx
useEffect(() => {
  localStorage.setItem('budgets', JSON.stringify(budgets))
}, [budgets])
```

### 3) `useMemo`

Evita recálculos desnecessários de valores derivados (totais, margens, dados de gráfico).

```jsx
const totals = useMemo(() => computeTotals(selectedPeriod), [selectedPeriod])
```

### 4) Props

Dados e funções descem do pai para os filhos via props (`onSave`, `onDelete`, `onEdit`, `onCopy`, etc).

### 5) Imutabilidade

Atualizações usam `map`, `filter` e spread (`...`) — nunca mutação direta.

## Regras de negócio implementadas

### Orçamentos

- criar, editar, copiar e remover orçamento (com confirmação).
- barra de progresso com cor dinâmica por percentual gasto.
- total de despesas e percentual gasto exibidos no card.

### Categorias

- categorias padrão: `Gastos Essenciais` (50%), `Prioridades Financeiras` (20%), `Estilo de Vida` (30%).
- criar e editar categorias personalizadas.
- impedir remoção de categoria em uso por orçamentos.

### Despesas (Orçamentos)

- criar, editar, remover (com confirmação), mover entre categorias, mover + editar em uma operação.
- status: `pendente`, `pago`, `cancelado`.

### Negócio (Períodos)

- criar, editar, copiar e remover períodos.
- registrar receitas e despesas por período.
- cálculo de resultado líquido e margem.
- gráficos: Receitas vs Despesas (AreaChart), Evolução do resultado (AreaChart), Diagrama de Pareto.
- filtro de período nos gráficos: Todos / Últimos 3 meses / Último mês.

## Exportar e Importar dados

Disponível nos dois módulos via dropdown **Exportar / Importar**:

- **Exportar JSON**: backup completo dos dados (importável de volta).
- **Exportar CSV**: planilha para abrir no Excel/Sheets.
- **Importar JSON**: mescla com os dados existentes, gerando novos IDs para evitar colisão.

Funções em `src/utils/exportImport.js`:
- `exportJSON(data, filename)`
- `exportCSVBudgets(budgets, filename)`
- `exportCSVBusiness(periods, filename)`
- `importJSON(file)` → retorna `Promise`

## Formatação monetária

No arquivo `src/utils/formatters.js`:

- `formatCurrency(value)`: formata para `pt-BR` (R$).
- `maskCurrency(value)`: aplica máscara enquanto digita.
- `parseUserValue(valueStr)`: converte texto em número para salvar.

## Persistência de dados

Chaves no `localStorage`:

- `budgets`: orçamentos com categorias e despesas.
- `categories`: categorias disponíveis.
- `businessPeriods`: períodos com receitas e despesas.

Ao recarregar a página, o app recupera os dados automaticamente.

## Barras de progresso

A cor da barra é calculada por `src/utils/progressColor.js`, compartilhado entre `BudgetList` e `ExpenseList`:

```js
export function getProgressColor(percentual) {
  if (percentual >= 90) return '[&>div]:bg-red-500'
  if (percentual >= 70) return '[&>div]:bg-yellow-500'
  return '[&>div]:bg-emerald-500'
}
```

## Observações importantes

- Entrada da aplicação: `src/main.jsx`.
- `src/index.js` existe mas não é usado (padrão antigo do CRA).
- `src/App.test.js` está com template antigo e não representa o comportamento atual.
- O script `test` não está definido no `package.json`.

## O que aprender com este projeto

1. como dividir tela em componentes e módulos.
2. como usar `useState`, `useEffect` e `useMemo` em caso real.
3. como organizar regras de negócio em hooks customizados.
4. como tratar formulários, validações e fluxos de navegação.
5. como persistir dados com `localStorage`.
6. como exportar e importar dados (JSON/CSV) no browser.
7. como usar componentes avançados do shadcn/ui (ButtonGroup, DropdownMenu).

## Próximos passos (sugestões)

- adicionar testes unitários para hooks e funções utilitárias.
- criar filtros e busca de despesas.
- extrair tipos para TypeScript.
- adicionar autenticação e backend no futuro.
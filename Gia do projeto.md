# Guia do Projeto (Iniciante em React)

## 1) O que é este projeto?

Este projeto é um **aplicativo de controle financeiro pessoal** feito com **React + Vite**, organizado em dois módulos:

**Módulo Orçamentos**: permite criar orçamentos, organizar categorias, adicionar despesas e acompanhar quanto já foi gasto em cada categoria.

**Módulo Negócio**: permite registrar receitas e despesas por período, visualizar gráficos de evolução e analisar onde o dinheiro está concentrado (Diagrama de Pareto).

Arquivo principal da aplicação: [src/App.jsx](src/App.jsx)

---

## 2) Tecnologias usadas (resumo simples)

- **React**: cria a interface em componentes.
- **Vite**: ferramenta de desenvolvimento/build.
- **Tailwind CSS v4**: estilos utilitários (classes prontas).
- **shadcn/ui + Radix UI**: componentes visuais reutilizáveis (Button, Card, Select, ButtonGroup, DropdownMenu, Progress, etc).
- **Recharts**: biblioteca de gráficos (AreaChart, ComposedChart, PieChart).
- **localStorage**: salva dados no navegador (sem backend).

Arquivos importantes:
- Configuração do Vite: [vite.config.js](vite.config.js)
- Entrada da aplicação: [src/main.jsx](src/main.jsx)
- Estilos globais: [src/index.css](src/index.css)
- Dependências: [package.json](package.json)

---

## 3) Como o projeto foi estruturado

### Módulos (orquestração de telas)
- [src/components/BudgetModule.jsx](src/components/BudgetModule.jsx) — controla todas as telas de orçamentos
- [src/components/BusinessModule.jsx](src/components/BusinessModule.jsx) — controla todas as telas de negócio/períodos

### Views específicas de orçamento
Ficam em [src/components/budget](src/components/budget):
- `BudgetListView.jsx` — tela da lista de orçamentos (botões de ação, grid de cards)
- `BudgetDetailView.jsx` — tela de detalhe de um orçamento (despesas por categoria)
- `CategoryManagerView.jsx` — tela de gerenciamento de categorias

### Componentes de tela
Ficam em [src/components](src/components):
- `BudgetList.jsx`, `BudgetForm.jsx`
- `ExpenseList.jsx`, `ExpenseForm.jsx`
- `CategoryForm.jsx`
- `PeriodList.jsx`, `PeriodCharts.jsx`, `PeriodSummary.jsx`, `ParetoChart.jsx`
- `IncomeList.jsx`, `ExpenseListBusiness.jsx`

### Formulários do módulo Negócio
Ficam em [src/components/forms](src/components/forms):
- `PeriodForm.jsx`, `IncomeForm.jsx`, `ExpenseFormBusiness.jsx`

### Hooks (estado e lógica)
Ficam em [src/hooks](src/hooks):
- [`useBudgets`](src/hooks/useBudgets.js) — CRUD de orçamentos, categorias e despesas, persistência
- [`useCategories`](src/hooks/useCategories.js) — CRUD de categorias disponíveis
- [`useBusiness`](src/hooks/useBusiness.js) — CRUD de períodos, receitas e despesas do módulo Negócio

### Utilitários
Ficam em [src/utils](src/utils):
- [`formatters.js`](src/utils/formatters.js) — `formatCurrency`, `maskCurrency`, `parseUserValue`
- [`exportImport.js`](src/utils/exportImport.js) — `exportJSON`, `exportCSVBudgets`, `exportCSVBusiness`, `importJSON`
- [`progressColor.js`](src/utils/progressColor.js) — `getProgressColor` (cor dinâmica das barras)

### UI reutilizável (shadcn)
Fica em [src/components/ui](src/components/ui): Button, Card, Select, Progress, ButtonGroup, DropdownMenu, AlertDialog, etc.

---

## 4) Assuntos de React abordados neste projeto

## ✅ Componentização
A interface foi quebrada em partes menores e organizadas em camadas: módulos → views → componentes → UI.

Exemplo central: [src/App.jsx](src/App.jsx)

## ✅ Estado com `useState`
O projeto usa vários estados para controlar tela atual, item selecionado, edição e erros.

### O que é `useState`
`useState` é um **hook do React** que permite guardar informações dentro do componente que mudam com o tempo e fazem a tela atualizar automaticamente.

### Sintaxe básica
```jsx
const [valor, setValor] = useState(valorInicial)
```

### Exemplo: controle de tela
```jsx
const [tela, setTela] = useState('lista')
```
Quando `setTela('formulario')` é chamado, o React renderiza novamente mostrando o formulário.

### Forma recomendada para atualizar com base no valor anterior
```jsx
setNumero((anterior) => anterior + 1)
```

## ✅ Efeitos com `useEffect`
`useEffect` executa algo além de renderizar a UI — chamados de "efeitos colaterais".

No projeto ele é usado para **sincronizar o estado com o localStorage**:

```jsx
useEffect(() => {
  localStorage.setItem('budgets', JSON.stringify(budgets))
}, [budgets])
```

O segundo argumento `[budgets]` é a **lista de dependências**: o efeito só roda quando `budgets` muda.

## ✅ Memoização com `useMemo`
`useMemo` evita recalcular valores derivados toda vez que o componente renderiza.

No projeto é usado para calcular totais e dados de gráfico:

```jsx
const totals = useMemo(() => {
  const totalIncome = selectedPeriod.incomes.reduce((sum, item) => sum + item.value, 0)
  const totalExpense = selectedPeriod.expenses.reduce((sum, item) => sum + item.value, 0)
  return { income: totalIncome, expense: totalExpense, result: totalIncome - totalExpense }
}, [selectedPeriod])
```

Só recalcula quando `selectedPeriod` muda.

## ✅ Hooks customizados
A lógica de dados foi separada em hooks para deixar os componentes mais limpos:

- [`useBudgets`](src/hooks/useBudgets.js) — orçamentos, categorias, despesas
- [`useCategories`](src/hooks/useCategories.js) — categorias disponíveis
- [`useBusiness`](src/hooks/useBusiness.js) — períodos, receitas, despesas do negócio

## ✅ Fluxo por props
Componentes filhos recebem dados e funções por props (`onSave`, `onDelete`, `onEdit`, `onCopy`, `onSelect`).

## ✅ Persistência no navegador
Os dados são salvos no `localStorage` dentro dos hooks, nas chaves:
- `budgets`
- `categories`
- `businessPeriods`

---

## 5) Exportar e importar dados

Disponível nos dois módulos via dropdown **Exportar / Importar**:

- **Exportar JSON**: backup completo, pode ser importado de volta.
- **Exportar CSV**: abre no Excel/Sheets para análise.
- **Importar JSON**: mescla com os dados existentes. Ao importar, todos os IDs são regenerados com `crypto.randomUUID()` para evitar colisão com dados existentes.

Funções em [`src/utils/exportImport.js`](src/utils/exportImport.js):

```js
exportJSON(data, filename)
exportCSVBudgets(budgets, filename)
exportCSVBusiness(periods, filename)
importJSON(file) // retorna Promise
```

---

## 6) Barras de progresso com cor dinâmica

A função `getProgressColor` em [`src/utils/progressColor.js`](src/utils/progressColor.js) é compartilhada entre `BudgetList` e `ExpenseList`:

```js
export function getProgressColor(percentual) {
  if (percentual >= 90) return '[&>div]:bg-red-500'   // vermelho
  if (percentual >= 70) return '[&>div]:bg-yellow-500' // amarelo
  return '[&>div]:bg-emerald-500'                      // verde
}
```

Centralizar aqui garante que os dois componentes sempre usem os mesmos limiares.

---

## 7) Gráficos (Recharts)

Todos os gráficos usam gradiente e estilo consistente com o tema da aplicação.

**PeriodCharts** — dois gráficos de área com filtro de período:
- Receitas vs Despesas (`AreaChart`)
- Evolução do resultado (`AreaChart`)

**PeriodSummary** — rosca de receitas vs despesas (`PieChart`)

**ParetoChart** — gráfico combinado barra + linha (`ComposedChart`) com linha de referência em 80%

---

## 8) Como o app funciona (passo a passo)

1. A aplicação inicia em [src/main.jsx](src/main.jsx) e renderiza [`App`](src/App.jsx).
2. `App` exibe a sidebar e renderiza `BudgetModule` ou `BusinessModule` conforme o módulo ativo.
3. Cada módulo controla sua própria navegação interna por telas usando `useState`.
4. Os hooks carregam dados do `localStorage` na inicialização e salvam automaticamente via `useEffect`.
5. Exportar gera um arquivo para download no browser. Importar lê um arquivo JSON e mescla os dados regenerando IDs.

---

## 9) Pontos didáticos para quem está começando em React

- **Separar UI de lógica**: UI em componentes, lógica em hooks.
- **IDs estáveis**: sempre use `crypto.randomUUID()` ao criar entidades — nunca referencie por índice de array.
- **Imutabilidade**: atualize arrays/objetos com `map`, `filter`, `...spread` — nunca mutação direta.
- **Utilitários puros**: funções sem efeito colateral ficam em `utils/` e são fáceis de testar.
- **Consistência**: um único `getProgressColor` serve dois componentes — evita divergência.

---

## 10) Resumo final

Este projeto reúne em um app real:

- componentes e módulos organizados em camadas;
- hooks customizados com persistência;
- formulários com validações;
- gráficos com Recharts;
- exportação/importação de dados (JSON e CSV);
- componentes avançados do shadcn/ui (ButtonGroup, DropdownMenu);
- utilitários compartilhados entre componentes.

Se você está começando, o caminho sugerido é:
1. entender [`App.jsx`](src/App.jsx) e a navegação entre módulos;
2. ler [`BudgetModule.jsx`](src/components/BudgetModule.jsx) para entender o fluxo de telas;
3. estudar os hooks em [src/hooks](src/hooks) para entender onde os dados vivem;
4. por fim, explorar os componentes de apresentação em [src/components](src/components).
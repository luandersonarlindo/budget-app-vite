# Guia do Projeto (Atualizado)

Este documento foi atualizado para refletir mudanças arquiteturais recentes: migração de referências por índice para identificadores estáveis (`id`), reorganização das views de orçamento e o uso intensivo de hooks customizados para separar lógica e persistência.

## 1) Visão geral

Aplicativo: gerenciador de orçamentos pessoais (React + Vite).

Objetivos principais:
- criar e copiar orçamentos;
- gerenciar categorias;
- adicionar, editar, mover e remover despesas;
- persistir dados no navegador (`localStorage`).

Ponto importante da refatoração recente:
- todas as entidades principais (orçamentos, categorias, despesas) agora possuem `id` (UUID via `crypto.randomUUID()`), e a comunicação entre hooks e componentes usa esses `id`s — isso evita bugs silenciosos causados por referências por índice em arrays.

---

## 2) Tecnologias

- **React** + **Vite**
- **Tailwind CSS**
- **shadcn/ui + Radix UI** (componentes base)
- **localStorage** (persistência local)

Comandos úteis:
```bash
npm install
npm run dev
npm run build
```

---

## 3) Estrutura e arquitetura (atual)

Arquitetura em camadas e responsabilidades:
- **Views / Orquestração**: componentes que definem telas e fluxo (ex.: `BudgetModule`).
- **Views específicas**: componentes que representam páginas/visões (ex.: `BudgetListView`, `BudgetDetailView`, `CategoryManagerView`).
- **Componentes UI**: elementos reutilizáveis (botões, cards, selects) sob `src/components/ui`.
- **Hooks**: encapsulam lógica de negócio e persistência (`src/hooks`).
- **Utils / Lib**: funções puras e formatação (`src/utils`).

Estrutura de arquivos (principal):
- `src/main.jsx` — entrada da aplicação
- `src/App.jsx` — roteamento/tela principal
- `src/components/` — components e views
  - `src/components/BudgetModule.jsx` — orquestrador de telas de orçamento
  - `src/components/BudgetList.jsx` — lista de cartões de orçamento (recebe `budget`/`id`)
  - `src/components/ExpenseForm.jsx` — formulário de despesa (usa `categoryId`)
  - `src/components/ExpenseList.jsx` — lista de despesas por categoria
  - `src/components/CategoryForm.jsx` — formulário de categoria
  - `src/components/ui/*` — componentes de UI reutilizáveis (Button, Card, Select, etc.)
  - `src/components/budget/` — views específicas de orçamento
    - `BudgetListView.jsx` — tela de lista de orçamentos
    - `BudgetDetailView.jsx` — tela de detalhe de um orçamento (despesas)
    - `CategoryManagerView.jsx` — tela para gerenciar categorias

  - `src/components/BusinessModule.jsx` — orquestrador do módulo de negócios/períodos
  - `src/components/period/` — views de período
    - `PeriodCharts.jsx` — gráficos por período
    - `PeriodSummary.jsx` — resumo/totais do período

- `src/hooks/` — hooks customizados
  - `useBudgets.js` — lógica e persistência de orçamentos + operações (add/update/remove/copy/addExpense/updateExpense/moveExpense/…). Todas as funções usam `budgetId`, `categoryId`, `expenseId`.
  - `useCategories.js` — CRUD de categorias
  - `useBusiness.js` — lógica de negócios por período (períodos, receitas, despesas, agregações para gráficos)
  - outros hooks conforme necessário

- `src/utils/formatters.js` — máscaras e parsing de moeda

Design decisions recentes:
- Identificadores estáveis (`id`) para evitar bugs causados por mudanças de posição em arrays.
- Separação explícita entre Views (p.ex. `BudgetListView`) e componentes de apresentação (p.ex. `BudgetList`) para permitir testes e reutilização.

---

## 4) Padrões de dados e IDs

- Sempre crie um `id` ao inserir uma nova entidade: `crypto.randomUUID()`.
- `budget` shape (exemplo):
```js
{
  id: 'uuid',
  name: 'Casa',
  value: 2500,
  categories: [ { id: 'cat-uuid', name: 'Moradia', expenses: [ { id: 'exp-uuid', description, value, status } ] } ]
}
```

- Todas as operações de `useBudgets` têm assinaturas baseadas em ids:
  - `addExpense(budgetId, categoryId, expense)`
  - `updateExpense(budgetId, categoryId, expenseId, expense)`
  - `removeExpense(budgetId, categoryId, expenseId)`
  - `moveExpense(budgetId, fromCategoryId, expenseId, toCategoryId)`

Motivação: usar ids torna o sistema robusto a reordenações ou filtros das listas.

---

## 5) Hooks e persistência (`useEffect`)

- `useBudgets` e `useCategories` utilizam `useEffect` para sincronizar o estado com o `localStorage`:

```jsx
useEffect(() => {
  localStorage.setItem('budgets', JSON.stringify(budgets))
}, [budgets])
```

- Recomenda-se executar uma normalização (migração) dos dados carregados do `localStorage` para garantir que entradas antigas recebam `id` quando ausente. Isso evita que a UI espere `id`s inexistentes.

Exemplo de normalização no load:

```js
const normalized = (raw || []).map(b => ({
  id: b.id || crypto.randomUUID(),
  categories: (b.categories || []).map(c => ({ id: c.id || crypto.randomUUID(), ...c, expenses: (c.expenses || []).map(e => ({ id: e.id || crypto.randomUUID(), ...e })) }))
}))
```

---

## 6) Performance: `useMemo` e `useCallback`

- Use `useMemo` para valores derivados custosos (ex.: totais por categoria, somas). Exemplo:

```jsx
const totals = useMemo(() => computeTotals(budget), [budget])
```

- Use `useCallback` ao passar callbacks para componentes filhos que dependem de identidade estável, especialmente quando os filhos usam `React.memo`.

- Observação específica do projeto: atualmente este código não usa `React.memo` nem `useCallback` em nenhum componente crítico. A recomendação acima é válida como padrão arquitetural, mas não cria expectativa falsa — marque isto como "opcional/para aplicar quando necessário". A única otimização aplicada com frequência aqui é `useMemo` para valores derivados (totais, somas).

- Evite otimizar prematuramente: prefira clareza; aplique memoização quando houver evidência de renderizações desnecessárias.

---

## 7) Fluxos principais (resumo)

1. `BudgetModule` orquestra telas: lista → formulário (criar/editar) → detalhe (despesas) → formulário de despesa.
2. `BudgetListView` exibe a lista e usa `BudgetList` para apresentação dos cartões (cada cartão passa `budget.id` nas ações).
3. `BudgetDetailView` renderiza `ExpenseList` e delega ações de adicionar/editar/remover/mover despesas usando `budget.id` + `categoryId` + `expenseId`.
4. `ExpenseForm` recebe `expenseToEdit` com `categoryId` e pré-seleciona a categoria pelo `id`.


**Business module (resumo do fluxo):**

1. `BusinessModule` organiza a navegação por períodos (ex.: mês/ano) e agrupa receitas e despesas por período.
2. `useBusiness` fornece operações para criar/selecionar períodos, adicionar receitas e despesas ao período, e calcular agregações temporais (totais, variações) usadas pelos gráficos.
3. `PeriodSummary` mostra os totais do período (receitas, despesas, saldo) e métricas derivadas; `PeriodCharts` exibe visualizações (ex.: barras por categoria, linhas por evolução temporal) usando os dados agregados fornecidos por `useBusiness`.
4. A comunicação com os componentes de visualização usa `periodId`, `entryId` (para receitas/despesas), e `categoryId` quando aplicável — a mesma filosofia de IDs estáveis se aplica para evitar referências por índice.



---

## 8) Testes e validação manual

- Testes manuais sugeridos após a refatoração:
  - criar um orçamento;
  - editar o orçamento e confirmar que `selectedBudget` é atualizado quando necessário;
  - copiar e remover orçamentos;
  - adicionar/editar/mover/remover despesas entre categorias;
  - confirmar persistência após reload.

- Comandos para rodar localmente:
```bash
npm install
npm run dev
```

---

## 9) Boas práticas para contribuir

- Prefira passar `id` em vez de índices quando referenciar itens em listas.
- Mantenha componentes puros e mova lógica para hooks quando fizer sentido.
- Documente mudanças de contrato entre componentes (ex.: troca de `categoryIndex` → `categoryId`).

---

## 10) Próximos passos recomendados

- Implementar rotina de normalização de dados no `useBudgets` (se ainda não existir).
- Adicionar testes unitários para as funções críticas de `useBudgets` (add/update/move/remove/copy).
- Rodar testes manuais de fluxo após normalização.

---

Este guia deve servir como referência viva: atualize sempre que fizer mudanças de contrato (props / hooks) ou reorganizar pastas.
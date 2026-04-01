# Budget App (React + Vite)

Aplicação de controle financeiro pessoal feita com **React**, com foco em:

- criar orçamentos;
- organizar categorias;
- registrar despesas por categoria;
- visualizar quanto foi gasto e quanto ainda está disponível.

Este README foi escrito para quem está começando em React.

## Visão geral do projeto

O app funciona como um pequeno gerenciador de orçamento.

Fluxo principal:

1. Você cria um orçamento (nome e valor total).
2. Define categorias (padrão ou personalizadas).
3. Adiciona despesas dentro das categorias.
4. Acompanha limite, gasto e saldo restante por categoria.

## Tecnologias utilizadas

- **React 19**: construção da interface por componentes.
- **Vite 7**: ambiente de desenvolvimento e build.
- **Tailwind CSS v4**: utilitários de estilo.
- **shadcn/ui + Radix**: componentes de UI reutilizáveis.
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
		BudgetForm.jsx
		BudgetList.jsx
		CategoryForm.jsx
		CategoryManager.jsx
		ExpenseForm.jsx
		ExpenseList.jsx
		ui/
	hooks/
		useBudgets.js
		useCategories.js
		useExpenses.js
	utils/
		formatters.js
```

### O papel de cada parte

- `App.jsx`: orquestra as telas e estados principais.
- `components/`: interface visual (formulários, listas, cards e ações).
- `hooks/`: regras de negócio e manipulação de dados.
- `utils/`: funções auxiliares de formatação de moeda.

## Arquitetura e organização

O projeto separa bem responsabilidades:

1. **UI (Componentes)**: exibe e coleta dados.
2. **Lógica (Hooks)**: altera dados de orçamento/categoria/despesa.
3. **Persistência**: `useBudgets` e `useCategories` salvam no `localStorage`.

Isso facilita manutenção e aprendizado.

## Conceitos de React aplicados

### 1) `useState`

`useState` guarda informações que mudam durante o uso do app.

No projeto ele controla, por exemplo:

- tela atual (`lista`, `formulario`, `despesas`, etc.);
- item em edição (orçamento, categoria, despesa);
- mensagens de erro;
- itens pendentes de confirmação de remoção.

Exemplo de ideia usada no app:

```jsx
const [tela, setTela] = useState('lista')
```

Quando `setTela` é chamado, o React renderiza novamente com a nova tela.

### 2) `useEffect`

`useEffect` executa efeitos colaterais (algo além de renderizar UI).

No projeto:

- sempre que os orçamentos mudam, salva no `localStorage`;
- sempre que as categorias mudam, salva no `localStorage`.

Exemplo de padrão usado:

```jsx
useEffect(() => {
	localStorage.setItem('budgets', JSON.stringify(budgets))
}, [budgets])
```

### 3) Props

Dados e funções descem do componente pai para os filhos via props.

Exemplos:

- `BudgetList` recebe `onSelect`, `onEdit`, `onDelete`, `onCopy`.
- `ExpenseForm` recebe `onSave` e `onCancel`.

### 4) Imutabilidade

As atualizações são feitas criando novos arrays/objetos com `map`, `filter` e spread (`...`), evitando mutação direta.

Isso deixa o React mais previsível e ajuda a evitar bugs.

## Regras de negócio implementadas

### Orçamentos

- criar orçamento;
- editar orçamento;
- copiar orçamento;
- remover orçamento com confirmação.

### Categorias

- categorias padrão iniciais:
	- `Gastos Essenciais` (50%);
	- `Prioridades Financeiras` (20%);
	- `Estilo de Vida` (30%).
- criar categoria personalizada;
- editar categoria personalizada;
- impedir remoção de categoria em uso por orçamentos;
- categorias padrão não ficam disponíveis para remoção na tela de gestão.

### Despesas

- criar despesa;
- editar despesa;
- remover despesa com confirmação;
- mover despesa entre categorias;
- mover + editar em uma única operação.

### Validações

- nome e valor obrigatórios para orçamento e despesa;
- se categorias personalizadas estiverem ativas no orçamento, soma dos percentuais deve ser **100%**;
- percentual de categoria limitado entre 0 e 100.

## Cálculo financeiro no app

Para cada categoria de um orçamento:

- **limite da categoria** = `valor do orçamento * percentual da categoria / 100`
- **total gasto** = soma dos valores das despesas da categoria
- **disponível** = `limite - total gasto`

Também é mostrado o percentual gasto no componente de progresso.

## Formatação monetária

No arquivo `src/utils/formatters.js`:

- `formatCurrency(value)`: formata para `pt-BR` (R$);
- `maskCurrency(value)`: aplica máscara enquanto digita;
- `parseUserValue(valueStr)`: converte texto em número para salvar.

## Persistência de dados

Dados salvos no navegador:

- chave `budgets`;
- chave `categories`.

Ao recarregar a página, o app recupera esses dados automaticamente.

## Observações importantes

- Entrada atual da aplicação: `src/main.jsx`.
- Existe `src/index.js` (padrão antigo do CRA), mas não é a entrada usada pelo Vite.
- `src/App.test.js` está com teste de template antigo e não representa o comportamento atual.
- O script `test` não está definido no `package.json` neste momento.

## O que aprender com este projeto

Se você está começando, este projeto ensina bem:

1. como dividir tela em componentes;
2. como usar `useState` e `useEffect` em caso real;
3. como organizar regras de negócio em hooks;
4. como tratar formulários e validações;
5. como manter dados persistentes com `localStorage`.

## Próximos passos (sugestões)

- adicionar testes reais para componentes e hooks;
- criar filtros e busca de despesas;
- extrair tipos para TypeScript;
- adicionar autenticação e backend no futuro.


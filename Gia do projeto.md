# Guia do Projeto (Iniciante em React)

## 1) O que é este projeto?

Este projeto é um **aplicativo de orçamento pessoal** feito com **React + Vite**.  
A ideia principal é permitir que a pessoa:

- crie orçamentos;
- organize categorias;
- adicione despesas;
- acompanhe quanto já gastou em cada categoria.

Arquivo principal da aplicação: [src/App.jsx](src/App.jsx)

---

## 2) Tecnologias usadas (resumo simples)

- **React**: cria a interface em componentes.
- **Vite**: ferramenta de desenvolvimento/build (mais rápida que setups antigos).
- **Tailwind CSS v4**: estilos utilitários (classes prontas).
- **shadcn/ui + Radix UI**: componentes visuais reutilizáveis (botão, card, select, etc).
- **localStorage**: salva dados no navegador (sem backend).

Arquivos importantes:
- Configuração do Vite: [vite.config.js](vite.config.js)
- Entrada da aplicação: [src/main.jsx](src/main.jsx)
- Estilos globais: [src/index.css](src/index.css)
- Dependências: [package.json](package.json)

---

## 3) Como o projeto foi estruturado

### Componentes de tela (regra de negócio)
Ficam em [src/components](src/components):

- [src/components/BudgetForm.jsx](src/components/BudgetForm.jsx)
- [src/components/BudgetList.jsx](src/components/BudgetList.jsx)
- [src/components/CategoryForm.jsx](src/components/CategoryForm.jsx)
- [src/components/CategoryManager.jsx](src/components/CategoryManager.jsx)
- [src/components/ExpenseForm.jsx](src/components/ExpenseForm.jsx)
- [src/components/ExpenseList.jsx](src/components/ExpenseList.jsx)

### Hooks (estado e lógica)
Ficam em [src/hooks](src/hooks):

- [`useBudgets`](src/hooks/useBudgets.js) em [src/hooks/useBudgets.js](src/hooks/useBudgets.js)
- [`useCategories`](src/hooks/useCategories.js) em [src/hooks/useCategories.js](src/hooks/useCategories.js)
- [`useExpenses`](src/hooks/useExpenses.js) em [src/hooks/useExpenses.js](src/hooks/useExpenses.js)

### Utilitários
- [`formatCurrency`](src/utils/formatters.js), [`parseUserValue`](src/utils/formatters.js), [`maskCurrency`](src/utils/formatters.js) em [src/utils/formatters.js](src/utils/formatters.js)

### UI reutilizável (shadcn)
Fica em [src/components/ui](src/components/ui), por exemplo:
- [`Button`](src/components/ui/button.tsx) em [src/components/ui/button.tsx](src/components/ui/button.tsx)
- [`Card`](src/components/ui/card.tsx) em [src/components/ui/card.tsx](src/components/ui/card.tsx)
- [`Select`](src/components/ui/select.tsx) em [src/components/ui/select.tsx](src/components/ui/select.tsx)
- [`AlertDialog`](src/components/ui/alert-dialog.tsx) em [src/components/ui/alert-dialog.tsx](src/components/ui/alert-dialog.tsx)

---

## 4) Assuntos de React abordados neste projeto

## ✅ Componentização
A interface foi quebrada em partes menores (formulários, listas, cards).  
Isso facilita manutenção e reaproveitamento.

Exemplo central: [src/App.jsx](src/App.jsx)

## ✅ Estado com `useState`
O projeto usa vários estados para controlar tela atual, item selecionado, edição e erros.

Exemplo: [`App`](src/App.jsx) em [src/App.jsx](src/App.jsx)

### O que é `useState`
`useState` é um **hook do React** que permite guardar informações dentro do componente.
Essas informações mudam com o tempo e fazem a tela atualizar automaticamente.

Em outras palavras: quando o estado muda, o React renderiza o componente de novo com os novos dados.

### Para que serve
- Guardar valores de formulário (nome, valor, categoria).
- Controlar se algo está aberto ou fechado (modal, menu, alerta).
- Salvar item selecionado para edição.
- Alternar telas/etapas (ex: lista, formulário, despesas).

### Sintaxe básica
```jsx
const [valor, setValor] = useState(valorInicial)
```

- `valor`: estado atual.
- `setValor`: função que atualiza o estado.
- `valorInicial`: valor inicial na primeira renderização.

### Exemplo 1: contador simples
```jsx
import { useState } from "react"

function Contador() {
   const [numero, setNumero] = useState(0)

   return (
      <button onClick={() => setNumero(numero + 1)}>
         Cliquei {numero} vezes
      </button>
   )
}
```

### Exemplo 2: input controlado (bem comum no projeto)
```jsx
import { useState } from "react"

function CampoNome() {
   const [nome, setNome] = useState("")

   return (
      <input
         value={nome}
         onChange={(e) => setNome(e.target.value)}
         placeholder="Digite seu nome"
      />
   )
}
```

### Forma recomendada para atualizar com base no valor anterior
Quando o novo valor depende do anterior, prefira esta forma:

```jsx
setNumero((anterior) => anterior + 1)
```

Isso evita inconsistências quando várias atualizações acontecem quase ao mesmo tempo.

### No seu projeto
No arquivo [src/App.jsx](src/App.jsx), o `useState` é usado para:
- controlar a tela atual;
- guardar orçamento/categoria/despesa em edição;
- guardar mensagens de erro e estados de UI.

Esse é um ótimo exemplo real de como `useState` organiza a interface em apps React.

## ✅ Hooks customizados
A lógica de dados foi separada em hooks para deixar o componente principal mais limpo:

- [`useBudgets`](src/hooks/useBudgets.js)
- [`useCategories`](src/hooks/useCategories.js)
- [`useExpenses`](src/hooks/useExpenses.js)

## ✅ Fluxo por props
Componentes filhos recebem dados e funções por props (ex: `onSave`, `onDelete`, `onEdit`).

Exemplos:
- [`BudgetList`](src/components/BudgetList.jsx)
- [`ExpenseForm`](src/components/ExpenseForm.jsx)

## ✅ Persistência no navegador
Os dados são salvos no `localStorage` dentro de:
- [`useBudgets`](src/hooks/useBudgets.js)
- [`useCategories`](src/hooks/useCategories.js)

---

## 5) Como o app funciona (passo a passo)

1. A aplicação inicia em [src/main.jsx](src/main.jsx) e renderiza [`App`](src/App.jsx).
2. [`App`](src/App.jsx) controla qual tela aparece (`lista`, `formulario`, `despesas`, etc).
3. Ao criar orçamento, o formulário usa máscaras e conversão de moeda:
   - [`maskCurrency`](src/utils/formatters.js)
   - [`parseUserValue`](src/utils/formatters.js)
4. Categorias podem ser gerenciadas e validadas.
5. Despesas podem ser criadas, editadas, removidas e movidas entre categorias.
6. Tudo é salvo no navegador para não perder ao recarregar.

---

## 6) Pontos didáticos para quem está começando em React

- **Separar UI de lógica**: UI em componentes, lógica em hooks.
- **Evitar estado bagunçado**: nomear bem os estados e responsabilidades.
- **Trabalhar com listas** (`map`) e eventos (`onClick`, `onChange`).
- **Imutabilidade**: atualizar arrays/objetos com `map`, `filter`, `...spread`.
- **Reuso**: usar componentes de UI padronizados.

---

## 7) Observações úteis do projeto

- O projeto usa entrada Vite em [src/main.jsx](src/main.jsx).
- Existe também [src/index.js](src/index.js), padrão antigo (CRA), que não é a entrada atual.
- Teste atual em [src/App.test.js](src/App.test.js) está no formato de template inicial e pode não refletir a UI real.

---

## 8) Resumo final

Este é um bom projeto para aprender React porque junta, em um app real:

- componentes;
- hooks customizados;
- formulários;
- listas;
- validações;
- persistência local;
- organização de código em camadas.

Se você está começando, o melhor caminho é:
1. entender [`App`](src/App.jsx);
2. depois ler os hooks em [src/hooks](src/hooks);
3. por fim, estudar os formulários e listas em [src/components](src/components).

Com isso, você já terá uma base sólida para criar outros apps React.
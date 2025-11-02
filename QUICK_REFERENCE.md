# 🚀 REFERÊNCIA RÁPIDA - DESENVOLVIMENTO

## 📦 SISTEMA DE PACKS (COPIE E COLE)

### Estrutura de Página Padrão
```jsx
import React from 'react';

const MinhaPage = ({ onNavigate }) => {
  return (
    // PACK 1: Fundo de Página
    <div className="min-h-screen bg-beige-50 dark:bg-gray-950 transition-colors duration-300">
      
      {/* Hero/Header Section */}
      // PACK 17: Gradiente (opcional para hero)
      <section className="bg-gradient-to-b from-beige-50 to-beige-100 dark:from-gray-950 dark:to-gray-900 transition-colors duration-300 py-16 px-4">
        <div className="max-w-7xl mx-auto">
          
          // PACK 4: Título Principal
          <h1 className="text-4xl font-bold text-secondary-800 dark:text-gray-100 transition-colors mb-4">
            Título da Página
          </h1>
          
          // PACK 6: Texto Corpo
          <p className="text-base text-secondary-600 dark:text-gray-300 transition-colors mb-6">
            Descrição da página
          </p>
          
          // PACK 9: Botão Primário
          <button className="bg-primary-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-primary-700 shadow-md hover:shadow-lg transition-all duration-300">
            Ação Principal
          </button>
        </div>
      </section>

      {/* Content Section */}
      // PACK 3: Seção/Container
      <section className="bg-beige-100 dark:bg-gray-900 border-beige-200 dark:border-gray-800 transition-colors duration-300 py-16 px-4">
        <div className="max-w-7xl mx-auto">
          
          // PACK 5: Título Secundário
          <h2 className="text-2xl font-bold text-secondary-700 dark:text-gray-200 transition-colors mb-8">
            Seção de Conteúdo
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Cards */}
            // PACK 2: Card Principal
            <div className="bg-white dark:bg-gray-800 border border-beige-200 dark:border-gray-700 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 p-6">
              
              // PACK 5: Título do Card
              <h3 className="text-2xl font-bold text-secondary-700 dark:text-gray-200 transition-colors mb-2">
                Card Title
              </h3>
              
              // PACK 6: Texto do Card
              <p className="text-base text-secondary-600 dark:text-gray-300 transition-colors">
                Card content
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default MinhaPage;
```

---

## 🎨 TABELA DE REFERÊNCIA RÁPIDA

| Elemento | Pack | Classes |
|----------|------|---------|
| **Fundo Página** | #1 | `bg-beige-50 dark:bg-gray-950` |
| **Card** | #2 | `bg-white dark:bg-gray-800 border dark:border-gray-700` |
| **Seção** | #3 | `bg-beige-100 dark:bg-gray-900` |
| **H1** | #4 | `text-secondary-800 dark:text-gray-100` |
| **H2/H3** | #5 | `text-secondary-700 dark:text-gray-200` |
| **Texto** | #6 | `text-secondary-600 dark:text-gray-300` |
| **Label** | #7 | `text-secondary-500 dark:text-gray-400` |
| **Destaque** | #8 | `text-primary-700 dark:text-primary-500` |
| **Botão 1º** | #9 | `bg-primary-600 text-white hover:bg-primary-700` |
| **Botão 2º** | #10 | `bg-white dark:bg-gray-800 border dark:border-gray-700` |
| **Botão Outline** | #11 | `border-2 border-primary-600 text-primary-600` |
| **Input** | #12 | `bg-white dark:bg-gray-800 border dark:border-gray-700` |
| **Link** | #13 | `text-primary-700 dark:text-primary-500 hover:underline` |
| **Badge** | #14 | `bg-primary-600 text-white px-3 py-1 rounded-full` |
| **Hover Card** | #15 | `hover:bg-beige-100 dark:hover:bg-gray-800` |
| **Borda** | #16 | `border-beige-300 dark:border-gray-700` |
| **Gradiente** | #17 | `from-beige-50 to-beige-100 dark:from-gray-950 dark:to-gray-900` |
| **Ícone** | #18 | `text-secondary-700 dark:text-gray-300` |
| **Menu Ativo** | #19 | `bg-primary-600 text-white` |
| **Menu Inativo** | #20 | `text-secondary-700 dark:text-gray-300 hover:bg-beige-100 dark:hover:bg-gray-800` |

---

## 🔥 SNIPPETS PRONTOS

### Formulário Completo
```jsx
<form className="space-y-6">
  <div>
    {/* PACK 7: Label */}
    <label className="text-sm text-secondary-500 dark:text-gray-400 transition-colors block mb-2">
      Nome
    </label>
    {/* PACK 12: Input */}
    <input
      type="text"
      className="w-full bg-white dark:bg-gray-800 text-secondary-700 dark:text-gray-200 border border-beige-300 dark:border-gray-700 rounded-lg px-4 py-3 focus:border-primary-600 focus:ring-2 focus:ring-primary-600/20 focus:outline-none transition-colors"
    />
  </div>
  
  {/* PACK 9: Botão Submit */}
  <button
    type="submit"
    className="w-full bg-primary-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-primary-700 shadow-md hover:shadow-lg transition-all duration-300"
  >
    Enviar
  </button>
</form>
```

### Lista com Itens Clicáveis
```jsx
<div className="space-y-2">
  {items.map(item => (
    <div
      key={item.id}
      {/* PACK 15: Hover State */}
      className="hover:bg-beige-100 dark:hover:bg-gray-800 rounded-lg transition-colors duration-300 cursor-pointer p-4"
    >
      {/* PACK 5: Título do Item */}
      <h3 className="text-2xl font-bold text-secondary-700 dark:text-gray-200 transition-colors">
        {item.title}
      </h3>
      {/* PACK 7: Info Secundária */}
      <p className="text-sm text-secondary-500 dark:text-gray-400 transition-colors">
        {item.date}
      </p>
    </div>
  ))}
</div>
```

### Grid de Cards
```jsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  {items.map(item => (
    <div
      key={item.id}
      {/* PACK 2: Card Principal */}
      className="bg-white dark:bg-gray-800 border border-beige-200 dark:border-gray-700 rounded-xl shadow-md hover:shadow-xl transition-all duration-300"
    >
      {/* Header do Card */}
      <div className="p-6 border-b border-beige-200 dark:border-gray-700">
        {/* PACK 14: Badge */}
        <span className="bg-primary-600 text-white px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide">
          {item.category}
        </span>
      </div>
      
      {/* Conteúdo do Card */}
      <div className="p-6">
        {/* PACK 5: Título */}
        <h3 className="text-2xl font-bold text-secondary-700 dark:text-gray-200 transition-colors mb-2">
          {item.title}
        </h3>
        {/* PACK 6: Descrição */}
        <p className="text-base text-secondary-600 dark:text-gray-300 transition-colors mb-4">
          {item.description}
        </p>
        {/* PACK 13: Link */}
        <a href="#" className="text-primary-700 dark:text-primary-500 hover:text-primary-800 dark:hover:text-primary-400 font-medium underline-offset-4 hover:underline transition-colors">
          Saiba mais →
        </a>
      </div>
    </div>
  ))}
</div>
```

### Modal/Popup
```jsx
<div className="fixed inset-0 z-50 flex items-center justify-center p-4">
  {/* Backdrop */}
  <div className="fixed inset-0 bg-black/70 dark:bg-black/80 backdrop-blur-sm" />
  
  {/* PACK 2: Card do Modal */}
  <div className="relative bg-white dark:bg-gray-800 border border-beige-200 dark:border-gray-700 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 max-w-2xl w-full">
    
    {/* Header */}
    <div className="p-6 border-b border-beige-200 dark:border-gray-700">
      {/* PACK 5: Título */}
      <h2 className="text-2xl font-bold text-secondary-700 dark:text-gray-200 transition-colors">
        Título do Modal
      </h2>
    </div>
    
    {/* Body */}
    <div className="p-6">
      {/* PACK 6: Conteúdo */}
      <p className="text-base text-secondary-600 dark:text-gray-300 transition-colors">
        Conteúdo do modal
      </p>
    </div>
    
    {/* Footer */}
    <div className="p-6 border-t border-beige-200 dark:border-gray-700 flex gap-3 justify-end">
      {/* PACK 10: Botão Secundário */}
      <button className="bg-white dark:bg-gray-800 text-secondary-700 dark:text-gray-200 px-6 py-3 rounded-lg font-bold border border-beige-300 dark:border-gray-700 hover:bg-beige-100 dark:hover:bg-gray-700 transition-all duration-300">
        Cancelar
      </button>
      {/* PACK 9: Botão Primário */}
      <button className="bg-primary-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-primary-700 shadow-md hover:shadow-lg transition-all duration-300">
        Confirmar
      </button>
    </div>
  </div>
</div>
```

---

## ✅ CHECKLIST DE VALIDAÇÃO

Antes de fazer commit, verifique:

- [ ] Todos os elementos usam um PACK completo
- [ ] Todas as cores têm variante `dark:`
- [ ] Todos os elementos têm `transition-colors` ou `transition-all`
- [ ] Duração de transição é `duration-300`
- [ ] Botões têm hover states
- [ ] Inputs têm focus states
- [ ] Textos são legíveis em ambos os modos
- [ ] Cards têm sombras (`shadow-md`, `hover:shadow-xl`)
- [ ] Bordas usam cores corretas do pack

---

## 🚫 ERROS COMUNS A EVITAR

❌ **ERRADO**: Misturar cores de packs diferentes
```jsx
className="bg-white text-gray-400"  // ❌ Cor hardcoded
```

✅ **CERTO**: Usar pack completo
```jsx
className="bg-white dark:bg-gray-800 text-secondary-600 dark:text-gray-300"
```

---

❌ **ERRADO**: Esquecer transição
```jsx
className="bg-white dark:bg-gray-800"  // ❌ Sem transição
```

✅ **CERTO**: Sempre incluir transição
```jsx
className="bg-white dark:bg-gray-800 transition-colors duration-300"
```

---

❌ **ERRADO**: Usar cores numéricas inconsistentes
```jsx
className="text-secondary-500 dark:text-gray-200"  // ❌ Contraste ruim
```

✅ **CERTO**: Seguir a tabela de packs
```jsx
className="text-secondary-600 dark:text-gray-300"  // ✅ Pack #6
```

---

## 📝 TEMPLATE DE NOVA PÁGINA

Copie e cole este template ao criar uma nova página:

```jsx
import React from 'react';

const NomeDaPagina = ({ onNavigate }) => {
  return (
    <div className="min-h-screen bg-beige-50 dark:bg-gray-950 transition-colors duration-300">
      {/* Hero Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-bold text-secondary-800 dark:text-gray-100 transition-colors mb-4">
            Título
          </h1>
          <p className="text-base text-secondary-600 dark:text-gray-300 transition-colors mb-6">
            Descrição
          </p>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-beige-100 dark:bg-gray-900 transition-colors duration-300">
        <div className="max-w-7xl mx-auto">
          {/* Seu conteúdo aqui */}
        </div>
      </section>
    </div>
  );
};

export default NomeDaPagina;
```

---

**Use este guia sempre que for criar ou editar componentes!**

# 🎨 GUIA DE ESTILOS - APOSTOLADO SEJA SANTO

## 📦 PACKS DE ESTILOS PRÉ-DEFINIDOS

Use estes "packs" prontos para manter consistência total em todo o projeto.
Sempre use o pack completo, nunca misture classes de packs diferentes.

---

## Paleta de Cores Oficial

### 🌞 Modo Claro (Light Mode)

#### Primary (Dourado)
- `primary-600`: #E6A400 - **Botões e elementos ativos**
- `primary-700`: #CC9200 - **Hover states e badges**

#### Secondary (Marrom Rústico)
- `secondary-500`: #6B4F3A - **Texto secundário**
- `secondary-600`: #5A4230 - **Texto médio**
- `secondary-700`: #4A3627 - **Títulos e texto principal**
- `secondary-800`: #3A2B1F - **Títulos grandes**
- `secondary-900`: #2A1F16 - **Overlays**

#### Beige (Fundos)
- `beige-50`: #FAF7F4 - **Fundo geral da página**
- `beige-100`: #F0E8DF - **Cards e footer**
- `beige-200`: #E3D5C5 - **Hover states leves**
- `beige-300`: #D4C2AD - **Bordas**
- `white`: #FFFFFF - **Cards de destaque**

### 🌙 Modo Escuro (Dark Mode)

#### Primary (Dourado)
- `primary-500`: #FDB913 - **Elementos ativos (mais brilhante)**
- `primary-600`: #E6A400 - **Botões**

#### Gray (Fundos e Textos)
- `gray-950`: #030712 - **Fundo geral**
- `gray-900`: #111827 - **Cards e seções**
- `gray-800`: #1F2937 - **Cards secundários**
- `gray-700`: #374151 - **Bordas e hover**
- `gray-400`: #9CA3AF - **Texto secundário**
- `gray-300`: #D1D5DB - **Texto médio**
- `gray-200`: #E5E7EB - **Títulos**

---

## 📦 PACKS DE ESTILOS (USE SEMPRE ESTES)

### 🎯 PACK 1: Fundo de Página
```jsx
// Use em: <div> principal de páginas
className="min-h-screen bg-beige-50 dark:bg-gray-950 transition-colors duration-300"
```

### 🎯 PACK 2: Card Principal
```jsx
// Use em: Cards, modais, containers destacados
className="bg-white dark:bg-gray-800 border border-beige-200 dark:border-gray-700 rounded-xl shadow-md hover:shadow-xl transition-all duration-300"
```

### 🎯 PACK 3: Seção/Container
```jsx
// Use em: Sections, áreas de conteúdo
className="bg-beige-100 dark:bg-gray-900 border-beige-200 dark:border-gray-800 transition-colors duration-300"
```

### 🎯 PACK 4: Título Principal (H1)
```jsx
// Use em: Títulos grandes, headings principais
className="text-4xl font-bold text-secondary-800 dark:text-gray-100 transition-colors"
```

### 🎯 PACK 5: Título Secundário (H2/H3)
```jsx
// Use em: Subtítulos, headers de seção
className="text-2xl font-bold text-secondary-700 dark:text-gray-200 transition-colors"
```

### 🎯 PACK 6: Texto Corpo
```jsx
// Use em: Parágrafos, descrições
className="text-base text-secondary-600 dark:text-gray-300 transition-colors"
```

### 🎯 PACK 7: Texto Secundário
```jsx
// Use em: Labels, info adicional, metadata
className="text-sm text-secondary-500 dark:text-gray-400 transition-colors"
```

### 🎯 PACK 8: Texto Destaque (Dourado)
```jsx
// Use em: CTAs, citações, destaques importantes
className="text-primary-700 dark:text-primary-500 font-semibold transition-colors"
```

### 🎯 PACK 9: Botão Primário
```jsx
// Use em: Ações principais, CTAs
className="bg-primary-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-primary-700 shadow-md hover:shadow-lg transition-all duration-300"
```

### 🎯 PACK 10: Botão Secundário
```jsx
// Use em: Ações secundárias
className="bg-white dark:bg-gray-800 text-secondary-700 dark:text-gray-200 px-6 py-3 rounded-lg font-bold border border-beige-300 dark:border-gray-700 hover:bg-beige-100 dark:hover:bg-gray-700 transition-all duration-300"
```

### 🎯 PACK 11: Botão Outline (Dourado)
```jsx
// Use em: Botões de destaque sem fundo
className="bg-transparent border-2 border-primary-600 dark:border-primary-500 text-primary-600 dark:text-primary-500 px-6 py-3 rounded-lg font-bold hover:bg-primary-600 hover:text-white transition-all duration-300"
```

### 🎯 PACK 12: Input/Textarea
```jsx
// Use em: Campos de formulário
className="w-full bg-white dark:bg-gray-800 text-secondary-700 dark:text-gray-200 border border-beige-300 dark:border-gray-700 rounded-lg px-4 py-3 focus:border-primary-600 focus:ring-2 focus:ring-primary-600/20 focus:outline-none transition-colors"
```

### 🎯 PACK 13: Link/Âncora
```jsx
// Use em: Links de texto
className="text-primary-700 dark:text-primary-500 hover:text-primary-800 dark:hover:text-primary-400 font-medium underline-offset-4 hover:underline transition-colors"
```

### 🎯 PACK 14: Badge/Tag
```jsx
// Use em: Tags, categorias, labels
className="bg-primary-600 text-white px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide"
```

### 🎯 PACK 15: Hover State em Card
```jsx
// Use em: Elementos clicáveis que não são botões
className="hover:bg-beige-100 dark:hover:bg-gray-800 rounded-lg transition-colors duration-300 cursor-pointer"
```

### 🎯 PACK 16: Borda/Divider
```jsx
// Use em: Separadores, bordas de seção
className="border-t border-beige-300 dark:border-gray-700"
```

### 🎯 PACK 17: Gradiente de Fundo
```jsx
// Use em: Hero sections, CTAs especiais
className="bg-gradient-to-b from-beige-50 to-beige-100 dark:from-gray-950 dark:to-gray-900 transition-colors duration-300"
```

### 🎯 PACK 18: Ícone/SVG
```jsx
// Use em: Ícones coloridos
className="text-secondary-700 dark:text-gray-300 transition-colors"
```

### 🎯 PACK 19: Menu Item Ativo
```jsx
// Use em: Item de menu selecionado
className="bg-primary-600 text-white px-4 py-2 rounded-lg font-semibold shadow-md"
```

### 🎯 PACK 20: Menu Item Inativo
```jsx
// Use em: Item de menu não selecionado
className="text-secondary-700 dark:text-gray-300 px-4 py-2 rounded-lg font-semibold hover:bg-beige-100 dark:hover:bg-gray-800 transition-colors"
```

---

## ⚠️ REGRAS DE USO DOS PACKS

1. **SEMPRE use o pack completo** - Não retire classes
2. **NÃO misture packs** - Cada elemento deve usar apenas 1 pack
3. **Adicione classes utilitárias** - Pode adicionar margin, padding, width, etc.
4. **Mantenha transition-colors** - Essencial para smooth dark mode
5. **Sempre inclua hover states** - Melhora UX

### Exemplo de Uso Correto:
```jsx
<div className="min-h-screen bg-beige-50 dark:bg-gray-950 transition-colors duration-300">
  <div className="max-w-7xl mx-auto px-4 py-8">
    <h1 className="text-4xl font-bold text-secondary-800 dark:text-gray-100 transition-colors mb-6">
      Título
    </h1>
    <p className="text-base text-secondary-600 dark:text-gray-300 transition-colors mb-4">
      Conteúdo
    </p>
    <button className="bg-primary-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-primary-700 shadow-md hover:shadow-lg transition-all duration-300">
      Ação
    </button>
  </div>
</div>
```

---

## Padrões de Componentes (com Dark Mode)

### Botões Principais
```jsx
className="bg-primary-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-primary-700 shadow-md transition-colors"
// Sem mudança no dark (funciona bem em ambos)
```

### Botões Secundários
```jsx
className="bg-white dark:bg-gray-800 text-secondary-700 dark:text-gray-200 px-6 py-2 rounded-lg font-bold hover:bg-beige-100 dark:hover:bg-gray-700 border border-beige-300 dark:border-gray-700 transition-colors"
```

### Títulos
- **H1**: `text-4xl font-bold text-secondary-800 dark:text-gray-100`
- **H2**: `text-2xl font-bold text-secondary-700 dark:text-gray-200`
- **H3**: `text-lg font-bold text-secondary-700 dark:text-gray-200`

### Texto
- **Corpo**: `text-base text-secondary-600 dark:text-gray-300`
- **Secundário**: `text-sm text-secondary-500 dark:text-gray-400`
- **Citação**: `text-xl text-primary-700 dark:text-primary-500 font-bold italic`

### Cards
```jsx
className="bg-white dark:bg-gray-800 rounded-xl border border-beige-200 dark:border-gray-700 shadow-md hover:shadow-xl transition-colors"
// Conteúdo interno
className="p-5 bg-beige-50 dark:bg-gray-900"
```

### Inputs
```jsx
className="w-full bg-white dark:bg-gray-800 text-secondary-700 dark:text-gray-200 rounded-lg px-4 py-3 border border-beige-300 dark:border-gray-700 focus:border-primary-600 focus:ring-2 focus:ring-primary-600/20 focus:outline-none transition-colors"
```

### Toggle de Tema (Ícones)
```jsx
{/* Sol - Light Mode */}
<svg className="w-5 h-5 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
  <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
</svg>

{/* Lua - Dark Mode */}
<svg className="w-5 h-5 text-secondary-700" fill="currentColor" viewBox="0 0 20 20">
  <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
</svg>
```

## Z-Index Hierarchy
- **Header**: z-50
- **Mobile Menu Sidebar**: z-50
- **Mobile Menu Overlay**: z-40
- **Modal**: z-50 (usar com cuidado)

## Regras de Contraste

### Modo Claro
1. **NUNCA** usar `secondary-500` ou mais claro em fundos `beige-50`
2. **SEMPRE** usar `secondary-700` ou mais escuro para títulos
3. **SEMPRE** usar `primary-700` para texto dourado (nunca primary-500)
4. **SEMPRE** usar `white` para texto em botões `primary-600`

### Modo Escuro
1. **SEMPRE** usar `gray-200` ou mais claro para títulos em fundos escuros
2. **USAR** `gray-300` para texto médio em fundos `gray-900/gray-950`
3. **USAR** `gray-400` para texto secundário
4. **USAR** `primary-500` (mais brilhante) em vez de `primary-700` no dark mode
5. **TRANSIÇÃO**: Sempre adicionar `transition-colors duration-300` para mudanças suaves

## Sombras
- **Cards**: `shadow-md hover:shadow-xl`
- **Botões**: `shadow-md`
- **Menus**: `shadow-2xl`

## Transições
- **Padrão**: `transition-colors`
- **Transform**: `transition-all`
- **Menu**: `transition-transform duration-300 ease-out`

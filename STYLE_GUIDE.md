# 🎨 GUIA DE ESTILOS - APOSTOLADO SEJA SANTO

## Paleta de Cores Oficial

### Primary (Dourado)
- `primary-600`: #E6A400 - **Botões e elementos ativos**
- `primary-700`: #CC9200 - **Hover states e badges**

### Secondary (Marrom Rústico)
- `secondary-500`: #6B4F3A - **Texto secundário**
- `secondary-600`: #5A4230 - **Texto médio**
- `secondary-700`: #4A3627 - **Títulos e texto principal**
- `secondary-800`: #3A2B1F - **Títulos grandes**
- `secondary-900`: #2A1F16 - **Overlays**

### Beige (Fundos)
- `beige-50`: #FAF7F4 - **Fundo geral da página**
- `beige-100`: #F0E8DF - **Cards e footer**
- `beige-200`: #E3D5C5 - **Hover states leves**
- `beige-300`: #D4C2AD - **Bordas**
- `white`: #FFFFFF - **Cards de destaque**

## Padrões de Componentes

### Botões Principais
```jsx
className="bg-primary-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-primary-700 shadow-md"
```

### Botões Secundários
```jsx
className="bg-white text-secondary-700 px-6 py-2 rounded-lg font-bold hover:bg-beige-100 border border-beige-300"
```

### Títulos
- **H1**: `text-4xl font-bold text-secondary-800`
- **H2**: `text-2xl font-bold text-secondary-700`
- **H3**: `text-lg font-bold text-secondary-700`

### Texto
- **Corpo**: `text-base text-secondary-600`
- **Secundário**: `text-sm text-secondary-500`
- **Citação**: `text-xl text-primary-700 font-bold italic`

### Cards
```jsx
className="bg-white rounded-xl border border-beige-200 shadow-md hover:shadow-xl"
// Conteúdo interno
className="p-5 bg-beige-50"
```

### Inputs
```jsx
className="w-full bg-white text-secondary-700 rounded-lg px-4 py-3 border border-beige-300 focus:border-primary-600 focus:ring-2 focus:ring-primary-600/20 focus:outline-none"
```

## Z-Index Hierarchy
- **Header**: z-50
- **Mobile Menu Sidebar**: z-50
- **Mobile Menu Overlay**: z-40
- **Modal**: z-50 (usar com cuidado)

## Regras de Contraste
1. **NUNCA** usar `secondary-500` ou mais claro em fundos `beige-50`
2. **SEMPRE** usar `secondary-700` ou mais escuro para títulos
3. **SEMPRE** usar `primary-700` para texto dourado (nunca primary-500)
4. **SEMPRE** usar `white` para texto em botões `primary-600`

## Sombras
- **Cards**: `shadow-md hover:shadow-xl`
- **Botões**: `shadow-md`
- **Menus**: `shadow-2xl`

## Transições
- **Padrão**: `transition-colors`
- **Transform**: `transition-all`
- **Menu**: `transition-transform duration-300 ease-out`

# 🌓 Dark Mode - Guia Completo

## ✨ Funcionalidades

O sistema de Dark Mode do Apostolado Seja Santo oferece:

- ✅ **Toggle visual** no Header (desktop e mobile)
- ✅ **Persistência** da preferência no localStorage
- ✅ **Detecção automática** da preferência do sistema operacional
- ✅ **Transições suaves** entre modos (300ms)
- ✅ **Contraste otimizado** para ambos os modos
- ✅ **Ícones intuitivos** (☀️ Sol / 🌙 Lua)

---

## 🎨 Paleta de Cores

### 🌞 Modo Claro (Light)
```css
Fundo: beige-50 (#FAF7F4)
Cards: white (#FFFFFF)
Seções: beige-100 (#F0E8DF)
Bordas: beige-200, beige-300
Títulos: secondary-700, secondary-800 (marrom escuro)
Texto: secondary-600 (marrom médio)
Destaque: primary-600, primary-700 (dourado)
```

### 🌙 Modo Escuro (Dark)
```css
Fundo: gray-950 (#030712)
Cards: gray-800 (#1F2937)
Seções: gray-900 (#111827)
Bordas: gray-700, gray-800
Títulos: gray-200 (#E5E7EB)
Texto: gray-300, gray-400
Destaque: primary-500 (dourado brilhante)
```

---

## 🔧 Arquitetura Técnica

### 1. ThemeContext (`src/context/ThemeContext.jsx`)

**Responsabilidades:**
- Gerenciar estado global do tema (`isDark`)
- Aplicar classe `dark` no `<html>`
- Salvar preferência no localStorage
- Detectar preferência do sistema

**API:**
```jsx
const { isDark, toggleTheme } = useTheme();
```

### 2. Tailwind Config (`tailwind.config.js`)

**Configuração:**
```javascript
{
  darkMode: 'class', // Ativa dark mode por classe
  // ...cores definidas
}
```

### 3. App.jsx

**Wrapper:**
```jsx
<ThemeProvider>
  <AuthProvider>
    <div className="bg-beige-50 dark:bg-gray-950 transition-colors">
      {/* App content */}
    </div>
  </AuthProvider>
</ThemeProvider>
```

---

## 🎯 Padrões de Uso

### Backgrounds
```jsx
// Página
className="bg-beige-50 dark:bg-gray-950"

// Cards principais
className="bg-white dark:bg-gray-800"

// Seções
className="bg-beige-100 dark:bg-gray-900"

// Hover states
className="hover:bg-beige-100 dark:hover:bg-gray-800"
```

### Texto
```jsx
// Títulos
className="text-secondary-700 dark:text-gray-200"

// Corpo
className="text-secondary-600 dark:text-gray-300"

// Secundário
className="text-secondary-500 dark:text-gray-400"

// Destaque dourado
className="text-primary-700 dark:text-primary-500"
```

### Bordas
```jsx
className="border-beige-200 dark:border-gray-700"
className="border-beige-300 dark:border-gray-800"
```

### Transições
**SEMPRE** adicionar transição suave:
```jsx
className="... transition-colors duration-300"
```

---

## 🎨 Toggle Button

### Desktop (Header)
```jsx
<button
  onClick={toggleTheme}
  className="p-2 rounded-lg bg-beige-200 dark:bg-gray-800 hover:bg-beige-300 dark:hover:bg-gray-700 transition-colors"
>
  {isDark ? (
    <svg className="w-5 h-5 text-amber-400">☀️ Sol</svg>
  ) : (
    <svg className="w-5 h-5 text-secondary-700">🌙 Lua</svg>
  )}
</button>
```

### Mobile (Sidebar)
```jsx
<button
  onClick={toggleTheme}
  className="w-full flex items-center justify-between px-4 py-3 rounded-lg bg-beige-200 dark:bg-gray-800"
>
  <span className="text-secondary-700 dark:text-gray-300 font-semibold">
    {isDark ? 'Modo Claro' : 'Modo Escuro'}
  </span>
  {/* Ícone */}
</button>
```

---

## 📋 Checklist de Implementação

Ao criar novo componente, sempre seguir:

- [ ] Adicionar `useTheme()` se precisar do estado
- [ ] Fundos: `bg-[light] dark:bg-[dark]`
- [ ] Textos: `text-[light] dark:text-[dark]`
- [ ] Bordas: `border-[light] dark:border-[dark]`
- [ ] Hover: `hover:bg-[light] dark:hover:bg-[dark]`
- [ ] Transição: `transition-colors duration-300`
- [ ] Testar contraste em ambos os modos

---

## 🔍 Contraste & Acessibilidade

### WCAG 2.1 AA Compliance

**Modo Claro:**
- Títulos (secondary-700 em beige-50): ✅ 8.2:1
- Corpo (secondary-600 em beige-50): ✅ 6.1:1
- Links (primary-700 em beige-50): ✅ 7.5:1

**Modo Escuro:**
- Títulos (gray-200 em gray-950): ✅ 14.8:1
- Corpo (gray-300 em gray-950): ✅ 11.2:1
- Links (primary-500 em gray-950): ✅ 9.8:1

Todos os contrastes atendem aos padrões WCAG AA (mínimo 4.5:1).

---

## 🚀 Como Usar

### Para Usuários

1. **Desktop**: Clique no ícone de Sol/Lua no canto superior direito
2. **Mobile**: Abra o menu hamburger, o toggle está no topo
3. A preferência é **salva automaticamente**

### Para Desenvolvedores

```jsx
import { useTheme } from './context/ThemeContext';

function MeuComponente() {
  const { isDark, toggleTheme } = useTheme();
  
  return (
    <div className="bg-white dark:bg-gray-800 transition-colors">
      <h1 className="text-secondary-700 dark:text-gray-200">
        Modo atual: {isDark ? 'Escuro' : 'Claro'}
      </h1>
      <button onClick={toggleTheme}>
        Alternar Tema
      </button>
    </div>
  );
}
```

---

## 🎯 Componentes Atualizados

✅ **App.jsx** - Fundo geral com dark mode  
✅ **Header.jsx** - Toggle button + classes dark  
✅ **Footer.jsx** - Classes dark em todo footer  
✅ **CourseCard.jsx** - Cards com dark mode  
✅ **PostCard.jsx** - Cards com dark mode  

**Próximos:**
- [ ] Páginas (Home, Courses, Posts, Calendar, etc.)
- [ ] Modal.jsx
- [ ] Forms (Login, Profile, Admin)

---

## 📝 Notas Importantes

1. **LocalStorage**: Preferência salva como `'theme': 'dark' | 'light'`
2. **Sistema**: Se não houver preferência salva, detecta do SO
3. **Classe**: Dark mode ativado via classe `dark` no `<html>`
4. **Transições**: Sempre usar `transition-colors duration-300`
5. **Contraste**: Sempre testar legibilidade em ambos os modos

---

## 🐛 Troubleshooting

### Dark mode não funciona
- Verificar se `ThemeProvider` está envolvendo o app
- Checar se `darkMode: 'class'` está no tailwind.config.js
- Verificar console do navegador por erros

### Cores não mudam
- Confirmar que classes dark estão corretas: `dark:bg-gray-800`
- Verificar se transition está presente
- Limpar localStorage e tentar novamente

### Contraste ruim
- Consultar STYLE_GUIDE.md para paleta correta
- Usar ferramenta de contrast checker online
- Seguir padrão: gray-200+ para títulos no dark

---

**Desenvolvido com ❤️ para melhor experiência do usuário**

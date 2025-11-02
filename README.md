# Apostolado SPA - React + Vite + Tailwind CSS

## 📖 Visão Geral

Single-Page Application (SPA) completa para um apostolado de formação religiosa católica, com sistema dinâmico de controle de acesso baseado em roles (RBAC - Role-Based Access Control).

## 🎨 Design & Tema

- **Tema Dark Premium**: Fundo preto (`bg-black`) e cinza escuro (`bg-gray-950`)
- **Cor de Destaque**: Dourado/Âmbar (`amber-500`)
- **Fonte**: Inter (Google Fonts)
- **Totalmente Responsivo**: Design mobile-first

## ✨ Funcionalidades Principais

### 🔐 Sistema de Autenticação (Simulado)
- Login e Registro de usuários
- Sistema dinâmico de Roles/Classes
- Controle de acesso baseado em permissões
- Logout com persistência em localStorage

### 👥 Controle de Acesso (RBAC)
- **Roles Padrão**: Admin, Inscrito, Formação 1, Núcleo, user
- **Conteúdo Público**: Visível para todos (visitantes)
- **Conteúdo Restrito**: Requer roles específicas
- **Indicadores Visuais**: Conteúdo bloqueado com ícone de cadeado e overlay

### 📚 Gestão de Cursos
- Grid de cursos com filtros por categoria
- Página de detalhes com aulas e comentários
- Aulas individuais com controle de acesso
- Sistema de avaliações e reviews
- Comentários (apenas para usuários logados)

### 📰 Postagens & Artigos
- Grid de postagens com categorias
- Controle de acesso por role
- Imagens com placeholders

### 📅 Calendário de Eventos
- Calendário mensal completo (estilo moderno)
- Eventos com controle de acesso
- Lista de próximos eventos
- Visual inspirado nas referências fornecidas

### 👤 Perfil do Usuário
- Informações do usuário
- Visualização de roles/permissões
- Estatísticas de uso
- Botão de logout

### ⚙️ Painel Administrativo (Admin Panel)

**Acesso**: Apenas usuários com role "Admin"

#### Abas do Admin:

1. **Gerenciamento de Usuários**
   - Listar todos os usuários
   - Editar roles de cada usuário
   - Deletar usuários (exceto Admin principal)

2. **Gerenciamento de Conteúdo**
   - Editar permissões de cursos, posts e eventos
   - Definir roles necessárias para cada conteúdo
   - Tornar conteúdo público ou privado

3. **Gerenciamento de Roles**
   - Criar novas roles/classes dinamicamente
   - Deletar roles (exceto roles do sistema)
   - Roles criadas aparecem automaticamente em todos os checkboxes

4. **Gerenciamento de Admins**
   - Conceder/revogar permissões de Admin
   - Lista de todos os administradores

## 🚀 Instalação & Execução

### Pré-requisitos
- Node.js 16+ instalado
- npm ou yarn

### Instalação

```bash
# Instalar dependências
npm install
```

### Desenvolvimento

```bash
# Iniciar servidor de desenvolvimento
npm run dev
```

O aplicativo estará disponível em `http://localhost:5173`

### Build para Produção

```bash
# Criar build otimizado
npm run build

# Visualizar build de produção
npm run preview
```

## 📁 Estrutura do Projeto

```
Apostolado/
├── public/
├── src/
│   ├── components/          # Componentes reutilizáveis
│   │   ├── Header.jsx       # Navegação principal
│   │   ├── Footer.jsx       # Rodapé
│   │   ├── CourseCard.jsx   # Card de curso com lock state
│   │   ├── PostCard.jsx     # Card de postagem
│   │   └── Modal.jsx        # Modal reutilizável
│   ├── context/
│   │   └── AuthContext.jsx  # Contexto de autenticação e RBAC
│   ├── data/
│   │   └── mockDatabase.js  # Banco de dados simulado
│   ├── pages/               # Páginas da aplicação
│   │   ├── Home.jsx         # Página inicial
│   │   ├── Courses.jsx      # Lista de cursos
│   │   ├── CourseDetail.jsx # Detalhes do curso
│   │   ├── Posts.jsx        # Lista de postagens
│   │   ├── Calendar.jsx     # Calendário de eventos
│   │   ├── Login.jsx        # Login e registro
│   │   ├── Profile.jsx      # Perfil do usuário
│   │   └── Admin.jsx        # Painel administrativo
│   ├── App.jsx              # Componente principal com roteamento
│   ├── main.jsx             # Entry point
│   └── index.css            # Estilos globais + Tailwind
├── index.html
├── package.json
├── vite.config.js
├── tailwind.config.js
└── postcss.config.js
```

## 🔑 Credenciais de Teste

### Usuário Membro (Inscrito)
- **Email**: membro@apostolado.com
- **Senha**: membro123
- **Roles**: Inscrito, user

### Usuário Formando
- **Email**: formando@apostolado.com
- **Senha**: formando123
- **Roles**: Inscrito, Formação 1, user

### Administrador
- **Email**: admin@apostolado.com
- **Senha**: admin123
- **Roles**: Admin, user, Inscrito, Formação 1, Núcleo

**Dica**: Use os botões de "Login Rápido" na página de login para testar rapidamente!

## 🎯 Recursos Técnicos

### Tecnologias Utilizadas
- **React 18**: Biblioteca UI
- **Vite**: Build tool ultra-rápido
- **Tailwind CSS**: Framework CSS utility-first
- **React Context API**: Gerenciamento de estado global
- **LocalStorage**: Persistência de sessão do usuário

### Recursos Implementados
- ✅ SPA com navegação simulada (sem React Router, mais leve)
- ✅ Sistema completo de RBAC dinâmico
- ✅ Controle de acesso em tempo real
- ✅ Interface administrativa completa
- ✅ Persistência de sessão
- ✅ Design responsivo mobile-first
- ✅ Comentários em cursos
- ✅ Calendário funcional
- ✅ Modais reutilizáveis
- ✅ Estados de loading visual (locked/unlocked)

## 🎨 Paleta de Cores

```css
--black: #000000
--gray-950: #030712
--gray-900: #111827
--gray-800: #1f2937
--gray-700: #374151
--amber-500: #f59e0b
--amber-600: #d97706
```

## 🔄 Fluxo de Autenticação & RBAC

1. **Visitante (não logado)**
   - Vê apenas conteúdo público (requiredRoles: [])
   - Conteúdo restrito aparece com overlay de cadeado

2. **Usuário Logado**
   - Vê conteúdo público + conteúdo das suas roles
   - Pode comentar em cursos
   - Acessa perfil

3. **Administrador**
   - Todas as permissões de usuário
   - Acesso ao Admin Panel
   - Pode gerenciar usuários, conteúdo e roles

## 📝 Próximos Passos (Opcional)

- [ ] Integração com backend real
- [ ] Upload de imagens
- [ ] Player de vídeo funcional
- [ ] Sistema de notificações
- [ ] Busca e filtros avançados
- [ ] Modo claro/escuro toggle
- [ ] Suporte a múltiplos idiomas

## 📄 Licença

Este projeto é um protótipo de demonstração para fins educacionais.

---

**Desenvolvido com ❤️ para o Apostolado de Formação Religiosa**

"Os que não querem ser vencidos pela verdade, serão vencidos pelo erro."

# 💈 BarberPro - Sistema de Gestão para Barbearias

Sistema completo de gestão para barbearias premium com interface moderna, recursos de agendamento, loja de produtos e painel administrativo.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![React](https://img.shields.io/badge/React-18+-61DAFB?logo=react)
![Docker](https://img.shields.io/badge/Docker-Ready-2496ED?logo=docker)

## 📋 Índice

- [Sobre o Projeto](#sobre-o-projeto)
- [Funcionalidades](#funcionalidades)
- [Tecnologias](#tecnologias)
- [Pré-requisitos](#pré-requisitos)
- [Instalação](#instalação)
- [Deploy com Docker](#deploy-com-docker)
- [Estrutura do Projeto](#estrutura-do-projeto)
- [Segurança](#segurança)
- [Acesso ao Sistema](#acesso-ao-sistema)
- [Contribuindo](#contribuindo)
- [Licença](#licença)

## 🎯 Sobre o Projeto

BarberPro é uma solução completa para gestão de barbearias que oferece:
- Sistema de agendamentos online
- Loja de produtos integrada
- Programa de fidelidade automático
- Dashboard administrativo com análises e métricas
- Interface moderna e responsiva

## ✨ Funcionalidades

### 👥 Área do Cliente
- ✅ Agendamento online com barbeiro favorito
- ✅ Histórico completo de cortes
- ✅ Programa de fidelidade (a cada 8 cortes, ganhe 1 grátis)
- ✅ Loja de produtos premium
- ✅ Perfil personalizável
- ✅ Sistema de cortesias

### 🛡️ Área Administrativa (Protegida)
- ✅ **Dashboard analítico** com gráficos e métricas em tempo real
- ✅ **Gestão de barbeiros** - cadastro, edição e exclusão
- ✅ **Gestão de serviços** - controle de preços e descrições
- ✅ **Gestão de produtos** - controle de estoque e vendas
- ✅ **Gestão de agendamentos** - aprovação e controle completo
- ✅ **Análise de performance** por barbeiro
- ✅ **Relatórios de receita** mensais

## 🚀 Tecnologias

- **Frontend**: React 18+
- **UI Framework**: Tailwind CSS
- **Componentes**: shadcn/ui
- **Ícones**: Lucide React
- **Animações**: Framer Motion
- **Gráficos**: Recharts
- **Backend/Auth**: Base44
- **Estado**: React Query (TanStack Query)
- **Roteamento**: React Router
- **Datas**: date-fns
- **Containerização**: Docker & Docker Compose

## 📦 Pré-requisitos

### Para Desenvolvimento
- Node.js 18+ 
- npm ou yarn
- Conta no Base44 (para autenticação e banco de dados)

### Para Deploy com Docker
- Docker 20.10+
- Docker Compose 1.29+

## 🔧 Instalação

### 1. Clone o repositório
```bash
git clone https://github.com/seu-usuario/barbershop.git
cd barbershop
```

### 2. Instale as dependências
```bash
npm install
```

### 3. Configure as variáveis de ambiente
```bash
# Crie um arquivo .env na raiz do projeto
cp .env.example .env
```

### 4. Execute em modo de desenvolvimento
```bash
npm start
```

A aplicação estará disponível em `http://localhost:3000`

## 🐳 Deploy com Docker

### Início Rápido
```bash
# 1. Navegue até a pasta do projeto
cd barbershop

# 2. Execute com Docker Compose
docker-compose up -d

# 3. Acesse em http://localhost
```

### Build Manual
```bash
# Construir a imagem
docker build -t barbershop-app .

# Executar o container
docker run -d -p 80:80 --name barbershop barbershop-app
```

📖 **Guia completo**: Consulte [README-DOCKER.md](./README-DOCKER.md) para instruções detalhadas.

## 📁 Estrutura do Projeto

```
barbershop/
├── API_s/                  # APIs e integrações
│   ├── API agendamento.js
│   ├── API barbeiro.js
│   ├── API produto.js
│   ├── API serviço.js
│   └── API venda.js
├── Components/             # Componentes React
│   ├── Admin/             # Componentes administrativos
│   ├── Auth/              # Autenticação e proteção de rotas
│   ├── Agendamentos/      # Componentes de agendamento
│   └── Loja/              # Componentes da loja
├── Entities/              # Modelos de dados
├── Pages/                 # Páginas da aplicação
│   ├── Index.js          # Página inicial
│   ├── Home.js           # Área do cliente
│   ├── AdminLogin.js     # Login administrativo
│   ├── AdminDashboard.js # Dashboard admin
│   ├── AdminBarbeiros.js # Gestão de barbeiros
│   ├── AdminServiços.js  # Gestão de serviços
│   ├── AdminProdutos.js  # Gestão de produtos
│   └── AdminAgendamentos.js # Gestão de agendamentos
├── Layout.js.js          # Layout principal
├── Dockerfile            # Configuração Docker
├── docker-compose.yml    # Docker Compose
└── README.md             # Este arquivo
```

## 🔒 Segurança

O sistema implementa múltiplas camadas de segurança:

### Autenticação
- Login obrigatório para área administrativa
- Senhas gerenciadas pelo Base44
- Sessões seguras com tokens

### Autorização
- **Verificação de role**: Apenas usuários com `role: "admin"` acessam área administrativa
- **Proteção de rotas**: Componente `ProtectedAdminRoute` em todas as páginas admin
- **Redirecionamento automático**: Usuários não-admin são bloqueados

### Proteção de Dados
- Validação em todas as entradas
- Queries parametrizadas
- Sem exposição de credenciais no frontend

## 🎮 Acesso ao Sistema

### Área do Cliente
1. Acesse a página inicial
2. Clique em "Entrar"
3. Faça login ou cadastre-se
4. Navegue pelas funcionalidades

### Área Administrativa
1. Na página inicial, clique no **pequeno ponto (•)** no rodapé
2. Faça login com credenciais de administrador
3. **Importante**: Apenas usuários com role "admin" conseguem acessar

> ⚠️ **Segurança**: Mesmo que consumidores tentem acessar URLs administrativas diretamente, serão redirecionados ao login e bloqueados.

## 👨‍💼 Configuração de Administrador

Para criar um usuário administrador no Base44:

1. Acesse o console do Base44
2. Crie um novo usuário
3. Defina o campo `role` como `"admin"`
4. Configure email e senha

```json
{
  "email": "admin@barberpro.com",
  "password": "sua-senha-segura",
  "role": "admin",
  "full_name": "Administrador"
}
```

## 📊 Dashboard Administrativo

O dashboard oferece:
- **Métricas em tempo real**: Receita total, agendamentos do dia, barbeiros ativos
- **Gráficos de receita**: Últimos 6 meses
- **Performance por barbeiro**: Agendamentos, conclusões, cancelamentos
- **Serviços mais procurados**: Análise de popularidade
- **Análise detalhada**: Taxa de conclusão, receita por barbeiro
- **Atividade recente**: Últimos agendamentos e movimentações

## 🎨 Interface

- **Design moderno**: UI clean com Tailwind CSS
- **Totalmente responsivo**: Funciona em desktop, tablet e mobile
- **Animações suaves**: Framer Motion para transições
- **Tema consistente**: Paleta de cores preto e branco premium
- **Ícones modernos**: Lucide React

## 🤝 Contribuindo

Contribuições são sempre bem-vindas!

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📝 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 📞 Suporte

Para suporte, entre em contato:
- Email: suporte@barberpro.com
- Issues: [GitHub Issues](https://github.com/seu-usuario/barbershop/issues)

## 🙏 Agradecimentos

- [Base44](https://base44.com) - Backend e autenticação
- [shadcn/ui](https://ui.shadcn.com) - Componentes UI
- [Tailwind CSS](https://tailwindcss.com) - Framework CSS
- [Lucide](https://lucide.dev) - Ícones
- [Recharts](https://recharts.org) - Biblioteca de gráficos

---

**Desenvolvido com ❤️ para BarberPro**

*Sistema completo de gestão para barbearias premium*

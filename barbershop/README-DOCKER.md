# BarberPro - Guia de Deploy com Docker

Este guia explica como fazer o deploy do sistema BarberPro usando Docker.

## 📋 Pré-requisitos

- Docker instalado (versão 20.10 ou superior)
- Docker Compose instalado (versão 1.29 ou superior)

## 🚀 Como Executar

### Opção 1: Usando Docker Compose (Recomendado)

```bash
# 1. Navegue até a pasta do projeto
cd barbershop

# 2. Execute o Docker Compose
docker-compose up -d

# 3. Acesse a aplicação em:
# http://localhost
```

### Opção 2: Usando Docker diretamente

```bash
# 1. Construir a imagem
docker build -t barbershop-app .

# 2. Executar o container
docker run -d -p 80:80 --name barbershop barbershop-app

# 3. Acesse a aplicação em:
# http://localhost
```

## 🛠️ Comandos Úteis

### Ver logs do container
```bash
docker-compose logs -f
```

### Parar o container
```bash
docker-compose down
```

### Reconstruir a imagem
```bash
docker-compose up -d --build
```

### Acessar o container
```bash
docker exec -it barbershop-app sh
```

## 🔐 Acesso Administrativo

O sistema possui duas áreas distintas:

### Área do Cliente
- **URL**: http://localhost/
- Botão "Entrar" na página inicial
- Acessível para todos os usuários

### Área Administrativa
- **URL**: http://localhost/ (link discreto no footer)
- **Requer autenticação**: Email e senha de administrador
- Apenas usuários com role "admin" podem acessar
- Link oculto no rodapé (pequeno ponto • após copyright)

## 🔒 Segurança

- **Autenticação obrigatória** para acesso administrativo
- **Verificação de role** (admin) em todas as páginas administrativas
- **Redirecionamento automático** se usuário não for admin
- **Proteção em nível de rota** usando ProtectedAdminRoute

## 📂 Estrutura de Páginas Protegidas

Todas as páginas administrativas estão protegidas:
- `/AdminDashboard` - Dashboard com estatísticas
- `/AdminBarbeiros` - Gestão de barbeiros
- `/AdminServicos` - Gestão de serviços
- `/AdminProdutos` - Gestão de produtos
- `/AdminAgendamentos` - Gestão de agendamentos

## 📦 Sobre o Dockerfile

O Dockerfile usa uma estratégia multi-stage:
1. **Build stage**: Compila a aplicação React
2. **Production stage**: Serve os arquivos estáticos com Nginx

Isso resulta em uma imagem otimizada e segura para produção.

## 🐛 Solução de Problemas

### Porta 80 já está em uso
```bash
# Use uma porta diferente
docker run -d -p 8080:80 --name barbershop barbershop-app
# Acesse: http://localhost:8080
```

### Rebuild após mudanças
```bash
docker-compose down
docker-compose up -d --build
```

### Ver erros de build
```bash
docker-compose up --build
```

## 📝 Notas Importantes

- O sistema usa Base44 para autenticação e banco de dados
- As credenciais de admin devem ser configuradas no Base44
- Para produção, configure variáveis de ambiente apropriadas
- Recomenda-se usar HTTPS em produção

## 🎯 Próximos Passos

1. Configure as credenciais de administrador no Base44
2. Teste o acesso administrativo com as credenciais configuradas
3. Configure um domínio e certificado SSL para produção
4. Configure backup regular do banco de dados

---

**Desenvolvido com ❤️ para BarberPro**

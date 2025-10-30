# � Task Management API - Full Stack Application

> **Aplicação completa de gerenciamento de tarefas com backend Node.js/TypeScript e frontend Angular 18+**

[![Node.js](https://img.shields.io/badge/Node.js-18.x-green.svg)](https://nodejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue.svg)](https://www.typescriptlang.org/)
[![Angular](https://img.shields.io/badge/Angular-18+-red.svg)](https://angular.dev/)
[![Express](https://img.shields.io/badge/Express-4.x-lightgrey.svg)](https://expressjs.com/)
[![MySQL](https://img.shields.io/badge/MySQL-8.x-orange.svg)](https://www.mysql.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-7.x-green.svg)](https://www.mongodb.com/)

## 📋 Índice

- [🚀 Start Rápido](#-start-rápido)
- [🛠️ Tecnologias](#-tecnologias)
- [📁 Estrutura do Projeto](#-estrutura-do-projeto)
- [⚙️ Instalação Completa](#-instalação-completa)
- [🌐 APIs Disponíveis](#-apis-disponíveis)
- [🔐 Autenticação](#-autenticação)
- [🎨 Features Implementadas](#-features-implementadas)
- [📱 Interface do Usuário](#-interface-do-usuário)
- [🛠️ Troubleshooting](#-troubleshooting)

## 🚀 Start Rápido

```bash
# Clone o repositório
git clone https://github.com/Hendy17/essential-api.git
cd essential-api

# Configure o backend
cd backend
npm install
# Configure o arquivo .env (veja seção de configuração)
npm run dev

# Em outro terminal, configure o frontend
cd frontend
npm install
npm start

# Acesse http://localhost:4200
# Credenciais: hendy@test.com / Teste123
```

## 🛠️ Tecnologias

### **Backend**
- **Node.js** 18+ com **TypeScript** 5.x
- **Express.js** - Framework web RESTful
- **MySQL** - Banco de dados principal
- **MongoDB** - Banco de dados alternativo
- **JWT** - Autenticação e autorização
- **bcryptjs** - Criptografia de senhas
- **express-validator** - Validação de dados

### **Frontend**
- **Angular 18+** - Framework frontend moderno
- **Angular Material** - Componentes UI elegantes
- **TypeScript** - Type safety e produtividade
- **RxJS** - Programação reativa
- **Signals** - Gerenciamento de estado
- **Glass Morphism** - Design visual moderno

## ✨ Funcionalidades

### 🔐 **Sistema de Autenticação**
- ✅ Registro e login de usuários
- ✅ Autenticação JWT com refresh tokens
- ✅ Middleware de proteção de rotas
- ✅ Gerenciamento de perfil de usuário
- ✅ Hash seguro de senhas com bcrypt

### 📊 **Gerenciamento de Tarefas**
- ✅ CRUD completo (Criar, Ler, Atualizar, Deletar)
- ✅ Paginação, busca e ordenação avançadas
- ✅ Filtros por status, prioridade e categoria
- ✅ Associação de tarefas com usuários
- ✅ Estatísticas de tarefas
- ✅ Suporte a tags e categorias

### 🏗️ **Dual Database Support**
- ✅ **API v1**: MySQL (sem autenticação)
- ✅ **API v2**: MongoDB (com autenticação JWT)

## 🛠️ Tecnologias

### **Backend Core**
- **Node.js** 18.x com **TypeScript** 5.x
- **Express.js** 4.x para API RESTful
- **Clean Architecture** pattern

### **Bancos de Dados**
- **MySQL** 8.x com `mysql2` driver
- **MongoDB** 7.x com `mongoose` ODM

### **Autenticação & Segurança**
- **JWT** (jsonwebtoken) para autenticação
- **bcryptjs** para hash de senhas
- **helmet** para segurança HTTP
- **cors** para Cross-Origin Resource Sharing

### **Validação & Middlewares**
- **express-validator** para validação de dados
- **morgan** para logging HTTP
- **dotenv** para variáveis de ambiente

## 📁 Estrutura do Projeto

```
essential/
├── backend/                    # API RESTful Node.js/TypeScript
│   ├── src/
│   │   ├── config/            # Configurações (DB, MongoDB)
│   │   ├── controllers/       # Controladores das rotas
│   │   ├── middleware/        # Middlewares (auth, errors)
│   │   ├── models/           # Modelos de dados
│   │   ├── routes/           # Definição das rotas
│   │   ├── services/         # Lógica de negócio
│   │   ├── utils/            # Utilitários (JWT, validação)
│   │   └── index.ts          # Entrada da aplicação
│   ├── .env                  # Variáveis de ambiente
│   └── package.json
├── frontend/                  # Aplicação Angular 18+
│   ├── src/
│   │   ├── app/
│   │   │   ├── core/         # Serviços, guards, interceptors
│   │   │   ├── features/     # Módulos de funcionalidades
│   │   │   │   ├── auth/     # Login, registro
│   │   │   │   └── tasks/    # CRUD de tarefas
│   │   │   └── shared/       # Componentes compartilhados
│   │   └── environments/     # Configurações de ambiente
│   └── package.json
├── package.json              # Scripts de execução conjunta
└── README.md
```

## ⚙️ Instalação Completa

### **Pré-requisitos**
- Node.js 18+ 
- npm ou yarn
- MySQL 8.0+
- MongoDB 7+ (opcional)

### **1. Clone e Configure**
```bash
git clone https://github.com/Hendy17/essential-api.git
cd essential-api
```

### **2. Backend Setup**
```bash
cd backend
npm install

# Configure .env
cp .env.example .env
# Edite o .env com suas configurações

# Inicie o backend
npm run dev
```

**Arquivo `.env` do Backend:**
```env
# Servidor
PORT=3000
NODE_ENV=development
FRONTEND_URL=http://localhost:4200

# MySQL
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=sua_senha
DB_NAME=task_management

# MongoDB (opcional)
MONGODB_URI=mongodb://localhost:27017/task_management

# JWT
JWT_SECRET=sua_chave_secreta_jwt
JWT_REFRESH_SECRET=sua_chave_refresh_jwt
JWT_EXPIRES_IN=1h
JWT_REFRESH_EXPIRES_IN=7d
```

### **3. Frontend Setup**
```bash
cd frontend
npm install

# Inicie o frontend
npm start
```

### **4. Execução Simultânea**
Na pasta raiz:
```bash
npm install
npm run dev  # Inicia backend + frontend simultaneamente
```

## 🎨 Features Implementadas

### ✅ **Backend (API)**
- [x] **API RESTful completa** com Express + TypeScript
- [x] **Autenticação JWT** com refresh tokens
- [x] **CRUD de tarefas** completo
- [x] **Dual database** (MySQL + MongoDB)
- [x] **Validação robusta** de dados
- [x] **Middleware de segurança** e tratamento de erros
- [x] **CORS configurado** para o frontend
- [x] **Paginação e filtros** avançados

### ✅ **Frontend (Angular)**
- [x] **Interface moderna** com Angular Material
- [x] **Autenticação completa** (login/registro)
- [x] **CRUD de tarefas** com modal de criação
- [x] **Design responsivo** e acessível
- [x] **Glass morphism UI** com gradientes
- [x] **Gerenciamento de estado** com Signals
- [x] **Interceptors HTTP** automáticos
- [x] **Guards de rota** para proteção
- [x] **Standalone components** modernos

### 🎯 **Funcionalidades do Sistema**
- ✅ **Registro e Login** de usuários
- ✅ **Dashboard** com estatísticas
- ✅ **Criação de tarefas** com validação
- ✅ **Listagem organizada** de tarefas
- ✅ **Filtros dinâmicos** (prioridade, status)
- ✅ **Interface intuitiva** e responsiva
- ✅ **Autenticação persistente** com tokens

## 📱 Interface do Usuário

### **🔐 Tela de Login**
- Design moderno com glass morphism
- Validação em tempo real
- Gradientes e efeitos visuais
- Responsivo para mobile

### **📊 Dashboard de Tarefas**
- Cards com estatísticas (total, pendentes)
- Lista organizada de tarefas
- Botão para nova tarefa
- Filtros e ordenação

### **➕ Modal de Criação**
- Formulário completo de tarefa
- Campos: título, descrição, prioridade, data
- Validação antes do envio
- Feedback visual de sucesso/erro

### **🎨 Design System**
- **Paleta**: Azuis e gradientes
- **Tipografia**: Material Design
- **Espaçamento**: Grid consistente
- **Animações**: Transições suaves

## 👥 Credenciais de Teste

```
Email: hendy@test.com
Senha: Teste123
```

## 🔧 Scripts Disponíveis

### **Raiz do Projeto**
```bash
npm run dev              # Backend + Frontend simultâneo
npm run dev:backend      # Apenas backend
npm run dev:frontend     # Apenas frontend
```

### **Backend**
```bash
npm run dev              # Desenvolvimento com hot reload
npm run build            # Build para produção
npm start                # Executa versão compilada
```

### **Frontend**
```bash
npm start                # Servidor de desenvolvimento
npm run build            # Build para produção
npm test                 # Executa testes unitários
```

## 🌐 APIs Disponíveis

### **🔍 Health Check**
```
GET /api/health
```

### **🔐 Autenticação (`/api/auth`)**
| Método | Endpoint | Descrição | Auth |
|--------|----------|-----------|------|
| `POST` | `/register` | Registrar usuário | ❌ |
| `POST` | `/login` | Login de usuário | ❌ |
| `POST` | `/refresh` | Renovar tokens | ❌ |
| `GET` | `/profile` | Obter perfil | ✅ |
| `PUT` | `/profile` | Atualizar perfil | ✅ |
| `PUT` | `/change-password` | Alterar senha | ✅ |
| `POST` | `/logout` | Logout | ✅ |

### **📋 Tarefas v1 - MySQL (`/api/v1/tasks`)**
| Método | Endpoint | Descrição | Auth |
|--------|----------|-----------|------|
| `GET` | `/` | Listar tarefas | ❌ |
| `POST` | `/` | Criar tarefa | ❌ |
| `GET` | `/:id` | Buscar por ID | ❌ |
| `PUT` | `/:id` | Atualizar tarefa | ❌ |
| `DELETE` | `/:id` | Deletar tarefa | ❌ |
| `PATCH` | `/:id/complete` | Marcar completa | ❌ |
| `PATCH` | `/:id/uncomplete` | Marcar pendente | ❌ |

### **📋 Tarefas v2 - MongoDB (`/api/v2/tasks`)**
| Método | Endpoint | Descrição | Auth |
|--------|----------|-----------|------|
| `GET` | `/` | Listar tarefas | ✅ |
| `GET` | `/stats` | Estatísticas | ✅ |
| `GET` | `/overdue` | Tarefas atrasadas | ✅ |
| `POST` | `/` | Criar tarefa | ✅ |
| `GET` | `/:id` | Buscar por ID | ✅ |
| `PUT` | `/:id` | Atualizar tarefa | ✅ |
| `DELETE` | `/:id` | Deletar tarefa | ✅ |
| `PATCH` | `/:id/complete` | Marcar completa | ✅ |
| `PATCH` | `/:id/uncomplete` | Marcar pendente | ✅ |

### **🔍 Parâmetros de Query**
```
GET /api/v2/tasks?page=1&limit=10&search=trabalho&category=pessoal&priority=high&status=pending&sortBy=dueDate&sortOrder=DESC
```

| Parâmetro | Tipo | Descrição | Exemplo |
|-----------|------|-----------|---------|
| `page` | number | Número da página | `1` |
| `limit` | number | Itens por página | `10` |
| `search` | string | Busca no título/descrição | `"trabalho"` |
| `category` | string | Filtro por categoria | `"pessoal"` |
| `priority` | string | Filtro por prioridade | `"high"` |
| `status` | string | Filtro por status | `"pending"` |
| `sortBy` | string | Campo de ordenação | `"dueDate"` |
| `sortOrder` | string | Ordem (ASC/DESC) | `"DESC"` |

## 🔐 Autenticação

### **Registro de Usuário**
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "João Silva",
    "email": "joao@example.com",
    "password": "123456"
  }'
```

### **Login**
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "joao@example.com",
    "password": "123456"
  }'
```

### **Usando o Token**
```bash
curl -X GET http://localhost:3000/api/v2/tasks \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## 📁 Estrutura do Projeto

```
src/
├── 📁 config/
│   ├── database.ts          # Configuração MySQL
│   └── mongodb.ts           # Configuração MongoDB
├── 📁 controllers/
│   ├── authController.ts    # Controller de autenticação
│   ├── taskController.ts    # Controller MySQL
│   └── taskMongoController.ts # Controller MongoDB
├── 📁 middleware/
│   ├── auth.ts              # Middleware JWT
│   └── errorHandler.ts      # Tratamento de erros
├── 📁 models/
│   ├── Auth.ts              # Tipos de autenticação
│   ├── Pagination.ts        # Tipos de paginação
│   ├── Task.ts              # Modelo MySQL
│   ├── TaskMongo.ts         # Schema MongoDB
│   └── User.ts              # Schema de usuário
├── 📁 routes/
│   ├── authRoutes.ts        # Rotas de autenticação
│   ├── taskRoutes.ts        # Rotas MySQL
│   └── taskMongoRoutes.ts   # Rotas MongoDB
├── 📁 services/
│   ├── taskService.ts       # Serviços MySQL
│   └── taskMongoService.ts  # Serviços MongoDB
├── 📁 utils/
│   ├── jwtUtils.ts          # Utilitários JWT
│   └── validation.ts        # Validações
└── index.ts                 # Servidor principal
```

## 📜 Scripts

```bash
# Desenvolvimento
npm run dev          # Executa com nodemon e hot reload

# Produção
npm run build        # Compila TypeScript
npm start            # Executa versão compilada

# Utilitários
npm run clean        # Remove diretório dist
npm run prebuild     # Executa clean antes do build
```

## 🔧 Desenvolvimento

### **Exemplos de Uso**

#### **1. Registrar um novo usuário**
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "João Silva",
    "email": "joao@example.com", 
    "password": "123456"
  }'
```

#### **2. Fazer login**
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "joao@example.com",
    "password": "123456"
  }'
```

#### **3. Criar uma tarefa (MongoDB + Auth)**
```bash
curl -X POST http://localhost:3000/api/v2/tasks \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "title": "Finalizar projeto",
    "description": "Completar documentação e testes",
    "priority": "high",
    "category": "trabalho",
    "tags": ["urgent", "projeto"],
    "dueDate": "2025-11-15T10:00:00.000Z"
  }'
```

#### **4. Listar tarefas com filtros**
```bash
curl -X GET "http://localhost:3000/api/v2/tasks?page=1&limit=5&category=trabalho&priority=high&sortBy=dueDate&sortOrder=ASC" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### **Estrutura de Resposta**

#### **Sucesso com Paginação**
```json
{
  "status": "success",
  "data": {
    "tasks": [...],
    "pagination": {
      "currentPage": 1,
      "totalPages": 3,
      "totalItems": 25,
      "itemsPerPage": 10,
      "hasNextPage": true,
      "hasPrevPage": false
    }
  }
}
```

#### **Erro de Validação**
```json
{
  "status": "error",
  "message": "Validation failed",
  "errors": [
    {
      "field": "title",
      "message": "Title is required"
    }
  ]
}
```

## 🗂️ Features Implementadas por Branch

### **feat/01 - Base API** ✅
- ✅ Configuração inicial do projeto
- ✅ API RESTful básica com MySQL
- ✅ CRUD completo para tarefas
- ✅ Estrutura TypeScript + Express

### **feat/02 - Advanced Features** ✅
- ✅ Paginação automática
- ✅ Sistema de busca e filtros
- ✅ Ordenação customizável
- ✅ Validação robusta de dados

### **feat/03 - Authentication & MongoDB** ✅
- ✅ Sistema completo de autenticação JWT
- ✅ Integração com MongoDB
- ✅ Dual database support
- ✅ Middleware de segurança
- ✅ Associação de tarefas com usuários

## �️ Troubleshooting

### **Problema: Frontend não conecta com backend**
**Sintomas:**
- Erro CORS no console
- Requisições falhando
- Tarefas não carregam

**Solução:**
```bash
# Verifique se o backend está rodando
curl http://localhost:3000/api/health

# Verifique se CORS está configurado
# No arquivo backend/.env:
FRONTEND_URL=http://localhost:4200
```

### **Problema: Tarefas não aparecem na tela**
**Sintomas:**
- Tela mostra "Nenhuma tarefa encontrada"
- Console sem erros
- Login funcionando

**Solução:**
1. Abra o **DevTools (F12)**
2. Verifique a aba **Console** para logs
3. Clique no botão **"� Recarregar"**
4. Verifique se o token está válido

### **Problema: Erro de autenticação**
**Sintomas:**
- "Token inválido" ou 401 Unauthorized
- Redirecionamento para login

**Solução:**
```bash
# Limpe o localStorage do navegador
localStorage.clear()

# Ou faça logout e login novamente
# Verifique se JWT_SECRET está configurado no .env
```

### **Problema: Erro ao criar tarefa**
**Sintomas:**
- Modal abre mas não salva
- Erro no console

**Solução:**
1. Verifique se todos os campos obrigatórios estão preenchidos
2. Confirme se o backend está rodando
3. Verifique logs no console do navegador

### **Problema: Banco de dados não conecta**
**Sintomas:**
- Erro "Database connection failed"
- Backend não inicia

**Solução:**
```bash
# MySQL
mysql -u root -e "CREATE DATABASE IF NOT EXISTS task_management;"

# Verifique credenciais no .env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=sua_senha
DB_NAME=task_management
```

## 🤝 Contribuição

1. **Fork** o projeto
2. Crie uma **branch** para sua feature (`git checkout -b feature/MinhaFeature`)
3. **Commit** suas mudanças (`git commit -m 'Add: MinhaFeature'`)
4. **Push** para a branch (`git push origin feature/MinhaFeature`)
5. Abra um **Pull Request**

## � Licença

Este projeto está sob a licença **MIT**. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 👨‍� Autor

**Hendy Vorpagel**
- GitHub: [@Hendy17](https://github.com/Hendy17)
- Email: hendyvorpagel@gmail.com
- LinkedIn: [Hendy Vorpagel](https://linkedin.com/in/hendy-vorpagel)

---

## 🎯 Próximos Passos

### **Features Planejadas**
- [ ] **Edição de tarefas** em modal
- [ ] **Filtros avançados** por data
- [ ] **Notificações** de tarefas vencidas
- [ ] **Compartilhamento** de tarefas
- [ ] **Dark mode** toggle
- [ ] **PWA** (Progressive Web App)
- [ ] **Testes unitários** completos
- [ ] **Docker** containerization

### **Melhorias Técnicas**
- [ ] **WebSockets** para updates em tempo real
- [ ] **Redis** para cache
- [ ] **Rate limiting** na API
- [ ] **Swagger** documentation
- [ ] **CI/CD** pipeline
- [ ] **Monitoring** e logs avançados

---

**Desenvolvido com ❤️ usando Node.js, TypeScript, Angular e Material Design**

**🚀 Pronto para produção! Deploy em minutos com as configurações adequadas.**
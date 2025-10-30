# 🚀 Task Management API

> **API RESTful completa para gerenciamento de tarefas com autenticação JWT e duplo suporte de banco de dados**

[![Node.js](https://img.shields.io/badge/Node.js-18.x-green.svg)](https://nodejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue.svg)](https://www.typescriptlang.org/)
[![Express](https://img.shields.io/badge/Express-4.x-lightgrey.svg)](https://expressjs.com/)
[![MySQL](https://img.shields.io/badge/MySQL-8.x-orange.svg)](https://www.mysql.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-7.x-green.svg)](https://www.mongodb.com/)

## 📋 Índice

- [Funcionalidades](#-funcionalidades)
- [Tecnologias](#-tecnologias)
- [Arquitetura](#-arquitetura)
- [Instalação](#-instalação)
- [Configuração](#-configuração)
- [APIs Disponíveis](#-apis-disponíveis)
- [Autenticação](#-autenticação)
- [Estrutura do Projeto](#-estrutura-do-projeto)
- [Scripts](#-scripts)
- [Desenvolvimento](#-desenvolvimento)

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

## 🏛️ Arquitetura

```
📁 Task Management API
├── 🔄 Controllers      → Lógica de controle das rotas
├── 🛡️ Middleware       → Autenticação, validação, erros
├── 📊 Models          → Esquemas de dados (MySQL + MongoDB)
├── 🚏 Routes          → Definição de endpoints
├── ⚙️ Services        → Lógica de negócio
├── 🔧 Utils           → Utilitários (JWT, validação)
└── ⚡ Config          → Configurações de banco
```

## 🚀 Instalação

### **Pré-requisitos**
- Node.js 18+ instalado
- MySQL 8+ rodando
- MongoDB 7+ rodando
- npm ou yarn

### **Passos**

1. **Clone o repositório**
```bash
git clone https://github.com/Hendy17/essential-api.git
cd essential-api
```

2. **Instale as dependências**
```bash
npm install
```

3. **Configure os bancos de dados**
```bash
# MySQL
mysql -u root -e "CREATE DATABASE IF NOT EXISTS task_management;"

# MongoDB (via Homebrew no macOS)
brew services start mongodb/brew/mongodb-community
```

4. **Configure as variáveis de ambiente**
```bash
cp .env.example .env
# Edite o arquivo .env com suas configurações
```

5. **Execute em desenvolvimento**
```bash
npm run dev
```

## ⚙️ Configuração

### **Arquivo `.env`**
```env
# Server Configuration
PORT=3000
NODE_ENV=development

# MySQL Database
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=
DB_NAME=task_management

# MongoDB Configuration
MONGODB_URI=mongodb://localhost:27017/task_management_mongo

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRES_IN=7d
JWT_REFRESH_SECRET=your-super-secret-refresh-key
JWT_REFRESH_EXPIRES_IN=30d

# Security
BCRYPT_SALT_ROUNDS=12
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

## 🚨 Notas Importantes

### **Segurança**
- 🔐 Todas as senhas são hash com bcrypt (salt rounds: 12)
- 🛡️ Tokens JWT com expiração configurável
- 🔒 Middleware de autenticação em rotas protegidas
- 🛠️ Headers de segurança com helmet

### **Performance**
- ⚡ Connection pooling para MySQL
- 📊 Paginação automática para grandes datasets
- 🔍 Índices otimizados no MongoDB
- 💾 Queries otimizadas com projeções

### **Monitoramento**
- 📝 Logging HTTP com morgan
- 🔧 Health check endpoint
- ❌ Tratamento centralizado de erros
- 📊 Estatísticas de tarefas por usuário

## 📞 Suporte

- **Repositório**: [https://github.com/Hendy17/essential-api](https://github.com/Hendy17/essential-api)
- **Issues**: [GitHub Issues](https://github.com/Hendy17/essential-api/issues)

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

---

**Desenvolvido usando Node.js, TypeScript, MySQL e MongoDB**
# Task Management API

API RESTful para gerenciamento de tarefas desenvolvida com Node.js, TypeScript e MySQL.

## Funcionalidades

- ✅ Criar tarefas
- ✅ Listar todas as tarefas
- ✅ Buscar tarefa por ID
- ✅ Atualizar tarefas
- ✅ Deletar tarefas
- ✅ Marcar tarefas como completas/pendentes
- ✅ Filtrar por status e prioridade

## Tecnologias

- **Node.js** com **TypeScript**
- **Express.js** para API RESTful
- **MySQL** como banco de dados
- **mysql2** para conexão com o banco
- **express-validator** para validação
- **helmet** para segurança
- **cors** para Cross-Origin Resource Sharing

## Instalação

1. Clone o repositório
2. Instale as dependências:
```bash
npm install
```

3. Configure o banco de dados MySQL
4. Copie `.env.example` para `.env` e configure as variáveis
5. Execute em desenvolvimento:
```bash
npm run dev
```

## API Endpoints

### Tarefas (Tasks)

- `GET /api/tasks` - Listar tarefas
  - Query params: `status`, `priority`, `search`, `page`, `limit`, `sortBy`, `sortOrder`
  - Exemplo: `/api/tasks?page=1&limit=5&search=trabalho&sortBy=priority&sortOrder=ASC`
- `POST /api/tasks` - Criar tarefa
- `GET /api/tasks/:id` - Buscar tarefa por ID
- `PUT /api/tasks/:id` - Atualizar tarefa
- `DELETE /api/tasks/:id` - Deletar tarefa
- `PATCH /api/tasks/:id/complete` - Marcar como completa
- `PATCH /api/tasks/:id/uncomplete` - Marcar como pendente

### Paginação e Filtros

A API suporta paginação automática quando os parâmetros `page` ou `limit` são fornecidos:

```
GET /api/tasks?page=2&limit=10&search=importante&sortBy=dueDate&sortOrder=ASC
```

**Parâmetros disponíveis:**
- `page` - Número da página (padrão: 1)
- `limit` - Itens por página (padrão: 10)
- `search` - Busca por texto no título/descrição
- `sortBy` - Campo para ordenação: `createdAt`, `updatedAt`, `title`, `priority`, `dueDate`
- `sortOrder` - Ordem: `ASC` ou `DESC`
- `status` - Filtro por status: `completed`, `pending`
- `priority` - Filtro por prioridade: `low`, `medium`, `high`
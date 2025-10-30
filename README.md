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

- `GET /api/tasks` - Listar tarefas
- `POST /api/tasks` - Criar tarefa
- `GET /api/tasks/:id` - Buscar tarefa
- `PUT /api/tasks/:id` - Atualizar tarefa
- `DELETE /api/tasks/:id` - Deletar tarefa
- `PATCH /api/tasks/:id/complete` - Marcar como completa
- `PATCH /api/tasks/:id/uncomplete` - Marcar como pendente
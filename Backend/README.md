# Todo Backend API

A Node.js + Express + TypeScript backend with MySQL database using Sequelize ORM for the Todo application.

## Features

- RESTful API endpoints for Todo CRUD operations
- MySQL database with Sequelize ORM
- TypeScript for type safety
- Automatic database table synchronization
- Error handling and validation
- CORS enabled for frontend integration

## Prerequisites

- Node.js (v16 or higher)
- MySQL (v5.7 or higher, or v8.0+)
- npm or yarn

## Setup Instructions

### 1. Install Dependencies

```bash
cd Backend
npm install
```

### 2. Configure Database

Create a MySQL database:

```sql
CREATE DATABASE todo_db;
```

### 3. Configure Environment Variables

Copy the `.env.example` file to `.env`:

```bash
cp .env.example .env
```

Edit `.env` and update with your database credentials:

```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password_here
DB_NAME=todo_db
DB_PORT=3306

SERVER_PORT=3001

NODE_ENV=development
```

### 4. Run the Server

#### Development Mode (with hot reload)

```bash
npm run dev
```

#### Production Mode

```bash
npm run build
npm start
```

Or use the combined command:

```bash
npm run start:prod
```

The server will start on `http://localhost:3001` (or the port specified in `.env`).

## API Endpoints

### Base URL: `http://localhost:3001/api/todos`

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/todos` | Get all todos |
| POST | `/api/todos` | Create a new todo |
| PUT | `/api/todos/:id` | Update a todo |
| DELETE | `/api/todos/:id` | Delete a todo |
| DELETE | `/api/todos/completed` | Delete all completed todos |

### Request/Response Examples

#### GET /api/todos
```json
[
  {
    "id": 1,
    "text": "Learn TypeScript",
    "completed": false,
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
]
```

#### POST /api/todos
**Request Body:**
```json
{
  "text": "Learn TypeScript"
}
```

**Response:**
```json
{
  "id": 1,
  "text": "Learn TypeScript",
  "completed": false,
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

#### PUT /api/todos/:id
**Request Body:**
```json
{
  "completed": true
}
```
or
```json
{
  "text": "Updated text"
}
```

#### DELETE /api/todos/:id
**Response:**
```json
{
  "message": "Todo deleted successfully"
}
```

#### DELETE /api/todos/completed
**Response:**
```json
{
  "message": "Deleted 3 completed todos"
}
```

## Project Structure

```
Backend/
├── src/
│   ├── config/
│   │   └── database.ts          # Sequelize database configuration
│   ├── models/
│   │   └── Todo.ts              # Todo model definition
│   ├── controllers/
│   │   └── todoController.ts    # Todo business logic
│   ├── routes/
│   │   └── todoRoutes.ts        # API route definitions
│   └── server.ts                # Express app and server setup
├── dist/                        # Compiled JavaScript (generated)
├── .env                         # Environment variables (create from .env.example)
├── .env.example                 # Example environment variables
├── package.json
├── tsconfig.json
└── README.md
```

## Database Schema

The `todos` table is automatically created with the following structure:

| Column | Type | Constraints |
|--------|------|-------------|
| id | INTEGER | PRIMARY KEY, AUTO_INCREMENT |
| text | STRING | NOT NULL |
| completed | BOOLEAN | DEFAULT false, NOT NULL |
| createdAt | DATE | DEFAULT CURRENT_TIMESTAMP |
| updatedAt | DATE | DEFAULT CURRENT_TIMESTAMP |

## Troubleshooting

### Database Connection Issues

- Ensure MySQL is running
- Verify database credentials in `.env`
- Check that the database exists: `CREATE DATABASE todo_db;`
- Verify MySQL user has proper permissions

### Port Already in Use

If port 3001 is already in use, change `SERVER_PORT` in `.env` to a different port.

### TypeScript Errors

Run type checking:
```bash
npm run type-check
```

## Development Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Compile TypeScript to JavaScript
- `npm start` - Start production server (requires build first)
- `npm run start:prod` - Build and start production server
- `npm run type-check` - Type check without building


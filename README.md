
#### 1. Registration & Verification Flow
<img src="./.github/register.png" width="48%" alt="Register Screen" /> <img src="./.github/email_received.png" width="48%" alt="Email Inbox" />

<br />

<img src="./.github/email_verify.png" width="48%" alt="Verify Screen" /> <img src="./.github/login.png" width="48%" alt="Login Screen" />

---

### 📬 API Testing & Postman Collections
To verify the API endpoints and route payloads, here is the complete Postman collection setup:

![Postman Collections](./.github/postman.png)



# ERD DIAGRAM
[View the ERD diagram](https://drive.google.com/file/d/1_OIcAkLUbbSHWs18X8uLRmlyAlW_dy6d/view?usp=sharing)

# SQL Interview Questions and Answers

---

## Table of Contents

1. [Difference Between DELETE, TRUNCATE, and DROP](#1-difference-between-delete-truncate-and-drop)
2. [What is a Primary Key?](#2-what-is-a-primary-key)
3. [Primary Key vs Unique Key](#3-primary-key-vs-unique-key)
4. [What is a Foreign Key?](#4-what-is-a-foreign-key)
5. [What is JOIN in SQL?](#5-what-is-join-in-sql)
6. [What is Normalization?](#6-what-is-normalization)
7. [What is Indexing?](#7-what-is-indexing)
8. [WHERE vs HAVING](#8-where-vs-having)
9. [What is a Transaction?](#9-what-is-a-transaction)
10. [Second Highest Salary Query](#10-second-highest-salary-query)

---

## 1. Difference Between `DELETE`, `TRUNCATE`, and `DROP`

| Command | Description |
|---|---|
| `DELETE` | Removes selected rows from a table. It can use a `WHERE` condition. |
| `TRUNCATE` | Removes all rows from a table quickly, but keeps the table structure. |
| `DROP` | Removes the entire table, including its data and structure. |

### Example

```sql
DELETE FROM users WHERE id = 1;

TRUNCATE TABLE users;

DROP TABLE users;
```

---

## 2. What is a Primary Key?

A **Primary Key** is a column that uniquely identifies each row in a table.

A primary key:

- Must be unique
- Cannot be `NULL`
- Helps identify each record separately

### Example

```sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100)
);
```

Here, `id` is the primary key.

---

## 3. Primary Key vs Unique Key

| Primary Key | Unique Key |
|---|---|
| Uniquely identifies each row | Ensures values are unique |
| Cannot be `NULL` | Can allow `NULL` depending on the database |
| Only one primary key per table | Multiple unique keys can exist in a table |
| Commonly used for `id` | Commonly used for `email`, `username`, or `phone` |

### Example

```sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(100) UNIQUE
);
```

Here, `id` is the primary key and `email` is a unique key.

---

## 4. What is a Foreign Key?

A **Foreign Key** is used to create a relationship between two tables.

It usually refers to the primary key of another table.

### Example

```sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100)
);

CREATE TABLE orders (
  id SERIAL PRIMARY KEY,
  user_id INT REFERENCES users(id),
  total_price INT
);
```

Here, `user_id` in the `orders` table refers to the `id` column of the `users` table.

This means one user can have many orders.

---

## 5. What is JOIN in SQL?

A **JOIN** is used to combine data from two or more tables based on a related column.

---

### INNER JOIN

`INNER JOIN` returns only the matching rows from both tables.

```sql
SELECT users.name, orders.total_price
FROM users
INNER JOIN orders
ON users.id = orders.user_id;
```

If a user has no order, that user will not appear in the result.

---

### LEFT JOIN

`LEFT JOIN` returns all rows from the left table and matching rows from the right table.

```sql
SELECT users.name, orders.total_price
FROM users
LEFT JOIN orders
ON users.id = orders.user_id;
```

If a user has no order, the user will still appear, but the order value will be `NULL`.

---

## 6. What is Normalization?

**Normalization** is the process of organizing database tables to reduce duplicate data and improve data consistency.

It helps keep the database clean, structured, and easier to maintain.

---

### 1NF — First Normal Form

A table is in **1NF** when each column contains only one value.

#### Bad Example

| id | name | phones |
|---|---|---|
| 1 | Rifat | 01711, 01822 |

#### Good Example

| id | name | phone |
|---|---|---|
| 1 | Rifat | 01711 |
| 1 | Rifat | 01822 |

---

### 2NF — Second Normal Form

A table is in **2NF** when:

- It is already in 1NF
- Every non-key column depends on the full primary key

This mainly applies when a table has a composite primary key.

---

### 3NF — Third Normal Form

A table is in **3NF** when:

- It is already in 2NF
- No non-key column depends on another non-key column

For example, instead of storing `department_name` directly inside a `students` table, we can store department information in a separate `departments` table.

---

## 7. What is Indexing?

**Indexing** is a technique used to make database searching faster.

An index works like a book index. Instead of scanning every row, the database can quickly find the required data.

### Example

```sql
CREATE INDEX idx_users_email
ON users(email);
```

Now searching by email can become faster:

```sql
SELECT * FROM users
WHERE email = 'test@gmail.com';
```

### Why do we use indexes?

We use indexes to improve query performance, especially on columns that are frequently:

- Searched
- Filtered
- Sorted
- Joined

However, too many indexes can slow down `INSERT`, `UPDATE`, and `DELETE` operations because indexes also need to be updated.

---

## 8. WHERE vs HAVING

| WHERE | HAVING |
|---|---|
| Filters rows | Filters groups |
| Used before grouping | Used after `GROUP BY` |
| Usually does not use aggregate functions | Can use aggregate functions |
| Works with normal row data | Works with grouped data |

### WHERE Example

```sql
SELECT * FROM users
WHERE age > 18;
```

### HAVING Example

```sql
SELECT department, COUNT(*) AS total_users
FROM users
GROUP BY department
HAVING COUNT(*) > 5;
```

In short, `WHERE` filters rows before grouping, and `HAVING` filters groups after grouping.

---

## 9. What is a Transaction?

A **transaction** is a group of SQL operations that are executed together.

If all operations are successful, the changes are saved using `COMMIT`.

If something goes wrong, the changes can be cancelled using `ROLLBACK`.

### Example

```sql
BEGIN;

UPDATE accounts
SET balance = balance - 500
WHERE id = 1;

UPDATE accounts
SET balance = balance + 500
WHERE id = 2;

COMMIT;
```

---

### COMMIT

`COMMIT` saves the changes permanently.

```sql
COMMIT;
```

---

### ROLLBACK

`ROLLBACK` cancels the changes made in the current transaction.

```sql
ROLLBACK;
```

---

## 10. Second Highest Salary Query

Assume we have an `employees` table with a `salary` column.

### Using `LIMIT` and `OFFSET`

```sql
SELECT DISTINCT salary
FROM employees
ORDER BY salary DESC
LIMIT 1 OFFSET 1;
```

This query sorts the salaries from highest to lowest, skips the highest salary, and returns the second highest salary.

---

### Using Subquery

```sql
SELECT MAX(salary) AS second_highest_salary
FROM employees
WHERE salary < (
  SELECT MAX(salary)
  FROM employees
);
```

This query first finds the highest salary, then finds the maximum salary below it.

---

## Quick Summary

| Topic | Short Answer |
|---|---|
| `DELETE` | Removes selected rows |
| `TRUNCATE` | Removes all rows but keeps table structure |
| `DROP` | Removes the full table |
| Primary Key | Uniquely identifies each row |
| Unique Key | Prevents duplicate values |
| Foreign Key | Connects two tables |
| JOIN | Combines data from tables |
| INNER JOIN | Returns only matching rows |
| LEFT JOIN | Returns all left table rows and matching right table rows |
| Normalization | Organizes data and reduces duplication |
| Indexing | Makes searching faster |
| WHERE | Filters rows |
| HAVING | Filters grouped data |
| Transaction | Executes multiple SQL operations together |
| COMMIT | Saves changes |
| ROLLBACK | Cancels changes |



# Assignment 02

A modular Express.js backend built with TypeScript. The current codebase focuses on API structure, authentication module scaffolding, reusable response formatting, request validation, and centralized error handling. Prisma and PostgreSQL are planned for a future version, but they are not integrated yet.

## ERD

[View the ERD diagram](https://drive.google.com/file/d/1rGvyNJtd2n8ZRgIJCpmWjZ8-tn_zpoV8/view?usp=sharing)

## Database Concepts Q&A

### 1. Primary Key vs. Foreign Key

- **Primary Key (PK):** A column (or set of columns) that uniquely identifies every row in a table. It cannot contain `NULL` values, and there can only be one PK per table. Think of it as a definitive ID number.
- **Foreign Key (FK):** A column in one table that links to the Primary Key of another table. It acts as a bridge to establish a relationship between the two tables and enforces referential integrity, ensuring you cannot have an orphaned record that points to a non-existent primary key.

### 2. The Importance of Normalization

Normalization is the process of organizing data to minimize redundancy (duplicate data) and prevent data anomalies (errors during insertion, updating, or deletion).

By breaking large tables into smaller, related tables, you ensure that a piece of information is stored in exactly one place. This is crucial in relational systems like SQLite or PostgreSQL because it keeps the database efficient, maintains strict data integrity, and makes updates much safer.

### 3. What is a JOIN?

A `JOIN` is a SQL operation used to combine rows from two or more tables based on a related column between them, usually a Primary Key to Foreign Key relationship. Since normalization splits data apart, `JOIN` is the mechanism used to stitch it back together for queries.

### 4. SQL vs. MongoDB

This is the fundamental difference between relational and document databases.

| Feature | SQL (Relational) | MongoDB (NoSQL/Document) |
| --- | --- | --- |
| **Structure** | Tables, rows, and columns. | Collections of BSON/JSON documents. |
| **Schema** | Rigid and predefined. | Flexible and dynamic; documents in the same collection can have different structures. |
| **Relationships** | Strongly enforced via Foreign Keys and JOINs. | Often handled by embedding data within the document or using reference IDs like `ObjectId`. |
| **Scaling** | Typically scales **vertically** by adding more CPU/RAM to a single server. | Built to scale **horizontally** by distributing data across multiple servers. |

### 5. Composite Key

A composite key is a Primary Key made up of **two or more columns** combined to guarantee uniqueness. While neither column is unique on its own, their combination is.

- *Example:* In a `ClassRoster` table, `StudentID` might repeat because a student takes multiple classes, and `ClassID` might repeat because a class has multiple students. However, the combination of `(StudentID, ClassID)` is unique and can serve as the composite key.

### 6. Weak Entity

A weak entity is a piece of data that cannot be uniquely identified by its own attributes alone. It depends on the existence of an owner entity, or strong entity, to exist.

- *Example:* A `Room` in a `Building`. If the `Building` is demolished, the `Room` ceases to exist. The room's identifier, such as Room 101, is only meaningful when combined with the building's Primary Key.

### 7. Why Do We Use Constraints?

Constraints are rules strictly enforced by the database engine to limit the type of data that can go into a table. They are the ultimate safety net to ensure accuracy and reliability. Common constraints include `NOT NULL` for required values, `UNIQUE` to prevent duplicates, and `CHECK` to ensure values meet a specific condition like `Age >= 18`.

### 8. Many-to-Many Relationship

This occurs when multiple records in Table A can relate to multiple records in Table B.

- *Example:* Authors and Books. An author can write multiple books, and a book can have multiple authors.
- **How it's solved:** In relational databases, you cannot resolve this directly. You must create a **junction table** or join table that sits between them, holding the Primary Keys of both tables as Foreign Keys.

### 9. Clustered vs. Non-Clustered Index

Indexes drastically speed up data retrieval, acting like the index at the back of a textbook.

- **Clustered Index:** Dictates the **actual physical sorting order** of the data on disk. Because data can only be physically sorted one way, a table can only have **one** clustered index, usually automatically created on the Primary Key.
- **Non-Clustered Index:** A separate data structure from the actual table. It contains a sorted list of the indexed columns along with pointers, like page numbers, to the actual data rows. You can have **multiple** non-clustered indexes on a table to speed up various queries.

### 10. Database Sharding vs. Partitioning

Both techniques manage large datasets, but they solve different problems.

- **Partitioning:** Dividing a single large table into smaller, more manageable logical pieces **within the same database server**.
- *When to use:* Use it to improve query performance and maintenance on a single machine. For example, partitioning a massive logs table by year. Old years can be archived easily without scanning the whole table.
- **Sharding:** Distributing pieces of a database across **multiple distinct physical servers** through horizontal scaling. Each server, or shard, holds a subset of the total data.
- *When to use:* Use it when your dataset or traffic is so massive that it exceeds the hardware limits of a single server, such as CPU, RAM, or disk space. This is a complex architecture, though systems like MongoDB support sharding natively to handle massive, distributed applications.

## Overview

This project is a small backend starter built with a modular Express architecture. Right now, it is centered around an `auth` module and a few shared utilities that make the code easier to scale later.

The current codebase includes:

- Express 5 for the HTTP server
- TypeScript for type safety
- Zod for request validation
- `http-status` for readable status code constants
- `dotenv` for environment configuration
- `cors` and `cookie-parser` middleware
- a reusable `sendResponse` helper for consistent JSON responses
- a `catchAsync` helper for async controller error forwarding
- a global error handler middleware

The service layer is still returning placeholder data, so this repository should be treated as a foundation project rather than a complete production-ready auth system.

## Features

- Modular folder structure
- Versioned API base path: `/api/v1`
- Dedicated auth module with separated route, controller, service, and validation files
- Reusable response helper for consistent API output
- Zod-based request validation middleware
- Async error forwarding with `catchAsync`
- Centralized global error middleware
- Structured `404` response for unknown routes
- Environment-based configuration using `.env`
- TypeScript development workflow with `tsx`

## Tech Stack

- Node.js
- Express.js
- TypeScript
- Zod
- pnpm

## Project Structure

```text
src/
├── app.ts
├── server.ts
├── app/
│   ├── middleware/
│   │   ├── globalError.ts
│   │   ├── notFound.ts
│   │   └── validateRequest.ts
│   ├── modules/
│   │   └── auth/
│   │       ├── auth.controller.ts
│   │       ├── auth.route.ts
│   │       ├── auth.service.ts
│   │       └── auth.validation.ts
│   └── routes/
│       └── routes.ts
├── config/
│   └── env.ts
├── types/
│   └── response.ts
└── utils/
    ├── ApiResponse.ts
    └── catchAsync.ts
```

## How It Works

The application starts from `src/server.ts`, loads environment values from `src/config/env.ts`, and boots the Express app from `src/app.ts`.

Request flow:

1. Shared middleware is applied with `cors`, `express.json`, `cookie-parser`, and `express.urlencoded`.
2. The app exposes a health-style root route at `/`.
3. All API routes are mounted under `/api/v1`.
4. Module routes are connected from `src/app/routes/routes.ts`.
5. Controllers call service functions and return structured JSON responses through `sendResponse`.
6. Async controller errors can be forwarded with `catchAsync`.
7. Unexpected errors are handled by `globalError`.
8. Unknown routes fall through to `notFound`.

The root route:

```http
GET /
```

returns:

```json
{
  "message": "Successful"
}
```

All API routes are grouped under:

```text
/api/v1
```

The auth module is mounted under:

```text
/api/v1/auth
```

## Environment Variables

Create a `.env` file in the project root:

```env
PORT=5000
NODE_ENV=development
```

### Variables Used

- `PORT` - the port used by the HTTP server
- `NODE_ENV` - enables extra error details in development mode

## API Response Pattern

Successful responses are returned through `src/utils/ApiResponse.ts` and follow this shape:

```json
{
  "success": true,
  "message": "Any success message",
  "data": {}
}
```

## Auth Endpoints

The current auth module contains scaffolded routes that demonstrate structure and flow rather than complete authentication logic.

### 1. Login

```http
GET /api/v1/auth/login
```

Current behavior:

- handled by `AuthController.login`
- wrapped with `catchAsync`
- returns placeholder login data from the service layer
- has a validation schema in the codebase, but the route validation is currently commented out

Current response:

```json
{
  "success": true,
  "message": "Login Successful",
  "data": "email@com"
}
```

### 2. Register

```http
GET /api/v1/auth/register
```

Current behavior:

- handled by `AuthController.register`
- wrapped with `catchAsync`
- validated by `validateRequestData(AuthValidation.registerSchema)`
- returns placeholder registration data from the service layer

Current response:

```json
{
  "success": true,
  "message": "Register successful",
  "data": {
    "name": "Rifat",
    "email": "rifat@gmail.com"
  }
}
```

### 3. Change Password

```http
GET /api/v1/auth/change-password
```

Current behavior:

- handled by `AuthController.changePassword`
- returns placeholder password-change data
- has a validation schema defined, but the route is not currently using validation middleware

Current response:

```json
{
  "success": true,
  "message": "Password Changed Successfully",
  "data": {
    "oldPassword": "old",
    "newPassword": "new",
    "confirmNewPassword": "confirmed"
  }
}
```

### 4. Forgot Password

```http
GET /api/v1/auth/forgot-password
```

Current behavior:

- handled by `AuthController.forgotPassword`
- returns placeholder forgot-password data
- has a validation schema defined, but the route is not currently using validation middleware

Current response:

```json
{
  "success": true,
  "message": "Password reset mail sent!",
  "data": "myemail@gmail.com"
}
```

## Validation

Request validation is handled by `src/app/middleware/validateRequest.ts` using Zod schemas from the auth module.

Available schemas:

- `loginSchema`: validates email format
- `registerSchema`: validates `name` with a minimum of 3 characters
- `forgotPasswordSchema`: validates email format
- `changePasswordSchema`:
  - requires `oldPassword`
  - requires `newPassword` with a minimum of 6 characters
  - requires `confirmNewPassword`
  - ensures `newPassword` and `confirmNewPassword` match

Current route usage:

- `register` uses validation middleware
- `login` validation is present but commented out
- `change-password` and `forgot-password` schemas exist but are not wired to routes yet

If validation fails, the API returns a `400 Bad Request` response like:

```json
{
  "success": false,
  "message": "Validation error message",
  "error": [
    {
      "path": [],
      "message": "Validation details"
    }
  ]
}
```

## Error Handling

The project currently includes two main error-related middlewares:

- `globalError.ts` for centralized error responses
- `notFound.ts` for unmatched routes

When `NODE_ENV=development`, the global error handler includes extra debugging details such as the error object and stack trace.

Example `404` response:

```json
{
  "success": false,
  "message": "Api not found",
  "error": {
    "path": "/requested/path",
    "message": "Your requested path was not found"
  }
}
```

## Installation

Clone the repository and install dependencies:

```bash
git clone https://github.com/rifat584/rt-assignment-02
cd assignment-02
pnpm install
```

## Running the Project

### Development

```bash
pnpm dev
```

Runs the server in watch mode using `tsx`.

### Production Build

```bash
pnpm build
```

### Start Built Version

```bash
pnpm start
```

## Available Scripts

- `pnpm dev` - run the app in development mode
- `pnpm build` - compile TypeScript into `dist`
- `pnpm start` - run the compiled app from `dist/server.js`

## API Testing

You can test the API using Postman, Insomnia, or `curl`.

Example root request:

```bash
curl http://localhost:5000/
```

Example auth route:

```bash
curl http://localhost:5000/api/v1/auth/register
```

## Current Status

This project is still in an early scaffold phase. Right now:

- auth routes still use `GET` instead of more RESTful methods like `POST` or `PATCH`
- service methods return hardcoded placeholder data
- there is no database integration yet
- there is no Prisma setup yet
- there is no PostgreSQL connection yet
- there is no password hashing
- there is no JWT-based authentication yet
- only the `register` route currently applies validation middleware
- `changePassword` and `forgotPassword` are not yet wrapped with `catchAsync`

## Future Plan

The next planned step is to extend this backend with Prisma and PostgreSQL.

After that, the project can grow into a more complete auth system with:

- proper RESTful route methods
- Prisma schema and database models
- PostgreSQL-backed service logic
- secure password hashing with `bcrypt`
- JWT authentication and authorization
- full validation coverage for all auth routes
- custom error classes and better exception handling
- automated tests for routes and middleware

## Author

Rifat

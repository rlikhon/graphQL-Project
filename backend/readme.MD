# GraphQL Pro

A GraphQL + Express + MongoDB project for building a user authentication and real-time API service.

## Project Overview

This project includes:
- Express server setup
- Apollo Server for GraphQL
- MongoDB connection with Mongoose
- JWT-based authentication
- Password hashing with bcrypt
- GraphQL subscriptions support
- Nested relational mapping

## Installed Packages

The following packages are currently installed in this project:

- @graphql-tools/schema - ^10.1.0
- apollo-server-express - ^3.13.0
- bcrypt - ^6.0.0
- dotenv - ^17.4.2
- express - ^4.22.2
- graphql - ^16.14.2
- graphql-subscriptions - ^3.0.0
- jsonwebtoken - ^9.0.3
- mongoose - ^9.9.4
- subscriptions-transport-ws - ^0.11.0

## Scripts

Use the following scripts from the terminal:

```bash                                   
❯ npm start
❯ npm run dev
```

## Installation

```bash
❯ npm init -y         
❯ npm i apollo-server-express graphql express mongoose dotenv     
❯ npm install -g nodemon
❯ npm run dev
❯ npm i bcrypt jsdonwebtoken
❯ npm i graphql-subcriptions 
❯ npm i @graphql-tools/schema
❯ npm i subcriptions-transport-ws

```

## Run the Project

```bash
❯ npm run dev
```

This will start the server using nodemon for development mode.

## Notes

- Project type: CommonJS
- Main entry file: src/index.js
- Server configuration is managed in the src folder
- Environment variables can be stored in a .env file

## Last Activity

- 2026-09-06: Completed the initial project setup (`425a97e`, `full project`)

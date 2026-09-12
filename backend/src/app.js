const express = require("express");
const { ApolloServer } = require("apollo-server-express");
const { ApolloServerPluginDrainHttpServer } = require("apollo-server-core"); // 🚀 Added
const { typeDefs, resolvers } = require("./graphql/schema");

const authMiddleware = require("./middleware/auth");


async function createApolloServer(app, httpServer) {
    const server = new ApolloServer({
        typeDefs,
        resolvers,
        formatError: (err) => {
            // Log the error for debugging purposes
            console.error("💥 Apollo v3 Error:", err);
            return {
                message: err.message,
                path: err.path,
                location: err.locations,
                code: err.extensions?.code || 'INTERNAL_SERVER_ERROR',
                details: err.extensions?.details || null
            };
        },
        context: ({ req }) => {            
            const user = authMiddleware(req);
            return { user };
        },
        plugins: [
            ApolloServerPluginDrainHttpServer({ httpServer })
        ]
    });

    await server.start();
    server.applyMiddleware({ app, path: "/graphql" });
    return server;
}

async function createApp() {
    const app = express();
    return app;
}

module.exports = { createApp, createApolloServer };
require('dotenv').config();
const { createServer } = require('http');
const { execute, subscribe } = require('graphql');
const { SubscriptionServer } = require('subscriptions-transport-ws');

const { createApp, createApolloServer } = require('./app');
const connectDB = require('./config/db');

const { typeDefs, resolvers } = require('./graphql/schema');
const { makeExecutableSchema } = require('@graphql-tools/schema');

const PORT = process.env.PORT || 4000;

const start = async () => {
    await connectDB();
    const app = await createApp();
    
    const httpServer = createServer(app);
    const apolloServer = await createApolloServer(app, httpServer);    

    const schema = makeExecutableSchema({
        typeDefs,
        resolvers,
    });

    SubscriptionServer.create({
        schema,
        execute,
        subscribe,
        onConnect: () => {
            console.log('Client connected for subscriptions');
        },
        onDisconnect: () => {
            console.log('Client disconnected from subscriptions');
        }
    }, {
        server: httpServer,
        path: "/graphql",//apolloServer.subscriptionsPath
    });

    httpServer.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
};

start();
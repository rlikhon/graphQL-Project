require('dotenv').config();
const { createServer } = require('http');
const { createApp, createApolloServer } = require('./app');
const connectDB = require('./config/db');
const { typeDefs, resolvers } = require('./graphql/schema');
const { makeExecutableSchema } = require('@graphql-tools/schema');
const { WebSocketServer } = require("ws");
const { useServer } = require('graphql-ws/use/ws');

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

    const wsServer = new WebSocketServer({
        server: httpServer,
        path: '/graphql'
    });

    useServer(
        {
            schema,
            onConnect: () => {
                console.log('Client connected for subscriptions');
            },
            onDisconnect: () => {
                console.log('Client disconnected from subscriptions');
            }
        },
        wsServer
    );

    // Usage: FOR REAL-TIME AUTH
    // const authMiddleware = require('./middleware/auth'); 
    // useServer(
    //     {
    //         schema,
    //         // 🛰️ WebSocket context pipeline
    //         context: (ctx) => {
    //             // 1. Extract the token from the socket's connection parameters
    //             const token = ctx.connectionParams?.Authorization || ctx.connectionParams?.authorization;

    //             // 2. Mock an Express 'req' object matching the shape your middleware expects
    //             const mockReq = {
    //                 headers: {
    //                     authorization: token
    //                 }
    //             };

    //             // 3. Pass the mock request straight into your existing middleware
    //             const user = authMiddleware(mockReq);

    //             // 4. Return the decoded user object to your subscription context
    //             return { user };
    //         },
    //         onConnect: () => {
    //             console.log('Client connected for subscriptions via graphql-ws');
    //         },
    //         onDisconnect: () => {
    //             console.log('Client disconnected from subscriptions');
    //         }
    //     },
    //     wsServer
    // );


    httpServer.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
};

start();
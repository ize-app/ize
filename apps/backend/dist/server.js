"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const server_1 = require("@apollo/server");
const express4_1 = require("@apollo/server/express4");
const cors_1 = __importDefault(require("cors"));
const body_parser_1 = require("body-parser");
const query_resolvers_1 = require("./graphql/resolvers/query_resolvers");
const host = (_a = process.env.HOST) !== null && _a !== void 0 ? _a : 'localhost';
const port = process.env.PORT ? Number(process.env.PORT) : 3000;
const app = (0, express_1.default)();
app.get('/', (req, res) => {
    res.send({ message: 'Hello API' });
});
const typeDefs = `#graphql
  type Query {
    hello: String
  }
`;
const server = new server_1.ApolloServer({
    typeDefs,
    resolvers: query_resolvers_1.resolvers,
});
server.start().then(() => {
    app.use('/graphql', (0, cors_1.default)(), (0, body_parser_1.json)(), (0, express4_1.expressMiddleware)(server));
    app.listen(port, host, () => {
        console.log(`[ API Ready ] http://${host}:${port}`);
    });
});
//# sourceMappingURL=server.js.map
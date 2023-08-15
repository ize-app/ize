"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resolvers = void 0;
const user_resolvers_1 = require("./user_resolvers");
exports.resolvers = {
    Query: Object.assign({}, user_resolvers_1.userQueries),
};
//# sourceMappingURL=query_resolvers.js.map
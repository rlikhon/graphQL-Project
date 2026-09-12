const { gql } = require('apollo-server-express');

const userTypeDefs = require('./typeDefs/userType');
const userResolver = require('./resolvers/userResolver');

const postTypeDefs = require('./typeDefs/post.typeDefs');
const postResolver = require('./resolvers/post.resolver');

const baseTypeDefs = gql`
  type Query {
    _empty: String
  }
  type Mutation {
    _empty: String
  }
  type Subscription {
    _empty: String
  }
`;

const typeDefs = [baseTypeDefs, userTypeDefs, postTypeDefs];
const resolvers = [userResolver, postResolver];

module.exports = { typeDefs, resolvers };
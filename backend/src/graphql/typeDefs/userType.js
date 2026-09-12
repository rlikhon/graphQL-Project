const { gql } = require('apollo-server-express');

const userTypeDefs = gql`
  type User {    
    id: ID!
    name: String!
    email: String!    
    createdAt: String!
    updatedAt: String 
  }

  type authPayload {
    token: String!
    user: User!
  }
  
  input CreateUserInput {
    name: String!
    email: String!
    password: String!
  }

  input UpdateUserInput {
    name: String
    email: String
  }

  type UserPaginate {
    docs: [User!]!       # An array of non-null users, and the array itself cannot be null
    totalDocs: Int!      # Always an integer
    totalPages: Int!     # Always an integer
    currentPage: Int!    # Always an integer
}

extend type Query {
    getUsers(page: Int, limit: Int): UserPaginate!
    getUser(id: ID!): User
}

  type Mutation {
    registerUser(input: CreateUserInput!): authPayload!
    loginUser(email: String!, password: String!): authPayload!
    createUser(input: CreateUserInput!): User!
    updateUser(id: ID!, input: UpdateUserInput!): User!
    deleteUser(id: ID!): Boolean!
  }

  type Subscription {
    userCreated: User!
  }
`;

module.exports = userTypeDefs;
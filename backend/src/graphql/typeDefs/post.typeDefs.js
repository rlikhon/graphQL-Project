const { gql } = require('apollo-server-express');

const postTypeDefs = gql`
  type Post {
    id: ID!
    title: String!
    content: String!
    author: User!
    createdAt: String!
    updatedAt: String!
  }

  input PostInput {
    title: String!
    content: String!
  }

  extend type Query {
    getPosts: [Post!]!
    getPost(id: ID!): Post
  }

  extend type Mutation {
    createPost(input: PostInput!): Post!
    updatePost(id: ID!, input: PostInput!): Post
    deletePost(id: ID!): Boolean
  }
`;

module.exports = postTypeDefs;
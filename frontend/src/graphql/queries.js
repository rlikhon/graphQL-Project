import { gql } from '@apollo/client';

export const GET_USERS = gql`
  query GetUsers($page: Int, $limit: Int) {
    getUsers(page: $page, limit: $limit) {      
      docs {
        id
        name
        email
        createdAt
      }
      totalDocs
      totalPages
      currentPage      
    }
  }
`;

export const GET_USER_BY_ID = gql`
  query GetUser($id: ID!) {
    getUser(id: $id) {
      id
      name
      email
      createdAt
    }
  }
`;
import {gql} from 'graphql-tag';

export const REGISTER_USER = gql`
    mutation RegisterUser($input: RegisterInput!) {
        registerUser(input: $input) {
            id
            username
            email
            createdAt
        }
    }
`;

export const LOGIN_USER = gql`
    mutation LoginUser($input: LoginInput!) {
        loginUser(input: $input) {
            id
            name
            email
            createdAt
        }
    }
`;

export const LOGOUT_USER = gql`
    mutation LogoutUser {
        logoutUser
    }
`;

export const CREATE_USER = gql`
    mutation CreateUser($input: CreateUserInput!) {
        createUser(input: $input) {
            id
            name
            email
            createdAt
        }
    }
`;

export const UPDATE_USER = gql`
    mutation UpdateUser($updateUserId: ID!, $input: UpdateUserInput!) {
        updateUser(id: $updateUserId, input: $input) {
            id
            name
            email
            createdAt
        }
    }    
`;

export const DELETE_USER = gql`
    mutation DeleteUser($deleteUserId: ID!) {
        deleteUser(id: $deleteUserId)
    }
`;
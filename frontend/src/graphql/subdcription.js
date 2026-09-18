import { gql } from '@apollo/client';

export const USER_CREATED_SUBSCRIPTION = gql`

    subscription UserCreated {
        userCreated {
            id
            name
            email
            createdAt
        }
    }
`;
import { gql } from '@apollo/client';

export const GET_USERS = gql`
  query {
    business(id: "garaje-san-francisco") {
        name
        id
        alias
        rating
        url
    }
  }
`;
import { gql } from "graphql-request";

export const SIGN_UP_MUTATION = gql`
  mutation SignUp(
    $username: String!
    $firstName: String!
    $lastName: String!
    $email: String!
    $password: String!
  ) {
    signUp(
      createAuthInput: {
        username: $username
        firstName: $firstName
        lastName: $lastName
        email: $email
        password: $password
      }
    )
  }
`;

export const SIGN_IN_MUTATION = gql`
  mutation SignIn($email: String!, $password: String!) {
    signIn(signInInput: { email: $email, password: $password }) {
      accessToken
      refreshToken
    }
  }
`;

export const REFRESH_TOKEN_QUERY = gql`
  query RefreshToken($refreshToken: String!) {
    refreshToken(refreshToken: $refreshToken) {
      accessToken
    }
  }
`;

export const FETCH_SESSION_USER = gql`
  query {
    user {
      id
      username
      email
      fullName
      avatar
      createdAt
    }
  }
`;

export const GET_ALL_MY_WORKSPACE = gql`
  query {
    get_all_my_workspaces {
      id
      name
      description
      logo {
        id
        filename
        url
        type
        createdAt
      }
      createdAt
    }
  }
`;

export const CREATE_WORKSPACE_MUTATION = gql`
  mutation CreateWorkspace(
    $name: String!
    $logo: String
    $description: String
  ) {
    createWorkspace(
      createWorkspaceInput: {
        name: $name
        description: $description
        logo: $logo
      }
    ) {
      id
      name
      description
      logo {
        id
        filename
        url
        type
        createdAt
      }
    }
  }
`;

export const GET_ALL_BOARDS = gql`
  query GetAllBoards($workspaceId: String!) {
    getAllBoards(workspaceId: $workspaceId) {
      id
      name
      background
      description
      createdAt
    }
  }
`;

export const CREATE_BOARD = gql`
  mutation CreateBoard(
    $name: String!
    $background: String!
    $description: String
    $workspaceId: String!
  ) {
    createBoard(
      createBoardInput: {
        name: $name
        background: $background
        description: $description
        workspaceId: $workspaceId
      }
    ) {
      id
      name
    }
  }
`;

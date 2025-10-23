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
  query GetAllBoards(
    $workspaceId: String!
    $take: Int
    $cursor: String
    $sort: String
    $search: String
  ) {
    getAllBoards(
      workspaceId: $workspaceId
      take: $take
      cursor: $cursor
      sort: $sort
      search: $search
    ) {
      items {
        id
        name
        background
        description
        createdAt
        starred {
          id
        }
      }
      nextCursor
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

export const GET_STARRED_BOARDS = gql`
  query FindStarredBoards($workspaceId: String!) {
    findStarredBoards(workspaceId: $workspaceId) {
      id
      name
      background
    }
  }
`;

export const TOGGLE_STARRED_BOARD = gql`
  mutation ToggleStarredBoard($workspaceId: String!, $boardId: String!) {
    toggleStarredBoard(
      toggleStarredBoardInput: { workspaceId: $workspaceId, boardId: $boardId }
    )
  }
`;

export const GET_LISTS = gql`
  query Lists($boardId: String!) {
    list(boardId: $boardId) {
      id
      name
      orderIndex
    }
  }
`;

export const GET_BOARD = gql`
  query GetBoard($boardId: String!) {
    getBoard(boardId: $boardId) {
      name
      background
      members {
        id
        role
        user {
          id
          fullName
          avatar
          username
        }
      }
    }
  }
`;

export const UPDATE_BOARD = gql`
  mutation UpdateBoard(
    $id: String!
    $name: String
    $background: String
    $workspaceId: String
    $description: String
  ) {
    updateBoard(
      updateBoardInput: {
        id: $id
        name: $name
        background: $background
        workspaceId: $workspaceId
        description: $description
      }
    ) {
      name
    }
  }
`;

export const UPDATE_LIST = gql`
  mutation UpdateList(
    $id: String!
    $name: String
    $boardId: String
    $orderIndex: Int
  ) {
    updateList(
      updateListInput: {
        id: $id
        name: $name
        boardId: $boardId
        orderIndex: $orderIndex
      }
    ) {
      name
      orderIndex
    }
  }
`;

export const UPDATE_BOARD_MEMBER = gql`
  mutation UpdateBoardMember($id: String!, $role: ROLE, $boardId: String!) {
    updateBoardMember(
      updateBoardMemberInput: { id: $id, role: $role }
      boardId: $boardId
    ) {
      role

      id
    }
  }
`;

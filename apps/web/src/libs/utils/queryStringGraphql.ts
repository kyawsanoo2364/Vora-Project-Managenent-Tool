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

export const CREATE_LIST = gql`
  mutation CreateList($name: String!, $boardId: String!) {
    createList(createListInput: { name: $name, boardId: $boardId }) {
      id
      name
      orderIndex
    }
  }
`;

export const GET_LISTS = gql`
  query Lists($boardId: String!) {
    list(boardId: $boardId) {
      id
      name
      orderIndex
      cards {
        id
      }
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
    $orderIndex: Int!
  ) {
    updateList(
      updateListInput: {
        id: $id
        name: $name
        boardId: $boardId
        orderIndex: $orderIndex
      }
    )
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

export const CREATE_OR_GET_INVITE_LINK = gql`
  mutation CreateInviteLink($scope: String!, $scopeId: String!, $role: ROLE) {
    createInviteLink(
      createInviteLinkInput: { scope: $scope, scopeId: $scopeId, role: $role }
    ) {
      inviteLink
    }
  }
`;

export const GET_INVITE_USING_SCOPE_ID = gql`
  query getInvite($scopeId: String!) {
    getInvite(scopeId: $scopeId) {
      id
    }
  }
`;

export const CONFIRM_INVITE_LINK = gql`
  query confirm($scopeId: String!, $token: String!) {
    confirmLink(scopeId: $scopeId, token: $token) {
      invitedBy
      scopeName
      scopeType
      alreadyJoined
    }
  }
`;

export const ACCEPT_INVITE_LINK = gql`
  mutation Accept($token: String!) {
    acceptLink(token: $token)
  }
`;

export const REVOKE_INVITE_LINK = gql`
  mutation revoke($scopeId: String!) {
    revokeLink(scopeId: $scopeId)
  }
`;

export const GET_WORKSPACE_MEMBER = gql`
  query GetMember($workspaceId: String!) {
    getMember(workspaceId: $workspaceId) {
      role
      id
      userId
    }
  }
`;

export const GET_ALL_WORKSPACE_MEMBERS = gql`
  query getAllWorkspaceMember($workspaceId: String!) {
    getAllWorkspaceMember(workspaceId: $workspaceId) {
      id
      role
      user {
        id
        email
        fullName
        username
      }
    }
  }
`;

export const UPDATE_WORKSPACE_MEMBER_ROLE = gql`
  mutation UpdateWorkspaceMemberRole(
    $id: String!
    $role: String!
    $workspaceId: String!
  ) {
    updateWorkspaceMemberRole(id: $id, role: $role, workspaceId: $workspaceId) {
      id
    }
  }
`;

export const REMOVE_WORKSPACE_MEMBER = gql`
  mutation RemoveWorkspaceMember($id: String!, $workspaceId: String!) {
    removeWorkspaceMember(id: $id, workspaceId: $workspaceId)
  }
`;

export const GET_USERS_BY_NAME_OR_EMAIL = gql`
  query GetUserByNameOrEmail($searchTerms: String!) {
    getUsersByNameOrEmail(searchTerms: $searchTerms) {
      id
      fullName
      email
      avatar
      username
    }
  }
`;

export const INVITE_LINK_USING_MAIL = gql`
  mutation InviteLinkUsingMail(
    $role: ROLE
    $scope: String!
    $scopeId: String!
    $email: String!
  ) {
    inviteLinkUsingMail(
      inviteToEmailInput: {
        role: $role
        scope: $scope
        scopeId: $scopeId
        email: $email
      }
    )
  }
`;

export const CREATE_BOARD_MEMBER = gql`
  mutation createBoardMember(
    $role: ROLE!
    $userId: String!
    $boardId: String!
  ) {
    createBoardMember(
      createBoardMemberInput: { role: $role, userId: $userId }
      boardId: $boardId
    ) {
      id
      role
    }
  }
`;

export const REMOVE_LEAVE_BOARD_MEMBER = gql`
  mutation RemoveBoardMember($id: String!) {
    removeBoardMember(id: $id)
  }
`;

export const GET_CURRENT_BOARD_MEMBER = gql`
  query GetCurrentBoardMember($boardId: String!) {
    getCurrentBoardMember(boardId: $boardId) {
      id
      role
      userId
    }
  }
`;

export const GET_CARDS_BY_LIST_ID = gql`
  query GetCardsByListId($listId: String!) {
    getCardsByListId(listId: $listId) {
      id
      title
    }
  }
`;

export const GET_CURRENT_CARD_POS_AND_LIST = gql`
  query getCurrentCardPosAndList($cardId: String!) {
    getCurrentCardPosAndList(cardId: $cardId) {
      listId
      orderIndex
    }
  }
`;

export const GET_BOARD_ID_FROM_CARD = gql`
  query getBoardIdFromCard($cardId: String!) {
    getBoardIdFromCard(cardId: $cardId)
  }
`;

export const CREATE_CARD = gql`
  mutation CreateCard($title: String!, $listId: String!, $boardId: String!) {
    createCard(
      createCardInput: { title: $title, listId: $listId }
      boardId: $boardId
    ) {
      id
      listId
      title
    }
  }
`;

export const UPDATE_CARD = gql`
  mutation UpdateCard(
    $boardId: String!
    $id: String!
    $title: String
    $description: String
    $priority: String
    $startDate: DateTime
    $dueDate: DateTime
    $isCompleted: Boolean
  ) {
    updateCard(
      boardId: $boardId
      updateCardInput: {
        id: $id
        title: $title
        description: $description
        priority: $priority
        startDate: $startDate
        dueDate: $dueDate
        isCompleted: $isCompleted
      }
    ) {
      id
    }
  }
`;

export const GET_CARD_BY_ID = gql`
  query GetCardById($id: String!) {
    getCardById(id: $id) {
      id
      title
      priority
      startDate
      dueDate
      description
      checklists {
        id
        title
        items {
          id
          content
          isCompleted
          dueDate
          assignMembers {
            id
            user {
              username
              firstName
              lastName
              email
              avatar
            }
          }
          orderIndex
          createdAt
        }

        orderIndex

        createdAt
      }
      assignMembers {
        id
        user {
          username
          firstName
          lastName
          email
          avatar
        }
      }

      cover {
        id
        mediaId
        media {
          url
          filename
          type
        }
        createdAt
      }
      attachments {
        id
        userId
        uploadedBy {
          firstName
          lastName
        }
        mediaId
        media {
          url
          filename
          type
        }
        createdAt
      }
      isCompleted
      createdAt
    }
  }
`;

export const CREATE_CHECKLIST = gql`
  mutation createChecklist(
    $title: String!
    $cardId: String!
    $boardId: String!
  ) {
    createChecklist(
      createChecklistInput: { title: $title, cardId: $cardId }
      boardId: $boardId
    ) {
      id
      title
    }
  }
`;

export const UPDATE_CHECKLIST = gql`
  mutation updateChecklist($title: String!, $id: String!, $boardId: String!) {
    updateChecklist(
      updateChecklistInput: { title: $title, id: $id }
      boardId: $boardId
    ) {
      title
    }
  }
`;

export const UPDATE_CHECKLIST_POS = gql`
  mutation updateChecklistPosition(
    $checklistId: String!
    $orderIndex: Int!
    $boardId: String!
    $cardId: String!
  ) {
    updateChecklistPosition(
      checklistId: $checklistId
      orderIndex: $orderIndex
      boardId: $boardId
      cardId: $cardId
    )
  }
`;

export const DELETE_CHECKLIST = gql`
  mutation removeChecklist($id: String!, $boardId: String!) {
    removeChecklist(id: $id, boardId: $boardId)
  }
`;

export const CREATE_CHECKLIST_ITEM = gql`
  mutation createChecklistItem(
    $content: String!
    $checklistId: String!
    $boardId: String!
    $dueDate: DateTime
    $memberIds: [String!]
  ) {
    createChecklistItem(
      createChecklistItemInput: {
        content: $content
        checklistId: $checklistId
        dueDate: $dueDate
        memberIds: $memberIds
      }
      boardId: $boardId
    ) {
      content
    }
  }
`;

export const UPDATE_CHECK_LIST_ITEM = gql`
  mutation updateChecklistItem(
    $id: String!
    $boardId: String!
    $content: String
    $dueDate: DateTime
    $isCompleted: Boolean
  ) {
    updateChecklistItem(
      updateChecklistItemInput: {
        id: $id
        content: $content
        dueDate: $dueDate
        isCompleted: $isCompleted
      }
      boardId: $boardId
    ) {
      id
    }
  }
`;

export const UPDATE_CHECKLIST_ITEM_POS = gql`
  mutation updateChecklistItemPos(
    $itemId: String!
    $checklistId: String!
    $orderIndex: Int!
    $boardId: String!
  ) {
    updateChecklistItemPos(
      itemId: $itemId
      checklistId: $checklistId
      orderIndex: $orderIndex
      boardId: $boardId
    )
  }
`;

export const DELETE_CHECKlIST_ITEM = gql`
  mutation removeChecklistItem($id: String!, $boardId: String!) {
    removeChecklistItem(id: $id, boardId: $boardId)
  }
`;

export const GET_ALL_BOARD_MEMBERS = gql`
  query boardMembers($boardId: String!) {
    boardMembers(boardId: $boardId) {
      id
      user {
        fullName
        avatar
        firstName
        lastName
      }
    }
  }
`;

export const ASSIGN_MEMBER_TO_CARD = gql`
  mutation addAssignMemberInCard(
    $cardId: String!
    $memberId: String!
    $boardId: String!
  ) {
    addAssignMemberInCard(
      assignMemberCardInput: { cardId: $cardId, memberId: $memberId }
      boardId: $boardId
    )
  }
`;

export const REMOVE_ASSIGNED_MEMBER_FROM_CARD = gql`
  mutation removeAssignMemberInCard(
    $cardId: String!
    $memberId: String!
    $boardId: String!
  ) {
    removeAssignMemberInCard(
      assignMemberCardInput: { cardId: $cardId, memberId: $memberId }
      boardId: $boardId
    )
  }
`;

export const GET_ALL_ACTIVITIES_BY_CARD_ID = gql`
  query getAllActivitiesByCardId($cardId: String!, $boardId: String!) {
    getAllActivitiesByCardId(cardId: $cardId, boardId: $boardId) {
      id
      action
      user {
        firstName
        lastName
        avatar
      }
      createdAt
    }
  }
`;

export const ADD_ASSIGN_MEMBER_IN_CHECKLIST_ITEM = gql`
  mutation addAssignMemberInChecklistItem(
    $id: String!
    $memberId: String!
    $boardId: String!
  ) {
    addAssignMemberInChecklistItem(
      id: $id
      memberId: $memberId
      boardId: $boardId
    )
  }
`;

export const REMOVE_ASSIGNED_MEMBER_FROM_CHECKLIST_ITEM = gql`
  mutation removeAssignedMemberFromChecklistItem(
    $id: String!
    $memberId: String!
    $boardId: String!
  ) {
    removeAssignedMemberFromChecklistItem(
      id: $id
      memberId: $memberId
      boardId: $boardId
    )
  }
`;

export const ADD_ATTACHMENT_FILE_USING_URL_TO_CARD = gql`
  mutation addAttachmentFromURL(
    $cardId: String!
    $url: String!
    $boardId: String!
  ) {
    addAttachmentFromURL(cardId: $cardId, url: $url, boardId: $boardId) {
      id
    }
  }
`;

export const UPDATE_ATTACHMENT_IN_CARD = gql`
  mutation updateAttachment(
    $id: String!
    $filename: String!
    $boardId: String!
  ) {
    updateAttachment(
      updateAttachmentInput: { id: $id, filename: $filename }
      boardId: $boardId
    ) {
      id
    }
  }
`;

export const REMOVE_ATTACHMENT = gql`
  mutation removeAttachment($id: String!, $boardId: String!) {
    removeAttachment(id: $id, boardId: $boardId) {
      id
    }
  }
`;

export const GET_ALL_CHECKLIST_BY_BOARD = gql`
  query GetAllChecklistByBoardId($boardId: String!) {
    getAllChecklistByBoardId(boardId: $boardId) {
      id
      title
    }
  }
`;

export const DUPLICATE_CHECKLIST = gql`
  mutation DuplicateChecklist(
    $checklistId: String!
    $title: String!
    $cardId: String!
    $boardId: String!
  ) {
    duplicateChecklist(
      checklistId: $checklistId
      createChecklistInput: { title: $title, cardId: $cardId }
      boardId: $boardId
    ) {
      id
    }
  }
`;

export const GET_ALL_COMMENTS = gql`
  query comments(
    $cardId: String!
    $boardId: String!
    $take: Int
    $cursor: String
  ) {
    comments(cardId: $cardId, boardId: $boardId, take: $take, cursor: $cursor) {
      items {
        id
        content
        createdAt
        updatedAt
        user {
          id
          firstName
          lastName
          avatar
        }
        reactions {
          emoji
          count

          reactedByUser
        }
      }
      nextCursor
    }
  }
`;

export const CREATE_COMMENT = gql`
  mutation CreateComment(
    $content: String!
    $cardId: String!
    $boardId: String!
  ) {
    createComment(
      createCommentInput: { content: $content, cardId: $cardId }
      boardId: $boardId
    ) {
      id
    }
  }
`;

export const UPDATE_COMMENT = gql`
  mutation updateComment($id: String!, $content: String!, $boardId: String!) {
    updateComment(
      updateCommentInput: { id: $id, content: $content }
      boardId: $boardId
    ) {
      id
    }
  }
`;

export const REMOVE_COMMENT = gql`
  mutation removeComment($id: String!, $boardId: String!) {
    removeComment(id: $id, boardId: $boardId) {
      id
    }
  }
`;

export const REACTION_TO_COMMENT = gql`
  mutation createReaction(
    $emoji: String!
    $commentId: String!
    $boardId: String!
  ) {
    createReaction(
      createReactionToCommentInput: { emoji: $emoji, commentId: $commentId }
      boardId: $boardId
    ) {
      id
    }
  }
`;

export const ADD_COVER_IN_CARD = gql`
  mutation addCoverInCard(
    $cardId: String!
    $attachmentId: String!
    $boardId: String!
  ) {
    addCoverInCard(
      cardId: $cardId
      attachmentId: $attachmentId
      boardId: $boardId
    )
  }
`;

export const REMOVE_COVER_FROM_CARD = gql`
  mutation removeCoverFromCard($cardId: String!, $boardId: String!) {
    removeCoverFromCard(cardId: $cardId, boardId: $boardId)
  }
`;

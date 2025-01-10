export const ROOM_EVENTS = {
  CONNECTION: "connection",
  JOIN_ROOM: "join_room",
  LEAVE_ROOM: "leave_room",
  DISCONNECT: "disconnect",
} as const;

export const MESSAGE_EVENTS = {
  SEND_MESSAGE: "send_message",
  RECEIVE_MESSAGE: "receive_message",
} as const;

export const CARD_GAME_EVENTS = {
  //--- Phase ---
  PENDING: "pending",
  START: "start",
  SELECT_CARD: "select_card",
  RESOLVE: "resolve",
  RESULT_CHECK: "result_check",
  //-------------
  SEND_CARD_GAME: "send_card_game",
  RECEIVE_CARD_GAME: "receive_card_game",
} as const;

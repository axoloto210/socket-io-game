export const ROOM_EVENTS = {
  CONNECTION: "connection",
  JOIN_ROOM: "join_room",
  LEAVE_ROOM: "leave_room",
  DISCONNECT: "disconnect",
} as const;

export const MESSAGE_EVENTS = {
  SEND_MESSAGE: "send_message",
  RECEIVE_MESSAGE: "receive_message",
} as const

export const CARD_GAME_EVENTS = {
  START: "start",
  SELECT_CARD: "select_card",
  RESOLVE: "resolve",
  RESULT_CHECK: "result_check",
} as const;

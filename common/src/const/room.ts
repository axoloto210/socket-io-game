export const ROOM_EVENTS = {
  CONNECTION: "connection",
  JOIN_ROOM: "join_room",
  JOIN_RANDOM_ROOM: "join_random_room",
  RANDOM_ROOM_ASSIGNED:"random_room_assigned",
  LEAVE_ROOM: "leave_room",
  DISCONNECT: "disconnect",
  ROOM_FULL: "room_full",
  ROOM_DISMISS: "room_dismiss",
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
  WAITING_SELECTION: "waiting_selection",
  SHOWING_SELECTED_CARDS: "showing_select_cards",
  RESOLVE: "resolve",
  RESULT_CHECK: "result_check",
  GAME_END: "game_end",
  //-------------
  SEND_CARD_GAME: "send_card_game",
  RECEIVE_CARD_GAME: "receive_card_game",
} as const;

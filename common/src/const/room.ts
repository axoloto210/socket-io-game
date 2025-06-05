export const ROOM_EVENTS = {
  CONNECTION: "connection",
  JOIN_ROOM: "join_room",
  JOIN_BOT_ROOM: "join_bot_room",
  JOIN_DELUXE_ROOM: "join_deluxe_room",
  JOIN_DELUXE_BOT_ROOM: "join_deluxe_bot_room",
  ASSIGN_RANDOM_ROOM_ID: "assign_random_room_id",
  RANDOM_ROOM_ASSIGNED: "random_room_assigned",
  ASSIGN_BOT_ROOM_ID: "assign_bot_room_id",
  BOT_ROOM_ASSIGNED: "bot_room_assigned",
  ASSIGN_DELUXE_RANDOM_ROOM_ID: "assign_deluxe_random_room_id",
  DELUXE_RANDOM_ROOM_ASSIGNED: "deluxe_random_room_assigned",
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
  DECIDE_CARD_AND_ITEM: "decide_card_and_item",
  WAITING_SELECTION: "waiting_selection",
  SHOWING_SELECTED_CARDS: "showing_select_cards",
  RESOLVE: "resolve",
  RESULT_CHECK: "result_check",
  GAME_END: "game_end",
  //-------------
  SEND_CARD_GAME: "send_card_game",
  RECEIVE_CARD_GAME: "receive_card_game",
} as const;

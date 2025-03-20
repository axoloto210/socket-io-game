import { io, Socket } from "socket.io-client";

// Tips:モジュールの評価は1度のみなので、複数ファイルでimportしても作成されるsocketは1つだけで済む。
export const socket: Socket = io(import.meta.env.VITE_BACKEND_URL);

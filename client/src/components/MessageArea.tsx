import { Socket } from "socket.io-client";
import { useMessage } from "../hooks/useMessage";

type MessageAreaProps = {
  socket: Socket;
  currentRoomId: string;
};

export const MessageArea = (props: MessageAreaProps) => {
  const { socket, currentRoomId } = props;

  const { message, setMessage, messages, sendMessage } = useMessage(socket);

  const clickSubmitHandler = () => {
    if (message.trim()) {
      sendMessage({ currentRoomId });
    }
  };

  return (
    <>
      <div className="mb-4 h-96 overflow-y-auto border p-4">
        {messages.map((msg) => {
          const localeTimeString = new Date(msg.timestamp).toLocaleTimeString();
          return (
            <div key={localeTimeString} className="mb-2">
              <span className="font-bold">{msg.userName}:</span>
              <span className="ml-2">{msg.message}</span>
              <span className="ml-2 text-sm text-gray-500">
                {localeTimeString}
              </span>
            </div>
          );
        })}
      </div>

      {currentRoomId && (
        <div className="flex">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                clickSubmitHandler();
              }
            }}
            placeholder="メッセージを入力"
            className="mr-2 border p-2"
          />
          <button
            className="rounded bg-blue-500 px-4 py-2 text-white"
            onClick={clickSubmitHandler}
          >
            送信
          </button>
        </div>
      )}
    </>
  );
};

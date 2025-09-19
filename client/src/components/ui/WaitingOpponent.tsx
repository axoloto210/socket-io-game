export const WaitingOpponent = () => {
  return (
    <div className="flex flex-col items-center justify-center rounded-lg bg-gray-50 p-8 shadow-md">
      <div className="mb-4 h-12 w-12 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"></div>
      <p className="text-xl font-medium text-gray-700">
        対戦相手を待っています
      </p>
      <p className="mt-2 text-sm text-gray-500">しばらくお待ちください...</p>
    </div>
  );
};

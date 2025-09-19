export const ReturnTopButton = () => {
  return (
    <button
      onClick={() => (window.location.href = "/")}
      className="fixed bottom-6 right-6 rounded-full bg-blue-500 p-3 text-white shadow-lg transition-all duration-300 hover:bg-blue-600"
    >
      トップへ
    </button>
  );
};

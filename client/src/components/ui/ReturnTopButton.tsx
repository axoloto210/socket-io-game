export const ReturnTopButton = () => {
  return (
    <button
      onClick={() => (window.location.href = "/")}
      className="fixed bottom-6 right-6 bg-blue-500 hover:bg-blue-600 text-white p-3 rounded-full shadow-lg transition-all duration-300"
    >
      トップへ
    </button>
  );
};

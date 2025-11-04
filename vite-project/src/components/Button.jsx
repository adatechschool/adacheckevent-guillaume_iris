const Button = ({ children, onClick, disabled = false }) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className={`px-4 py-2 rounded-lg font-medium transition duration-150 ${
      disabled
        ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
        : 'bg-blue-600 hover:bg-blue-700 text-white shadow-md'
    }`}
  >
    {children}
  </button>
);

export default Button;
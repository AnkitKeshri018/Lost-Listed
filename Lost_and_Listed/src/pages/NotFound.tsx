const NotFound = () => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="text-center">
        <h1 className="mb-4 text-5xl font-bold text-gray-800">404</h1>
        <p className="mb-4 text-lg text-gray-600">Oops! Page not found</p>
        <a
          href="/"
          className="text-blue-600 underline hover:text-blue-800 transition"
        >
          Return to Home
        </a>
      </div>
    </div>
  );
};

export default NotFound;

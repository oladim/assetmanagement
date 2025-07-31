export default function Unauthorized() {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white p-6 rounded shadow-md text-center">
          <h2 className="text-xl font-semibold mb-4">Access Denied</h2>
          <p>You do not have permission to access this page.</p>
        </div>
      </div>
    );
  }
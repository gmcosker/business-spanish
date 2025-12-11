import { Link } from 'react-router-dom';
import { Home, Search, BookOpen } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full text-center">
        <div className="mb-8">
          <h1 className="text-9xl font-bold text-primary-600 mb-4">404</h1>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Page Not Found
          </h2>
          <p className="text-gray-600 mb-8">
            The page you're looking for doesn't exist or has been moved.
          </p>
        </div>

        <div className="space-y-4">
          <Link
            to="/"
            className="btn-primary w-full inline-flex items-center justify-center gap-2"
          >
            <Home className="w-5 h-5" />
            Go to Dashboard
          </Link>

          <div className="grid grid-cols-2 gap-4">
            <Link
              to="/learning-path"
              className="btn-secondary inline-flex items-center justify-center gap-2"
            >
              <BookOpen className="w-4 h-4" />
              Learning Path
            </Link>

            <Link
              to="/"
              className="btn-secondary inline-flex items-center justify-center gap-2"
            >
              <Search className="w-4 h-4" />
              Search
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}


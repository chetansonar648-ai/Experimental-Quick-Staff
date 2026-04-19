import { Link } from 'react-router-dom';

export default function ClientModulePlaceholder() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#f6f7f8] dark:bg-[#101c22]">
      <div className="text-center px-4">
        <h1 className="text-4xl font-bold text-[#212529] dark:text-[#f6f7f8] mb-4">
          Client Module will be added later
        </h1>
        <Link 
          to="/" 
          className="inline-block mt-4 px-6 py-3 bg-[#005A9C] text-white rounded-lg hover:bg-[#005A9C]/90 transition-colors"
        >
          Go to Home
        </Link>
      </div>
    </div>
  );
}


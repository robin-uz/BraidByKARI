import { Helmet } from 'react-helmet';

export default function TestPage() {
  return (
    <>
      <Helmet>
        <title>Test Page | KARI STYLEZ</title>
      </Helmet>
      <div className="container mx-auto py-12 px-4">
        <h1 className="text-4xl font-bold text-amber-800 dark:text-amber-300 mb-6">Test Page</h1>
        <p className="text-lg mb-8">This is a simple test page to verify routing is working.</p>
        <div className="bg-amber-100 dark:bg-amber-900/30 p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold mb-4">Page Info</h2>
          <p>Current time: {new Date().toLocaleTimeString()}</p>
        </div>
      </div>
    </>
  );
}
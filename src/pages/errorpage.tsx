// src/ErrorPage.js
import React from 'react';
import Link from 'next/link';

const ErrorPage = () => {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-md">
        <h1 className="text-4xl text-red-600 font-bold mb-4">Oops! Something went wrong.</h1>
        <p className="text-gray-600">We're sorry, but an error occurred while processing your request.</p>
        <div className="mt-6">
          <button
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring focus:ring-red-200"
            //onClick={() => window.location.reload()}
          >
            <Link href="/">Go home</Link>
            
          </button>
        </div>
      </div>
    </div>
  );
};

export default ErrorPage;

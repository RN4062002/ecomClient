import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRightIcon, HomeIcon } from '@heroicons/react/20/solid';

const Breadcrumbs = ({ pages }) => {
  return (
    <nav className="flex mb-8" aria-label="Breadcrumb">
      <ol role="list" className="flex items-center space-x-2">
        <li>
          <div>
            <Link to="/" className="text-gray-400 hover:text-gray-500">
              <HomeIcon className="h-5 w-5 shrink-0" aria-hidden="true" />
              <span className="sr-only">Home</span>
            </Link>
          </div>
        </li>
        {pages.map((page) => (
          <li key={page.name}>
            <div className="flex items-center">
              <ChevronRightIcon className="h-5 w-5 shrink-0 text-gray-400" aria-hidden="true" />
              <Link
                to={page.href}
                state={page.state}
                className={`ml-2 text-sm font-medium ${
                  page.current ? 'text-indigo-600 cursor-default' : 'text-gray-500 hover:text-gray-700'
                }`}
                aria-current={page.current ? 'page' : undefined}
              >
                {page.name}
              </Link>
            </div>
          </li>
        ))}
      </ol>
    </nav>
  );
};

export default Breadcrumbs;

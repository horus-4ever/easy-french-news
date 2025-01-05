import React from 'react';

type LoadingMessageProps = {
  loading: boolean;
  hasMore: boolean;
};

const LoadingMessage: React.FC<LoadingMessageProps> = ({ loading, hasMore }) => (
  <>
    {loading && (
      <p className="text-center mt-6 text-gray-900 dark:text-gray-400">
        Loading...
      </p>
    )}
    {!hasMore && (
      <p className="text-center mt-6 text-gray-900 dark:text-gray-400">
        No more articles.
      </p>
    )}
  </>
);

export default LoadingMessage;

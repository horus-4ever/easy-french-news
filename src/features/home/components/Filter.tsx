import React from 'react';

type FilterProps = {
  labels: string[];
  selectedTags: string[];
  handleTagChange: (tagName: string) => void;
};

const Filter: React.FC<FilterProps> = ({ labels, selectedTags, handleTagChange }) => (
  <div className="bg-white dark:bg-gray-800 p-4 rounded-lg mb-6 shadow">
    <h2 className="font-semibold mb-2 text-gray-900 dark:text-gray-100">
      Filtrer par tags
    </h2>
    <div className="flex flex-wrap gap-3">
      {labels.map((label) => (
        <label
          key={label}
          className={`flex items-center gap-2 cursor-pointer px-4 py-2 rounded-lg border dark:border-black shadow-sm ${
            selectedTags.includes(label)
              ? 'bg-green-100 border-green-500 dark:bg-green-900'
              : 'bg-white dark:bg-gray-900 hover:shadow-md'
          }`}
        >
          <input
            type="checkbox"
            value={label}
            checked={selectedTags.includes(label)}
            onChange={() => handleTagChange(label)}
            className="hidden"
          />
          <div
            className={`w-5 h-5 border-2 rounded-md ${
              selectedTags.includes(label)
                ? 'bg-green-500 border-green-500'
                : 'border-gray-400 dark:border-gray-600'
            }`}
          ></div>
          <span className="text-gray-900 dark:text-gray-100">{label}</span>
        </label>
      ))}
    </div>
  </div>
);

export default Filter;

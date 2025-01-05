import React from 'react';
import { FiFilter } from 'react-icons/fi';

type HeaderProps = {
  toggleFilter: () => void;
};

const Header: React.FC<HeaderProps> = ({ toggleFilter }) => (
  <div className="flex justify-between items-center mb-6">
    <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
      Derniers articles
    </h1>
    <button
      onClick={toggleFilter}
      className="flex items-center gap-2 px-4 py-2 border rounded-lg bg-green-600 text-white hover:bg-green-700 dark:border-green-900"
    >
      <FiFilter /> Filtres
    </button>
  </div>
);

export default Header;
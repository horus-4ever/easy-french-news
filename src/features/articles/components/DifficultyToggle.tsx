interface DifficultyToggleProps {
    difficulty: 'easy' | 'medium';
    onChange: (value: 'easy' | 'medium') => void;
}

export default function DifficultyToggle({ difficulty, onChange }: DifficultyToggleProps) {
    return (
        <div className="flex gap-2 w-full sm:w-[250px]">
            <button
                onClick={() => onChange('easy')}
                className={`flex-1 px-4 py-2 rounded text-center ${
                    difficulty === 'easy'
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-200 dark:bg-gray-700 dark:text-gray-100'
                }`}
            >
                Easy
            </button>
            <button
                onClick={() => onChange('medium')}
                className={`flex-1 px-4 py-2 rounded text-center ${
                    difficulty === 'medium'
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-200 dark:bg-gray-700 dark:text-gray-100'
                }`}
            >
                Medium
            </button>
        </div>
    );
}

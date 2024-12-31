interface DifficultyToggleProps {
    difficulty: 'easy' | 'medium';
    onChange: (value: 'easy' | 'medium') => void;
  }

export default function DifficultyToggle({ difficulty, onChange }: DifficultyToggleProps) {
    return (
        <div>
            <button
                onClick={() => onChange('easy')}
                className={`mr-2 px-4 py-2 rounded ${difficulty === 'easy' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
            >
                Easy
            </button>
            <button
                onClick={() => onChange('medium')}
                className={`px-4 py-2 rounded ${difficulty === 'medium' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
            >
                Medium
            </button>
        </div>
    );
}
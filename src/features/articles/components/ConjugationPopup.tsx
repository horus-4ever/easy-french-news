import { useEffect, useState } from 'react';
import ConjugationTable from '@/features/conjugation/components/ConjugationTable';
import Participles from '@/features/conjugation/components/Participles';
import { checkIfVerbExists } from '@/features/conjugation/api/api';

interface ConjugationPopupProps {
  verb: string;
  onClose: () => void;
}

interface ConjugationData {
  [key: string]: string[];
}

export default function ConjugationPopup({ verb, onClose }: ConjugationPopupProps) {
  const [conjugations, setConjugations] = useState<ConjugationData | null>(null);

  useEffect(() => {
    const fetchConjugation = async () => {
      try {
        const words = verb.split(' ').filter(Boolean);
        let foundVerb = null;

        for (const word of words) {
          const searchWord = word.replace("s'", "");
          const exists = await checkIfVerbExists(searchWord);
          if (exists) {
            foundVerb = searchWord;
            break;
          }
        }
        const verbToFetch = foundVerb || words[0];
        const response = await fetch(`/api/conjugate/${verbToFetch}`);
        const data = await response.json();
        setConjugations(data.conjugation);
      } catch (error) {
        console.error('Error fetching conjugation:', error);
      }
    };

    fetchConjugation();
  }, [verb]);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  const pronouns = ['je', 'tu', 'il/elle', 'nous', 'vous', 'ils/elles'];

  if (!conjugations) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 dark:bg-opacity-70">
        <div className="flex items-center justify-center bg-white dark:bg-gray-800 p-6 rounded-md shadow-lg w-[90%] max-w-screen-sm">
          <p className="text-gray-800 dark:text-gray-200">Loading...</p>
          <button
            className="text-3xl text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-white transition"
            onClick={onClose}
          >
            &times;
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 dark:bg-opacity-70 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-lg shadow-2xl w-[90%] sm:w-[85%] md:w-[70%] lg:w-[60%] max-w-screen-sm md:max-w-screen-md lg:max-w-screen-lg mx-auto relative max-h-[85vh] overflow-hidden flex flex-col">
        
        <button
          className="absolute top-3 right-3 text-3xl text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-white transition"
          onClick={onClose}
        >
          &times;
        </button>

        <h2 className="text-4xl font-extrabold text-center mb-6 text-blue-500 dark:text-blue-300">
          {verb}
        </h2>

        <div className="overflow-y-auto px-2 sm:px-4" style={{ maxHeight: '70vh' }}>
          <div className="mb-6 w-full">
            <Participles conjugations={conjugations} />
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            <ConjugationTable
              title="Présent (直現)"
              conjugations={conjugations['P']}
              pronouns={pronouns}
              color="bg-blue-100 dark:bg-blue-900 border-blue-200 dark:border-blue-700"
              cellColor="bg-blue-50 dark:bg-blue-950"
            />
            <ConjugationTable
              title="Futur (直単未)"
              conjugations={conjugations['F']}
              pronouns={pronouns}
              color="bg-green-100 dark:bg-green-900 border-green-200 dark:border-green-700"
              cellColor="bg-green-50 dark:bg-green-950"
            />
            <ConjugationTable
              title="Imparfait (直半)"
              conjugations={conjugations['I']}
              pronouns={pronouns}
              color="bg-yellow-100 dark:bg-yellow-900 border-yellow-200 dark:border-yellow-700"
              cellColor="bg-yellow-50 dark:bg-yellow-950"
            />
            <ConjugationTable
              title="Conditionnel (条現)"
              conjugations={conjugations['C']}
              pronouns={pronouns}
              color="bg-red-100 dark:bg-red-900 border-red-200 dark:border-red-700"
              cellColor="bg-red-50 dark:bg-red-950"
            />
            <ConjugationTable
              title="Subjonctif Présent (接現)"
              conjugations={conjugations['S']}
              pronouns={pronouns}
              color="bg-purple-100 dark:bg-purple-900 border-purple-200 dark:border-purple-700"
              cellColor="bg-purple-50 dark:bg-purple-950"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

import { useEffect, useState } from 'react';
import ConjugationTable from '@/components/conjugation/ConjugationTable';
import Participles from '@/components/conjugation/Participles';
import { checkIfVerbExists } from '@/lib/api';

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
          const exists = await checkIfVerbExists(word);
          if (exists) {
            foundVerb = word;
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
    // Disable scrolling when the popup is open
    document.body.style.overflow = 'hidden';

    // Cleanup to re-enable scrolling when the popup closes
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  const pronouns = ['je', 'tu', 'il/elle', 'nous', 'vous', 'ils/elles'];

  if (!conjugations) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
        <div className="flex items-center justify-center bg-white p-6 rounded-md shadow-lg w-[90%] max-w-screen-sm">
          <p>Loading...</p>
          <button
            className="text-3xl text-gray-500 hover:text-gray-800 transition"
            onClick={onClose}
          >
            &times;
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white p-4 sm:p-6 rounded-lg shadow-2xl w-[90%] sm:w-[85%] md:w-[70%] lg:w-[60%] max-w-screen-sm md:max-w-screen-md lg:max-w-screen-lg mx-auto relative max-h-[85vh] overflow-hidden flex flex-col">
        
        {/* Close Button */}
        <button
          className="absolute top-3 right-3 text-3xl text-gray-500 hover:text-gray-800 transition"
          onClick={onClose}
        >
          &times;
        </button>

        <h2 className="text-4xl font-extrabold text-center mb-6 text-blue-500">
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
              color="bg-blue-50 border-blue-200"
            />
            <ConjugationTable
              title="Futur (直単未)"
              conjugations={conjugations['F']}
              pronouns={pronouns}
              color="bg-green-50 border-green-200"
            />
            <ConjugationTable
              title="Imparfait (直半)"
              conjugations={conjugations['I']}
              pronouns={pronouns}
              color="bg-yellow-50 border-yellow-200"
            />
            <ConjugationTable
              title="Conditionnel (条現)"
              conjugations={conjugations['C']}
              pronouns={pronouns}
              color="bg-red-50 border-red-200"
            />
            <ConjugationTable
              title="Subjonctif Présent (接現)"
              conjugations={conjugations['S']}
              pronouns={pronouns}
              color="bg-purple-50 border-purple-200"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

import { useEffect, useState } from 'react';
import ConjugationTable from '@/components/conjugation/ConjugationTable';
import Participles from '@/components/conjugation/Participles';

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
        const response = await fetch(`/api/conjugate/${verb}`);
        const data = await response.json();
        setConjugations(data.conjugation);
      } catch (error) {
        console.error('Error fetching conjugation:', error);
      }
    };

    fetchConjugation();
  }, [verb]);

  const pronouns = ['je', 'tu', 'il/elle', 'nous', 'vous', 'ils/elles'];

  if (!conjugations) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
        <div className="bg-white p-6 rounded-md shadow-lg w-[90%] max-w-screen-sm">
          <p>Loading...</p>
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

        {/* Title */}
        <h2 className="text-4xl font-extrabold text-center mb-6 text-blue-500">
          {verb}
        </h2>

        {/* Scrollable Content */}
        <div className="overflow-y-auto px-2 sm:px-4" style={{ maxHeight: '70vh' }}>
          {/* Centered Participles */}
        <div className="mb-6 w-full">
          <Participles conjugations={conjugations} />
        </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            <ConjugationTable
              title="Présent"
              conjugations={conjugations['P']}
              pronouns={pronouns}
              color="bg-blue-50 border-blue-200"
            />
            <ConjugationTable
              title="Futur"
              conjugations={conjugations['F']}
              pronouns={pronouns}
              color="bg-green-50 border-green-200"
            />
            <ConjugationTable
              title="Imparfait"
              conjugations={conjugations['I']}
              pronouns={pronouns}
              color="bg-yellow-50 border-yellow-200"
            />
            <ConjugationTable
              title="Conditionnel"
              conjugations={conjugations['C']}
              pronouns={pronouns}
              color="bg-red-50 border-red-200"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

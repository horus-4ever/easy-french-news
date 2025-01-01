interface ParticiplesProps {
    conjugations: { [key: string]: string[] };
  }
  
  export default function Participles({ conjugations }: ParticiplesProps) {
    return (
      <div className="mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 place-items-center gap-6 w-full">
          <div className="text-center">
            <p className="text-lg font-medium text-gray-600">participe présent</p>
            <p className="text-3xl font-extrabold">{conjugations['G']}</p>
          </div>
          <div className="text-center">
            <p className="text-lg font-medium text-gray-600">participe passé</p>
            <p className="text-3xl font-extrabold">{conjugations['K'][0]}</p>
          </div>
        </div>
      </div>
    );
  }
  
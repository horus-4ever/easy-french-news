interface ConjugationTableProps {
    title: string;
    conjugations?: string[];
    pronouns: string[];
    color: string;
  }
  
  export default function ConjugationTable({
    title,
    conjugations,
    pronouns,
    color,
  }: ConjugationTableProps) {
    if (!conjugations) return null;
  
    return (
      <div className={`mb-6 rounded-lg shadow-md p-5 border ${color}`}>
        <h3 className="text-2xl font-semibold text-center mb-5">{title}</h3>
        <div className="grid grid-cols-1 gap-3">
          {pronouns.map((pronoun, index) => (
            <div
              key={index}
              className="flex justify-between items-center p-3 rounded-md border bg-white"
            >
              <span className="font-bold text-lg">{pronoun}</span>
              <span className="text-lg">{conjugations[index]}</span>
            </div>
          ))}
        </div>
      </div>
    );
  }
  
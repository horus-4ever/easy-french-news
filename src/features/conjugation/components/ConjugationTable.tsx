interface ConjugationTableProps {
  title: string;
  conjugations?: string[];
  pronouns: string[];
  color: string;
  cellColor: string;
}

export default function ConjugationTable({
  title,
  conjugations,
  pronouns,
  color,
  cellColor,
}: ConjugationTableProps) {
  if (!conjugations) return null;

  return (
    <div className={`mb-6 rounded-lg shadow-md p-5 border ${color} dark:border-gray-700`}>
      <h3 className="text-2xl font-semibold text-center mb-5 text-gray-800 dark:text-gray-100">
        {title}
      </h3>
      <div className="grid grid-cols-1 gap-3">
        {pronouns.map((pronoun, index) => (
          <div
            key={index}
            className={`flex justify-between items-center p-3 rounded-md border ${cellColor} dark:border-gray-700`}
          >
            <span className="font-bold text-lg text-gray-800 dark:text-gray-200">{pronoun}</span>
            <span className="text-lg text-gray-800 dark:text-gray-300">{conjugations[index]}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

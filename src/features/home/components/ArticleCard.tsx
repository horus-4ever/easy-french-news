import Image from 'next/image';
import Link from 'next/link';
import { useReadArticles } from '@/context/ReadArticlesContext';
import { FiCheck } from 'react-icons/fi';

interface Props {
  id: string;
  title: string;
  imageUrl?: string;
  labels?: string[];
  publishDate?: string;
}

export default function ArticleCard({
  id,
  title,
  imageUrl,
  labels,
  publishDate
}: Props) {
  const { readArticles, toggleRead } = useReadArticles();
  const isRead = readArticles.includes(id);

  return (
    <div className="relative bg-white dark:bg-gray-800 rounded-md shadow hover:shadow-lg transition p-4 flex flex-col justify-between h-full">
      {/* Big checkmark icon on the LEFT side */}
      {isRead && (
        <div className="absolute top-2 left-2 z-10">
          <FiCheck
            size={40}
            className="text-green-500 bg-white dark:bg-gray-800 rounded-full p-1 border-4 border-green-500"
            style={{
              boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)', // Thin shadow for contrast
            }}
          />
        </div>
      )}

      {/* Link wraps image, title, and labels */}
      <Link href={`/articles/${id}`} className="flex-grow">
        <div className="relative h-48 w-full mb-2">
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={title}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              priority={false}
              style={{ objectFit: 'cover' }}
              className="rounded-md"
            />
          ) : (
            <div className="bg-gray-200 dark:bg-gray-700 h-full w-full flex items-center justify-center">
              No Image
            </div>
          )}
        </div>
        <h2 className="text-lg font-bold mb-2 text-gray-900 dark:text-gray-100">
          {title}
        </h2>
        {labels && labels.length > 0 && (
          <div className="mb-2 flex flex-wrap gap-1">
            {labels.map((label) => (
              <span
                key={label}
                className="bg-blue-100 dark:bg-blue-800 text-blue-600 dark:text-blue-300 px-2 py-1 rounded text-sm"
              >
                {label}
              </span>
            ))}
          </div>
        )}
      </Link>

      {/* Publish date and toggle switch */}
      <div className="flex items-center justify-between mt-2 border-t border-gray-200 dark:border-gray-700 pt-2">
        {publishDate && (
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Published on {new Date(publishDate).toUTCString()}
          </p>
        )}

        <label className="relative cursor-pointer">
          {/* Hidden checkbox */}
          <input
            type="checkbox"
            className="sr-only peer"
            checked={isRead}
            onChange={() => toggleRead(id)}
          />
          {/* Switch background */}
          <div className="w-10 h-5 bg-gray-300 dark:bg-gray-600 rounded-full transition-colors peer-checked:bg-blue-500 dark:peer-checked:bg-blue-400"></div>
          {/* Switch thumb */}
          <div className="absolute left-[2px] top-[2px] w-4 h-4 bg-white border border-gray-300 dark:border-gray-500 rounded-full transition-transform peer-checked:translate-x-5"></div>
        </label>
      </div>
    </div>
  );
}

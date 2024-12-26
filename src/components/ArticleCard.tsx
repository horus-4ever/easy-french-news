import Image from 'next/image';
import Link from 'next/link';

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
  return (
    <div className="bg-white rounded-md shadow hover:shadow-lg transition p-4">
      <Link href={`/articles/${id}`}>
        <div className="relative h-48 w-full mb-2">
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={title}
              fill
              style={{ objectFit: 'cover' }}
              className="rounded-md"
            />
          ) : (
            <div className="bg-gray-200 h-full w-full flex items-center justify-center">
              No Image
            </div>
          )}
        </div>
        <h2 className="text-lg font-bold mb-2">{title}</h2>
        {labels && labels.length > 0 && (
          <div className="mb-2 flex flex-wrap gap-1">
            {labels.map((label) => (
              <span key={label} className="bg-blue-100 text-blue-600 px-2 py-1 rounded text-sm">
                {label}
              </span>
            ))}
          </div>
        )}
        {publishDate && (
          <p className="text-xs text-gray-500">
            Published on {new Date(publishDate).toLocaleDateString()}
          </p>
        )}
      </Link>
    </div>
  );
}

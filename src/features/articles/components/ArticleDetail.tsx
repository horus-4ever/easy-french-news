"use client";

interface ArticleDetailProps {
  content: any;             // HTML from either easyVersion.content or mediumVersion.content
}

export default function ArticleDetail({ content }: ArticleDetailProps) {
  return (
    <>
      <div
        className="prose max-w-none text-xl text-justify"
      >
        {content}
      </div>
    </>
  );
}

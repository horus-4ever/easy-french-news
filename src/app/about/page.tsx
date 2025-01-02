"use client";

import React from 'react';
import Link from 'next/link';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Hero Section */}
      <header className="bg-gradient-to-r from-blue-500 to-green-500 text-white py-20 text-center">
        <h1 className="text-4xl font-bold">📰 French Easy News App</h1>
        <p className="mt-4 text-lg">
          Simplifying French News for Native Japanese Speakers
        </p>
      </header>

      {/* About Section */}
      <section className="py-12 px-6 container mx-auto">
        <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-6">🌍 About the Project</h2>
        <p className="text-gray-700 dark:text-gray-300 text-lg leading-7">
          The <strong className="dark:text-white">French Easy News App</strong> bridges the language gap for
          native Japanese speakers learning French. It provides simplified
          French news articles enriched with vocabulary and grammar tools to
          help learners improve their language skills in a real-world context.
        </p>
      </section>

      {/* Features Section */}
      <section className="py-12 px-6 bg-white dark:bg-gray-800">
        <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-100 text-center mb-10">
          🎯 Key Features
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="p-6 bg-gray-50 dark:bg-gray-700 shadow-lg rounded-lg">
            <h3 className="font-semibold text-lg mb-3 text-gray-800 dark:text-gray-100">📄 Simplified News</h3>
            <p className="text-gray-600 dark:text-gray-300">
              Read curated French news articles in simple language, available
              in easy and medium difficulty levels.
            </p>
          </div>
          <div className="p-6 bg-gray-50 dark:bg-gray-700 shadow-lg rounded-lg">
            <h3 className="font-semibold text-lg mb-3 text-gray-800 dark:text-gray-100">🗣️ Audio Support</h3>
            <p className="text-gray-600 dark:text-gray-300">
              Listen to articles with integrated audio, improving your listening
              skills.
            </p>
          </div>
          <div className="p-6 bg-gray-50 dark:bg-gray-700 shadow-lg rounded-lg">
            <h3 className="font-semibold text-lg mb-3 text-gray-800 dark:text-gray-100">📚 Vocabulary</h3>
            <p className="text-gray-600 dark:text-gray-300">
              Hover over difficult words for translations and explore vocabulary
              lists for every article.
            </p>
          </div>
          <div className="p-6 bg-gray-50 dark:bg-gray-700 shadow-lg rounded-lg">
            <h3 className="font-semibold text-lg mb-3 text-gray-800 dark:text-gray-100">📖 Grammar Learning</h3>
            <p className="text-gray-600 dark:text-gray-300">
              Explore contextual grammar lessons with examples tied to the
              articles.
            </p>
          </div>
          <div className="p-6 bg-gray-50 dark:bg-gray-700 shadow-lg rounded-lg">
            <h3 className="font-semibold text-lg mb-3 text-gray-800 dark:text-gray-100">📝 Quiz</h3>
            <p className="text-gray-600 dark:text-gray-300">
              Test your comprehension with quizzes at the end of every article.
            </p>
          </div>
          <div className="p-6 bg-gray-50 dark:bg-gray-700 shadow-lg rounded-lg">
            <h3 className="font-semibold text-lg mb-3 text-gray-800 dark:text-gray-100">📱 Responsive Design</h3>
            <p className="text-gray-600 dark:text-gray-300">
              Enjoy a seamless experience on both mobile and desktop devices.
            </p>
          </div>
        </div>
      </section>

      {/* Tech Stack Section */}
      <section className="py-12 px-6 container mx-auto bg-gray-100 dark:bg-gray-800">
        <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-6">🛠️ Tech Stack</h2>
        <p className="text-gray-700 dark:text-gray-300 text-lg leading-7">
          Built with Next.js, React, TailwindCSS, MongoDB, and HTML5 Audio API
          for a fast and engaging user experience.
        </p>
      </section>

      {/* Footer Section */}
      <footer className="bg-gray-900 text-white py-6">
        <div className="container mx-auto text-center">
          <p className="text-lg">
            Learn more on our{' '}
            <Link href="https://github.com/horus-4ever/easy-french-news" className="text-blue-400 underline hover:text-blue-300">
                GitHub Repository
            </Link>
          </p>
        </div>
      </footer>
    </div>
  );
}

import React from 'react';
import SelectOA from '@/app/components/forms/SelectOA';

const Page = () => {
  return (
    <main className="bg-gray-100 dark:bg-slate-900 py-12 px-4">
      <div className="w-full max-w-3xl mx-auto mt-12 bg-white dark:bg-slate-800 shadow-lg rounded-2xl p-8">
        <h1 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white text-center">
          Visualizador de Objetivos de Aprendizaje
        </h1>
        <SelectOA />
      </div>
    </main>
  );
};

export default Page;

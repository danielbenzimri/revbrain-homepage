'use client';

import React, { useState } from 'react';
import { ContentData } from '@/types/legacy';
import Button from '@/components/ui/Button';
import { Check } from 'lucide-react';

interface UseCasesProps {
  content: ContentData;
}

const UseCases: React.FC<UseCasesProps> = ({ content }) => {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <section id="features" className="py-24 bg-slate-50 border-y border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-slate-900 mb-4">{content.personas.title}</h2>
          <p className="text-lg text-slate-600">{content.personas.subtitle}</p>
        </div>

        {/* Mobile: Stacked, Desktop: Tabs */}
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
          {/* Tabs Navigation (Desktop) / List (Mobile) */}
          <div className="lg:w-1/3 flex lg:flex-col gap-2 overflow-x-auto pb-4 lg:pb-0">
            {content.personas.items.map((persona, index) => (
              <button
                key={persona.id}
                onClick={() => setActiveTab(index)}
                className={`flex-shrink-0 text-start px-6 py-4 rounded-xl transition-all duration-200 border-2 ${
                  activeTab === index
                    ? 'bg-white border-teal-500 shadow-md'
                    : 'bg-transparent border-transparent hover:bg-slate-200'
                }`}
              >
                <div
                  className={`font-bold text-lg mb-1 ${activeTab === index ? 'text-teal-700' : 'text-slate-700'}`}
                >
                  {persona.title}
                </div>
                <div
                  className={`text-sm hidden lg:block ${activeTab === index ? 'text-teal-600/80' : 'text-slate-500'}`}
                >
                  {index === 0 ? 'SI Partners' : index === 1 ? 'Consultants' : 'RevOps Teams'}
                </div>
              </button>
            ))}
          </div>

          {/* Content Area */}
          <div className="lg:w-2/3 bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden min-h-[400px]">
            {content.personas.items.map((persona, index) => (
              <div
                key={persona.id}
                className={`p-8 lg:p-12 h-full flex flex-col justify-center transition-opacity duration-500 ${activeTab === index ? 'block animate-fadeIn' : 'hidden'}`}
              >
                <h3 className="text-2xl font-bold text-slate-900 mb-6">{persona.title}</h3>
                <p className="text-xl text-slate-600 mb-8 leading-relaxed">{persona.description}</p>
                <ul className="space-y-4 mb-10">
                  {persona.benefits.map((benefit, i) => (
                    <li key={i} className="flex items-center gap-3 text-slate-700">
                      <div className="flex-shrink-0 w-6 h-6 rounded-full bg-teal-100 flex items-center justify-center text-teal-600">
                        <Check size={14} strokeWidth={3} />
                      </div>
                      {benefit}
                    </li>
                  ))}
                </ul>
                <div>
                  <Button size="lg">{persona.cta}</Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default UseCases;

'use client';

import React, { useState } from 'react';
import { ContentData } from '@/types/legacy';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface FAQProps {
  content: ContentData;
}

const FAQ: React.FC<FAQProps> = ({ content }) => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="py-24 bg-slate-50 border-t border-slate-200">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-center text-slate-900 mb-12">{content.faq.title}</h2>

        <div className="space-y-4">
          {content.faq.items.map((item, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                className="bg-white rounded-xl border border-slate-200 overflow-hidden transition-all duration-200"
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : idx)}
                  className="w-full flex items-center justify-between p-6 text-start focus:outline-none"
                >
                  <span className="font-semibold text-slate-900 text-lg">{item.question}</span>
                  {isOpen ? (
                    <ChevronUp className="text-teal-500" />
                  ) : (
                    <ChevronDown className="text-slate-400" />
                  )}
                </button>

                <div
                  className={`px-6 text-slate-600 overflow-hidden transition-all duration-300 ease-in-out ${
                    isOpen ? 'max-h-48 pb-6 opacity-100' : 'max-h-0 opacity-0'
                  }`}
                >
                  {item.answer}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default FAQ;

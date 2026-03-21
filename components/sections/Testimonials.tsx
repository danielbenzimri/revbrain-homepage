import React from 'react';
import { ContentData } from '@/types/legacy';
import { Quote } from 'lucide-react';

interface TestimonialsProps {
  content: ContentData;
}

const Testimonials: React.FC<TestimonialsProps> = ({ content }) => {
  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-center text-slate-900 mb-16">
          {content.testimonials.title}
        </h2>

        <div className="grid md:grid-cols-2 gap-8">
          {content.testimonials.items.map((item, idx) => (
            <div key={idx} className="bg-slate-50 p-8 rounded-2xl border border-slate-100 relative">
              <Quote className="absolute top-8 right-8 rtl:left-8 rtl:right-auto text-teal-200 w-12 h-12" />
              <p className="text-lg text-slate-700 italic mb-8 relative z-10">"{item.quote}"</p>
              <div className="flex items-center gap-4">
                <img
                  src={item.image}
                  alt={item.author}
                  className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-md"
                />
                <div>
                  <div className="font-bold text-slate-900">{item.author}</div>
                  <div className="text-sm text-slate-500">
                    {item.role}, {item.company}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;

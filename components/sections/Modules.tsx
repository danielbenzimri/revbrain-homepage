import React from 'react';
import { ContentData } from '@/types/legacy';
import * as Icons from 'lucide-react';

interface ModulesProps {
  content: ContentData;
}

const Modules: React.FC<ModulesProps> = ({ content }) => {
  return (
    <section id="modules" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl font-bold text-slate-900 sm:text-4xl mb-4">
            {content.modules.title}
          </h2>
          <p className="text-lg text-slate-600">{content.modules.subtitle}</p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {content.modules.items.map((item, idx) => {
            // Find the component safely from the Icons namespace
            const iconName = item.icon as string;
            let IconComponent: any = (Icons as any)[iconName];

            // If the icon wasn't found or is not a renderable component, use Box as fallback
            if (
              !IconComponent ||
              (typeof IconComponent !== 'function' && typeof IconComponent !== 'object')
            ) {
              IconComponent = Icons.Box;
            }

            return (
              <div
                key={idx}
                className="group flex flex-col items-center p-6 bg-slate-50 rounded-xl border border-slate-100 hover:border-teal-200 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 text-center"
              >
                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-teal-600 shadow-sm mb-4 group-hover:bg-teal-500 group-hover:text-white transition-colors">
                  <IconComponent size={24} />
                </div>
                <h3 className="font-semibold text-slate-900 group-hover:text-teal-700 transition-colors">
                  {item.name}
                </h3>
                <span className="text-xs text-slate-400 mt-1 uppercase tracking-wider">
                  {item.category}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Modules;

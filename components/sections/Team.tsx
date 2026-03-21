import React from 'react';
import { ContentData } from '@/types/legacy';
import { Linkedin } from 'lucide-react';

interface TeamProps {
  content: ContentData;
}

const Team: React.FC<TeamProps> = ({ content }) => {
  return (
    <section id="team" className="py-24 bg-slate-50 border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl font-bold text-slate-900 mb-4">{content.team.title}</h2>
          <p className="text-lg text-slate-600">{content.team.subtitle}</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-3xl mx-auto">
          {content.team.items.map((member, idx) => (
            <div
              key={idx}
              className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-100 hover:-translate-y-2"
            >
              <div className="aspect-w-1 aspect-h-1 w-full overflow-hidden">
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-full h-64 object-cover object-center group-hover:scale-105 transition-transform duration-500 filter grayscale group-hover:grayscale-0"
                />
              </div>
              <div className="p-6">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="text-xl font-bold text-slate-900">{member.name}</h3>
                    <div className="text-violet-600 font-medium text-sm mb-3">{member.role}</div>
                  </div>
                  {member.linkedin && (
                    <a
                      href={member.linkedin}
                      className="text-slate-400 hover:text-blue-600 transition-colors"
                    >
                      <Linkedin size={18} />
                    </a>
                  )}
                </div>
                <p className="text-slate-500 text-sm leading-relaxed">{member.bio}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Team;

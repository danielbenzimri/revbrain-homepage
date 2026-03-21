import React from 'react';
import { ContentData, Language } from '@/types/legacy';
import Button from '@/components/ui/Button';
import { ChevronLeft, ChevronRight, CheckCircle } from 'lucide-react';

interface HeroProps {
  content: ContentData;
  lang: Language;
}

const Hero: React.FC<HeroProps> = ({ content, lang }) => {
  const Icon = lang === 'he' ? ChevronLeft : ChevronRight;

  return (
    <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
      {/* Background Decor */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-violet-50/50 to-slate-50/50" />
        <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-violet-100/30 blur-3xl rounded-full translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 left-0 w-1/3 h-1/3 bg-purple-100/30 blur-3xl rounded-full -translate-x-1/2 translate-y-1/2" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-8 items-center">
          {/* Text Content */}
          <div className="text-center lg:text-start rtl:lg:text-right">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-100 text-violet-800 text-sm font-medium mb-6">
              <span className="w-2 h-2 rounded-full bg-violet-500 animate-pulse"></span>
              {lang === 'he' ? 'Salesforce CPQ → Revenue Cloud' : 'Salesforce CPQ → Revenue Cloud'}
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.15] mb-6">
              {content.hero.headline}
            </h1>
            <p className="text-lg sm:text-xl text-slate-600 mb-8 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
              {content.hero.subheadline}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Button size="lg" href="/en/schedule">
                {content.hero.ctaPrimary}
                <Icon className={`w-5 h-5 ${lang === 'he' ? 'mr-2' : 'ml-2'}`} />
              </Button>
              <Button size="lg" variant="outline" href="#how-it-works">
                {content.hero.ctaSecondary}
              </Button>
            </div>

            <div className="mt-10 pt-8 border-t border-slate-200 flex flex-wrap justify-center lg:justify-start gap-8">
              {content.stats.map((stat, i) => (
                <div key={i} className="flex flex-col items-center lg:items-start">
                  <span className="text-3xl font-bold text-slate-900">{stat.value}</span>
                  <span className="text-sm text-slate-500 uppercase tracking-wide">
                    {stat.label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Visual/Image */}
          <div className="relative">
            <div className="absolute inset-0 bg-violet-500/10 rounded-2xl transform rotate-3 scale-105 z-0"></div>
            <div className="relative bg-white rounded-2xl shadow-2xl overflow-hidden border border-slate-200 z-10">
              {/* Abstract UI representation */}
              <div className="bg-slate-900 p-4 flex items-center gap-2">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-500"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                </div>
                <div className="ml-4 h-6 w-64 bg-slate-800 rounded text-xs text-slate-400 flex items-center px-2 font-mono">
                  app.revbrain.ai/migration/analysis
                </div>
              </div>
              <div className="p-6 bg-slate-50 space-y-4">
                {/* Migration flow visualization */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600 font-bold text-sm">
                      CPQ
                    </div>
                    <span className="text-sm font-medium text-slate-700">Salesforce CPQ</span>
                  </div>
                  <div className="text-slate-400">→</div>
                  <div className="flex items-center gap-2">
                    <div className="w-10 h-10 bg-violet-100 rounded-lg flex items-center justify-center text-violet-600 font-bold text-sm">
                      RCA
                    </div>
                    <span className="text-sm font-medium text-slate-700">Revenue Cloud</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="w-full bg-violet-200 rounded-full h-2">
                      <div
                        className="bg-violet-600 h-2 rounded-full"
                        style={{ width: '92%' }}
                      ></div>
                    </div>
                    <span className="text-xs text-violet-600 font-semibold whitespace-nowrap">
                      92%
                    </span>
                  </div>
                  <p className="text-xs text-slate-500">
                    {lang === 'he'
                      ? '184 מתוך 200 פריטי קונפיגורציה הומרו'
                      : '184 of 200 configuration items migrated'}
                  </p>
                </div>
              </div>

              {/* Floating Card */}
              <div
                className={`absolute top-1/4 ${lang === 'he' ? 'left-6' : 'right-6'} bg-white p-4 rounded-xl shadow-xl border border-violet-100 max-w-[200px]`}
              >
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-violet-100 rounded-lg text-violet-600">
                    <CheckCircle size={20} />
                  </div>
                  <div>
                    <div className="text-xs text-slate-500">
                      {lang === 'he' ? 'ולידציה' : 'Validation'}
                    </div>
                    <div className="font-bold text-violet-600">
                      {lang === 'he' ? 'הושלם' : 'Passed'}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;

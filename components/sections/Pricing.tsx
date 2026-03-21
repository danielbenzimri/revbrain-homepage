import React from 'react';
import { ContentData } from '@/types/legacy';
import Button from '@/components/ui/Button';
import { Check } from 'lucide-react';

interface PricingProps {
  content: ContentData;
}

const Pricing: React.FC<PricingProps> = ({ content }) => {
  return (
    <section id="pricing" className="py-24 bg-slate-900 text-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl font-bold mb-4">{content.pricing.title}</h2>
          <p className="text-lg text-slate-400">{content.pricing.subtitle}</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {content.pricing.tiers.map((tier, idx) => (
            <div
              key={idx}
              className={`relative rounded-2xl p-6 flex flex-col ${
                tier.highlight
                  ? 'bg-slate-800 ring-2 ring-teal-500 shadow-2xl shadow-teal-900/50 scale-105 z-10'
                  : 'bg-slate-800/50 border border-slate-700'
              }`}
            >
              {tier.highlight && (
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-teal-500 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                  Most Popular
                </div>
              )}
              <div className="mb-6">
                <h3 className="text-lg font-bold text-white mb-2">{tier.name}</h3>
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-bold text-white">{tier.price}</span>
                  <span className="text-sm text-slate-400">{tier.period}</span>
                </div>
                <p className="text-sm text-slate-400 mt-3">{tier.description}</p>
              </div>

              <ul className="space-y-3 mb-8 flex-1">
                {tier.features.map((feature, fIdx) => (
                  <li key={fIdx} className="flex items-start gap-3 text-sm text-slate-300">
                    <Check className="w-5 h-5 text-teal-400 flex-shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              <Button
                href={tier.href}
                variant={tier.highlight ? 'primary' : 'outline'}
                className={
                  !tier.highlight
                    ? 'text-white hover:text-white border-slate-600 hover:bg-slate-700'
                    : ''
                }
                size="sm"
              >
                {tier.cta}
              </Button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Pricing;

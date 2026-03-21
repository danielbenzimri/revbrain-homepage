import React from 'react';
import { ContentData } from '@/types/legacy';
import { Twitter, Linkedin, Facebook, Mail } from 'lucide-react';

interface FooterProps {
  content: ContentData;
}

const Footer: React.FC<FooterProps> = ({ content }) => {
  return (
    <footer className="bg-slate-50 border-t border-slate-200 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div className="col-span-1 md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-br from-violet-600 to-teal-500 rounded-lg flex items-center justify-center text-white font-bold text-lg">
                R
              </div>
              <span className="text-xl font-bold text-slate-900">RevBrain</span>
            </div>
            <p className="text-slate-500 text-sm leading-relaxed">{content.hero.subheadline}</p>
          </div>

          <div>
            <h4 className="font-bold text-slate-900 mb-4">{content.nav.modules}</h4>
            <ul className="space-y-2 text-sm text-slate-600">
              <li>
                <a href="#" className="hover:text-violet-600">
                  CPQ Analysis
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-violet-600">
                  Migration Engine
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-violet-600">
                  Validation
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-violet-600">
                  Deployment
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-slate-900 mb-4">{content.nav.about}</h4>
            <ul className="space-y-2 text-sm text-slate-600">
              <li>
                <a href="#" className="hover:text-violet-600">
                  Company
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-violet-600">
                  Careers
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-violet-600">
                  Blog
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-violet-600">
                  Contact
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-slate-900 mb-4">Social</h4>
            <div className="flex space-x-4 rtl:space-x-reverse">
              <a href="#" className="text-slate-400 hover:text-violet-600 transition-colors">
                <Linkedin size={20} />
              </a>
              <a href="#" className="text-slate-400 hover:text-violet-600 transition-colors">
                <Twitter size={20} />
              </a>
              <a href="#" className="text-slate-400 hover:text-violet-600 transition-colors">
                <Facebook size={20} />
              </a>
              <a
                href="mailto:contact@revbrain.ai"
                className="text-slate-400 hover:text-violet-600 transition-colors"
              >
                <Mail size={20} />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-slate-200 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-slate-500">
          <div>{content.footer.rights}</div>
          <div className="flex gap-6">
            <a href="#" className="hover:text-slate-900">
              {content.footer.privacy}
            </a>
            <a href="#" className="hover:text-slate-900">
              {content.footer.terms}
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

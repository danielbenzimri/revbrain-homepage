import { ContentData } from '@/types/legacy';

export const HEBREW_CONTENT: ContentData = {
  nav: {
    features: 'יתרונות',
    modules: 'כלים',
    pricing: 'מחירים',
    about: 'אודות',
    team: 'הצוות',
    contact: 'צור קשר',
    login: 'התחברות',
    signup: 'הרשמה',
  },
  hero: {
    headline: 'הפכו חודשים של מיגרציית CPQ ידנית לשבועות עם AI',
    subheadline:
      'כלי AI שמאיץ מיגרציות מ-Salesforce CPQ ל-Revenue Cloud Advanced. אוטומציה של 90% מהעבודה, במיוחד עבור שותפי Salesforce.',
    ctaPrimary: 'קבעו הדגמה',
    ctaSecondary: 'איך זה עובד',
  },
  trustedBy: {
    title: 'שותפי Salesforce מובילים בוחרים ב-RevBrain',
  },
  stats: [
    { label: 'אוטומציה', value: '90%' },
    { label: 'קיצור זמן מיגרציה', value: '80%' },
    { label: 'דיוק מיפוי', value: '99%' },
  ],
  modules: {
    title: 'כלים לכל שלב במיגרציה',
    subtitle: 'מניתוח ראשוני ועד פריסה — RevBrain מלווה את כל התהליך',
    items: [
      { name: 'ניתוח CPQ', category: 'Analysis', icon: 'Search' },
      { name: 'מיפוי מוצרים', category: 'Analysis', icon: 'GitBranch' },
      { name: 'כללי מחיר', category: 'Migration', icon: 'Calculator' },
      { name: 'תבניות הצעה', category: 'Migration', icon: 'FileText' },
      { name: 'תהליכי אישור', category: 'Migration', icon: 'CheckSquare' },
      { name: 'Guided Selling', category: 'Migration', icon: 'Navigation' },
      { name: 'בדיקות ולידציה', category: 'Validation', icon: 'ShieldCheck' },
      { name: 'דוח פערים', category: 'Validation', icon: 'AlertTriangle' },
      { name: 'פריסה', category: 'Deployment', icon: 'Rocket' },
      { name: 'Custom Code', category: 'Migration', icon: 'Code' },
    ],
  },
  personas: {
    title: 'פתרונות לכל סוג של שותף',
    subtitle: 'בין אם אתם SI גדול, בוטיק או יועץ עצמאי — RevBrain מאיץ לכם את המיגרציה',
    items: [
      {
        id: 'si-partners',
        title: 'שותפי אינטגרציה',
        description:
          'מיגרציות CPQ הן הפרויקטים הכי מורכבים? RevBrain מאפשר אוטומציה של 90% מהעבודה ומקצר פרויקטים מחודשים לשבועות.',
        benefits: [
          'ניתוח קונפיגורציות CPQ מורכבות באופן אוטומטי',
          'מיפוי אוטומטי ל-Revenue Cloud Advanced',
          'Validation Suite מלא לוידוא שלמות',
        ],
        cta: 'קבעו הדגמה',
      },
      {
        id: 'consultants',
        title: 'יועצי Salesforce',
        description:
          'אין מספיק כוח אדם למיגרציות גדולות? RevBrain מאפשר לכם לקחת פרויקטים שהיו גדולים מדי — ללא גיוס.',
        benefits: [
          'הרחבת יכולות ללא גיוס',
          'ביצוע מיגרציות שהיו בלתי אפשריות',
          'תמחור תחרותי יותר ללקוחות',
        ],
        cta: 'גלו איך',
      },
      {
        id: 'revops',
        title: 'צוותי RevOps',
        description:
          'עוברים מ-CPQ ל-Revenue Cloud? קבלו דוח ניתוח מקדים שמזהה סיכונים ופערים לפני שמתחילים.',
        benefits: [
          'דוח ניתוח מקדים מלא',
          'זיהוי סיכונים לפני תחילת המיגרציה',
          'תוכנית מיגרציה מפורטת',
        ],
        cta: 'בקשו ניתוח',
      },
    ],
  },
  pricing: {
    title: 'תמחור מותאם לצרכים שלכם',
    subtitle: 'תמחור לפי פרויקט או תוכנית שותפים קבועה',
    tiers: [
      {
        name: 'לפי פרויקט',
        price: 'מותאם אישית',
        period: '',
        description: 'לשותפים עם פרויקט ספציפי',
        features: [
          'ניתוח CPQ מלא ודוח פערים',
          'מיגרציה אוטומטית',
          'Validation Suite',
          'תמיכה טכנית',
        ],
        cta: 'קבעו הדגמה',
        href: '/schedule',
      },
      {
        name: 'שותף קבוע',
        price: 'מותאם אישית',
        period: '',
        description: 'לשותפים עם פרויקטים מרובים',
        features: ['גישה מלאה לכל הכלים', 'פרויקטים ללא הגבלה', 'תמיכה עדיפה', 'תמחור מועדף'],
        cta: 'דברו איתנו',
        href: '/schedule',
        highlight: true,
      },
    ],
  },
  team: {
    title: 'המייסדים',
    subtitle: 'צוות עם ניסיון עמוק ב-Salesforce ובהנדסת תוכנה',
    items: [
      {
        name: 'אופיר כהן',
        role: 'מנכ״ל ומייסד שותף',
        image:
          'https://images.ctfassets.net/fag6qh78w8nn/7G7onzm0kPbKgbF03kBYoq/ad1fe1ca9184f05ed4e40a7270d1947f/ofir.png',
        bio: 'יזם סדרתי ובונה מוצרי AI עם 15+ שנות ניסיון בסטארטאפים וב-GTM ארגוני. ייסד ומכר חברת BI. חווה על בשרו את כאב הלוגיקה העסקית ב-CRM כמנהל כללי של יחידת B2B SaaS.',
        linkedin: '#',
      },
      {
        name: 'דניאל אבירם',
        role: 'סמנכ״ל טכנולוגיות ומייסד שותף',
        image:
          'https://images.ctfassets.net/fag6qh78w8nn/5u5tENR8dzbO6kIL2bmOtI/109ba523217df272c2db942f41b67627/daniel.png',
        bio: '15+ שנות ניסיון בבניית מערכות AI בסקייל בארגונים מורכבים. כ-Head of AI ב-ZoomInfo תכנן את שכבת הבינה של אחת הפלטפורמות העתירות בנתונים ב-B2B. כ-Tech Lead ב-Amazon AWS בנה צינורות נתונים ומערכות AI בייצור.',
        linkedin: '#',
      },
    ],
  },
  testimonials: {
    title: 'מה השותפים שלנו אומרים',
    items: [
      {
        quote:
          'RevBrain קיצר לנו פרויקט מיגרציה שתוכנן ל-8 חודשים ל-6 שבועות בלבד. הניתוח האוטומטי חסך מאות שעות.',
        author: 'Sarah Mitchell',
        role: 'Salesforce Architect',
        company: 'CloudForce Partners',
        image:
          'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=150',
      },
      {
        quote:
          'בתור שותף Salesforce, מיגרציות CPQ היו תמיד הפרויקטים הכי מורכבים. RevBrain הפך אותם לפרויקטים רווחיים וצפויים.',
        author: 'James Rodriguez',
        role: 'Partner Director',
        company: 'Apex Revenue Solutions',
        image:
          'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150',
      },
    ],
  },
  faq: {
    title: 'שאלות נפוצות',
    items: [
      {
        question: 'מה בדיוק RevBrain עושה?',
        answer:
          'RevBrain הוא כלי AI שמאיץ מיגרציות מ-Salesforce CPQ ל-Revenue Cloud Advanced. הכלי מנתח את הקונפיגורציה הקיימת, ממפה אותה ל-RCA, ומייצר את רוב הקוד והקונפיגורציה הנדרשים.',
      },
      {
        question: 'כמה מהמיגרציה באמת אוטומטית?',
        answer:
          'RevBrain מאפשר אוטומציה של כ-90% מהעבודה, כולל Product Catalog, Price Rules, Quote Templates ו-Approval Processes.',
      },
      {
        question: 'האם הנתונים שלנו מאובטחים?',
        answer:
          'בהחלט. RevBrain מנתח מטא-דאטה וקונפיגורציה בלבד, לא נתוני לקוחות. כל הנתונים מוצפנים בתעבורה ובמנוחה.',
      },
    ],
  },
  footer: {
    rights: 'כל הזכויות שמורות RevBrain 2025',
    privacy: 'מדיניות פרטיות',
    terms: 'תנאי שימוש',
  },
};

export const ENGLISH_CONTENT: ContentData = {
  nav: {
    features: 'Features',
    modules: 'Tools',
    pricing: 'Pricing',
    about: 'About',
    team: 'Team',
    contact: 'Contact',
    login: 'Login',
    signup: 'Sign Up',
  },
  hero: {
    headline: 'Turn months of manual CPQ migration into weeks with AI',
    subheadline:
      'AI-powered migration tool for Salesforce CPQ to Revenue Cloud Advanced. Automate 90% of the work, built for Salesforce partners.',
    ctaPrimary: 'Schedule a Demo',
    ctaSecondary: 'How It Works',
  },
  trustedBy: {
    title: 'Trusted by leading Salesforce partners',
  },
  stats: [
    { label: 'Automation', value: '90%' },
    { label: 'Time Reduction', value: '80%' },
    { label: 'Mapping Accuracy', value: '99%' },
  ],
  modules: {
    title: 'Tools for Every Migration Phase',
    subtitle: 'From initial analysis to deployment — RevBrain covers the entire process',
    items: [
      { name: 'CPQ Analysis', category: 'Analysis', icon: 'Search' },
      { name: 'Product Mapping', category: 'Analysis', icon: 'GitBranch' },
      { name: 'Price Rules', category: 'Migration', icon: 'Calculator' },
      { name: 'Quote Templates', category: 'Migration', icon: 'FileText' },
      { name: 'Approval Flows', category: 'Migration', icon: 'CheckSquare' },
      { name: 'Guided Selling', category: 'Migration', icon: 'Navigation' },
      { name: 'Validation Suite', category: 'Validation', icon: 'ShieldCheck' },
      { name: 'Gap Report', category: 'Validation', icon: 'AlertTriangle' },
      { name: 'Deployment', category: 'Deployment', icon: 'Rocket' },
      { name: 'Custom Code', category: 'Migration', icon: 'Code' },
    ],
  },
  personas: {
    title: 'Built for Salesforce Partners',
    subtitle:
      'Whether you are a large SI, boutique firm, or independent consultant — RevBrain accelerates your migrations',
    items: [
      {
        id: 'si-partners',
        title: 'SI Partners',
        description:
          'CPQ migrations are your most complex projects? RevBrain automates 90% of the work and shortens projects from months to weeks.',
        benefits: [
          'Automated complex CPQ configuration analysis',
          'Automatic mapping to Revenue Cloud Advanced',
          'Full Validation Suite for completeness',
        ],
        cta: 'Schedule a Demo',
      },
      {
        id: 'consultants',
        title: 'Salesforce Consultants',
        description:
          'Not enough bandwidth for large migrations? RevBrain lets you take on projects that were too big — without hiring.',
        benefits: [
          'Scale capacity without hiring',
          'Deliver previously impossible migrations',
          'More competitive pricing for clients',
        ],
        cta: 'Learn How',
      },
      {
        id: 'revops',
        title: 'RevOps Teams',
        description:
          'Moving from CPQ to Revenue Cloud? Get a pre-migration analysis report that identifies risks and gaps before you start.',
        benefits: [
          'Full pre-migration analysis report',
          'Risk identification before migration begins',
          'Detailed migration plan',
        ],
        cta: 'Request Analysis',
      },
    ],
  },
  pricing: {
    title: 'Pricing Tailored to Your Needs',
    subtitle: 'Per-project pricing or ongoing partner plans',
    tiers: [
      {
        name: 'Per Project',
        price: 'Custom',
        period: '',
        description: 'For partners with a specific project',
        features: [
          'Full CPQ analysis & gap report',
          'Automated migration',
          'Validation Suite',
          'Technical support',
        ],
        cta: 'Schedule a Demo',
        href: '/schedule',
      },
      {
        name: 'Partner Plan',
        price: 'Custom',
        period: '',
        description: 'For partners with multiple projects',
        features: [
          'Full access to all tools',
          'Unlimited projects',
          'Priority support',
          'Preferred pricing',
        ],
        cta: 'Talk to Us',
        href: '/schedule',
        highlight: true,
      },
    ],
  },
  team: {
    title: 'The Founders',
    subtitle: 'A team with deep Salesforce and software engineering experience',
    items: [
      {
        name: 'Ofir Cohen',
        role: 'CEO & Co-Founder',
        image:
          'https://images.ctfassets.net/fag6qh78w8nn/7G7onzm0kPbKgbF03kBYoq/ad1fe1ca9184f05ed4e40a7270d1947f/ofir.png',
        bio: 'Serial entrepreneur and AI product builder with 15+ years across startups and enterprise GTM. Founded and exited a business intelligence company. Experienced revenue logic pain firsthand as a GM scaling a B2B SaaS unit.',
        linkedin: '#',
      },
      {
        name: 'Daniel Aviram',
        role: 'CTO & Co-Founder',
        image:
          'https://images.ctfassets.net/fag6qh78w8nn/5u5tENR8dzbO6kIL2bmOtI/109ba523217df272c2db942f41b67627/daniel.png',
        bio: "15+ years building large-scale AI systems inside complex enterprises. As Head of AI at ZoomInfo, architected the intelligence layer behind one of B2B's most data-intensive platforms. As Tech Lead at Amazon AWS, built high-scale data pipelines and production AI systems.",
        linkedin: '#',
      },
    ],
  },
  testimonials: {
    title: 'What Our Partners Say',
    items: [
      {
        quote:
          'RevBrain shortened a migration project planned for 8 months to just 6 weeks. The automated analysis saved us hundreds of hours.',
        author: 'Sarah Mitchell',
        role: 'Salesforce Architect',
        company: 'CloudForce Partners',
        image:
          'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=150',
      },
      {
        quote:
          'As a Salesforce partner, CPQ migrations were always our most complex projects. RevBrain turned them into profitable, predictable engagements.',
        author: 'James Rodriguez',
        role: 'Partner Director',
        company: 'Apex Revenue Solutions',
        image:
          'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150',
      },
    ],
  },
  faq: {
    title: 'Frequently Asked Questions',
    items: [
      {
        question: 'What exactly does RevBrain do?',
        answer:
          'RevBrain is an AI tool that accelerates migrations from Salesforce CPQ to Revenue Cloud Advanced. It analyzes your existing CPQ configuration, maps it to RCA, and generates most of the required code and configuration.',
      },
      {
        question: 'How much of the migration is actually automated?',
        answer:
          'RevBrain automates approximately 90% of migration work, including Product Catalog, Price Rules, Quote Templates, and Approval Processes.',
      },
      {
        question: 'Is our data secure?',
        answer:
          'Absolutely. RevBrain analyzes metadata and configuration only, not customer data. All data is encrypted in transit and at rest.',
      },
    ],
  },
  footer: {
    rights: 'All rights reserved RevBrain 2025',
    privacy: 'Privacy Policy',
    terms: 'Terms of Use',
  },
};

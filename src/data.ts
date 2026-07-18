export interface StatItem {
  id: string;
  label: string;
  count: number;
  suffix: string;
}

export interface IndustryItem {
  id: string;
  name: string;
  emoji: string;
  description: string;
}

export interface ProgramItem {
  id: string;
  title: string;
  description: string;
  emoji: string;
  count: number;
  suffix: string;
  countLabel: string;
}

export interface StepItem {
  number: string;
  title: string;
  description: string;
}

export interface USPItem {
  id: string;
  title: string;
  description: string;
  emoji: string;
}

export interface TeamMember {
  name: string;
  role: string;
  initials: string;
  avatar: string;
}

export interface TeamGroup {
  department: string;
  members: TeamMember[];
}

export const TRUST_LOGOS = [
  { name: "HUL", logoText: "Hindustan Unilever" },
  { name: "SBI", logoText: "State Bank of India" },
  { name: "Mahindra", logoText: "Mahindra Group" },
  { name: "Vi", logoText: "Vodafone Idea" },
  { name: "Fortis", logoText: "Fortis Healthcare" },
  { name: "Glenmark", logoText: "Glenmark Pharmaceuticals" }
];

export const STATS_DATA: StatItem[] = [
  { id: "stat-exp", label: "Years of Group Experience", count: 15, suffix: "+" },
  { id: "stat-brands", label: "Brands in Our Catalog", count: 100, suffix: "+" },
  { id: "stat-clients", label: "Enterprise Clients Served", count: 500, suffix: "+" },
  { id: "stat-renewal", label: "Client Renewal Rate", count: 98, suffix: "%" }
];

export const INDUSTRIES_DATA: IndustryItem[] = [
  { id: "ind-tech", name: "Software & Technology", emoji: "💻", description: "Incentivize long development hours and product milestones with curated tech items." },
  { id: "ind-health", name: "Hospitals & Healthcare", emoji: "🏥", description: "Recognize tireless care teams and administrative leaders with healthy-living vouchers." },
  { id: "ind-pharma", name: "Pharmaceuticals", emoji: "💊", description: "Accelerate sales force motivation and field agent compliance across India." },
  { id: "ind-telecom", name: "Telecom", emoji: "📱", description: "Channel incentive programs designed to keep local distribution networks focused." },
  { id: "ind-builders", name: "Builders & Developers", emoji: "🏢", description: "Reward procurement leads, contractors, and channel partners for project completions." },
  { id: "ind-hotels", name: "Hotels & Restaurants", emoji: "🏨", description: "Motivate frontline hospitality staff to deliver 5-star customer experiences." },
  { id: "ind-financial", name: "Financial Institutions", emoji: "🏦", description: "Secure, fully-compliant points programs for relationship managers and advisors." },
  { id: "ind-govt", name: "Govt. Institutions", emoji: "🏛️", description: "GEM-compliant motivation programs aligned with institutional regulations." },
  { id: "ind-mfg", name: "Manufacturing Units", emoji: "🏭", description: "Boost safety achievements and production efficiency for floor managers and labor teams." },
  { id: "ind-edu", name: "Educational Institutions", emoji: "🎓", description: "Appreciate teachers, professors, and administrative heads for institutional excellence." }
];

export const PROGRAMS_DATA: ProgramItem[] = [
  { id: "prog-sales", title: "Loyalty management Programs", description: "A Loyalty Management System is a comprehensive platform that helps businesses build stronger relationships with customers, dealers, distributors, retailers, and channel partners through customizable rewards and incentive programs. It enables organizations to launch QR code-based loyalty campaigns, automate point accumulation and redemption, manage tiered reward structures, and offer multiple redemption options such as digital wallets, bank transfers, gift vouchers, or merchandise", emoji: "📈", count: 145, suffix: "%", countLabel: "Average Sales Lift" },
  { id: "prog-dealer", title: "Dealer distribution Programs", description: "A Dealer Management System (DMS) is a centralized platform designed to simplify and optimize the management of dealers, distributors, retailers, and channel partners. It enables businesses to manage customer networks, streamline primary and secondary order processing, track sales performance, set and monitor sales targets, and automate financial operations such as invoicing, payments, credit notes, and outstanding balances. With real-time dashboards, ERP and accounting software integration, communication tools, and comprehensive analytics.", emoji: "🤝", count: 185, suffix: "K+", countLabel: "Active Channel Partners" }

];

export const PROCESS_STEPS: StepItem[] = [
  { number: "01", title: "Define Goals", description: "We align with your HR or Sales heads to map clear, actionable campaign milestones." },
  { number: "02", title: "Design the Structure", description: "Select custom brand catalogs, points-conversion parameters, and corporate themes." },
  { number: "03", title: "Launch the Portal", description: "Deploy a secure, mobile-friendly portal custom-configured with your domain." },
  { number: "04", title: "Track & Optimize", description: "Monitor real-time participation, popular brand redemptions, and ROI metrics." }
];

export const WHY_US_DATA: USPItem[] = [
  { id: "why-catalog", title: "Vetted Brand Catalog", description: "Access 1,000+ top-tier national brands, instant digital e-vouchers, and physical gifts.", emoji: "🎁" },
  { id: "why-delivery", title: "Pan-India Delivery", description: "Reliable physical shipment dispatch and near-instant digital delivery across all Indian pin codes.", emoji: "📍" },
  { id: "why-report", title: "Real-Time Reporting", description: "Audit points balances, download active vouchers, and export monthly spend spreadsheets dynamically.", emoji: "📊" }
];

export const TEAM_DATA: TeamGroup[] = [
  {
    department: "Leadership",
    members: [
      { name: "Samir Kalra", role: "Director", initials: "SK", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=256&h=256&q=80" },
      { name: "Shveta Kalra", role: "Director", initials: "ShK", avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=256&h=256&q=80" }
    ]
  },
  {
    department: "Marketing",
    members: [
      { name: "Agrim Kalra", role: "Marketing Head", initials: "AK", avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=256&h=256&q=80" }
    ]
  }

 
  
];

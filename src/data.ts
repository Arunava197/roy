export const NAV_LINKS = [
  { label: 'Home', href: '#home' },
  { label: 'About', href: '#about' },
  { label: 'Skills', href: '#skills' },
  { label: 'Projects', href: '#projects' },
  { label: 'Experience', href: '#experience' },
  { label: 'Education', href: '#education' },
  { label: 'Certifications', href: '#certifications' },
  { label: 'Games', href: '#games' },
  { label: 'Contact', href: '#contact' },
];

export const SKILLS_CATEGORIES = [
  {
    category: 'Data Analysis & BI',
    skills: [
      { name: 'SQL & Python Data Analysis', level: 90 },
      { name: 'KPI Tracking', level: 85 },
      { name: 'Reporting Automation', level: 80 },
      { name: 'Transaction Monitoring', level: 88 },
      { name: 'Anomaly Detection', level: 75 }
    ],
  },
  {
    category: 'Tools & Technologies',
    skills: [
      { name: 'SQL (Advanced, Joins, Aggregations, Window Functions)', level: 95 },
      { name: 'Excel (Pivot Tables, Macros, Formulas)', level: 90 },
      { name: 'Power BI (DAX, Dashboards)', level: 80 },
      { name: 'Python', level: 70 },
    ],
  },
  {
    category: 'Business & Operations',
    skills: [
      { name: 'Risk Assessment', level: 85 },
      { name: 'Operational Oversight', level: 80 },
      { name: 'Cross-Functional Collaboration', level: 90 },
      { name: 'Compliance Awareness', level: 85 },
      { name: 'Process Improvement', level: 88 }
    ],
  },
];

export const PROJECTS = [
  {
    id: 1,
    title: 'Retail Cohort Insights',
    description: 'Analyzed 500,000 retail transactions to reveal customer behavior and revenue trends.',
    problem: 'Required insights from 500,000 annual retail transactions.',
    tools: ['SQL', 'Excel'],
    method: 'Cohort identification, pivot table analysis, and schematic database design with 20 critical data fields.',
    findings: 'Achieved 95% accuracy in cleaning, filtering, and calculating transaction revenue.',
    impact: 'Revealed customer behavior and revenue trends successfully.',
    githubLink: 'https://github.com/Arunava197/Retail-Cohort-Insights-using-SQL',
    liveLink: 'https://1drv.ms/x/c/8190fbf69507d0d8/ERBJGCBofPJBucqFG3FQYnsBA1zk1g3zfAvf25JpgADPfg?e=oeASrT',
    images: [
      'https://images.unsplash.com/photo-1556740738-b6a63e27c4df?auto=format&fit=crop&q=80&w=2000',
      'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=2000',
      'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=2000',
      'https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?auto=format&fit=crop&q=80&w=2000'
    ]
  },
  {
    id: 2,
    title: 'RFM Segmentation: Analyzing Sales Data for Customer Insights',
    description: 'Categorized customers into distinct segments using RFM analysis on 2,800+ sales transactions.',
    problem: 'Need for precise customer categorization from raw sales data.',
    tools: ['Python', 'Data Analysis'],
    method: 'Processed 2823 unique sales transactions using RFM analysis to identify distinct customer patterns.',
    findings: 'Customers categorized into 7 distinct segments. Identified November 2004 as peak sales month driven by Classic Cars.',
    impact: 'Enabled targeted marketing and robust anomaly tracking capability.',
    githubLink: 'https://github.com/Arunava197/RFM_segmentation',
    liveLink: 'https://1drv.ms/x/c/8190fbf69507d0d8/IQNdtmI3iTWzRLsisRp2HKbwAcY49dbEaForIvmihAfTd30',
    images: [
      'https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&q=80&w=2000',
      'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&q=80&w=2000',
      'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=2000',
      'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&q=80&w=2000'
    ]
  },
  {
    id: 3,
    title: 'HR Attrition Analysis',
    description: 'Created data-driven HR dashboards to examine demographics, turnover, and wellness trends.',
    problem: 'Need for data-driven insights to improve hiring quality and reduce employee attrition.',
    tools: ['Power BI', 'Data Modeling'],
    method: 'Creation of data-driven HR dashboards examining demographics, turnover, and wellness trends.',
    findings: 'Identified key drivers of employee attrition and actionable wellness insights.',
    impact: 'Reduced recruitment cycle time by 20%, improved hiring quality by 10%, and improved employee retention rates by 15%.',
    githubLink: 'https://github.com/Arunava197/HR_attrition_dashboard',
    liveLink: 'https://app.powerbi.com/view?r=eyJrIjoiM2YyMGNhNjItYjE3MS00NWZhLTk2ZjMtMjdkNWY3MTg0M2U1IiwidCI6IjRhNWFkYzcwLWVkNTItNDM1NS04MmQ2LTg2YTRhYjk3MzhiOCIsImMiOjEwfQ%3D%3D',
    images: [
      'https://images.unsplash.com/photo-1573164713988-8665fc963095?auto=format&fit=crop&q=80&w=2000',
      'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&q=80&w=2000',
      'https://images.unsplash.com/photo-1542744094-24638eff58bb?auto=format&fit=crop&q=80&w=2000',
      'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&q=80&w=2000'
    ]
  },
  {
    id: 4,
    title: 'Monthly Sales Trends and Optimizing Fulfillment',
    description: 'Optimized operations and fulfillment through dynamic pricing models and trend analysis.',
    problem: 'Optimization of operations based on monthly sales trends.',
    tools: ['Excel', 'Power BI'],
    method: 'Extracted insights from sales data and developed dynamic pricing models based on trend analysis.',
    findings: 'Identified opportunities for efficiency optimization and pricing adjustments.',
    impact: 'Increased efficiency by 25%, revenue by 10%, and average order value by 15%.',
    githubLink: 'https://github.com/Arunava197/Analyzing-_Sales-_Trends',
    liveLink: 'https://app.powerbi.com/view?r=eyJrIjoiOGI5YjIxMTItM2I3YS00MzZlLWE1YTAtZDVjNDU4YWI0YTQxIiwidCI6IjRhNWFkYzcwLWVkNTItNDM1NS04MmQ2LTg2YTRhYjk3MzhiOCIsImMiOjEwfQ%3D%3D',
    images: [
      'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=2000',
      'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=2000',
      'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&q=80&w=2000',
      'https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&q=80&w=2000'
    ]
  },
  {
    id: 5,
    title: 'AirBnb Market Insights Analysis',
    description: 'Analyzed booking patterns and average prices across European cities to increase occupancy rates.',
    problem: 'Analysis of market trends in multiple European cities to increase occupancy rates.',
    tools: ['Excel'],
    method: 'Illustrated booking patterns and average prices, highlighting room types and host demographics.',
    findings: 'Uncovered customer satisfaction trends and key demographics of top-performing hosts.',
    impact: 'Identified opportunities to increase occupancy by 12%, revenue for top hosts by 15%, and customer reviews by 10%.',
    githubLink: 'https://github.com/Arunava197/Exploring-Insights-in-AirBnb-with-Excel',
    liveLink: 'https://1drv.ms/x/c/8190fbf69507d0d8/IQOj77FRNYykSIVKyyLJzpubAc0-ya8uGG9vJ4KsLcAi414',
    images: [
      'https://images.unsplash.com/photo-1499856871958-5b9627545d1a?auto=format&fit=crop&q=80&w=2000',
      'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&q=80&w=2000',
      'https://images.unsplash.com/photo-1502672260266-1c1e5250ff22?auto=format&fit=crop&q=80&w=2000',
      'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&q=80&w=2000'
    ]
  },
  {
    id: 6,
    title: 'Healthcare Insurance Dashboard',
    description: 'Developed interactive dashboards tracking healthcare KPIs, patient demographics, and claims data.',
    problem: 'Need to track healthcare KPIs and optimize insurance policies.',
    tools: ['Power BI', 'Data Visualization'],
    method: 'Developed interactive dashboards analyzing patient demographics and claims data.',
    findings: 'Uncovered trends in coverage and optimization opportunities in policy underwriting.',
    impact: 'Provided actionable insights for policy adjustment and targeted marketing.',
    githubLink: 'https://github.com/Arunava197/Healthcare_Insurance_dashboard',
    liveLink: 'https://app.powerbi.com/view?r=eyJrIjoiNzUwZDU3MDAtZWU5OS00YTZlLTliOWEtNTkzZDUzNTFlZTVhIiwidCI6IjRhNWFkYzcwLWVkNTItNDM1NS04MmQ2LTg2YTRhYjk3MzhiOCIsImMiOjEwfQ%3D%3D',
    images: [
      'https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&q=80&w=2000',
      'https://images.unsplash.com/photo-1504439468489-c8920d786a2b?auto=format&fit=crop&q=80&w=2000',
      'https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&q=80&w=2000',
      'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=2000'
    ]
  },
  {
    id: 7,
    title: 'Heart Disease Prediction',
    description: 'Built precise machine learning models achieving 99% accuracy in predicting heart disease.',
    problem: 'Need for precise and efficient models to impact clinical care decisions.',
    tools: ['Machine Learning', 'Data Analysis'],
    method: 'Implemented predictive modeling for real-world healthcare applications.',
    findings: 'Achieved 99% accuracy in predicting heart disease, enhancing prediction accuracy by 20% and reducing processing time by 30%.',
    impact: 'Impacting care decisions for over 1,000 patients annually through real-world implementation.',
    githubLink: 'https://github.com/Arunava197/Predict_heart_disease',
    liveLink: 'https://1drv.ms/b/c/8190fbf69507d0d8/ES9LdibeEFJBnGxdDWa5_M8BXrta7zt2k1UN_e01TjvKQQ',
    images: [
      'https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&q=80&w=2000',
      'https://images.unsplash.com/photo-1530497610245-94d3c16cda28?auto=format&fit=crop&q=80&w=2000',
      'https://images.unsplash.com/photo-1584308666744-24d5e4a899ee?auto=format&fit=crop&q=80&w=2000',
      'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?auto=format&fit=crop&q=80&w=2000'
    ]
  }
];

export const EXPERIENCES = [
  {
    id: 1,
    role: 'Junior Officer (Digitization)',
    company: 'Centre for Development Innovation and Practices-CDIP',
    timeline: 'September 2024 - Present',
    description: 'Spearheaded BI initiatives, monitoring and validating 10K+ customer transaction records to ensure data integrity.',
    achievements: [
      'Conducted root-cause analyses on discrepancies, reducing operational errors by 25%.',
      'Coordinated with cross-functional teams (IT, program, field operations) to maintain stability.',
      'Developed and automated SQL-based reports and Power BI dashboards for transaction monitoring and KPI tracking.',
      'Resolved data discrepancies within 24-48 hours, maintaining compliance.',
      'Optimized operational processes, improving workflow efficiency by 30%.'
    ],
  },
  {
    id: 2,
    role: 'Data Artist',
    company: 'Adiva Graphics',
    timeline: 'July 2024 - August 2024',
    description: 'Created impactful data visualizations to support strategic business decisions.',
    achievements: [
      'Created impactful data visualizations that boosted client engagement by 30%.',
      'Collaborated with teams to deliver data solutions, reducing project turnaround time by 15%.'
    ],
  }
];

export const EDUCATION = [
  {
    id: 1,
    degree: 'Executive MBA in MIS',
    institution: 'University of Dhaka',
    field: 'Management Information Systems',
    description: 'Focusing on the intersection of business strategy and information technology.',
  },
  {
    id: 2,
    degree: 'B.Sc. (honors) in Statistics',
    institution: 'Shahjalal University of Science & Technology, Sylhet',
    field: 'Statistics',
    description: 'Focused on statistical modeling, research methodologies, and quantitative analysis.',
  },
  {
    id: 3,
    degree: 'HSC in Science',
    institution: 'Ashuganj Sarkarkhana College',
    field: 'Science',
    description: 'Higher Secondary Certificate',
  },
  {
    id: 4,
    degree: 'SSC in Science',
    institution: 'Ashuganj Sarkarkhana College',
    field: 'Science',
    description: 'Secondary School Certificate',
  }
];

export const CERTIFICATIONS = [
  { id: 1, title: 'Lean Six Sigma Green Belt Professional Certification', issuer: 'Six Sigma', date: '2023', summary: 'Demonstrated knowledge of process improvement methodologies, DMAIC framework, and statistical analysis tools to drive business efficiency.' },
  { id: 11, title: 'Google AI Specialization', issuer: 'Coursera / Google', date: '2024', summary: 'Comprehensive training in modern AI concepts including machine learning, deep learning, and generative AI using Google tools and platforms.' },
  { id: 2, title: 'IBM Data Science', issuer: 'Coursera / IBM', date: '2023', summary: 'Gained practical experience with open source tools and libraries, Python, databases, SQL, data visualization, and applied machine learning.' },
  { id: 3, title: 'Business Analysis & Process Management', issuer: 'Coursera', date: '2023', summary: 'Learned to identify business needs, propose solutions, and manage process optimization efforts systematically.' },
  { id: 4, title: 'Data Manipulation in Snowflake', issuer: 'DataCamp', date: '2023', summary: 'Gained proficiency in advanced SQL techniques specific to Snowflake for managing and transforming large datasets.' },
  { id: 5, title: 'Data Manipulation in SQL', issuer: 'DataCamp', date: '2022', summary: 'Mastered complex analytical queries, window functions, and data aggregation using robust SQL methodologies.' },
  { id: 6, title: 'Business Intelligence Analyst', issuer: 'Maven Analytics', date: '2023', summary: 'Learned comprehensive BI lifecycle including data modeling, interactive dashboard creation, and insights storytelling.' },
  { id: 7, title: 'Oracle Analytics Cloud Certified Professional', issuer: 'Oracle', date: '2024', summary: 'Certified in leveraging Oracle Analytics Cloud for creating insightful data models, visualizations, and collaborative BI environments.' },
  { id: 8, title: 'OCI Certified AI Foundations Associate', issuer: 'Oracle', date: '2024', summary: 'Demonstrated foundational knowledge of AI concepts and their implementation within Oracle Cloud Infrastructure.' },
  { id: 9, title: 'SQL (Intermediate)', issuer: 'HackerRank', date: '2022', summary: 'Validated intermediate-level SQL querying skills including subqueries, complex joins, and analytical functions.' },
  { id: 10, title: 'Data Science & Analytics Program', issuer: 'Data Solution-360', date: '2022', summary: 'Completed an intensive program covering end-to-end data analytics, from descriptive analysis to predictive modeling.' }
];

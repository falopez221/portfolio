export const heroLines = [
  "Strategy, finance and execution working together.",
  "Structured thinking turned into decision-ready output.",
  "Building a consulting foundation in CFO & Enterprise Value at Accenture.",
  "Less noise. Better thinking.",
];

export const profile = {
  name: "Francisco",
  title: "Strategy & Consulting Intern",
  team: "CFO & Enterprise Value",
  company: "Accenture",
  location: "Buenos Aires, Argentina",
  email: "franciscoariellopez22@gmail.com",
  linkedin: "https://linkedin.com/in/francisco-ariel-lopez",
  availability: "Open to networking conversations and selected opportunities.",
  calendly: "mailto:franciscoariellopez22@gmail.com",
};

export const quickFacts = [
  "Consulting",
  "Finance",
  "Enterprise Value",
  "Buenos Aires",
];

export const aboutBlocks = [
  {
    title: "Valuacion y Flujo de Fondos",
    eyebrow: "FINANCE CORE",
    text: "Armado y analisis de flujo de fondos, metodologias de valuacion y proyeccion de variables macroeconomicas.",
    accent: "valuation",
    tags: ["Cash Flow", "Valuation", "Macro"],
  },
  {
    title: "Estrategia y Riesgos",
    eyebrow: "DECISION LENS",
    text: "Analisis de costos, evaluacion de riesgos financieros y decisiones criticas basadas en escenarios reales.",
    accent: "risk",
    tags: ["Costs", "Risk", "Scenarios"],
  },
  {
    title: "Executive Communication",
    eyebrow: "CONSULTING OUTPUT",
    text: "Profundizando capacidades en valuacion, business cases, performance analysis, executive storytelling y comunicacion estructurada.",
    accent: "story",
    tags: ["Business Cases", "Storyline", "Slides"],
  },
  {
    title: "Digital Finance",
    eyebrow: "BLOCKCHAIN AND DEFI",
    text: "Proyectos donde estrategia, finanzas y analisis disciplinado se conviertan en decisiones concretas e impacto medible.",
    accent: "defi",
    tags: ["Blockchain", "DeFi", "Adoption"],
  },
];

export const spotlightCards = [
  {
    title: "Value creation mindset",
    text: "Growth, margins, capital allocation and strategic narrative.",
    accent: "valuation",
    stat: "EV",
  },
  {
    title: "Structured problem solving",
    text: "Frame ambiguity, test hypotheses and move toward decisions.",
    accent: "risk",
    stat: "01",
  },
  {
    title: "Executive communication",
    text: "Clear messaging, clean slides and decision-ready synthesis.",
    accent: "story",
    stat: "PPT",
  },
  {
    title: "Digital assets and DeFi",
    text: "Interes profesional por blockchain, finanzas digitales y nuevos modelos de valor.",
    accent: "defi",
    stat: "DeFi",
  },
];

export const workflowApps = [
  {
    id: "excel",
    label: "Excel",
    icon: "XL",
    eyebrow: "MODELING",
    title: "Valuation, cash flow and value drivers.",
    summary:
      "Armado de flujo de fondos, sensibilidades y drivers financieros para leer escenarios con mayor claridad.",
    browserLabel: "Workbook",
    browserTabs: [
      "Flujo de fondos",
      "Valuation view",
      "Sensitivity map",
    ],
    actions: [
      "Actualizar supuestos",
      "Testear escenarios",
      "Exportar conclusiones",
    ],
    metrics: [
      { label: "Focus", value: "Valuation" },
      { label: "Deliverable", value: "Cash Flow" },
      { label: "Style", value: "Structured" },
    ],
    board: "finance",
    tabDetails: [
      {
        label: "Flujo de fondos",
        insight: "Entradas operativas, capex, working capital y caja libre organizados en una vista ejecutiva.",
        values: ["Revenue", "EBITDA", "Capex", "FCF"],
      },
      {
        label: "Valuation view",
        insight: "Multiple view, DCF logic y salida de enterprise value para contrastar escenarios.",
        values: ["DCF", "WACC", "Terminal", "EV"],
      },
      {
        label: "Sensitivity map",
        insight: "Lectura de sensibilidad para entender que variables mueven mas el resultado.",
        values: ["WACC", "Growth", "Margin", "FX"],
      },
    ],
    angle: "-4deg",
    accent: "excel",
  },
  {
    id: "powerpoint",
    label: "PowerPoint",
    icon: "P",
    eyebrow: "STORYLINE",
    title: "Executive narrative for critical decisions.",
    summary:
      "Sintesis ejecutiva, storylines claras y materiales que ordenan la conversacion con foco en decision-making.",
    browserLabel: "Deck",
    browserTabs: [
      "Executive summary",
      "Risk levers",
      "Decision path",
    ],
    actions: [
      "Refinar storyline",
      "Bajar mensaje clave",
      "Pulir slides",
    ],
    metrics: [
      { label: "Focus", value: "Narrative" },
      { label: "Deliverable", value: "Deck" },
      { label: "Style", value: "Executive" },
    ],
    board: "deck",
    tabDetails: [
      {
        label: "Executive summary",
        insight: "Una pagina para ordenar contexto, decision requerida y recomendacion principal.",
        values: ["Context", "Key Message", "Decision"],
      },
      {
        label: "Risk levers",
        insight: "Riesgos principales, trade-offs y mitigantes para sostener una conversacion ejecutiva.",
        values: ["Risk", "Impact", "Mitigation"],
      },
      {
        label: "Decision path",
        insight: "Next steps, owners y criterios para pasar de analisis a accion.",
        values: ["Owners", "Timing", "Output"],
      },
    ],
    angle: "-3deg",
    accent: "powerpoint",
  },
  {
    id: "teams",
    label: "Teams",
    icon: "T",
    eyebrow: "SYNC",
    title: "Stakeholder alignment and project rhythm.",
    summary:
      "Seguimiento de equipos, prioridades y proximos pasos con una cadencia clara y ejecutable.",
    browserLabel: "Sync",
    browserTabs: [
      "Client updates",
      "Owners",
      "Meeting notes",
    ],
    actions: [
      "Compartir progreso",
      "Alinear prioridades",
      "Trackear owners",
    ],
    metrics: [
      { label: "Focus", value: "Coordination" },
      { label: "Deliverable", value: "Update" },
      { label: "Style", value: "Clear" },
    ],
    board: "sync",
    tabDetails: [
      {
        label: "Client updates",
        insight: "Estado, bloqueos y prioridades para mantener alineada la conversacion.",
        values: ["Status", "Risks", "Actions"],
      },
      {
        label: "Owners",
        insight: "Responsables claros y acciones visibles para acelerar ejecucion.",
        values: ["Owner", "Due Date", "Next Step"],
      },
      {
        label: "Meeting notes",
        insight: "Notas convertidas en decisiones, follow-ups y entregables concretos.",
        values: ["Notes", "Decisions", "Follow-up"],
      },
    ],
    angle: "-2deg",
    accent: "teams",
  },
  {
    id: "research",
    label: "Research",
    icon: "R",
    eyebrow: "MARKET VIEW",
    title: "Research, benchmarks and risk context.",
    summary:
      "Contexto de mercado, benchmarks y riesgos para fortalecer recomendaciones y escenarios.",
    browserLabel: "Research",
    browserTabs: [
      "Market scan",
      "Benchmarks",
      "Risk signals",
    ],
    actions: [
      "Escanear mercado",
      "Comparar peers",
      "Sintetizar findings",
    ],
    metrics: [
      { label: "Focus", value: "Risk View" },
      { label: "Deliverable", value: "Insight" },
      { label: "Style", value: "Fast" },
    ],
    board: "research",
    tabDetails: [
      {
        label: "Market scan",
        insight: "Senales de mercado, noticias y drivers que afectan la tesis.",
        values: ["Market", "Signal", "Trend"],
      },
      {
        label: "Benchmarks",
        insight: "Peers, referencias y rangos comparables para dar contexto al analisis.",
        values: ["Peers", "Range", "Median"],
      },
      {
        label: "Risk signals",
        insight: "Factores de riesgo que conviene monitorear antes de recomendar.",
        values: ["Risk", "Probability", "Impact"],
      },
    ],
    angle: "-5deg",
    accent: "research",
  },
];

export const experienceCards = [
  {
    eyebrow: "CURRENT ROLE",
    title: "Accenture | CFO & Enterprise Value",
    subtitle: "Strategy & Consulting Intern",
    description:
      "Analisis, research y recomendaciones estructuradas en finanzas y estrategia, con foco en claridad, rigor y materiales listos para conversacion ejecutiva.",
    tags: ["Strategy", "Finance", "Enterprise Value"],
  },
  {
    eyebrow: "VALUATION AND CASH FLOW",
    title: "Valuacion y Flujo de Fondos",
    subtitle: "From assumptions to grounded financial logic",
    description:
      "Armado y analisis de flujo de fondos, metodologias de valuacion y lectura de variables macroeconomicas para construir una mirada financiera clara.",
    tags: ["Valuation", "Cash Flow", "Macroeconomics"],
  },
  {
    eyebrow: "STRATEGY AND RISK",
    title: "Estrategia y Riesgos",
    subtitle: "Decisions under real business pressure",
    description:
      "Analisis de costos, evaluacion de riesgos financieros y toma de decisiones criticas apoyadas en escenarios reales y pensamiento estructurado.",
    tags: ["Risk Analysis", "Scenarios", "Decision Making"],
  },
  {
    eyebrow: "DIGITAL FINANCE",
    title: "Blockchain and DeFi",
    subtitle: "Professional curiosity with business framing",
    description:
      "Interes sostenido en blockchain, DeFi y nuevos modelos de infraestructura financiera desde una mirada de negocio, riesgo y adopcion.",
    tags: ["Blockchain", "DeFi", "Digital Finance"],
  },
];

export const photoCards = [
  {
    badge: "PHOTO SELECTION",
    slides: [
      {
        image: "/images/fran-photo-1.jpeg",
        title: "Perspective matters as much as precision.",
        caption: "A more personal layer to the portfolio: selective, calm and still aligned with an executive profile.",
        meta: "Patagonia | perspective and clarity",
      },
      {
        image: "/images/fran-photo-4.jpeg",
        title: "Ambition with city rhythm.",
        caption: "Energy, movement and a digital-business pace without losing professional tone.",
        meta: "Buenos Aires | after-hours energy",
      },
      {
        image: "/images/fran-photo-3.jpeg",
        title: "Clean profile, executive direction.",
        caption: "A more formal visual frame for the consulting side of the portfolio.",
        meta: "Portrait | polished profile",
      },
      {
        image: "/images/fran-photo-2.jpeg",
        title: "Professional presence, clearer signal.",
        caption: "Executive aesthetic, minimal presentation and stronger recruiter-read positioning.",
        meta: "Formal portrait | consulting presence",
      },
    ],
  },
  {
    badge: "EXECUTIVE CUT",
    slides: [
      {
        image: "/images/fran-photo-2.jpeg",
        title: "Executive presence, without overdesign.",
        caption: "The visual identity should feel premium, personal and ready for recruiter review.",
        meta: "Formal portrait | consulting ready",
      },
      {
        image: "/images/fran-photo-3.jpeg",
        title: "Professional, direct and more personal.",
        caption: "A cleaner portrait treatment for the contact-facing side of the portfolio.",
        meta: "Headshot | contact-facing",
      },
      {
        image: "/images/fran-photo-4.jpeg",
        title: "Business energy beyond the desk.",
        caption: "A portfolio can show ambition and movement without becoming too casual.",
        meta: "City lights | digital-business tone",
      },
      {
        image: "/images/fran-photo-1.jpeg",
        title: "Distance helps sharpen judgment.",
        caption: "Perspective, focus and calm execution still matter behind every spreadsheet and slide.",
        meta: "Outdoor frame | clarity and focus",
      },
    ],
  },
];

export const calendarCard = {
  eyebrow: "AVAILABILITY",
  title: "Selective availability for calls and conversations.",
  timezone: "GMT-3 | Buenos Aires",
  days: [
    ["Mon", "21"],
    ["Tue", "22"],
    ["Wed", "23"],
    ["Thu", "24"],
    ["Fri", "25"],
    ["Sat", "26"],
    ["Sun", "27"],
  ],
  events: [
    {
      type: "meeting",
      title: "Networking call",
      time: "10:00 AM - 10:30 AM",
      detail: "Consulting, finance and career conversations",
      badge: "30m",
    },
    {
      type: "focus",
      title: "Research block",
      time: "11:00 AM - 12:00 PM",
      detail: "Valuation, case prep and executive materials",
      badge: "1h",
    },
    {
      type: "availability",
      title: "Open window",
      time: "3:00 PM - 4:00 PM",
      detail: "Best slot for an intro call or quick coffee chat",
      badge: "Open",
    },
  ],
};

export const audioIntro = {
  eyebrow: "AUDIO INTRO",
  title: "Piano intro",
  subtitle: "A softer, more personal layer to the portfolio while the rest stays sharp and executive.",
  src: "/audio/fran-intro.mp3",
  durationLabel: "01:12",
  cover: "/images/fran-photo-3.jpeg",
};

export const currentPodcast = {
  eyebrow: "CURRENT PODCAST",
  title: "Current Podcast",
  episode: "Secrets of a Tech-Savvy CFO",
  subtitle: "Insights on finance leadership, technology and enterprise value.",
  metadata: "27 min • CFO Weekly",
  href:
    "https://podcasts.apple.com/us/podcast/greatest-hits-secrets-of-a-tech-savvy-cfo-with-aaron-levine/id1511978445?i=1000754437381",
  takeaways: [
    "Modern CFOs need tech fluency",
    "Finance must influence decisions",
    "Data enables enterprise value creation",
  ],
};

export const contactCards = [
  {
    title: "LinkedIn",
    eyebrow: "PROFILE",
    text: "Stay connected around consulting, finance and future opportunities.",
    href: "https://linkedin.com/in/francisco-ariel-lopez",
    label: "View profile",
    type: "linkedin",
    metric: "in",
  },
  {
    title: "Email",
    eyebrow: "DIRECT",
    text: "For networking, collaboration or conversations around enterprise value and strategy.",
    href: "mailto:franciscoariellopez22@gmail.com",
    label: "Send email",
    type: "email",
    metric: "Mail",
  },
  {
    title: "CV",
    eyebrow: "PDF",
    text: "Download the current profile snapshot for a quick recruiter read.",
    href: "/cv/Fran-CV.pdf",
    label: "Download CV",
    type: "cv",
    metric: "CV",
  },
];

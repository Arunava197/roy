import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: {
      "nav": {
        "Home": "Home",
        "About": "About",
        "Skills": "Skills",
        "Projects": "Projects",
        "Experience": "Experience",
        "Education": "Education",
        "Certifications": "Certifications",
        "Contact": "Contact"
      },
      "hero": {
        "greeting": "Hi, I am Arunava Chandan Roy",
        "role": "Business Intelligence & Data Analyst",
        "description": "I specialize in turning data into insight, strategy, and measurable decisions.",
        "download_cv": "Download CV",
        "contact_me": "Contact Me"
      },
      "voice": {
        "hero_intro": "Hi, I am Arunava Chandan Roy, a Business Intelligence and Data Analyst. I specialize in turning data into insight, strategy, and measurable decisions.",
        "global_intro": "Welcome to Arunava Chandan Roy's portfolio. I am a Business Intelligence and Data Analyst specializing in turning data into insight, strategy, and measurable decisions.",
        "lang_changed": "Language changed to English"
      },
      "section_titles": {
        "about": "About Me",
        "skills": "Technical Skills",
        "projects": "Analytical Projects",
        "experience": "Resume & Experience",
        "education": "Education",
        "certifications": "Certifications",
        "contact": "Get in Touch"
      },
      "ui": {
        "problem": "Problem Statement",
        "methodology": "Methodology",
        "impact": "Business Impact",
        "view_details": "View Details",
        "view_live": "View Project Live",
        "search": "Search by keywords, tools, or topics...",
        "all": "All"
      }
    }
  },
  bn: {
    translation: {
      "nav": {
        "Home": "হোম",
        "About": "সম্পর্কে",
        "Skills": "দক্ষতা",
        "Projects": "প্রকল্প",
        "Experience": "অভিজ্ঞতা",
        "Education": "শিক্ষা",
        "Certifications": "সার্টিফিকেশন",
        "Contact": "যোগাযোগ"
      },
      "hero": {
        "greeting": "নমস্কার, আমি অরুণাভ চন্দন রায়",
        "role": "বিজনেস ইন্টেলিজেন্স এবং ডেটা অ্যানালিস্ট",
        "description": "আমি ডেটাকে ইনসাইট, কৌশল এবং পরিমাপযোগ্য সিদ্ধান্তে পরিণত করতে পারদর্শী।",
        "download_cv": "সিভি ডাউনলোড",
        "contact_me": "যোগাযোগ করুন"
      },
      "voice": {
        "hero_intro": "নমস্কার, আমি অরুণাভ চন্দন রায়, একজন বিজনেস ইন্টেলিজেন্স এবং ডেটা অ্যানালিস্ট। আমি ডেটাকে ইনসাইট, কৌশল এবং পরিমাপযোগ্য সিদ্ধান্তে পরিণত করতে পারদর্শী।",
        "global_intro": "অরুণাভ চন্দন রায়ের পোর্টফোলিওতে আপনাকে স্বাগত। আমি একজন বিজনেস ইন্টেলিজেন্স এবং ডেটা অ্যানালিস্ট, যিনি ডেটাকে ইনসাইট, কৌশল এবং পরিমাপযোগ্য সিদ্ধান্তে পরিণত করতে পারদর্শী।",
        "lang_changed": "ভাষা বাংলায় পরিবর্তিত হয়েছে"
      },
      "section_titles": {
        "about": "আমার সম্পর্কে",
        "skills": "প্রযুক্তিগত দক্ষতা",
        "projects": "বিশ্লেষণমূলক প্রকল্প",
        "experience": "জীবনবৃত্তান্ত ও অভিজ্ঞতা",
        "education": "শিক্ষা",
        "certifications": "সার্টিফিকেশন",
        "contact": "যোগাযোগ করুন"
      },
      "ui": {
        "problem": "সমস্যা",
        "methodology": "পদ্ধতি",
        "impact": "প্রভাব",
        "view_details": "বিস্তারিত দেখুন",
        "view_live": "প্রকল্পটি সরাসরি দেখুন",
        "search": "কিওয়ার্ড বা টুল দিয়ে খুঁজুন...",
        "all": "সব"
      }
    }
  },
  hi: {
    translation: {
      "nav": {
        "Home": "होम",
        "About": "मेरे बारे में",
        "Skills": "कौशल",
        "Projects": "प्रोजेक्ट्स",
        "Experience": "अनुभव",
        "Education": "शिक्षा",
        "Certifications": "प्रमाणपत्र",
        "Contact": "संपर्क"
      },
      "hero": {
        "greeting": "नमस्ते, मैं अरुणव चंदन रॉय हूँ",
        "role": "बिजनेस इंटेलिजेंस और डेटा विश्लेषक",
        "description": "मैं डेटा को अंतर्दृष्टि, रणनीति और मापने योग्य निर्णयों में बदलने में विशेषज्ञ हूँ।",
        "download_cv": "सीवी डाउनलोड करें",
        "contact_me": "संपर्क करें"
      },
      "voice": {
        "hero_intro": "नमस्ते, मैं अरुणव चंदन रॉय हूँ, एक बिजनेस इंटेलिजेंस और डेटा विश्लेषक। मैं डेटा को अंतर्दृष्टि, रणनीति और मापने योग्य निर्णयों में बदलने में विशेषज्ञ हूँ।",
        "global_intro": "अरुणव चंदन रॉय के पोर्टफोलियो में आपका स्वागत है। मैं एक बिजनेस इंटेलिजेंस और डेटा विश्लेषक हूँ, जो डेटा को अंतर्दृष्टि, रणनीति और मापने योग्य निर्णयों में बदलने में विशेषज्ञ है।",
        "lang_changed": "भाषा हिंदी में बदल गई है"
      },
      "section_titles": {
        "about": "मेरे बारे में",
        "skills": "तकनीकी कौशल",
        "projects": "विश्लेषणात्मक परियोजनाएं",
        "experience": "रेज़्यूमे और अनुभव",
        "education": "शिक्षा",
        "certifications": "प्रमाणपत्र",
        "contact": "संपर्क करें"
      },
      "ui": {
        "problem": "समस्या",
        "methodology": "कार्यप्रणाली",
        "impact": "प्रभाव",
        "view_details": "विवरण देखें",
        "view_live": "लाइव प्रोजेक्ट देखें",
        "search": "कीवर्ड या टूल से खोजें...",
        "all": "सभी"
      }
    }
  },
  zh: {
    translation: {
      "nav": {
        "Home": "首页",
        "About": "关于",
        "Skills": "技能",
        "Projects": "项目",
        "Experience": "经验",
        "Education": "教育",
        "Certifications": "证书",
        "Contact": "联系"
      },
      "hero": {
        "greeting": "你好，我是 Arunava Chandan Roy",
        "role": "商业智能与数据分析师",
        "description": "我专注于将数据转化为洞察、策略和可衡量的决策。",
        "download_cv": "下载简历",
        "contact_me": "联系我"
      },
      "voice": {
        "hero_intro": "你好，我是 Arunava Chandan Roy，一名商业智能与数据分析师。我专注于将数据转化为洞察、策略和可衡量的决策。",
        "global_intro": "欢迎来到 Arunava Chandan Roy 的作品集。我是一名商业智能与数据分析师，专注于将数据转化为洞察、策略和可衡量的决策。",
        "lang_changed": "语言已切换为中文"
      },
      "section_titles": {
        "about": "关于我",
        "skills": "技术技能",
        "projects": "分析项目",
        "experience": "简历和经验",
        "education": "教育背景",
        "certifications": "证书",
        "contact": "保持联系"
      },
      "ui": {
        "problem": "问题陈述",
        "methodology": "方法论",
        "impact": "业务影响",
        "view_details": "查看详情",
        "view_live": "查看项目演示",
        "search": "按关键字，工具或主题搜索...",
        "all": "全部"
      }
    }
  },
  es: {
    translation: {
      "nav": {
        "Home": "Inicio",
        "About": "Sobre mí",
        "Skills": "Habilidades",
        "Projects": "Proyectos",
        "Experience": "Experiencia",
        "Education": "Educación",
        "Certifications": "Certificaciones",
        "Contact": "Contacto"
      },
      "hero": {
        "greeting": "Hola, soy Arunava Chandan Roy",
        "role": "Analista de Inteligencia de Negocios y Datos",
        "description": "Me especializo en convertir datos en conocimiento, estrategia y decisiones medibles.",
        "download_cv": "Descargar CV",
        "contact_me": "Contáctame"
      },
      "voice": {
        "hero_intro": "Hola, soy Arunava Chandan Roy, Analista de Inteligencia de Negocios y Datos. Me especializo en convertir datos en conocimiento, estrategia y decisiones medibles.",
        "global_intro": "Bienvenido al portafolio de Arunava Chandan Roy. Soy un Analista de Inteligencia de Negocios y Datos que se especializa en convertir datos en conocimiento, estrategia y decisiones medibles.",
        "lang_changed": "Idioma cambiado a español"
      },
      "section_titles": {
        "about": "Sobre mí",
        "skills": "Habilidades Técnicas",
        "projects": "Proyectos Analíticos",
        "experience": "Currículum y Experiencia",
        "education": "Educación",
        "certifications": "Certificaciones",
        "contact": "Contacto"
      },
      "ui": {
        "problem": "Problema",
        "methodology": "Metodología",
        "impact": "Impacto",
        "view_details": "Ver detalles",
        "view_live": "Ver proyecto en vivo",
        "search": "Buscar por palabras clave, herramientas...",
        "all": "Todo"
      }
    }
  },
  de: {
    translation: {
      "nav": {
        "Home": "Startseite",
        "About": "Über mich",
        "Skills": "Fähigkeiten",
        "Projects": "Projekte",
        "Experience": "Erfahrung",
        "Education": "Bildung",
        "Certifications": "Zertifikate",
        "Contact": "Kontakt"
      },
      "hero": {
        "greeting": "Hallo, ich bin Arunava Chandan Roy",
        "role": "Business Intelligence & Datenanalyst",
        "description": "Ich bin darauf spezialisiert, Daten in Erkenntnisse, Strategien und messbare Entscheidungen umzuwandeln.",
        "download_cv": "Lebenslauf herunterladen",
        "contact_me": "Kontaktieren Sie mich"
      },
      "voice": {
        "hero_intro": "Hallo, ich bin Arunava Chandan Roy, ein Business Intelligence und Datenanalyst. Ich bin darauf spezialisiert, Daten in Erkenntnisse, Strategien und messbare Entscheidungen umzuwandeln.",
        "global_intro": "Willkommen im Portfolio von Arunava Chandan Roy. Ich bin ein Business Intelligence und Datenanalyst, der sich darauf spezialisiert hat, Daten in Erkenntnisse, Strategien und messbare Entscheidungen umzuwandeln.",
        "lang_changed": "Sprache auf Deutsch geändert"
      },
      "section_titles": {
        "about": "Über mich",
        "skills": "Technische Fähigkeiten",
        "projects": "Analytische Projekte",
        "experience": "Lebenslauf und Erfahrung",
        "education": "Bildung",
        "certifications": "Zertifikate",
        "contact": "Kontakt aufnehmen"
      },
      "ui": {
        "problem": "Problem",
        "methodology": "Methodik",
        "impact": "Auswirkungen",
        "view_details": "Details anzeigen",
        "view_live": "Live-Projekt anzeigen",
        "search": "Suche nach Schlüsselwörtern oder Themen...",
        "all": "Alle"
      }
    }
  },
  ru: {
    translation: {
      "nav": {
        "Home": "Главная",
        "About": "Обо мне",
        "Skills": "Навыки",
        "Projects": "Проекты",
        "Experience": "Опыт",
        "Education": "Образование",
        "Certifications": "Сертификаты",
        "Contact": "Контакты"
      },
      "hero": {
        "greeting": "Здравствуйте, я Арунава Чандан Рой",
        "role": "Аналитик бизнес-аналитики и данных",
        "description": "Я специализируюсь на превращении данных в идеи, стратегии и измеримые решения.",
        "download_cv": "Скачать резюме",
        "contact_me": "Связаться со мной"
      },
      "voice": {
        "hero_intro": "Здравствуйте, я Арунава Чандан Рой, аналитик бизнес-аналитики и данных. Я специализируюсь на превращении данных в идеи, стратегии и измеримые решения.",
        "global_intro": "Добро пожаловать в портфолио Арунава Чандан Рой. Я аналитик бизнес-аналитики и данных, специализирующийся на превращении данных в идеи, стратегии и измеримые решения.",
        "lang_changed": "Язык изменен на русский"
      },
      "section_titles": {
        "about": "Обо мне",
        "skills": "Технические навыки",
        "projects": "Аналитические проекты",
        "experience": "Резюме и опыт",
        "education": "Образование",
        "certifications": "Сертификаты",
        "contact": "Связаться со мной"
      },
      "ui": {
        "problem": "Проблема",
        "methodology": "Методология",
        "impact": "Влияние",
        "view_details": "Подробнее",
        "view_live": "Смотреть проект",
        "search": "Поиск по ключевым словам или инструментам...",
        "all": "Все"
      }
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'en', // default language
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false // react already safes from xss
    }
  });

export default i18n;

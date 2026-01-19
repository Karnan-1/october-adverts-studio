import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import LanguageDetector from 'i18next-browser-languagedetector'

const resources = {
  en: {
    translation: {
      'welcome': 'Welcome to October Adverts',
      'tagline': 'Brand Experience Agency',
      'subtitle': 'End-to-End Marketing Solutions',
      'description': 'Transform your brand with comprehensive marketing solutions including brand strategy, digital marketing, content creation, and experiential campaigns. Your partner in building memorable brand experiences.',
      'services': 'Our Services',
      'service1': 'Brand Strategy',
      'service2': 'Digital Marketing',
      'service3': 'Content Creation',
      'service4': 'Experiential Marketing',
      'contact': 'Contact Us',
      'language': 'Language'
    }
  },
  es: {
    translation: {
      'welcome': 'Bienvenido a October Adverts',
      'tagline': 'Agencia de Experiencia de Marca',
      'subtitle': 'Soluciones de Marketing Integrales',
      'description': 'Transforme su marca con soluciones de marketing integrales que incluyen estrategia de marca, marketing digital, creación de contenido y campañas experienciales. Su socio en la creación de experiencias de marca memorables.',
      'services': 'Nuestros Servicios',
      'service1': 'Estrategia de Marca',
      'service2': 'Marketing Digital',
      'service3': 'Creación de Contenido',
      'service4': 'Marketing Experiencial',
      'contact': 'Contáctenos',
      'language': 'Idioma'
    }
  },
  fr: {
    translation: {
      'welcome': 'Bienvenue chez October Adverts',
      'tagline': 'Agence d\'Expérience de Marque',
      'subtitle': 'Solutions Marketing Complètes',
      'description': 'Transformez votre marque avec des solutions marketing complètes incluant la stratégie de marque, le marketing digital, la création de contenu et les campagnes expérientielles. Votre partenaire dans la création d\'expériences de marque mémorables.',
      'services': 'Nos Services',
      'service1': 'Stratégie de Marque',
      'service2': 'Marketing Digital',
      'service3': 'Création de Contenu',
      'service4': 'Marketing Expérientiel',
      'contact': 'Contactez-nous',
      'language': 'Langue'
    }
  },
  de: {
    translation: {
      'welcome': 'Willkommen bei October Adverts',
      'tagline': 'Markenerlebnis-Agentur',
      'subtitle': 'End-to-End Marketing-Lösungen',
      'description': 'Transformieren Sie Ihre Marke mit umfassenden Marketing-Lösungen, einschließlich Markenstrategie, digitalem Marketing, Content-Erstellung und Erlebnis-Kampagnen. Ihr Partner beim Aufbau unvergesslicher Markenerlebnisse.',
      'services': 'Unsere Dienstleistungen',
      'service1': 'Markenstrategie',
      'service2': 'Digitales Marketing',
      'service3': 'Content-Erstellung',
      'service4': 'Erlebnis-Marketing',
      'contact': 'Kontaktieren Sie uns',
      'language': 'Sprache'
    }
  },
  it: {
    translation: {
      'welcome': 'Benvenuti a October Adverts',
      'tagline': 'Agenzia di Esperienza del Brand',
      'subtitle': 'Soluzioni di Marketing Complete',
      'description': 'Trasforma il tuo brand con soluzioni di marketing complete tra cui strategia del brand, marketing digitale, creazione di contenuti e campagne esperienziali. Il tuo partner nella creazione di esperienze di marca memorabili.',
      'services': 'I Nostri Servizi',
      'service1': 'Strategia del Brand',
      'service2': 'Marketing Digitale',
      'service3': 'Creazione di Contenuti',
      'service4': 'Marketing Esperienziale',
      'contact': 'Contattaci',
      'language': 'Lingua'
    }
  },
  pt: {
    translation: {
      'welcome': 'Bem-vindo ao October Adverts',
      'tagline': 'Agência de Experiência de Marca',
      'subtitle': 'Soluções de Marketing Completas',
      'description': 'Transforme sua marca com soluções de marketing abrangentes, incluindo estratégia de marca, marketing digital, criação de conteúdo e campanhas experienciais. Seu parceiro na construção de experiências de marca memoráveis.',
      'services': 'Nossos Serviços',
      'service1': 'Estratégia de Marca',
      'service2': 'Marketing Digital',
      'service3': 'Criação de Conteúdo',
      'service4': 'Marketing Experiencial',
      'contact': 'Contate-nos',
      'language': 'Idioma'
    }
  },
  hi: {
    translation: {
      'welcome': 'October Adverts में आपका स्वागत है',
      'tagline': 'ब्रांड अनुभव एजेंसी',
      'subtitle': 'संपूर्ण मार्केटिंग समाधान',
      'description': 'ब्रांड रणनीति, डिजिटल मार्केटिंग, सामग्री निर्माण और अनुभवात्मक अभियानों सहित व्यापक मार्केटिंग समाधानों के साथ अपने ब्रांड को रूपांतरित करें। यादगार ब्रांड अनुभव बनाने में आपका साथी।',
      'services': 'हमारी सेवाएं',
      'service1': 'ब्रांड रणनीति',
      'service2': 'डिजिटल मार्केटिंग',
      'service3': 'सामग्री निर्माण',
      'service4': 'अनुभवात्मक मार्केटिंग',
      'contact': 'संपर्क करें',
      'language': 'भाषा'
    }
  },
  zh: {
    translation: {
      'welcome': '欢迎来到 October Adverts',
      'tagline': '品牌体验机构',
      'subtitle': '端到端营销解决方案',
      'description': '通过全面的营销解决方案（包括品牌战略、数字营销、内容创作和体验式营销活动）改变您的品牌。您在打造令人难忘的品牌体验方面的合作伙伴。',
      'services': '我们的服务',
      'service1': '品牌战略',
      'service2': '数字营销',
      'service3': '内容创作',
      'service4': '体验式营销',
      'contact': '联系我们',
      'language': '语言'
    }
  },
  ja: {
    translation: {
      'welcome': 'October Advertsへようこそ',
      'tagline': 'ブランドエクスペリエンスエージェンシー',
      'subtitle': 'エンドツーエンドのマーケティングソリューション',
      'description': 'ブランド戦略、デジタルマーケティング、コンテンツ制作、体験型キャンペーンを含む包括的なマーケティングソリューションでブランドを変革します。記憶に残るブランド体験を構築するパートナー。',
      'services': '私たちのサービス',
      'service1': 'ブランド戦略',
      'service2': 'デジタルマーケティング',
      'service3': 'コンテンツ制作',
      'service4': '体験型マーケティング',
      'contact': 'お問い合わせ',
      'language': '言語'
    }
  },
  ar: {
    translation: {
      'welcome': 'مرحباً بك في October Adverts',
      'tagline': 'وكالة تجربة العلامة التجارية',
      'subtitle': 'حلول تسويقية شاملة',
      'description': 'حوّل علامتك التجارية من خلال حلول تسويقية شاملة تشمل استراتيجية العلامة التجارية والتسويق الرقمي وإنشاء المحتوى والحملات التجريبية. شريكك في بناء تجارب علامة تجارية لا تُنسى.',
      'services': 'خدماتنا',
      'service1': 'استراتيجية العلامة التجارية',
      'service2': 'التسويق الرقمي',
      'service3': 'إنشاء المحتوى',
      'service4': 'التسويق التجريبي',
      'contact': 'اتصل بنا',
      'language': 'اللغة'
    }
  }
}

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    detection: {
      order: ['navigator', 'htmlTag', 'path', 'subdomain'],
      caches: ['localStorage', 'cookie']
    },
    interpolation: {
      escapeValue: false
    }
  })

export default i18n

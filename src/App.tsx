/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, FormEvent, FC } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Trophy, 
  Calendar, 
  RefreshCcw, 
  AlertCircle, 
  Search, 
  ChevronRight, 
  Home, 
  Star, 
  LayoutList, 
  Newspaper, 
  Users, 
  Settings,
  Menu,
  X,
  Plus,
  Check,
  Send
} from "lucide-react";

// --- Types ---

interface Team {
  id: number;
  name: string;
  shortName: string;
  tla: string;
  crest: string;
}

interface Score {
  fullTime: { home: number | null; away: number | null };
}

interface Competition {
  id: number;
  name: string;
  code: string;
  type: string;
  emblem: string;
}

interface Match {
  id: number;
  utcDate: string;
  status: string;
  matchday: number;
  homeTeam: Team;
  awayTeam: Team;
  score: Score;
  competition: Competition;
}

interface StandingEntry {
  position: number;
  team: Team;
  playedGames: number;
  won: number;
  draw: number;
  lost: number;
  points: number;
  goalsFor: number;
  goalsAgainst: number;
  goalDifference: number;
}

interface Article {
  id: string;
  title: string;
  image: string;
  description: string;
  content: string;
  date: string;
  category: string;
  link?: string;
  source?: string;
  isAd?: boolean;
}

type Page = "home" | "news" | "matches" | "teams" | "tournaments" | "admin" | "about" | "privacy" | "terms" | "contact";
type Language = "en" | "es" | "fr" | "pt";

const TRANSLATIONS = {
  en: {
    home: "Home",
    news: "News",
    matches: "Matches",
    teams: "Teams",
    tournaments: "Tournaments",
    admin: "Admin",
    about: "About Us",
    privacy: "Privacy Policy",
    terms: "Terms of Service",
    contact: "Contact",
    liveNews: "Live News",
    latestNews: "Latest News",
    sponsored: "Sponsored Content",
    readMore: "Read More",
    liveMatches: "Live Matches",
    allLeagues: "All Leagues",
    topTeams: "Top Teams",
    selectTeam: "Select a team to view squad",
    majorLeagues: "Major Leagues",
    standings: "League Standings",
    adminPanel: "Admin Panel",
    publish: "Publish Article",
    ourStory: "Our Story",
    legal: "Legal",
    support: "Support",
    contactUs: "Contact Us",
    name: "Your Name",
    email: "Email Address",
    message: "Message",
    send: "Send Message",
    sent: "Message Sent!",
    agenda: "Agenda",
    realtime: "Real-time",
    winBig: "Win Big with GoalStream Premium",
    learnMore: "Learn More",
    allRights: "All Rights Reserved",
    featuredStory: "Featured Story",
    description: "The ultimate destination for football fans. Real-time scores, breaking news, and in-depth analysis from the world of football.",
    loading: "Loading...",
    error: "Error",
    noMatches: "No matches scheduled for today.",
    refresh: "Refresh",
    pos: "Pos",
    club: "Club",
    mp: "MP",
    gd: "GD",
    pts: "Pts",
    table: "Table",
    giants: "Global Giants",
    elite: "Elite",
    competitions: "Competitions"
  },
  es: {
    home: "Inicio",
    news: "Noticias",
    matches: "Partidos",
    teams: "Equipos",
    tournaments: "Torneos",
    admin: "Admin",
    about: "Sobre Nosotros",
    privacy: "Privacidad",
    terms: "Términos",
    contact: "Contacto",
    liveNews: "Noticias en Vivo",
    latestNews: "Últimas Noticias",
    sponsored: "Contenido Patrocinado",
    readMore: "Leer Más",
    liveMatches: "Partidos en Vivo",
    allLeagues: "Todas las Ligas",
    topTeams: "Mejores Equipos",
    selectTeam: "Selecciona un equipo para ver la plantilla",
    majorLeagues: "Grandes Ligas",
    standings: "Clasificación",
    adminPanel: "Panel de Admin",
    publish: "Publicar Artículo",
    ourStory: "Nuestra Historia",
    legal: "Legal",
    support: "Soporte",
    contactUs: "Contáctanos",
    name: "Tu Nombre",
    email: "Correo Electrónico",
    message: "Mensaje",
    send: "Enviar Mensaje",
    sent: "¡Mensaje Enviado!",
    agenda: "Agenda",
    realtime: "Tiempo Real",
    winBig: "Gana en Grande con GoalStream Premium",
    learnMore: "Saber Más",
    allRights: "Todos los derechos reservados",
    featuredStory: "Historia Destacada",
    description: "El destino definitivo para los aficionados al fútbol. Resultados en tiempo real, noticias de última hora y análisis profundo.",
    loading: "Cargando...",
    error: "Error",
    noMatches: "No hay partidos programados para hoy.",
    refresh: "Actualizar",
    pos: "Pos",
    club: "Club",
    mp: "PJ",
    gd: "DG",
    pts: "Pts",
    table: "Tabla",
    giants: "Gigantes Globales",
    elite: "Élite",
    competitions: "Competiciones"
  },
  fr: {
    home: "Accueil",
    news: "Actualités",
    matches: "Matchs",
    teams: "Équipes",
    tournaments: "Compétitions",
    admin: "Admin",
    about: "À Propos",
    privacy: "Confidentialité",
    terms: "Conditions",
    contact: "Contact",
    liveNews: "Infos en Direct",
    latestNews: "Dernières Infos",
    sponsored: "Contenu Sponsorisé",
    readMore: "Lire la Suite",
    liveMatches: "Matchs en Direct",
    allLeagues: "Toutes les Ligues",
    topTeams: "Top Équipes",
    selectTeam: "Sélectionnez une équipe pour voir l'effectif",
    majorLeagues: "Grandes Ligues",
    standings: "Classement",
    adminPanel: "Panneau Admin",
    publish: "Publier l'Article",
    ourStory: "Notre Histoire",
    legal: "Légal",
    support: "Support",
    contactUs: "Contactez-nous",
    name: "Votre Nom",
    email: "Adresse Email",
    message: "Message",
    send: "Envoyer le Message",
    sent: "Message Envoyé !",
    agenda: "Agenda",
    realtime: "Temps Réel",
    winBig: "Gagnez Gros avec GoalStream Premium",
    learnMore: "En Savoir Plus",
    allRights: "Tous droits réservés",
    featuredStory: "À la Une",
    description: "La destination ultime pour les fans de football. Scores en temps réel, infos de dernière minute et analyses approfondies.",
    loading: "Chargement...",
    error: "Erreur",
    noMatches: "Aucun match prévu aujourd'hui.",
    refresh: "Actualiser",
    pos: "Pos",
    club: "Club",
    mp: "MJ",
    gd: "DB",
    pts: "Pts",
    table: "Tableau",
    giants: "Géants Mondiaux",
    elite: "Élite",
    competitions: "Compétitions"
  },
  pt: {
    home: "Início",
    news: "Notícias",
    matches: "Jogos",
    teams: "Equipes",
    tournaments: "Competições",
    admin: "Admin",
    about: "Sobre Nós",
    privacy: "Privacidade",
    terms: "Termos",
    contact: "Contato",
    liveNews: "Notícias ao Vivo",
    latestNews: "Últimas Notícias",
    sponsored: "Conteúdo Patrocinado",
    readMore: "Ler Mais",
    liveMatches: "Jogos ao Vivo",
    allLeagues: "Todas as Ligas",
    topTeams: "Melhores Equipes",
    selectTeam: "Selecione uma equipe para ver o elenco",
    majorLeagues: "Grandes Ligas",
    standings: "Classificação",
    adminPanel: "Painel Admin",
    publish: "Publicar Artigo",
    ourStory: "Nossa História",
    legal: "Legal",
    support: "Suporte",
    contactUs: "Contate-nos",
    name: "Seu Nome",
    email: "Endereço de E-mail",
    message: "Mensagem",
    send: "Enviar Mensagem",
    sent: "Mensagem Enviada!",
    agenda: "Agenda",
    realtime: "Tempo Real",
    winBig: "Ganhe Grande com GoalStream Premium",
    learnMore: "Saber Mais",
    allRights: "Todos os direitos reservados",
    featuredStory: "Destaque",
    description: "O destino final para os fãs de futebol. Resultados em tempo real, notícias de última hora e análises profundas.",
    loading: "Carregando...",
    error: "Erro",
    noMatches: "Nenhum jogo agendado para hoje.",
    refresh: "Atualizar",
    pos: "Pos",
    club: "Clube",
    mp: "J",
    gd: "SG",
    pts: "Pts",
    table: "Tabela",
    giants: "Gigantes Globais",
    elite: "Elite",
    competitions: "Competições"
  }
};

// --- Constants ---

const TOP_TEAMS = [
  { id: 86, name: "Real Madrid", crest: "https://crests.football-data.org/86.png" },
  { id: 81, name: "FC Barcelona", crest: "https://crests.football-data.org/81.svg" },
  { id: 64, name: "Liverpool FC", crest: "https://crests.football-data.org/64.png" },
  { id: 65, name: "Manchester City", crest: "https://crests.football-data.org/65.png" },
  { id: 57, name: "Arsenal FC", crest: "https://crests.football-data.org/57.png" },
  { id: 98, name: "AC Milan", crest: "https://crests.football-data.org/98.svg" },
  { id: 108, name: "FC Internazionale Milano", crest: "https://crests.football-data.org/108.png" },
];

const TOURNAMENTS = [
  { id: "CL", name: "Champions League", icon: "🏆" },
  { id: "PL", name: "Premier League", icon: "🇬🇧" },
  { id: "PD", name: "La Liga", icon: "🇪🇸" },
  { id: "BL1", name: "Bundesliga", icon: "🇩🇪" },
  { id: "SA", name: "Serie A", icon: "🇮🇹" },
  { id: "FL1", name: "Ligue 1", icon: "🇫🇷" },
  { id: "DED", name: "Eredivisie", icon: "🇳🇱" },
  { id: "PPL", name: "Primeira Liga", icon: "🇵🇹" },
  { id: "BSA", name: "Brasileirão", icon: "🇧🇷" },
  { id: "ASL", name: "Liga Argentina", icon: "🇦🇷" },
  { id: "MLS", name: "MLS", icon: "🇺🇸" },
  { id: "EL", name: "Europa League", icon: "🇪🇺" },
  { id: "WC", name: "World Cup", icon: "🌍" },
];

const RSS_FEEDS = [
  { name: "BBC Sport", url: "http://feeds.bbci.co.uk/sport/football/rss.xml" },
  { name: "Sky Sports", url: "https://www.skysports.com/rss/12040" },
  { name: "ESPN", url: "https://www.espn.com/espn/rss/soccer/news" }
];

const INITIAL_NEWS: Article[] = [
  {
    id: "1",
    title: "The Rise of a New Era: Football's Next Superstars",
    image: "https://picsum.photos/seed/football1/1200/600",
    description: "As the legends move on, a new generation of talent is taking the world stage by storm.",
    content: "Full content about the new generation...",
    date: new Date().toISOString(),
    category: "Analysis"
  },
  {
    id: "2",
    title: "Transfer Window: Top 10 Rumors You Need to Know",
    image: "https://picsum.photos/seed/football2/800/500",
    description: "The summer window is heating up with massive moves being discussed across Europe.",
    content: "Details about transfers...",
    date: new Date().toISOString(),
    category: "Transfers"
  },
  {
    id: "3",
    title: "Tactical Breakdown: How the Champions Won it All",
    image: "https://picsum.photos/seed/football3/800/500",
    description: "A deep dive into the tactical innovations that defined this season's success.",
    content: "Tactical analysis...",
    date: new Date().toISOString(),
    category: "Tactics"
  }
];

// --- Components ---

const Skeleton = ({ className }: { className?: string }) => (
  <div className={`bg-gray-100 animate-pulse rounded-xl ${className}`} />
);

const MatchSkeleton = () => (
  <div className="bg-white border border-gray-100 p-6 rounded-2xl flex items-center justify-between gap-4">
    <div className="flex-1 flex flex-col items-center gap-3">
      <Skeleton className="w-12 h-12 rounded-full" />
      <Skeleton className="w-24 h-4" />
    </div>
    <div className="flex flex-col items-center gap-2">
      <Skeleton className="w-20 h-8" />
      <Skeleton className="w-12 h-3" />
    </div>
    <div className="flex-1 flex flex-col items-center gap-3">
      <Skeleton className="w-12 h-12 rounded-full" />
      <Skeleton className="w-24 h-4" />
    </div>
  </div>
);

const NewsSkeleton = () => (
  <div className="flex flex-col md:flex-row gap-6 bg-white p-4 rounded-2xl border border-gray-50">
    <Skeleton className="w-full md:w-72 h-48 shrink-0" />
    <div className="flex-1 space-y-4 py-2">
      <Skeleton className="w-20 h-4" />
      <Skeleton className="w-full h-8" />
      <div className="space-y-2">
        <Skeleton className="w-full h-4" />
        <Skeleton className="w-3/4 h-4" />
      </div>
    </div>
  </div>
);

const AdCard: FC<{ className?: string }> = ({ className }) => (
  <div className={`bg-gray-50 border-2 border-dashed border-gray-200 rounded-3xl p-8 flex flex-col items-center justify-center text-center gap-4 min-h-[200px] ${className}`}>
    <span className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-300">Sponsored Content</span>
    <div className="bg-white p-4 rounded-xl premium-shadow">
      <Trophy className="w-8 h-8 text-goal-accent mb-2 mx-auto" />
      <p className="text-sm font-black uppercase tracking-tighter">Win Big with GoalStream Premium</p>
    </div>
    <button className="text-[10px] font-black uppercase tracking-widest bg-black text-white px-4 py-2 rounded-full hover:bg-goal-accent hover:text-black transition-all">
      Learn More
    </button>
  </div>
);

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.21, 0.47, 0.32, 0.98]
    }
  }
};

export default function App() {
  const [activePage, setActivePage] = useState<Page>("home");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [matches, setMatches] = useState<Match[]>([]);
  const [standings, setStandings] = useState<{ [key: string]: StandingEntry[] }>({});
  const [news, setNews] = useState<Article[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedLeague, setSelectedLeague] = useState<string | null>(null);
  const [favorites, setFavorites] = useState<string[]>(() => {
    const saved = localStorage.getItem("goalstream_favorites");
    return saved ? JSON.parse(saved) : ["PL", "CL"];
  });
  const [matchFilter, setMatchFilter] = useState<string>("ALL");
  const [contactForm, setContactForm] = useState({ name: "", email: "", message: "" });
  const [contactStatus, setContactStatus] = useState<"idle" | "sending" | "sent">("idle");
  const [language, setLanguage] = useState<Language>(() => {
    const saved = localStorage.getItem("goalstream_lang");
    if (saved && ["en", "es", "fr", "pt"].includes(saved)) return saved as Language;
    
    const browserLang = navigator.language.slice(0, 2);
    return ["en", "es", "fr", "pt"].includes(browserLang) ? (browserLang as Language) : "en";
  });

  const t = (key: keyof typeof TRANSLATIONS.en) => {
    return TRANSLATIONS[language][key] || TRANSLATIONS.en[key];
  };

  const handleLanguageChange = (lang: Language) => {
    setLanguage(lang);
    localStorage.setItem("goalstream_lang", lang);
  };

  // --- Data Fetching ---

  useEffect(() => {
    const fetchAllRSS = async () => {
      setLoading(true);
      try {
        const feedPromises = RSS_FEEDS.map(feed => 
          fetch(`https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(feed.url)}`)
            .then(res => res.json())
            .then(data => (data.items || []).map((item: any) => ({
              id: item.guid || item.link,
              title: item.title,
              image: item.thumbnail || item.enclosure?.link || `https://picsum.photos/seed/${item.title.length}/800/500`,
              description: item.description?.replace(/<[^>]*>?/gm, '').slice(0, 150) + '...',
              content: item.content || item.description,
              date: item.pubDate,
              category: "Live News",
              link: item.link,
              source: feed.name
            })))
        );

        const allFeeds = await Promise.all(feedPromises);
        const combined = allFeeds.flat();
        
        // Remove duplicates by title
        const unique = combined.filter((v, i, a) => 
          a.findIndex(t => t.title === v.title) === i
        );

        // Sort by date
        const sorted = unique.sort((a, b) => 
          new Date(b.date).getTime() - new Date(a.date).getTime()
        );

        // Inject Ads every 4 items
        const withAds: Article[] = [];
        sorted.forEach((item, index) => {
          withAds.push(item);
          if ((index + 1) % 4 === 0) {
            withAds.push({
              id: `ad-${index}`,
              title: "Ad",
              image: "",
              description: "",
              content: "",
              date: new Date().toISOString(),
              category: "Ad",
              isAd: true
            });
          }
        });

        setNews(withAds);
      } catch (err) {
        console.error("RSS Fetch Error:", err);
        // Fallback to local news if RSS fails
        const storedNews = localStorage.getItem("goalstream_news");
        if (storedNews) {
          setNews(JSON.parse(storedNews));
        } else {
          setNews(INITIAL_NEWS);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchAllRSS();
  }, []);

  const fetchMatches = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/football/matches");
      if (!response.ok) throw new Error("Failed to fetch matches");
      const data = await response.json();
      setMatches(data.matches || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error fetching matches");
    } finally {
      setLoading(false);
    }
  };

  const fetchStandings = async (leagueId: string) => {
    if (standings[leagueId]) return;
    setLoading(true);
    try {
      const response = await fetch(`/api/football/competitions/${leagueId}/standings`);
      if (!response.ok) throw new Error("Failed to fetch standings");
      const data = await response.json();
      const totalStandings = data.standings?.find((s: any) => s.type === "TOTAL");
      setStandings(prev => ({ ...prev, [leagueId]: totalStandings?.table || [] }));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error fetching standings");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (activePage === "matches" || activePage === "home") fetchMatches();
  }, [activePage]);

  // --- Handlers ---

  const handleAddArticle = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const newArticle: Article = {
      id: Date.now().toString(),
      title: formData.get("title") as string,
      image: formData.get("image") as string,
      description: formData.get("description") as string,
      content: formData.get("content") as string,
      date: new Date().toISOString(),
      category: "News"
    };
    const updatedNews = [newArticle, ...news];
    setNews(updatedNews);
    localStorage.setItem("goalstream_news", JSON.stringify(updatedNews));
    setActivePage("news");
  };

  // --- Render Helpers ---

  const LanguageSwitcher = () => (
    <div className="flex items-center gap-1 bg-gray-50 p-1 rounded-xl border border-gray-100">
      {(["en", "es", "fr", "pt"] as Language[]).map((lang) => (
        <button
          key={lang}
          onClick={() => handleLanguageChange(lang)}
          className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase transition-all ${
            language === lang 
              ? "bg-black text-white shadow-lg shadow-black/10" 
              : "text-gray-400 hover:text-black hover:bg-gray-100"
          }`}
        >
          {lang === "en" && "🇬🇧"}
          {lang === "es" && "🇪🇸"}
          {lang === "fr" && "🇫🇷"}
          {lang === "pt" && "🇵🇹"}
          <span className="ml-1">{lang}</span>
        </button>
      ))}
    </div>
  );

  const NavItem = ({ page, label, icon: Icon }: { page: Page; label: string; icon: any }) => (
    <button
      onClick={() => {
        setActivePage(page);
        setIsMenuOpen(false);
      }}
      className={`relative flex items-center gap-2 px-4 py-6 text-xs font-black uppercase tracking-widest transition-all ${
        activePage === page 
          ? "text-black" 
          : "text-gray-400 hover:text-black"
      }`}
    >
      <Icon className="w-4 h-4" />
      {label}
      {activePage === page && (
        <motion.div 
          layoutId="nav-underline"
          className="absolute bottom-0 left-0 right-0 h-1 bg-goal-accent"
        />
      )}
    </button>
  );

  const renderHome = () => (
    <div className="space-y-20 pb-32">
      {/* Hero Section */}
      <section 
        className="relative h-[75vh] min-h-[500px] overflow-hidden group cursor-pointer" 
        onClick={() => news[0]?.link ? window.open(news[0].link, '_blank') : setActivePage("news")}
      >
        <img 
          src={news[0]?.image} 
          alt={news[0]?.title} 
          className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
        <div className="absolute bottom-0 left-0 p-8 md:p-20 max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="flex items-center gap-3 mb-6">
              <span className="bg-goal-accent text-black text-[10px] font-black uppercase px-3 py-1.5 inline-block tracking-widest rounded-sm">{t("featuredStory")}</span>
              {news[0]?.source && (
                <span className="text-white/60 text-[10px] font-black uppercase tracking-widest border border-white/20 px-3 py-1.5 rounded-sm">
                  Source: {news[0].source}
                </span>
              )}
            </div>
            <h2 className="text-4xl md:text-7xl font-black text-white leading-[1.1] mb-6 tracking-tighter">
              {news[0]?.title}
            </h2>
            <p className="text-gray-300 text-xl md:text-2xl font-medium line-clamp-2 max-w-2xl opacity-90">
              {news[0]?.description}
            </p>
          </motion.div>
        </div>
      </section>

      {/* News Grid */}
      <section className="max-w-screen-xl mx-auto px-6">
        <div className="flex items-end justify-between mb-12 border-b border-gray-100 pb-6">
          <div>
            <span className="text-goal-accent font-black uppercase text-[10px] tracking-[0.2em] mb-2 block">{t("realtime")}</span>
            <h3 className="text-4xl font-black uppercase tracking-tighter">{t("latestNews")}</h3>
          </div>
          <button onClick={() => setActivePage("news")} className="group text-sm font-black uppercase tracking-widest text-gray-400 hover:text-black flex items-center gap-2 transition-all">
            {t("learnMore")} <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
        
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10"
        >
          {news.slice(1, 7).map((article) => (
            article.isAd ? (
              <AdCard key={article.id} />
            ) : (
              <motion.div 
                key={article.id}
                variants={itemVariants}
                className="group bg-white rounded-2xl overflow-hidden premium-shadow hover:premium-shadow-hover transition-all duration-500 cursor-pointer flex flex-col"
                onClick={() => article.link ? window.open(article.link, '_blank') : setActivePage("news")}
              >
                <div className="news-card-image-container">
                  <img src={article.image} alt={article.title} className="news-card-image" referrerPolicy="no-referrer" />
                  <div className="absolute top-4 left-4 flex flex-col gap-2">
                    <span className="bg-white/90 backdrop-blur-md text-black text-[10px] font-black uppercase px-2 py-1 rounded-sm shadow-sm">
                      {article.category}
                    </span>
                    {article.source && (
                      <span className="bg-black text-white text-[8px] font-black uppercase px-2 py-1 rounded-sm shadow-sm w-fit">
                        {article.source}
                      </span>
                    )}
                  </div>
                </div>
                <div className="p-8 flex-1 flex flex-col">
                  <h4 className="text-2xl font-black mb-4 leading-tight group-hover:text-gray-700 transition-colors">
                    {article.title}
                  </h4>
                  <p className="text-gray-500 text-base line-clamp-2 mb-6 flex-1 leading-relaxed">
                    {article.description}
                  </p>
                  <div className="flex items-center justify-between pt-6 border-t border-gray-50">
                    <span className="text-[10px] font-black uppercase text-gray-300 tracking-widest">
                      {new Date(article.date).toLocaleDateString(language, { month: 'short', day: 'numeric' })}
                    </span>
                    <span className="text-goal-accent group-hover:translate-x-1 transition-transform">
                      <ChevronRight className="w-5 h-5" />
                    </span>
                  </div>
                </div>
              </motion.div>
            )
          ))}
        </motion.div>
      </section>

      <section className="max-w-screen-xl mx-auto px-6">
        <div className="bg-[#16a34a] p-5 rounded-2xl text-white font-black text-center mb-6 uppercase tracking-widest shadow-lg shadow-green-600/20">
          {t("agenda")} - {new Date().toLocaleDateString(language, { day: 'numeric', month: 'long', year: 'numeric' })}
        </div>
        
        <div className="bg-white rounded-[2.5rem] premium-shadow border border-gray-50 overflow-hidden">
          <div className="divide-y divide-gray-100">
            {loading && !matches.length ? (
              [1, 2, 3, 4, 5].map(i => (
                <div key={i} className="flex items-center gap-6 p-6">
                  <Skeleton className="w-16 h-6" />
                  <div className="flex-1 flex items-center gap-4">
                    <Skeleton className="w-8 h-8 rounded-full" />
                    <div className="flex-1 space-y-2">
                      <Skeleton className="w-24 h-3" />
                      <Skeleton className="w-48 h-4" />
                    </div>
                  </div>
                </div>
              ))
            ) : matches.length > 0 ? (
              matches.slice(0, 10).map((match) => {
                const isLive = match.status === 'LIVE' || match.status === 'IN_PLAY' || match.status === 'PAUSED';
                const isFinished = match.status === 'FINISHED';
                
                return (
                  <div 
                    key={match.id} 
                    className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-8 p-6 hover:bg-gray-50 transition-colors group cursor-pointer"
                    onClick={() => setActivePage("matches")}
                  >
                    {/* Time & Status */}
                    <div className="flex items-center gap-4 sm:w-32 shrink-0">
                      <div className="font-black text-lg text-black">
                        {new Date(match.utcDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })}
                      </div>
                      <div className="sm:hidden ml-auto">
                        {isLive ? (
                          <span className="bg-red-500 text-white text-[8px] font-black uppercase px-2 py-1 rounded-full animate-pulse">LIVE</span>
                        ) : isFinished ? (
                          <span className="bg-gray-200 text-gray-500 text-[8px] font-black uppercase px-2 py-1 rounded-full">FT</span>
                        ) : (
                          <span className="bg-gray-100 text-gray-400 text-[8px] font-black uppercase px-2 py-1 rounded-full">NS</span>
                        )}
                      </div>
                    </div>

                    {/* Competition & Teams */}
                    <div className="flex-1 flex items-center gap-4">
                      <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center p-2 shrink-0">
                        <img src={match.competition.emblem} alt="" className="w-full h-full object-contain" referrerPolicy="no-referrer" />
                      </div>
                      <div className="flex flex-col flex-1">
                        <span className="text-[10px] font-black uppercase text-gray-400 tracking-widest leading-none mb-2">
                          {match.competition.name}
                        </span>
                        <div className="flex items-center gap-2 sm:gap-4">
                          <div className="flex items-center gap-2 flex-1 justify-end sm:justify-start">
                            <span className="font-bold text-sm uppercase tracking-tight text-right sm:text-left">
                              {match.homeTeam.shortName || match.homeTeam.name}
                            </span>
                            <img 
                              src={match.homeTeam.crest || "https://crests.football-data.org/placeholder.png"} 
                              alt="" 
                              className="w-5 h-5 object-contain" 
                              referrerPolicy="no-referrer" 
                            />
                          </div>
                          <span className="text-gray-300 font-black text-xs">VS</span>
                          <div className="flex items-center gap-2 flex-1">
                            <img 
                              src={match.awayTeam.crest || "https://crests.football-data.org/placeholder.png"} 
                              alt="" 
                              className="w-5 h-5 object-contain" 
                              referrerPolicy="no-referrer" 
                            />
                            <span className="font-bold text-sm uppercase tracking-tight">
                              {match.awayTeam.shortName || match.awayTeam.name}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Desktop Status & Action */}
                    <div className="hidden sm:flex items-center gap-6">
                      {isLive ? (
                        <span className="bg-red-500 text-white text-[10px] font-black uppercase px-3 py-1 rounded-full animate-pulse">LIVE</span>
                      ) : isFinished ? (
                        <span className="bg-gray-200 text-gray-500 text-[10px] font-black uppercase px-3 py-1 rounded-full">FT</span>
                      ) : (
                        <span className="bg-gray-100 text-gray-400 text-[10px] font-black uppercase px-3 py-1 rounded-full">NS</span>
                      )}
                      <div className="text-goal-accent opacity-0 group-hover:opacity-100 transition-opacity">
                        <ChevronRight className="w-5 h-5" />
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="p-20 text-center text-gray-400 font-bold uppercase tracking-widest text-sm">
                {t("noMatches")}
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );

  const renderNews = () => (
    <div className="max-w-screen-lg mx-auto px-6 py-20">
      <div className="mb-16">
        <span className="text-goal-accent font-black uppercase text-[10px] tracking-[0.2em] mb-2 block">{t("liveNews")}</span>
        <h2 className="text-5xl font-black uppercase tracking-tighter">{t("latestNews")}</h2>
      </div>
      
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-10"
      >
        {news.map((article) => (
          article.isAd ? (
            <AdCard key={article.id} className="premium-shadow" />
          ) : (
            <motion.div 
              key={article.id}
              variants={itemVariants}
              className="flex flex-col md:flex-row gap-8 bg-white p-6 rounded-3xl premium-shadow hover:premium-shadow-hover transition-all duration-500 group cursor-pointer border border-gray-50"
              onClick={() => article.link && window.open(article.link, '_blank')}
            >
              <div className="w-full md:w-80 h-56 shrink-0 overflow-hidden rounded-2xl">
                <img src={article.image} alt={article.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" referrerPolicy="no-referrer" />
              </div>
              <div className="flex flex-col justify-center flex-1">
                <div className="flex items-center gap-4 mb-4">
                  <span className="text-[10px] font-black text-white bg-black px-2.5 py-1 rounded-sm uppercase tracking-widest">{article.category}</span>
                  {article.source && (
                    <span className="text-[10px] font-black text-goal-accent uppercase tracking-widest">Source: {article.source}</span>
                  )}
                  <span className="text-[10px] text-gray-400 font-black uppercase tracking-widest">{new Date(article.date).toLocaleDateString()}</span>
                </div>
                <h3 className="text-3xl font-black mb-4 group-hover:text-gray-700 transition-colors leading-[1.1] tracking-tight">
                  {article.title}
                </h3>
                <p className="text-gray-500 text-lg line-clamp-3 leading-relaxed">
                  {article.description}
                </p>
              </div>
            </motion.div>
          )
        ))}
      </motion.div>
    </div>
  );

  const toggleFavorite = (id: string) => {
    const newFavorites = favorites.includes(id)
      ? favorites.filter(fav => fav !== id)
      : [...favorites, id];
    setFavorites(newFavorites);
    localStorage.setItem("goalstream_favorites", JSON.stringify(newFavorites));
  };

  const filteredMatches = matches.filter(match => 
    matchFilter === "ALL" || match.competition.code === matchFilter
  );

  const renderMatches = () => (
    <div className="max-w-screen-md mx-auto px-6 py-20">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
        <div>
          <span className="text-goal-accent font-black uppercase text-[10px] tracking-[0.2em] mb-2 block">{t("realtime")}</span>
          <h2 className="text-5xl font-black uppercase tracking-tighter">{t("liveMatches")}</h2>
        </div>
        <div className="flex items-center gap-4">
          <select 
            value={matchFilter}
            onChange={(e) => setMatchFilter(e.target.value)}
            className="bg-white border border-gray-100 px-4 py-2 rounded-xl font-bold text-xs uppercase tracking-widest focus:outline-none focus:ring-2 focus:ring-goal-accent premium-shadow"
          >
            <option value="ALL">{t("allLeagues")}</option>
            {TOURNAMENTS.map(t => (
              <option key={t.id} value={t.id}>{t.name}</option>
            ))}
          </select>
          <button onClick={fetchMatches} className="p-3 hover:bg-gray-100 rounded-full transition-all active:scale-90">
            <RefreshCcw className={`w-6 h-6 ${loading ? "animate-spin" : ""}`} />
          </button>
        </div>
      </div>
      
      {error && (
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-red-50 border border-red-100 p-6 rounded-2xl text-red-600 mb-12 flex items-center gap-4"
        >
          <AlertCircle className="w-6 h-6 shrink-0" />
          <div className="text-sm font-bold">{error}</div>
        </motion.div>
      )}

      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-6"
      >
        {loading && !matches.length ? (
          [1, 2, 3, 4].map(i => <MatchSkeleton key={i} />)
        ) : filteredMatches.length > 0 ? (
          filteredMatches.map((match) => (
            <motion.div 
              key={match.id}
              variants={itemVariants}
              className="bg-white border border-gray-100 p-8 rounded-3xl premium-shadow hover:premium-shadow-hover transition-all duration-500 flex items-center justify-between gap-6 relative overflow-hidden"
            >
              {(match.status === 'LIVE' || match.status === 'IN_PLAY') && (
                <div className="absolute top-0 left-0 w-1 h-full bg-red-500" />
              )}
              
              <div className="flex-1 flex flex-col items-center text-center gap-4">
                <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center p-3">
                  <img src={match.homeTeam.crest} alt="" className="w-full h-full object-contain" referrerPolicy="no-referrer" />
                </div>
                <span className="font-black text-sm uppercase tracking-tight">{match.homeTeam.shortName || match.homeTeam.name}</span>
              </div>
              
              <div className="flex flex-col items-center gap-4 min-w-[120px]">
                <div className="text-5xl font-black tracking-tighter flex items-center gap-6">
                  <span className={match.score.fullTime.home === null ? "text-gray-200" : ""}>{match.score.fullTime.home ?? '-'}</span>
                  <span className="text-gray-100 font-light">|</span>
                  <span className={match.score.fullTime.away === null ? "text-gray-200" : ""}>{match.score.fullTime.away ?? '-'}</span>
                </div>
                <div className="flex items-center gap-2">
                  {(match.status === 'LIVE' || match.status === 'IN_PLAY') && (
                    <span className="live-dot">
                      <span className="live-dot-ping" />
                      <span className="live-dot-inner" />
                    </span>
                  )}
                  <span className={`text-[10px] font-black uppercase tracking-[0.2em] ${
                    match.status === 'LIVE' || match.status === 'IN_PLAY' ? 'text-red-500' : 'text-gray-400'
                  }`}>
                    {match.status.replace('_', ' ')}
                  </span>
                </div>
              </div>

              <div className="flex-1 flex flex-col items-center text-center gap-4">
                <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center p-3">
                  <img src={match.awayTeam.crest} alt="" className="w-full h-full object-contain" referrerPolicy="no-referrer" />
                </div>
                <span className="font-black text-sm uppercase tracking-tight">{match.awayTeam.shortName || match.awayTeam.name}</span>
              </div>
            </motion.div>
          ))
        ) : (
          <div className="text-center py-32">
            <div className="bg-gray-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
              <Calendar className="w-8 h-8 text-gray-300" />
            </div>
            <p className="text-gray-400 font-bold uppercase tracking-widest text-sm">{t("noMatches")}</p>
          </div>
        )}
      </motion.div>
    </div>
  );

  const renderTeams = () => (
    <div className="max-w-screen-xl mx-auto px-6 py-20">
      <div className="mb-16">
        <span className="text-goal-accent font-black uppercase text-[10px] tracking-[0.2em] mb-2 block">{t("elite")}</span>
        <h2 className="text-5xl font-black uppercase tracking-tighter">{t("giants")}</h2>
      </div>
      
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-8"
      >
        {TOP_TEAMS.map((team) => (
          <motion.div 
            key={team.id}
            variants={itemVariants}
            whileHover={{ y: -10 }}
            className="bg-[#1e293b] p-8 rounded-3xl premium-shadow hover:bg-[#334155] transition-all duration-500 flex flex-col items-center gap-6 cursor-pointer text-center group border border-white/5"
          >
            <div className="w-20 h-20 flex items-center justify-center grayscale group-hover:grayscale-0 transition-all duration-500">
              <img src={team.crest} alt={team.name} className="w-full h-full object-contain" referrerPolicy="no-referrer" />
            </div>
            <span className="text-xs font-black uppercase tracking-widest leading-tight text-gray-400 group-hover:text-white transition-colors">
              {team.name}
            </span>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );

  const renderTournaments = () => (
    <div className="max-w-screen-xl mx-auto px-6 py-20">
      <div className="mb-16">
        <span className="text-goal-accent font-black uppercase text-[10px] tracking-[0.2em] mb-2 block">{t("competitions")}</span>
        <h2 className="text-5xl font-black uppercase tracking-tighter">{t("majorLeagues")}</h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
        {TOURNAMENTS.map((league) => (
          <div key={league.id} className="relative group">
            <button 
              onClick={() => {
                setSelectedLeague(league.id);
                fetchStandings(league.id);
              }}
              className={`league-card w-full ${
                selectedLeague === league.id 
                  ? "ring-4 ring-goal-accent bg-[#334155]" 
                  : ""
              }`}
            >
              {selectedLeague === league.id && (
                <motion.div 
                  layoutId="league-indicator"
                  className="absolute top-0 left-0 right-0 h-1 bg-goal-accent"
                />
              )}
              <span className="text-5xl group-hover:scale-110 transition-transform duration-500">{league.icon}</span>
              <span className="font-black uppercase tracking-widest text-xs">{league.name}</span>
            </button>
            <button 
              onClick={(e) => {
                e.stopPropagation();
                toggleFavorite(league.id);
              }}
              className={`absolute top-4 right-4 p-2 rounded-full transition-all ${
                favorites.includes(league.id) 
                  ? "text-goal-accent bg-white/10" 
                  : "text-white/20 hover:text-white/50"
              }`}
            >
              <Star className={`w-5 h-5 ${favorites.includes(league.id) ? "fill-current" : ""}`} />
            </button>
          </div>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {selectedLeague && (
          <motion.div 
            key={selectedLeague}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            className="bg-white rounded-[2.5rem] premium-shadow overflow-hidden border border-gray-50"
          >
            <div className="p-10 bg-gray-50/50 border-b border-gray-100 flex items-center justify-between">
              <div>
                <span className="text-goal-accent font-black uppercase text-[10px] tracking-[0.2em] mb-1 block">{t("table")}</span>
                <h3 className="text-3xl font-black uppercase tracking-tighter">
                  {TOURNAMENTS.find(l => l.id === selectedLeague)?.name}
                </h3>
              </div>
              {loading && <RefreshCcw className="w-6 h-6 animate-spin text-gray-300" />}
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="text-[10px] font-black uppercase text-gray-400 border-b border-gray-100">
                    <th className="px-10 py-6">{t("pos")}</th>
                    <th className="px-10 py-6">{t("club")}</th>
                    <th className="px-10 py-6 text-center">{t("mp")}</th>
                    <th className="px-10 py-6 text-center">{t("gd")}</th>
                    <th className="px-10 py-6 text-center">{t("pts")}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {standings[selectedLeague]?.map((entry) => (
                    <tr key={entry.team.id} className="hover:bg-gray-50/50 transition-colors group">
                      <td className="px-10 py-6 font-black text-sm w-20">
                        <span className={entry.position <= 4 ? "text-goal-accent" : "text-gray-300"}>
                          {entry.position.toString().padStart(2, '0')}
                        </span>
                      </td>
                      <td className="px-10 py-6">
                        <div className="flex items-center gap-4">
                          <img src={entry.team.crest} alt="" className="w-8 h-8 object-contain" referrerPolicy="no-referrer" />
                          <span className="font-black text-sm uppercase tracking-tight group-hover:text-black transition-colors">
                            {entry.team.shortName || entry.team.name}
                          </span>
                        </div>
                      </td>
                      <td className="px-10 py-6 text-center text-sm font-bold text-gray-400">{entry.playedGames}</td>
                      <td className="px-10 py-6 text-center text-sm font-bold text-gray-400">
                        {entry.goalDifference > 0 ? `+${entry.goalDifference}` : entry.goalDifference}
                      </td>
                      <td className="px-10 py-6 text-center">
                        <span className="text-lg font-black text-black">{entry.points}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );

  const renderAdmin = () => (
    <div className="max-w-screen-sm mx-auto px-6 py-20">
      <div className="mb-16 text-center">
        <span className="text-goal-accent font-black uppercase text-[10px] tracking-[0.2em] mb-2 block">{t("admin")}</span>
        <h2 className="text-5xl font-black uppercase tracking-tighter">{t("adminPanel")}</h2>
      </div>
      
      <form onSubmit={handleAddArticle} className="bg-white p-12 rounded-[2.5rem] premium-shadow space-y-8 border border-gray-50">
        <div className="space-y-3">
          <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest ml-1">Article Title</label>
          <input required name="title" type="text" placeholder="Enter a catchy headline..." className="w-full p-5 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-goal-accent/20 transition-all font-bold" />
        </div>
        <div className="space-y-3">
          <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest ml-1">Image URL</label>
          <input required name="image" type="url" placeholder="https://images.unsplash.com/..." className="w-full p-5 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-goal-accent/20 transition-all font-bold" />
        </div>
        <div className="space-y-3">
          <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest ml-1">Short Description</label>
          <input required name="description" type="text" placeholder="A brief summary of the story..." className="w-full p-5 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-goal-accent/20 transition-all font-bold" />
        </div>
        <div className="space-y-3">
          <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest ml-1">Full Content</label>
          <textarea required name="content" rows={6} placeholder="Write the full story here..." className="w-full p-5 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-goal-accent/20 transition-all font-bold resize-none" />
        </div>
        <button type="submit" className="w-full bg-black text-white font-black uppercase py-6 rounded-2xl hover:bg-gray-900 transition-all flex items-center justify-center gap-3 shadow-xl shadow-black/10 active:scale-[0.98]">
          <Plus className="w-6 h-6" /> Publish Article
        </button>
      </form>
    </div>
  );

  const renderAbout = () => (
    <div className="max-w-screen-md mx-auto px-6 py-20">
      <div className="mb-16">
        <span className="text-goal-accent font-black uppercase text-[10px] tracking-[0.2em] mb-2 block">{t("ourStory")}</span>
        <h2 className="text-5xl font-black uppercase tracking-tighter">{t("about")}</h2>
      </div>
      <div className="prose prose-xl max-w-none text-gray-600 leading-relaxed space-y-8">
        <p className="font-bold text-2xl text-black leading-tight">
          GoalStream is the ultimate destination for football fans worldwide, delivering real-time scores, breaking news, and in-depth analysis.
        </p>
        <p>
          Founded in 2026, our mission is to provide the fastest and most reliable football information to fans everywhere. Whether it's the Premier League, La Liga, or the World Cup, we bring the game closer to you with a premium, mobile-first experience.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-12">
          <div className="bg-gray-50 p-10 rounded-[2.5rem] border border-gray-100">
            <Trophy className="w-12 h-12 text-goal-accent mb-6" />
            <h3 className="text-2xl font-black uppercase tracking-tighter mb-4">Real-time Data</h3>
            <p className="text-sm font-medium text-gray-500">Live scores and statistics from over 100+ global competitions updated every second.</p>
          </div>
          <div className="bg-gray-50 p-10 rounded-[2.5rem] border border-gray-100">
            <Newspaper className="w-12 h-12 text-goal-accent mb-6" />
            <h3 className="text-2xl font-black uppercase tracking-tighter mb-4">Expert Analysis</h3>
            <p className="text-sm font-medium text-gray-500">Breaking news and tactical breakdowns from our global network of football journalists.</p>
          </div>
        </div>
      </div>
    </div>
  );

  const renderPrivacy = () => (
    <div className="max-w-screen-md mx-auto px-6 py-20">
      <div className="mb-16">
        <span className="text-goal-accent font-black uppercase text-[10px] tracking-[0.2em] mb-2 block">{t("legal")}</span>
        <h2 className="text-5xl font-black uppercase tracking-tighter">{t("privacy")}</h2>
      </div>
      <div className="space-y-12 text-gray-600 leading-relaxed">
        <section>
          <h3 className="text-2xl font-black uppercase tracking-tighter text-black mb-4">1. Data Collection</h3>
          <p>We collect basic user information such as your email address when you sign up for our newsletter or create an account. We also collect usage data to improve our services and provide a better user experience.</p>
        </section>
        <section>
          <h3 className="text-2xl font-black uppercase tracking-tighter text-black mb-4">2. Cookies & Advertising</h3>
          <p>GoalStream uses cookies to personalize content and ads, to provide social media features, and to analyze our traffic. We also share information about your use of our site with our social media, advertising, and analytics partners (including Google AdSense).</p>
        </section>
        <section>
          <h3 className="text-2xl font-black uppercase tracking-tighter text-black mb-4">3. Third-party Services</h3>
          <p>We use third-party APIs and services to provide live scores, news feeds, and payment processing (Stripe). These services may collect data according to their own privacy policies.</p>
        </section>
        <section>
          <h3 className="text-2xl font-black uppercase tracking-tighter text-black mb-4">4. Your Rights</h3>
          <p>You have the right to access, correct, or delete your personal data at any time. If you have any questions about your privacy, please contact us.</p>
        </section>
      </div>
    </div>
  );

  const renderTerms = () => (
    <div className="max-w-screen-md mx-auto px-6 py-20">
      <div className="mb-16">
        <span className="text-goal-accent font-black uppercase text-[10px] tracking-[0.2em] mb-2 block">{t("legal")}</span>
        <h2 className="text-5xl font-black uppercase tracking-tighter">{t("terms")}</h2>
      </div>
      <div className="space-y-12 text-gray-600 leading-relaxed">
        <section>
          <h3 className="text-2xl font-black uppercase tracking-tighter text-black mb-4">1. Acceptance of Terms</h3>
          <p>By accessing and using GoalStream, you agree to be bound by these Terms of Service and all applicable laws and regulations.</p>
        </section>
        <section>
          <h3 className="text-2xl font-black uppercase tracking-tighter text-black mb-4">2. Use License</h3>
          <p>Permission is granted to temporarily download one copy of the materials on GoalStream's website for personal, non-commercial transitory viewing only.</p>
        </section>
        <section>
          <h3 className="text-2xl font-black uppercase tracking-tighter text-black mb-4">3. Disclaimer</h3>
          <p>The materials on GoalStream are provided on an 'as is' basis. GoalStream makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.</p>
        </section>
        <section>
          <h3 className="text-2xl font-black uppercase tracking-tighter text-black mb-4">4. Limitations</h3>
          <p>In no event shall GoalStream or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on GoalStream.</p>
        </section>
      </div>
    </div>
  );

  const renderContact = () => (
    <div className="max-w-screen-sm mx-auto px-6 py-20">
      <div className="mb-16 text-center">
        <span className="text-goal-accent font-black uppercase text-[10px] tracking-[0.2em] mb-2 block">{t("support")}</span>
        <h2 className="text-5xl font-black uppercase tracking-tighter">{t("contactUs")}</h2>
      </div>
      
      {contactStatus === "sent" ? (
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-green-50 border border-green-100 p-12 rounded-[2.5rem] text-center space-y-6"
        >
          <div className="bg-green-500 text-white w-20 h-20 rounded-full flex items-center justify-center mx-auto">
            <Check className="w-10 h-10" />
          </div>
          <h3 className="text-3xl font-black uppercase tracking-tighter">{t("sent")}</h3>
          <p className="text-gray-500 font-medium">Thank you for reaching out. Our team will get back to you within 24 hours.</p>
          <button 
            onClick={() => setContactStatus("idle")}
            className="text-xs font-black uppercase tracking-widest text-green-600 hover:text-green-700 transition-colors"
          >
            Send another message
          </button>
        </motion.div>
      ) : (
        <form 
          onSubmit={(e) => {
            e.preventDefault();
            setContactStatus("sending");
            setTimeout(() => setContactStatus("sent"), 1500);
          }}
          className="bg-white p-12 rounded-[2.5rem] premium-shadow space-y-8 border border-gray-50"
        >
          <div className="space-y-3">
            <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest ml-1">{t("name")}</label>
            <input 
              required 
              type="text" 
              placeholder="John Doe" 
              value={contactForm.name}
              onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
              className="w-full p-5 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-goal-accent/20 transition-all font-bold" 
            />
          </div>
          <div className="space-y-3">
            <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest ml-1">{t("email")}</label>
            <input 
              required 
              type="email" 
              placeholder="john@example.com" 
              value={contactForm.email}
              onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
              className="w-full p-5 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-goal-accent/20 transition-all font-bold" 
            />
          </div>
          <div className="space-y-3">
            <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest ml-1">{t("message")}</label>
            <textarea 
              required 
              rows={5} 
              placeholder="..." 
              value={contactForm.message}
              onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
              className="w-full p-5 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-goal-accent/20 transition-all font-bold resize-none" 
            />
          </div>
          <button 
            disabled={contactStatus === "sending"}
            type="submit" 
            className="w-full bg-black text-white font-black uppercase py-6 rounded-2xl hover:bg-gray-900 transition-all flex items-center justify-center gap-3 shadow-xl shadow-black/10 active:scale-[0.98] disabled:opacity-50"
          >
            {contactStatus === "sending" ? (
              <RefreshCcw className="w-6 h-6 animate-spin" />
            ) : (
              <Send className="w-6 h-6" />
            )}
            {contactStatus === "sending" ? t("loading") : t("send")}
          </button>
        </form>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-white">
      {/* Top Navbar */}
      <nav className="sticky top-0 z-50 glass-nav">
        <div className="max-w-screen-xl mx-auto px-6">
          <div className="flex items-center justify-between h-24">
            {/* Logo */}
            <button onClick={() => setActivePage("home")} className="flex items-center gap-3 group">
              <div className="bg-black text-white p-2 rounded-xl group-hover:rotate-12 transition-transform duration-500">
                <Trophy className="w-6 h-6" />
              </div>
              <span className="text-3xl font-black tracking-tighter uppercase">GoalStream</span>
            </button>

            {/* Desktop Menu */}
            <div className="hidden lg:flex items-center gap-6">
              <div className="flex items-center gap-1">
                <NavItem page="home" label={t("home")} icon={Home} />
                <NavItem page="news" label={t("news")} icon={Newspaper} />
                <NavItem page="matches" label={t("matches")} icon={Calendar} />
                <NavItem page="teams" label={t("teams")} icon={Users} />
                <NavItem page="tournaments" label={t("tournaments")} icon={Trophy} />
                <NavItem page="admin" label={t("admin")} icon={Settings} />
              </div>
              <LanguageSwitcher />
            </div>

            {/* Mobile Menu Toggle */}
            <div className="flex items-center gap-2 lg:hidden">
              <LanguageSwitcher />
              <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="p-3 hover:bg-gray-100 rounded-2xl transition-all active:scale-90">
                {isMenuOpen ? <X className="w-7 h-7" /> : <Menu className="w-7 h-7" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="lg:hidden border-t border-gray-100 overflow-hidden bg-white"
            >
              <div className="flex flex-col p-6 gap-4">
                <NavItem page="home" label={t("home")} icon={Home} />
                <NavItem page="news" label={t("news")} icon={Newspaper} />
                <NavItem page="matches" label={t("matches")} icon={Calendar} />
                <NavItem page="teams" label={t("teams")} icon={Users} />
                <NavItem page="tournaments" label={t("tournaments")} icon={Trophy} />
                <NavItem page="admin" label={t("admin")} icon={Settings} />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Main Content */}
      <main>
        <AnimatePresence mode="wait">
          <motion.div
            key={activePage}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            {activePage === "home" && renderHome()}
            {activePage === "news" && renderNews()}
            {activePage === "matches" && renderMatches()}
            {activePage === "teams" && renderTeams()}
            {activePage === "tournaments" && renderTournaments()}
            {activePage === "admin" && renderAdmin()}
            {activePage === "about" && renderAbout()}
            {activePage === "privacy" && renderPrivacy()}
            {activePage === "terms" && renderTerms()}
            {activePage === "contact" && renderContact()}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer className="bg-black text-white py-24">
        <div className="max-w-screen-xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <div className="text-center lg:text-left">
              <div className="flex items-center justify-center lg:justify-start gap-3 mb-8">
                <div className="bg-white text-black p-2 rounded-xl">
                  <Trophy className="w-8 h-8" />
                </div>
                <span className="text-4xl font-black tracking-tighter uppercase">GoalStream</span>
              </div>
              <p className="text-gray-400 text-xl font-medium max-w-md mx-auto lg:mx-0 leading-relaxed">
                {t("description")}
              </p>
            </div>
            <div className="flex flex-col items-center lg:items-end gap-12">
              <div className="flex flex-wrap justify-center lg:justify-end gap-10 text-xs font-black uppercase tracking-[0.2em] text-gray-500">
                <button onClick={() => setActivePage("about")} className="hover:text-goal-accent transition-colors">{t("about")}</button>
                <button onClick={() => setActivePage("privacy")} className="hover:text-goal-accent transition-colors">{t("privacy")}</button>
                <button onClick={() => setActivePage("terms")} className="hover:text-goal-accent transition-colors">{t("terms")}</button>
                <button onClick={() => setActivePage("contact")} className="hover:text-goal-accent transition-colors">{t("contact")}</button>
              </div>
              <div className="text-gray-600 text-[10px] font-black uppercase tracking-[0.3em]">
                © 2026 GoalStream Media Group. {t("allRights")}.
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

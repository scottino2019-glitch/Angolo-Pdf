import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  BookOpen,
  FileText,
  Search,
  Eye,
  ArrowDownToLine,
  X,
  Calendar,
  Layers,
  WifiOff,
  Contrast,
  Type,
  ZoomIn,
  ZoomOut,
  RotateCw,
  Printer,
  ExternalLink,
  Quote,
  Star
} from 'lucide-react';

export interface ChapterItem {
  title: string;
  pages: string;
}

export interface DocumentItem {
  id: string;
  title: string;
  category: string;
  author?: string;
  description: string;
  quote?: string;
  chapters?: ChapterItem[];
  filename: string;
  fileUrl: string;
  coverImage?: string;
  image?: string;
  cover?: string;
  copertina?: string;
  fileSize: string;
  pages: number;
  date: string;
  tags?: string[];
  badge?: string;
  accent?: string;
}

// Editorial Book Card Component preserving the prominent image, quote, silk ribbon, and reading progress
function EditorialBookCard({
  doc,
  onOpenPreview
}: {
  doc: DocumentItem;
  onOpenPreview: (doc: DocumentItem) => void;
}) {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [activeTab, setActiveTab] = useState<'quote' | 'index'>('quote');
  const [isBookmarked, setIsBookmarked] = useState<boolean>(false);
  const [imgError, setImgError] = useState<boolean>(false);

  const totalPages = doc.pages || 1;
  const progressPercent = Math.min(100, Math.max(5, Math.round((currentPage / totalPages) * 100)));

  const handlePrevPage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentPage((p) => Math.max(1, p - 1));
  };

  const handleNextPage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentPage((p) => Math.min(totalPages, p + 1));
  };

  // Dedicated quote from document or fallback to quote/description
  const displayQuote = doc.quote || doc.description;

  // Resolve cover image from any common key name
  const coverSource = doc.coverImage || doc.image || doc.cover || doc.copertina;

  return (
    <article
      id={`libro-card-${doc.id}`}
      className="w-full transition-all duration-300 rounded-2xl p-5 sm:p-6 relative shadow-2xl border-2 bg-gradient-to-br from-[#FCF9F2] via-[#F7F2E7] to-[#EDE3D1] border-[#D3C2A6] text-stone-900 flex flex-col justify-between hover:-translate-y-1 hover:shadow-[0_22px_45px_rgba(0,0,0,0.6)] group"
    >
      {/* Segnalibro a Nastro in Seta Cliccabile */}
      <div
        id={`book-ribbon-${doc.id}`}
        role="button"
        tabIndex={0}
        aria-label={isBookmarked ? 'Segnalibro inserito' : 'Inserisci segnalibro'}
        onClick={() => setIsBookmarked(!isBookmarked)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            setIsBookmarked(!isBookmarked);
          }
        }}
        title="Clicca per spostare il segnalibro"
        className={`absolute -top-1.5 right-7 w-6 h-12 rounded-b shadow-lg flex items-end justify-center pb-1.5 z-20 cursor-pointer transition-all duration-200 ${
          isBookmarked
            ? 'bg-gradient-to-b from-amber-600 to-amber-700 border-x border-amber-800 h-14 shadow-amber-950/50'
            : 'bg-gradient-to-b from-red-600 to-rose-700 border-x border-red-800 hover:h-14 shadow-red-950/40'
        }`}
      >
        <div className="w-0 h-0 border-x-[6px] border-x-transparent border-b-[6px] border-b-[#FCF9F2] mb-[-2px]" />
      </div>

      <div>
        {/* Immagine di Copertina Pregiata Visibile & In Primo Piano */}
        {coverSource && !imgError ? (
          <div
            onClick={() => onOpenPreview(doc)}
            className="relative w-full h-48 rounded-xl overflow-hidden mb-4 border border-[#D3C2A6] shadow-md bg-stone-950 cursor-pointer group/img"
            title="Clicca per consultare a schermo intero"
          >
            <img
              src={coverSource}
              alt={`Copertina del volume: ${doc.title}`}
              onError={() => setImgError(true)}
              className="w-full h-full object-cover group-hover/img:scale-104 transition-transform duration-300"
            />
            {/* Overlay graduato di pregio */}
            <div className="absolute inset-0 bg-gradient-to-t from-stone-950/80 via-transparent to-black/20" />

            {/* Badge formato e pagine sulla copertina */}
            <div className="absolute bottom-2.5 left-3 right-3 flex items-center justify-between pointer-events-none">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-black/60 text-amber-300 border border-white/10 backdrop-blur-xs">
                PDF / A • {doc.fileSize}
              </span>
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-black/60 text-stone-200 border border-white/10 backdrop-blur-xs">
                {doc.pages} pag.
              </span>
            </div>

            {/* Bottone rapido di anteprima visibile su hover */}
            <div className="absolute top-2.5 left-3 opacity-0 group-hover/img:opacity-100 transition-opacity">
              <span className="text-[10px] font-serif font-bold px-2 py-1 rounded-md bg-amber-600 text-stone-950 shadow">
                Clicca per aprire
              </span>
            </div>
          </div>
        ) : (
          /* Volume 3D se manca l'immagine o se il file non è trovato */
          <div
            onClick={() => onOpenPreview(doc)}
            className="relative w-full h-36 rounded-xl bg-gradient-to-tr from-stone-950 via-rose-950 to-red-900 border-l-4 border-amber-400 p-4 shadow-xl flex flex-col justify-between mb-4 cursor-pointer"
          >
            <div className="flex items-center justify-between">
              <span className="text-[9px] font-mono font-black uppercase tracking-wider text-amber-300">
                VOLUME PDF / A
              </span>
              <span className="text-[10px] font-mono font-bold text-amber-200">
                {doc.fileSize}
              </span>
            </div>
            <div>
              <h5 className="text-base font-serif font-black text-amber-100 leading-snug line-clamp-2">
                {doc.title}
              </h5>
              <span className="text-[10px] text-stone-300 font-mono mt-1 block">
                {doc.author || 'EDIZIONE UFFICIALE'}
              </span>
            </div>
          </div>
        )}

        {/* Metadati Libro & Titolo (mostra SOLO dati reali) */}
        <div className="mb-3.5 pr-6">
          <div className="flex items-center gap-2 flex-wrap mb-1">
            {doc.category && (
              <span className="text-[9px] font-mono font-black uppercase tracking-widest text-amber-900 block">
                {doc.category}
              </span>
            )}
            {doc.badge && (
              <span className="text-[9px] font-mono font-bold px-1.5 py-0.2 rounded bg-amber-900/10 text-amber-950 border border-amber-900/20">
                {doc.badge}
              </span>
            )}
          </div>

          <h3
            onClick={() => onOpenPreview(doc)}
            className="font-serif font-black text-lg leading-tight text-[#2B1B16] mt-0.5 hover:text-amber-900 transition-colors cursor-pointer line-clamp-2"
            title={doc.title}
          >
            {doc.title}
          </h3>

          {doc.author && (
            <p className="text-[11px] font-serif italic text-stone-600 mt-1 line-clamp-1">
              a cura di {doc.author}
            </p>
          )}

          {/* Dati Documento Reali (senza stelle o recensioni inventate) */}
          <div className="flex items-center gap-2 mt-2 text-stone-600 text-xs flex-wrap font-mono">
            {doc.pages && (
              <span className="text-[10px] font-bold">
                {doc.pages} {doc.pages === 1 ? 'pagina' : 'pagine'}
              </span>
            )}
            {doc.fileSize && (
              <span className="text-[10px] text-stone-500">
                • {doc.fileSize}
              </span>
            )}
            {doc.date && (
              <span className="text-[10px] text-stone-500">
                • {doc.date}
              </span>
            )}
          </div>
        </div>

        {/* Barra Avanzamento di Lettura (mostrata solo se il documento ha più pagine) */}
        {totalPages > 1 && (
          <div className="p-3 rounded-xl bg-black/5 border border-black/10 mb-4">
            <div className="flex items-center justify-between text-[11px] font-mono font-bold text-stone-800 mb-1.5">
              <span>
                AVANZAMENTO: <strong className="text-amber-900">{progressPercent}%</strong>
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handlePrevPage}
                  title="Pagina precedente"
                  className="w-5 h-5 rounded bg-stone-300 hover:bg-stone-400 text-stone-900 flex items-center justify-center text-xs font-bold cursor-pointer transition-colors"
                >
                  ‹
                </button>
                <span>
                  Pag. {currentPage} / {totalPages}
                </span>
                <button
                  type="button"
                  onClick={handleNextPage}
                  title="Pagina successiva"
                  className="w-5 h-5 rounded bg-stone-300 hover:bg-stone-400 text-stone-900 flex items-center justify-center text-xs font-bold cursor-pointer transition-colors"
                >
                  ›
                </button>
              </div>
            </div>
            <div className="w-full h-1.5 bg-[#D8C8A6] rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-red-600 to-rose-700 transition-all duration-200"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        )}

        {/* Sezione Contenuti Reali: Citazione, Capitoli o Descrizione (ZERO dati fantoccio) */}
        <div className="border-t border-[#D8C8A8] pt-3">
          {/* Se sono presenti SIA citazione/descrizione SIA capitoli, mostriamo i tab di scelta */}
          {doc.chapters && doc.chapters.length > 0 && (doc.quote || doc.description) ? (
            <div>
              <div className="flex gap-2 mb-2">
                <button
                  type="button"
                  onClick={() => setActiveTab('quote')}
                  className={`px-2.5 py-1 rounded font-mono text-[10px] font-bold uppercase cursor-pointer transition-colors flex items-center gap-1 ${
                    activeTab === 'quote'
                      ? 'bg-[#2B1B16] text-amber-100'
                      : 'bg-stone-200 text-stone-800 hover:bg-stone-300'
                  }`}
                >
                  <Quote className="w-2.5 h-2.5" />
                  {doc.quote ? 'CITAZIONE' : 'DESCRIZIONE'}
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('index')}
                  className={`px-2.5 py-1 rounded font-mono text-[10px] font-bold uppercase cursor-pointer transition-colors ${
                    activeTab === 'index'
                      ? 'bg-[#2B1B16] text-amber-100'
                      : 'bg-stone-200 text-stone-800 hover:bg-stone-300'
                  }`}
                >
                  INDICE CAPITOLI ({doc.chapters.length})
                </button>
              </div>

              {activeTab === 'quote' && (
                <div className="p-3.5 rounded-lg bg-amber-50/70 border border-amber-900/15 min-h-[90px] flex flex-col justify-between shadow-inner">
                  <p className="text-xs font-serif italic text-stone-800 leading-relaxed">
                    &ldquo;{displayQuote}&rdquo;
                  </p>
                </div>
              )}

              {activeTab === 'index' && (
                <div className="space-y-1 text-xs font-mono min-h-[90px] p-2.5 rounded-lg bg-white/50 border border-stone-300">
                  {doc.chapters.map((ch, idx) => (
                    <div
                      key={idx}
                      className="flex justify-between items-center py-0.5 border-b border-stone-200 last:border-b-0 text-[11px]"
                    >
                      <span className="font-bold text-stone-800 truncate pr-2">{ch.title}</span>
                      <span className="text-stone-500 shrink-0 font-semibold">{ch.pages}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : doc.chapters && doc.chapters.length > 0 ? (
            /* Solo capitoli presenti */
            <div className="space-y-1 text-xs font-mono p-2.5 rounded-lg bg-white/50 border border-stone-300">
              <span className="text-[9px] font-bold uppercase text-stone-500 block mb-1">
                Indice capitoli:
              </span>
              {doc.chapters.map((ch, idx) => (
                <div
                  key={idx}
                  className="flex justify-between items-center py-0.5 border-b border-stone-200 last:border-b-0 text-[11px]"
                >
                  <span className="font-bold text-stone-800 truncate pr-2">{ch.title}</span>
                  <span className="text-stone-500 shrink-0 font-semibold">{ch.pages}</span>
                </div>
              ))}
            </div>
          ) : (doc.quote || doc.description) ? (
            /* Solo citazione o descrizione presente */
            <div className="p-3.5 rounded-lg bg-amber-50/70 border border-amber-900/15 flex flex-col justify-between shadow-inner">
              <p className="text-xs font-serif italic text-stone-800 leading-relaxed">
                &ldquo;{displayQuote}&rdquo;
              </p>
            </div>
          ) : null}
        </div>
      </div>

      {/* Pulsanti di Azione: Consulta & Scarica PDF Nativo */}
      <div className="mt-5 pt-3.5 border-t border-[#D8C8A8] grid grid-cols-2 gap-2.5">
        <button
          type="button"
          onClick={() => onOpenPreview(doc)}
          className="inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-stone-900 hover:bg-stone-800 text-amber-100 text-xs font-serif font-bold transition-all shadow-md cursor-pointer"
          title={`Consulta "${doc.title}" a schermo intero`}
        >
          <Eye className="w-3.5 h-3.5 text-amber-400" />
          <span>Consulta</span>
        </button>

        <a
          href={doc.fileUrl}
          download={doc.filename}
          className="inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-gradient-to-r from-red-700 to-rose-800 hover:from-red-600 hover:to-rose-700 text-white text-xs font-mono font-bold shadow-md shadow-red-950/30 transition-all text-center cursor-pointer"
          title={`Download nativo Chrome di "${doc.filename}"`}
        >
          <ArrowDownToLine className="w-3.5 h-3.5" />
          <span>Scarica PDF</span>
        </a>
      </div>
    </article>
  );
}

export default function App() {
  // STRICT: Loaded exclusively from /documents.json - zero hardcoded fallbacks
  const [documents, setDocuments] = useState<DocumentItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  // Search & Filtering
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('Tutti');
  const [isOnline, setIsOnline] = useState<boolean>(navigator.onLine);

  // Accessibility Controls
  const [highContrast, setHighContrast] = useState<boolean>(false);
  const [dyslexicFont, setDyslexicFont] = useState<boolean>(false);
  const [textSize, setTextSize] = useState<'normal' | 'lg' | 'xl'>('normal');

  // Preview Reader Modal
  const [activePreviewDoc, setActivePreviewDoc] = useState<DocumentItem | null>(null);
  const [previewZoom, setPreviewZoom] = useState<number>(100);
  const [previewRotate, setPreviewRotate] = useState<number>(0);

  const searchInputRef = useRef<HTMLInputElement>(null);

  // Fetch documents exclusively from /documents.json
  const fetchDocuments = async () => {
    setIsLoading(true);
    setLoadError(null);
    try {
      const res = await fetch('/documents.json', { cache: 'no-cache' });
      if (!res.ok) {
        throw new Error(`Errore HTTP ${res.status} nel caricamento di /documents.json`);
      }
      const data = await res.json();
      if (Array.isArray(data)) {
        setDocuments(data);
      } else {
        setDocuments([]);
        setLoadError('Il file documents.json non contiene un array valido.');
      }
    } catch (err: any) {
      console.warn('Errore lettura documents.json:', err);
      setDocuments([]);
      setLoadError(err?.message || 'Impossibile leggere /documents.json');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, []);

  // Monitor network status
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Keyboard shortcut: Escape to close preview, '/' to search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && activePreviewDoc) {
        setActivePreviewDoc(null);
      }
      if (e.key === '/' && document.activeElement !== searchInputRef.current) {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activePreviewDoc]);

  // Accessibility classes
  useEffect(() => {
    if (highContrast) {
      document.body.classList.add('high-contrast');
    } else {
      document.body.classList.remove('high-contrast');
    }
  }, [highContrast]);

  useEffect(() => {
    if (dyslexicFont) {
      document.body.classList.add('font-dyslexic');
    } else {
      document.body.classList.remove('font-dyslexic');
    }
  }, [dyslexicFont]);

  useEffect(() => {
    document.body.classList.remove('text-size-lg', 'text-size-xl');
    if (textSize === 'lg') document.body.classList.add('text-size-lg');
    if (textSize === 'xl') document.body.classList.add('text-size-xl');
  }, [textSize]);

  // Extract Categories dynamically from loaded documents
  const categories = useMemo(() => {
    const map = new Map<string, number>();
    documents.forEach((d) => {
      if (d.category) {
        map.set(d.category, (map.get(d.category) || 0) + 1);
      }
    });

    const list: { name: string; count: number }[] = [
      { name: 'Tutti', count: documents.length }
    ];

    Array.from(map.entries()).forEach(([cat, count]) => {
      list.push({ name: cat, count });
    });

    return list;
  }, [documents]);

  // Filtered documents based on category and search query
  const filteredDocuments = useMemo(() => {
    return documents.filter((doc) => {
      if (selectedCategory !== 'Tutti' && doc.category !== selectedCategory) {
        return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const inTitle = doc.title?.toLowerCase().includes(q);
        const inDesc = doc.description?.toLowerCase().includes(q);
        const inQuote = doc.quote?.toLowerCase().includes(q);
        const inCat = doc.category?.toLowerCase().includes(q);
        const inTags = doc.tags?.some((t) => t.toLowerCase().includes(q));
        if (!inTitle && !inDesc && !inQuote && !inCat && !inTags) {
          return false;
        }
      }
      return true;
    });
  }, [documents, selectedCategory, searchQuery]);

  const formattedDateToday = useMemo(() => {
    try {
      return new Intl.DateTimeFormat('it-IT', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      }).format(new Date());
    } catch {
      return 'Edizione Critica';
    }
  }, []);

  return (
    /* Sfondo nobile a contrasto: noce scuro e mogano da biblioteca storica */
    <div className="min-h-screen bg-[#181411] text-[#FBF8F3] flex flex-col font-sans selection:bg-amber-900 selection:text-amber-100">
      {/* Offline Alert Strip */}
      {!isOnline && (
        <div
          role="status"
          className="bg-amber-600 text-stone-950 px-4 py-2 text-center text-xs font-bold flex items-center justify-center gap-2 border-b border-amber-700 sticky top-0 z-50 shadow-md"
        >
          <WifiOff className="w-4 h-4 shrink-0" />
          <span>Modalità non in linea: i volumi PDF in cache rimangono liberamente consultabili.</span>
        </div>
      )}

      {/* Header & Masthead da Biblioteca Storica */}
      <header className="border-b border-[#2C241E] bg-[#1F1915]/95 backdrop-blur sticky top-0 z-40 shadow-xl">
        {/* Ribbon data e metadati */}
        <div className="border-b border-[#2C241E] px-4 sm:px-8 py-1.5 flex items-center justify-between text-[11px] text-stone-400">
          <span className="capitalize font-mono flex items-center gap-1.5 text-amber-300">
            <Calendar className="w-3.5 h-3.5 text-amber-500" />
            {formattedDateToday}
          </span>
          <div className="flex items-center gap-3">
            <span className="hidden sm:inline font-serif italic text-stone-400">
              Biblioteca & Archivio dei Volumi Editoriali
            </span>
            <span className="font-mono text-[10px] bg-[#2E241E] px-2 py-0.5 rounded text-amber-200 border border-[#44362C]">
              Formato PDF/A • Motore Chromium
            </span>
          </div>
        </div>

        {/* Brand Banner & Search Tools */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            {/* Title / Brand */}
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-amber-700 via-amber-800 to-amber-600 border-2 border-amber-400/40 flex items-center justify-center text-amber-100 shadow-xl shadow-black/50 shrink-0">
                <BookOpen className="w-6 h-6 stroke-[2]" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-xl sm:text-2xl font-black font-serif text-[#FBF8F3] tracking-tight">
                    L'Angolo dei Volumi PDF
                  </h1>
                  <span className="text-[9px] font-mono font-black uppercase tracking-widest px-2 py-0.5 rounded bg-amber-500/15 text-amber-300 border border-amber-500/30">
                    EDIZIONE PREGIATA
                  </span>
                </div>
                <p className="text-xs text-stone-400 mt-0.5 font-serif italic">
                  Volumi rilegati con copertina, citazione guida e indice capitoli
                </p>
              </div>
            </div>

            {/* Search Bar & Accessibility Controls */}
            <div className="flex items-center gap-2.5 flex-1 md:max-w-md justify-end">
              {/* Search Bar */}
              <div className="relative w-full">
                <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  ref={searchInputRef}
                  type="search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Cerca nei volumi, citazioni o autori... (/)"
                  aria-label="Cerca nei volumi"
                  className="w-full pl-9 pr-8 py-2 bg-[#120F0D] border border-[#3A2F27] rounded-xl text-xs text-[#FBF8F3] placeholder:text-stone-500 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all shadow-inner"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    aria-label="Azzera ricerca"
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-white"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* Accessibility Controls */}
              <div
                className="flex items-center gap-1 bg-[#120F0D] border border-[#3A2F27] p-1 rounded-xl shrink-0"
                role="toolbar"
                aria-label="Strumenti di Accessibilità"
              >
                <button
                  type="button"
                  onClick={() => setHighContrast(!highContrast)}
                  aria-pressed={highContrast}
                  title="Alto contrasto"
                  className={`p-1.5 rounded-lg text-xs font-semibold transition-colors ${
                    highContrast ? 'bg-white text-black' : 'text-stone-300 hover:bg-[#28211C]'
                  }`}
                >
                  <Contrast className="w-3.5 h-3.5" />
                  <span className="sr-only">Alto contrasto</span>
                </button>

                <button
                  type="button"
                  onClick={() => setDyslexicFont(!dyslexicFont)}
                  aria-pressed={dyslexicFont}
                  title="Carattere ad alta leggibilità"
                  className={`px-2 py-1 rounded-lg text-xs font-semibold transition-colors ${
                    dyslexicFont ? 'bg-amber-600 text-stone-950 font-bold' : 'text-stone-300 hover:bg-[#28211C]'
                  }`}
                >
                  Leggibile
                </button>

                <button
                  type="button"
                  onClick={() => setTextSize(textSize === 'normal' ? 'lg' : textSize === 'lg' ? 'xl' : 'normal')}
                  title="Dimensione caratteri"
                  className="p-1.5 rounded-lg text-xs font-bold text-stone-300 hover:bg-[#28211C] flex items-center"
                >
                  <Type className="w-3.5 h-3.5 mr-0.5" />
                  {textSize === 'normal' ? '1x' : textSize === 'lg' ? '1.2x' : '1.4x'}
                </button>
              </div>
            </div>
          </div>

          {/* Category Tabs (Derived 100% dynamically from documents.json) */}
          <div className="mt-3.5 pt-3 border-t border-[#2C241E] flex items-center gap-2 overflow-x-auto scrollbar-none">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-400/90 mr-1 flex items-center gap-1.5 shrink-0 font-mono">
              <Layers className="w-3.5 h-3.5" />
              Sezioni:
            </span>
            {categories.map((cat) => {
              const isActive = selectedCategory === cat.name;
              return (
                <button
                  key={cat.name}
                  type="button"
                  onClick={() => setSelectedCategory(cat.name)}
                  className={`shrink-0 inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-mono transition-all ${
                    isActive
                      ? 'bg-amber-700 text-amber-100 font-bold shadow-md shadow-amber-950/60 border border-amber-500/50'
                      : 'bg-[#261E19] text-stone-300 hover:text-white hover:bg-[#332822] border border-[#3E3128]'
                  }`}
                >
                  <span>{cat.name}</span>
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                      isActive ? 'bg-amber-950 text-amber-200' : 'bg-[#181310] text-stone-400'
                    }`}
                  >
                    {cat.count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </header>

      {/* Main Volumes Grid on Contrasting Background */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full">
        {/* Section Header & Results Count */}
        <div className="flex items-baseline justify-between mb-6 pb-2.5 border-b border-[#2C241E]">
          <div>
            <h2 className="text-xl font-bold font-serif text-[#FBF8F3] tracking-tight flex items-center gap-2">
              <span>{selectedCategory === 'Tutti' ? 'Tutti i Volumi della Collana' : selectedCategory}</span>
            </h2>
            <p className="text-xs text-stone-400 mt-0.5 font-serif italic">
              {filteredDocuments.length}{' '}
              {filteredDocuments.length === 1 ? 'volume disponibile' : 'volumi disponibili'} per la consultazione
            </p>
          </div>

          {(searchQuery || selectedCategory !== 'Tutti') && (
            <button
              type="button"
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('Tutti');
              }}
              className="text-xs font-mono font-bold text-amber-400 hover:text-amber-300 hover:underline"
            >
              Mostra l'intera collana
            </button>
          )}
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="p-16 text-center text-stone-400 font-serif italic text-sm">
            Consultazione dell'archivio volumi in corso...
          </div>
        )}

        {/* Empty Catalog Warning */}
        {!isLoading && documents.length === 0 && (
          <div className="bg-[#1F1915] border border-[#3A2F27] rounded-2xl p-10 text-center max-w-lg mx-auto shadow-2xl my-8">
            <BookOpen className="w-10 h-10 text-amber-500 mx-auto mb-3" />
            <h3 className="text-base font-bold font-serif text-white">
              Nessun documento trovato in /documents.json
            </h3>
            <p className="text-xs text-stone-400 mt-2 leading-relaxed">
              {loadError
                ? `Segnalazione: ${loadError}`
                : 'Il catalogo public/documents.json è attualmente vuoto. Inserisci i tuoi PDF e le informazioni per vederli apparire automaticamente in questa elegante collana.'}
            </p>
          </div>
        )}

        {/* No Search Matches */}
        {!isLoading && documents.length > 0 && filteredDocuments.length === 0 && (
          <div className="bg-[#1F1915] border border-[#3A2F27] rounded-2xl p-10 text-center max-w-md mx-auto my-8 shadow-2xl">
            <FileText className="w-10 h-10 text-stone-500 mx-auto mb-2" />
            <h3 className="text-base font-bold font-serif text-white">Nessun volume trovato</h3>
            <p className="text-xs text-stone-400 mt-1">
              Nessun fascicolo corrisponde alla ricerca &ldquo;{searchQuery}&rdquo;.
            </p>
            <button
              type="button"
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('Tutti');
              }}
              className="mt-4 px-4 py-2 bg-amber-700 hover:bg-amber-600 text-amber-100 rounded-lg text-xs font-mono font-bold transition-colors"
            >
              Ripristina catalogo
            </button>
          </div>
        )}

        {/* The Grid of Editorial Book Cards with Image, Quote, Silk Ribbon & Reader */}
        {!isLoading && filteredDocuments.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
            {filteredDocuments.map((doc) => (
              <EditorialBookCard
                key={doc.id}
                doc={doc}
                onOpenPreview={(d) => {
                  setActivePreviewDoc(d);
                  setPreviewZoom(100);
                  setPreviewRotate(0);
                }}
              />
            ))}
          </div>
        )}
      </main>

      {/* Footer da Biblioteca */}
      <footer className="border-t border-[#2C241E] bg-[#14100D] py-6 text-center text-xs text-stone-500 mt-auto">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <span className="font-serif italic text-stone-400">
            L'Angolo dei Volumi PDF • Edizione Pregiata & Consultazione Aperta
          </span>
          <span className="font-mono text-[11px] text-stone-500">
            Supporto Offline • Download Nativo Chromium
          </span>
        </div>
      </footer>

      {/* Modal di Lettura a Schermo Intero */}
      {activePreviewDoc && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="preview-title"
          className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex flex-col p-2 sm:p-4 md:p-6 animate-in fade-in duration-100"
        >
          <div className="bg-[#1C1714] border-2 border-[#3A2F27] rounded-2xl w-full h-full max-w-6xl mx-auto flex flex-col overflow-hidden shadow-2xl">
            {/* Modal Header Bar */}
            <div className="px-4 py-3 border-b border-[#2C241E] flex items-center justify-between gap-3 bg-[#16120F]">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-8 h-8 rounded-lg bg-amber-700/30 border border-amber-600/40 text-amber-400 flex items-center justify-center shrink-0">
                  <BookOpen className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <h3
                    id="preview-title"
                    className="text-sm font-bold font-serif text-[#FBF8F3] truncate"
                  >
                    {activePreviewDoc.title}
                  </h3>
                  <p className="text-[11px] text-stone-400 truncate font-mono">
                    {activePreviewDoc.category} • {activePreviewDoc.fileSize} • {activePreviewDoc.pages} pagine
                  </p>
                </div>
              </div>

              {/* Reader Controls Toolbar */}
              <div className="flex items-center gap-1.5 shrink-0">
                <button
                  type="button"
                  onClick={() => setPreviewZoom((z) => Math.max(50, z - 15))}
                  title="Riduci zoom"
                  className="p-1.5 rounded-lg bg-[#28211C] border border-[#3E3128] hover:bg-[#342B24] text-stone-300"
                >
                  <ZoomOut className="w-4 h-4" />
                </button>

                <span className="text-xs font-mono text-stone-300 min-w-10 text-center">
                  {previewZoom}%
                </span>

                <button
                  type="button"
                  onClick={() => setPreviewZoom((z) => Math.min(200, z + 15))}
                  title="Aumenta zoom"
                  className="p-1.5 rounded-lg bg-[#28211C] border border-[#3E3128] hover:bg-[#342B24] text-stone-300"
                >
                  <ZoomIn className="w-4 h-4" />
                </button>

                <button
                  type="button"
                  onClick={() => setPreviewRotate((r) => (r + 90) % 360)}
                  title="Ruota pagina"
                  className="p-1.5 rounded-lg bg-[#28211C] border border-[#3E3128] hover:bg-[#342B24] text-stone-300"
                >
                  <RotateCw className="w-4 h-4" />
                </button>

                <button
                  type="button"
                  onClick={() => {
                    const printWin = window.open(activePreviewDoc.fileUrl, '_blank');
                    printWin?.focus();
                  }}
                  title="Stampa volume"
                  className="p-1.5 rounded-lg bg-[#28211C] border border-[#3E3128] hover:bg-[#342B24] text-stone-300"
                >
                  <Printer className="w-4 h-4" />
                </button>

                {/* Direct Chrome Download button */}
                <a
                  href={activePreviewDoc.fileUrl}
                  download={activePreviewDoc.filename}
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-gradient-to-r from-red-700 to-rose-800 hover:from-red-600 hover:to-rose-700 text-white text-xs font-mono font-bold shadow-sm"
                  title="Scarica con Chrome"
                >
                  <ArrowDownToLine className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Scarica</span>
                </a>

                {/* Close Button */}
                <button
                  type="button"
                  onClick={() => setActivePreviewDoc(null)}
                  className="p-1.5 rounded-lg text-stone-400 hover:text-white hover:bg-[#28211C] ml-1"
                  title="Chiudi visualizzatore (Esc)"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Document Frame */}
            <div className="flex-1 bg-[#100D0B] p-2 sm:p-4 overflow-auto flex items-center justify-center">
              <div
                className="w-full h-full max-w-4xl transition-all duration-150 flex items-center justify-center"
                style={{
                  transform: `scale(${previewZoom / 100}) rotate(${previewRotate}deg)`,
                  transformOrigin: 'center center'
                }}
              >
                <iframe
                  src={`${activePreviewDoc.fileUrl}#toolbar=1&navpanes=0`}
                  title={activePreviewDoc.title}
                  className="w-full h-full rounded-lg bg-white shadow-2xl border border-stone-700/60 min-h-[550px]"
                />
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-4 py-2 bg-[#16120F] border-t border-[#2C241E] flex items-center justify-between text-xs text-stone-400">
              <span className="font-mono text-[11px] truncate">
                File: {activePreviewDoc.filename}
              </span>
              <a
                href={activePreviewDoc.fileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-amber-400 hover:text-amber-300 hover:underline text-[11px] font-mono"
              >
                <span>Apri in una nuova scheda</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

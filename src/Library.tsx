import { useState } from 'react';
import { ArrowLeft, ArrowRight, Search, X } from 'lucide-react';
import { getHexagram, HEXAGRAMS, TRIGRAMS } from '../engines/iching';
import { ClassicalText, DiagramCard, HexCard } from './components';
import { copy, type Lang } from './i18n';

export function Library({ lang }: { lang: Lang }) {
  const t = copy[lang];
  const [search, setSearch] = useState('');
  const [upper, setUpper] = useState('');
  const [lower, setLower] = useState('');
  const query = search.trim().toLowerCase().replaceAll('ü', 'u');
  const filtered = HEXAGRAMS.filter(
    (h) =>
      (!upper || h.upper === upper) &&
      (!lower || h.lower === lower) &&
      (!query ||
        [h.name, h.fullName, h.english, h.pinyin, h.judgment, h.id.toString()]
          .join(' ')
          .toLowerCase()
          .replaceAll('ü', 'u')
          .includes(query)),
  );
  return (
    <div className="page library-page">
      <div className="page-heading">
        <span className="eyebrow">THE HEXAGRAM ATLAS / 64</span>
        <h1>{t.libraryTitle}</h1>
        <p>{t.librarySub}</p>
      </div>
      <div className="library-filters">
        <label className="search-box">
          <Search size={18} />
          <span className="sr-only">{t.search}</span>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t.search}
          />
          {search && (
            <button
              className="icon-button"
              onClick={() => setSearch('')}
              aria-label={t.clearFilters}
            >
              <X size={15} />
            </button>
          )}
        </label>
        <select aria-label={t.upper} value={upper} onChange={(e) => setUpper(e.target.value)}>
          <option value="">{t.allUpper}</option>
          {TRIGRAMS.map((tr) => (
            <option key={tr.code} value={tr.code}>
              {tr.symbol} {lang === 'zh' ? tr.name + ' · ' + tr.nature : tr.english}
            </option>
          ))}
        </select>
        <select aria-label={t.lower} value={lower} onChange={(e) => setLower(e.target.value)}>
          <option value="">{t.allLower}</option>
          {TRIGRAMS.map((tr) => (
            <option key={tr.code} value={tr.code}>
              {tr.symbol} {lang === 'zh' ? tr.name + ' · ' + tr.nature : tr.english}
            </option>
          ))}
        </select>
      </div>
      <div className="filter-status">
        <span role="status">
          {filtered.length} / 64 {t.found}
        </span>
        {(search || upper || lower) && (
          <button
            className="text-link"
            onClick={() => {
              setSearch('');
              setUpper('');
              setLower('');
            }}
          >
            {t.clearFilters}
            <X size={13} />
          </button>
        )}
      </div>
      <div className="library-grid">
        {filtered.map((h) => (
          <HexCard h={h} key={h.id} lang={lang} />
        ))}
      </div>
      {!filtered.length && <div className="empty-state">{t.empty}</div>}
      <p className="page-disclaimer">{t.disclaimer}</p>
    </div>
  );
}
export function HexagramDetail({ id, lang }: { id: number; lang: Lang }) {
  const h = getHexagram(id);
  const t = copy[lang];
  return (
    <div className="page detail-page">
      <a href="#library" className="text-link">
        <ArrowLeft size={16} />
        {t.backLibrary}
      </a>
      <div className="detail-intro">
        <div>
          <span className="eyebrow">THE HEXAGRAM ATLAS / {String(id).padStart(2, '0')}</span>
          <h1>{h.fullName}</h1>
          <p>
            {h.pinyin} · {h.english}
          </p>
          <span className="muted small">{t.englishNote}</span>
        </div>
        <DiagramCard
          h={h}
          label={`# ${String(id).padStart(2, '0')}`}
          lang={lang}
          bits={h.bits.split('').map(Number)}
        />
      </div>
      <ClassicalText h={h} lang={lang} />
      <section className="reading-note">
        <span className="eyebrow">{t.readingNote}</span>
        <p>{t.readingText}</p>
      </section>
      <div className="detail-pagination">
        {id > 1 ? (
          <a className="text-link" href={`#hexagram/${id - 1}`}>
            <ArrowLeft size={16} />
            {t.previous}
          </a>
        ) : (
          <span />
        )}
        <a className="button secondary" href="#cast">
          {t.castThis}
          <ArrowRight size={16} />
        </a>
        {id < 64 ? (
          <a className="text-link" href={`#hexagram/${id + 1}`}>
            {t.next}
            <ArrowRight size={16} />
          </a>
        ) : (
          <span />
        )}
      </div>
    </div>
  );
}

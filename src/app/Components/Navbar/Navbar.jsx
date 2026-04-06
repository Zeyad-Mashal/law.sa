"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Fragment, useEffect, useId, useMemo, useRef, useState } from "react";
import { FiGrid, FiInfo, FiMenu, FiSearch, FiX } from "react-icons/fi";
import "./Navbar.css";

const NAV_CATEGORIES = [
  { href: "#", label: "المملكة العربية السعودية" },
  { href: "/lawyers", label: "المحامون" },
  { href: "#", label: "أعمال المحاماة" },
  { href: "#", label: "ممارسة القانون" },
  { href: "#", label: "الشؤون القانونية للشركات" },
  { href: "#", label: "التقنية القانونية" },
  { href: "#", label: "التصنيفات وبيانات السوق" },
  { href: "#", label: "فعاليات" },
  { href: "#", label: "أقسام أخرى" },
];

/** بيانات تجريبية للبحث — يمكن استبدالها بـ API */
const SEARCH_ITEMS = [
  {
    id: "1",
    href: "#",
    title: "نظام المحاكم التجارية",
    description:
      "نظرة عامة على إجراءات المنازعات التجارية أمام المحاكم المختصة في المملكة وآجال الطعن والتنفيذ.",
  },
  {
    id: "2",
    href: "#",
    title: "الشركات",
    description:
      "تأسيس الشركات، أنواعها، والتزامات الشركاء والمديرين وفق نظام الشركات.",
  },
  {
    id: "3",
    href: "#",
    title: "حماية المستهلك",
    description:
      "حقوق المستهلك عند شراء السلع والخدمات ومسارات الشكوى أمام الجهات الرسمية ذات الصلة بما في ذلك التعويض.",
  },
  {
    id: "4",
    href: "#",
    title: "الملكية الفكرية",
    description:
      "علامات تجارية، براءات اختراع، وحقوق المؤلف في البيئة الرقمية.",
  },
  {
    id: "5",
    href: "#",
    title: "التحكيم",
    description:
      "اتفاقيات التحكيم، اختيار المحكمين، تنفيذ أحكام التحكيم محلياً ودولياً وفق اتفاقية نيويورك والأنظمة المحلية.",
  },
  {
    id: "6",
    href: "#",
    title: "الخصوصية والبيانات",
    description: "لوائح حماية البيانات الشخصية وواجبات المتحكم والمعالج.",
  },
  {
    id: "7",
    href: "#",
    title: "العقود الإلكترونية",
    description:
      "صحة التوقيع الإلكتروني والإثبات في المنازعات التعاقدية عبر القنوات الرقمية.",
  },
  {
    id: "8",
    href: "#",
    title: "التقاضي",
    description:
      "مراحل الدعوى، أطرافها، والمواعيد النظامية أمام الجهات القضائية.",
  },
];

function filterSearchItems(query) {
  const t = query.trim();
  if (!t) return [];
  return SEARCH_ITEMS.filter(
    (item) => item.title.includes(t) || item.description.includes(t),
  ).slice(0, 8);
}

function SearchResultsList({ results, query, onPick }) {
  if (!query.trim()) return null;

  return (
    <ul className="nav-search-dropdown" role="listbox">
      {results.length === 0 ? (
        <li className="nav-search-empty" role="presentation">
          لا توجد نتائج
        </li>
      ) : (
        results.map((item) => (
          <li key={item.id} role="presentation">
            <Link
              href={item.href}
              className="nav-search-item"
              role="option"
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => onPick()}
            >
              <span className="nav-search-item-title">{item.title}</span>
              <span className="nav-search-item-desc">{item.description}</span>
            </Link>
          </li>
        ))
      )}
    </ul>
  );
}

export default function Navbar() {
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const drawerId = useId();
  const desktopSearchRef = useRef(null);
  const drawerSearchRef = useRef(null);

  const searchResults = useMemo(
    () => filterSearchItems(searchQuery),
    [searchQuery],
  );

  const showDesktopDropdown =
    searchOpen && searchQuery.trim().length > 0 && !menuOpen;
  const showDrawerDropdown =
    searchOpen && searchQuery.trim().length > 0 && menuOpen;

  function closeSearch() {
    setSearchOpen(false);
  }

  function pickResult() {
    setSearchQuery("");
    closeSearch();
    setMenuOpen(false);
  }

  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e) => {
      if (e.key === "Escape") setMenuOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  useEffect(() => {
    function onDocDown(e) {
      const el = e.target;
      if (
        desktopSearchRef.current?.contains(el) ||
        drawerSearchRef.current?.contains(el)
      ) {
        return;
      }
      closeSearch();
    }
    document.addEventListener("mousedown", onDocDown);
    return () => document.removeEventListener("mousedown", onDocDown);
  }, []);

  useEffect(() => {
    function onKey(e) {
      if (e.key === "Escape" && searchOpen) closeSearch();
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [searchOpen]);

  function onSearchSubmit(e) {
    e.preventDefault();
    const first = searchResults[0];
    if (!first) return;
    if (first.href && first.href !== "#") router.push(first.href);
    pickResult();
  }

  return (
    <header className="nav" dir="rtl">
      <div className="nav-top">
        <div className="nav-top-inner">
          <button
            type="button"
            className="nav-menu-toggle"
            aria-expanded={menuOpen}
            aria-controls={drawerId}
            aria-label={menuOpen ? "إغلاق القائمة" : "فتح القائمة"}
            onClick={() => setMenuOpen((o) => !o)}
          >
            {menuOpen ? <FiX size={22} /> : <FiMenu size={22} />}
          </button>

          <div className="nav-search-block">
            <div className="nav-search-combo" ref={desktopSearchRef}>
              <form className="nav-search-form" onSubmit={onSearchSubmit}>
                <div className="nav-search-field">
                  <FiSearch size={18} aria-hidden />
                  <input
                    type="search"
                    name="q"
                    className="nav-search-input"
                    placeholder="بحث..."
                    autoComplete="off"
                    aria-label="بحث في الموقع"
                    aria-expanded={showDesktopDropdown}
                    aria-controls={
                      showDesktopDropdown
                        ? "nav-search-results-desktop"
                        : undefined
                    }
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      setSearchOpen(true);
                    }}
                    onFocus={() => setSearchOpen(true)}
                  />
                </div>
              </form>
              {showDesktopDropdown ? (
                <div id="nav-search-results-desktop">
                  <SearchResultsList
                    results={searchResults}
                    query={searchQuery}
                    onPick={pickResult}
                  />
                </div>
              ) : null}
            </div>
            <Link href="#" className="nav-advanced">
              بحث
            </Link>
          </div>

          <Link href="/" className="nav-logo">
            LAW.SA
          </Link>

          <div className="nav-actions">
            <Link href="/login" className="nav-btn-outline">
              تسجيل الدخول
            </Link>
            <Link href="/register" className="nav-btn-solid nav-btn-compact">
              إنشاء حساب
            </Link>
          </div>
        </div>
      </div>

      <nav className="nav-bottom" aria-label="أقسام الموقع">
        <div className="nav-bottom-inner">
          <div className="nav-links">
            {NAV_CATEGORIES.map((item, i) => (
              <Fragment key={item.label}>
                {i > 0 ? (
                  <span className="nav-sep" aria-hidden>
                    |
                  </span>
                ) : null}
                <Link href={item.href} className="nav-link">
                  {item.label}
                </Link>
              </Fragment>
            ))}
          </div>
        </div>
      </nav>

      <div
        className={`nav-overlay${menuOpen ? " is-open" : ""}`}
        aria-hidden={!menuOpen}
        onClick={() => setMenuOpen(false)}
      />

      <div
        id={drawerId}
        className={`nav-drawer${menuOpen ? " is-open" : ""}`}
        role="dialog"
        aria-modal="true"
        aria-label="قائمة التنقل"
      >
        <div className="nav-drawer-head">
          <span className="nav-drawer-title">LAW.SA</span>
          <button
            type="button"
            className="nav-drawer-close"
            aria-label="إغلاق"
            onClick={() => setMenuOpen(false)}
          >
            <FiX size={20} />
          </button>
        </div>
        <div className="nav-drawer-body">
          <div className="nav-drawer-search" ref={drawerSearchRef}>
            <div className="nav-search-combo nav-search-combo--drawer">
              <form
                className="nav-drawer-search-form"
                onSubmit={onSearchSubmit}
              >
                <div className="nav-search-field">
                  <FiSearch size={18} aria-hidden />
                  <input
                    type="search"
                    className="nav-search-input"
                    placeholder="بحث..."
                    aria-label="بحث في الموقع"
                    aria-expanded={showDrawerDropdown}
                    aria-controls={
                      showDrawerDropdown
                        ? "nav-search-results-drawer"
                        : undefined
                    }
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      setSearchOpen(true);
                    }}
                    onFocus={() => setSearchOpen(true)}
                  />
                </div>
              </form>
              {showDrawerDropdown ? (
                <div id="nav-search-results-drawer">
                  <SearchResultsList
                    results={searchResults}
                    query={searchQuery}
                    onPick={pickResult}
                  />
                </div>
              ) : null}
            </div>
            <Link
              href="#"
              className="nav-advanced"
              style={{ marginTop: "0.5rem", display: "inline-block" }}
            >
              بحث
            </Link>
          </div>
          <div className="nav-drawer-actions">
            <Link
              href="/login"
              className="nav-btn-outline"
              onClick={() => setMenuOpen(false)}
            >
              تسجيل الدخول
            </Link>
            <Link
              href="/register"
              className="nav-btn-solid"
              onClick={() => setMenuOpen(false)}
            >
              إنشاء حساب
            </Link>
          </div>
          <div className="nav-drawer-nav">
            {NAV_CATEGORIES.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="nav-drawer-link"
                onClick={() => setMenuOpen(false)}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </header>
  );
}

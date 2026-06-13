"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { navLinks } from "@/lib/content";
import { siteContainerClass } from "@/lib/site-container";

function navLinkClasses(active: boolean) {
  const base =
    "flex items-center whitespace-nowrap border-b-[3px] px-[18px] py-3 text-[0.92rem] font-medium text-white transition-colors hover:bg-white/10";

  return active
    ? `${base} border-b-accent bg-transparent text-accent`
    : `${base} border-b-transparent`;
}

function drawerLinkClasses(active: boolean) {
  const base =
    "block border-b border-[#ececec] px-[18px] py-3.5 text-[0.92rem] font-medium text-[#333] hover:bg-[#f5f5f5]";

  return active ? `${base} bg-primary-light font-semibold text-primary-dark` : base;
}

export function SiteNav() {
  const pathname = usePathname();
  const navRef = useRef<HTMLElement>(null);
  const sentinelRef = useRef<HTMLDivElement>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [pinned, setPinned] = useState(false);
  const [navHeight, setNavHeight] = useState(0);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const sentinel = sentinelRef.current;
    const nav = navRef.current;
    if (!sentinel || !nav) return;

    const syncHeight = () => setNavHeight(nav.offsetHeight);

    const observer = new IntersectionObserver(
      ([entry]) => {
        setPinned(!entry.isIntersecting);
        syncHeight();
      },
      { threshold: 0 },
    );

    observer.observe(sentinel);
    syncHeight();
    window.addEventListener("resize", syncHeight);

    return () => {
      observer.disconnect();
      window.removeEventListener("resize", syncHeight);
    };
  }, [pathname]);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!menuOpen) return;

    document.body.style.overflow = "hidden";

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenuOpen(false);
    };

    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [menuOpen]);

  const closeMenu = () => setMenuOpen(false);

  const drawer = (
    <>
      <div
        className={`fixed inset-0 z-500 bg-black/45 transition-opacity duration-250 ${
          menuOpen ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0 hidden"
        }`}
        aria-hidden={!menuOpen}
        onClick={closeMenu}
      />
      <aside
        id="nav-drawer"
        className={`fixed top-0 left-0 z-510 flex h-dvh w-[min(280px,78vw)] flex-col overflow-hidden bg-white shadow-[4px_0_24px_rgba(0,0,0,0.15)] transition-transform duration-280 ease-out ${
          menuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
        aria-hidden={!menuOpen}
        aria-label="Mobile navigation"
      >
        <div className="flex items-center justify-between border-b border-[#e8e8e8] bg-[#fafafa] px-4 py-3.5">
          <p className="m-0 text-[0.95rem] font-bold text-primary-dark">Menu</p>
          <button
            type="button"
            className="cursor-pointer border-0 bg-transparent px-2 py-1 text-[1.6rem] leading-none text-[#555] hover:text-black"
            aria-label="Close menu"
            onClick={closeMenu}
          >
            ×
          </button>
        </div>
        <ul className="m-0 flex-1 list-none overflow-y-auto p-0">
          {navLinks.map((link) => {
            const active = pathname === link.href;
            return (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={drawerLinkClasses(active)}
                  onClick={closeMenu}
                >
                  {link.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </aside>
    </>
  );

  return (
    <>
      <div ref={sentinelRef} className="site-nav-sentinel" aria-hidden="true" />
      {pinned ? (
        <div className="site-nav-placeholder" style={{ height: navHeight }} aria-hidden="true" />
      ) : null}
      <nav
        ref={navRef}
        className={`site-nav${pinned ? " site-nav--pinned" : ""}`}
        aria-label="Main navigation"
      >
        <div
          className={`nav-inner ${siteContainerClass} flex min-h-(--nav-height) items-stretch overflow-x-auto`}
        >
          <div className="nav-emblem-spacer" aria-hidden="true" />

          <ul className="m-0 flex min-w-max list-none items-stretch gap-0 p-0 max-lg:hidden">
            {navLinks.map((link) => {
              const active = pathname === link.href;
              return (
                <li key={link.href}>
                  <Link href={link.href} className={navLinkClasses(active)}>
                    {link.label}
                  </Link>
                </li>
              );
            })}
          </ul>

          <div className="nav-balance-spacer max-lg:hidden" aria-hidden="true" />

          <button
            type="button"
            className="hidden max-lg:ml-auto max-lg:flex max-lg:cursor-pointer max-lg:items-center max-lg:justify-center max-lg:border-0 max-lg:bg-transparent max-lg:px-3 max-lg:py-2"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            aria-controls="nav-drawer"
            onClick={() => setMenuOpen((value) => !value)}
          >
            <span
              className="flex h-5 w-6 flex-col justify-center gap-[5px]"
              aria-hidden="true"
            >
              <span
                className={`block h-0.5 w-full rounded-sm bg-white transition-all duration-200 ${
                  menuOpen ? "translate-y-[7px] rotate-45" : ""
                }`}
              />
              <span
                className={`block h-0.5 w-full rounded-sm bg-white transition-all duration-200 ${
                  menuOpen ? "opacity-0" : ""
                }`}
              />
              <span
                className={`block h-0.5 w-full rounded-sm bg-white transition-all duration-200 ${
                  menuOpen ? "-translate-y-[7px] -rotate-45" : ""
                }`}
              />
            </span>
          </button>
        </div>

        {mounted ? createPortal(drawer, document.body) : null}
      </nav>
    </>
  );
}

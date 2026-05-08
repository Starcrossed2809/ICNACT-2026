(function () {
    const root = document.documentElement;
  
    // Theme
    const themeToggle = document.querySelector("[data-theme-toggle]");
    const THEME_KEY = "icnact_theme";
  
    function applyTheme(theme) {
      if (theme === "dark") root.setAttribute("data-theme", "dark");
      else root.removeAttribute("data-theme");
    }
  
    const savedTheme = localStorage.getItem(THEME_KEY);
    if (savedTheme === "dark") applyTheme("dark");
  
    themeToggle?.addEventListener("click", () => {
      const next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
      if (next === "dark") {
        applyTheme("dark");
        localStorage.setItem(THEME_KEY, "dark");
      } else {
        applyTheme("light");
        localStorage.removeItem(THEME_KEY);
      }
    });
  
    // Sticky header
    const header = document.querySelector("[data-header]");
    function onScroll() {
      header?.classList.toggle("is-scrolled", window.scrollY > 8);
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  
    // Mobile nav
    const navToggle = document.querySelector("[data-nav-toggle]");
    const nav = document.querySelector("[data-nav]");
    navToggle?.addEventListener("click", () => {
      const isOpen = nav?.classList.toggle("is-open");
      navToggle.setAttribute("aria-expanded", String(!!isOpen));
    });
    nav?.querySelectorAll("a").forEach((a) => {
      a.addEventListener("click", () => {
        nav.classList.remove("is-open");
        navToggle?.setAttribute("aria-expanded", "false");
      });
    });
  
    // Toast
    const toast = document.querySelector("[data-toast]");
    let toastTimer = null;
    function showToast(message) {
      if (!toast) return;
      toast.textContent = message;
      toast.classList.add("is-visible");
      if (toastTimer) window.clearTimeout(toastTimer);
      toastTimer = window.setTimeout(() => toast.classList.remove("is-visible"), 2600);
    }
  
    async function copyText(text, okMessage) {
      try {
        await navigator.clipboard.writeText(text);
        showToast(okMessage || "Copied!");
      } catch {
        showToast("Copy failed (browser blocked).");
      }
    }
  
    document.querySelector("[data-copy-website]")?.addEventListener("click", () => {
      copyText("https://vitbhopal.ac.in/icnact-2025", "Website link copied.");
    });
  
    document.querySelector("[data-copy-address]")?.addEventListener("click", () => {
      copyText(
        "School of Advanced Sciences and Languages (SASL), VIT Bhopal University, Kothri-Kalan, Bhopal-Indore Highway, Madhya Pradesh-466114, India",
        "Address copied."
      );
    });
  
    document.querySelector("[data-copy-bank]")?.addEventListener("click", () => {
      copyText(
        [
          "Account Name: SASL VIT BHOPAL",
          "Account Number: 6994648311",
          "Bank Name: Indian Bank",
          "Branch Name: VIT Bhopal University",
          "IFSC Code: IDIB000V143",
          "Branch Code: 2953",
          "Swift Code: IDIBINBBMAS",
          "* Excluding Swift Charges",
        ].join("\n"),
        "Bank details copied."
      );
    });
  
    document.querySelectorAll("[data-copy-email]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const email = btn.getAttribute("data-copy-email");
        if (email) copyText(email, "Email copied.");
      });
    });
  
    // Footer year
    const yearEl = document.querySelector("[data-year]");
    if (yearEl) yearEl.textContent = String(new Date().getFullYear());
  
    // Search: highlight matches + open details + scroll into view
    const search = document.querySelector("[data-search]");
    const scopes = Array.from(document.querySelectorAll("[data-search-scope]"));
    const detailsList = Array.from(document.querySelectorAll("details"));
  
    function clearHighlights() {
      document.querySelectorAll("mark.hit").forEach((m) => {
        const text = document.createTextNode(m.textContent || "");
        m.replaceWith(text);
      });
    }
  
    function highlightInElement(el, q) {
      const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
      const texts = [];
      while (walker.nextNode()) texts.push(walker.currentNode);
  
      const query = q.toLowerCase();
      let found = false;
  
      texts.forEach((node) => {
        const v = node.nodeValue;
        if (!v) return;
        const idx = v.toLowerCase().indexOf(query);
        if (idx === -1) return;
  
        found = true;
        const before = v.slice(0, idx);
        const hit = v.slice(idx, idx + q.length);
        const after = v.slice(idx + q.length);
  
        const mark = document.createElement("mark");
        mark.className = "hit";
        mark.textContent = hit;
  
        const frag = document.createDocumentFragment();
        if (before) frag.appendChild(document.createTextNode(before));
        frag.appendChild(mark);
        if (after) frag.appendChild(document.createTextNode(after));
  
        node.parentNode?.replaceChild(frag, node);
      });
  
      return found;
    }
  
    function doSearch(q) {
      clearHighlights();
      if (!q || q.trim().length < 2) return;
  
      const query = q.trim();
      let firstHit = null;
  
      // open all details so search can find inside them
      detailsList.forEach((d) => (d.open = true));
  
      scopes.forEach((scope) => {
        const hit = highlightInElement(scope, query);
        if (hit && !firstHit) firstHit = scope;
      });
  
      if (firstHit) {
        firstHit.scrollIntoView({ behavior: "smooth", block: "center" });
        showToast("Found matches.");
      } else {
        showToast("No matches found.");
      }
    }
  
    let searchTimer = null;
    search?.addEventListener("input", () => {
      if (searchTimer) clearTimeout(searchTimer);
      const value = search.value;
      searchTimer = setTimeout(() => doSearch(value), 180);
    });
  })();
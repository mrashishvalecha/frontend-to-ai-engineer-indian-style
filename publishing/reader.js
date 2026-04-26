(function () {
  const ready = (fn) => {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", fn);
    } else {
      fn();
    }
  };

  ready(() => {
    document.body.classList.add("reader-enhanced");

    const toc = document.getElementById("TOC");
    const existingNodes = Array.from(document.body.childNodes);
    const main = document.createElement("main");
    main.className = "reader-main";

    existingNodes.forEach((node) => {
      if (node === toc) return;
      main.appendChild(node);
    });

    const progress = document.createElement("div");
    progress.className = "reader-progress";
    progress.innerHTML = "<span></span>";

    const toolbar = document.createElement("div");
    toolbar.className = "reader-toolbar";
    toolbar.innerHTML = `
      <div class="reader-brand">
        <strong>From Frontend Developer to AI Engineer</strong>
        <span>Ashish Valecha · Interactive ebook reader</span>
      </div>
      <div class="reader-actions">
        <button class="reader-btn" type="button" data-reader-action="toc">Contents</button>
        <button class="reader-btn" type="button" data-reader-action="search">Search</button>
        <button class="reader-btn" type="button" data-reader-action="font-down">A-</button>
        <button class="reader-btn" type="button" data-reader-action="font-up">A+</button>
        <button class="reader-btn" type="button" data-reader-action="theme">Dark</button>
        <a class="reader-download" href="frontend-to-ai-engineer-indian-style.epub" download>Download EPUB</a>
      </div>
    `;

    const hero = document.createElement("section");
    hero.className = "reader-hero";
    hero.innerHTML = `
      <div class="reader-hero-inner">
        <div>
          <p class="reader-kicker">Free interactive ebook</p>
          <h1><span>From Frontend</span><span>Developer to AI</span><span>Engineer</span></h1>
          <p><span>Indian-style practical roadmap</span><span>for Angular and React developers</span><span>who want to become AI-friendly</span><span>in the AI era.</span></p>
          <div class="reader-hero-actions">
            <a class="reader-primary" href="#preface">Start Reading</a>
            <button class="reader-secondary" type="button" data-reader-action="toc">Open Contents</button>
          </div>
          <div class="reader-stats" aria-label="Book stats">
            <div class="reader-stat"><strong data-reader-stat="chapters">17</strong><span>chapters</span></div>
            <div class="reader-stat"><strong data-reader-stat="minutes">--</strong><span>min read</span></div>
            <div class="reader-stat"><strong>EPUB</strong><span>free download</span></div>
          </div>
        </div>
        <div class="reader-cover-card">
          <img src="assets/cover.png" alt="From Frontend Developer to AI Engineer ebook cover">
        </div>
      </div>
    `;

    const scrim = document.createElement("div");
    scrim.className = "reader-scrim";

    const searchPanel = document.createElement("div");
    searchPanel.className = "reader-search-panel";
    searchPanel.innerHTML = `
      <div class="reader-search-row">
        <input type="search" placeholder="Search chapters, examples, RAG, prompts..." aria-label="Search this ebook">
        <button class="reader-btn" type="button" data-reader-action="close-search">Close</button>
      </div>
      <div class="reader-search-results" aria-live="polite"></div>
    `;

    const floating = document.createElement("div");
    floating.className = "reader-floating";
    floating.innerHTML = `
      <button class="reader-btn" type="button" data-reader-action="top" title="Back to top">Top</button>
    `;

    document.body.append(progress, toolbar);
    if (toc) document.body.appendChild(toc);
    document.body.append(hero, main, scrim, searchPanel, floating);

    if (toc) {
      toc.classList.add("reader-toc-panel");
      const title = document.createElement("div");
      title.className = "reader-toc-title";
      title.innerHTML = `<strong>Book Contents</strong><button class="reader-btn" type="button" data-reader-action="close-toc">Close</button>`;
      toc.prepend(title);
    }

    const themeButton = toolbar.querySelector('[data-reader-action="theme"]');
    const savedTheme = localStorage.getItem("reader-theme");
    if (savedTheme === "dark") {
      document.body.classList.add("reader-dark");
      themeButton.textContent = "Light";
    }

    let fontScale = Number(localStorage.getItem("reader-font-scale") || "1");
    const applyFontScale = () => {
      fontScale = Math.min(1.22, Math.max(0.92, fontScale));
      document.documentElement.style.setProperty("--reader-font-scale", fontScale.toFixed(2));
      localStorage.setItem("reader-font-scale", fontScale.toFixed(2));
    };
    applyFontScale();

    const openToc = () => {
      if (!toc) return;
      toc.classList.add("open");
      scrim.classList.add("open");
    };

    const closeToc = () => {
      if (toc) toc.classList.remove("open");
      scrim.classList.remove("open");
    };

    const openSearch = () => {
      searchPanel.classList.add("open");
      searchPanel.querySelector("input").focus();
    };

    const closeSearch = () => {
      searchPanel.classList.remove("open");
    };

    document.body.addEventListener("click", (event) => {
      const actionNode = event.target.closest("[data-reader-action]");
      if (!actionNode) return;

      const action = actionNode.dataset.readerAction;
      if (action === "toc") openToc();
      if (action === "close-toc") closeToc();
      if (action === "search") openSearch();
      if (action === "close-search") closeSearch();
      if (action === "top") window.scrollTo({ top: 0, behavior: "smooth" });
      if (action === "font-up") {
        fontScale += 0.06;
        applyFontScale();
      }
      if (action === "font-down") {
        fontScale -= 0.06;
        applyFontScale();
      }
      if (action === "theme") {
        document.body.classList.toggle("reader-dark");
        const dark = document.body.classList.contains("reader-dark");
        localStorage.setItem("reader-theme", dark ? "dark" : "light");
        themeButton.textContent = dark ? "Light" : "Dark";
      }
    });

    scrim.addEventListener("click", closeToc);
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        closeToc();
        closeSearch();
      }
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        openSearch();
      }
    });

    if (toc) {
      toc.addEventListener("click", (event) => {
        if (event.target.closest("a")) closeToc();
      });
    }

    const updateProgress = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const ratio = max > 0 ? window.scrollY / max : 0;
      progress.querySelector("span").style.transform = `scaleX(${Math.min(1, Math.max(0, ratio))})`;
    };
    updateProgress();
    window.addEventListener("scroll", updateProgress, { passive: true });

    const words = main.innerText.trim().split(/\s+/).filter(Boolean).length;
    const minutes = Math.max(1, Math.round(words / 210));
    const chapters = main.querySelectorAll("h1[id^='chapter-']").length || 17;
    const minutesNode = document.querySelector('[data-reader-stat="minutes"]');
    const chaptersNode = document.querySelector('[data-reader-stat="chapters"]');
    if (minutesNode) minutesNode.textContent = String(minutes);
    if (chaptersNode) chaptersNode.textContent = String(chapters);

    const revealTargets = main.querySelectorAll("h1, h2, h3, p, li, table, pre, figure");
    revealTargets.forEach((node) => node.classList.add("reveal"));
    if ("IntersectionObserver" in window) {
      const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            revealObserver.unobserve(entry.target);
          }
        });
      }, { rootMargin: "0px 0px -8% 0px", threshold: 0.05 });
      revealTargets.forEach((node) => revealObserver.observe(node));
    } else {
      revealTargets.forEach((node) => node.classList.add("is-visible"));
    }

    const headings = Array.from(main.querySelectorAll("h1[id], h2[id]"));
    const tocLinks = Array.from(document.querySelectorAll("#TOC a[href^='#']"));
    if ("IntersectionObserver" in window) {
      const activeObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const id = entry.target.id;
          tocLinks.forEach((link) => {
            link.classList.toggle("active", link.getAttribute("href") === `#${id}`);
          });
        });
      }, { rootMargin: "-20% 0px -70% 0px", threshold: 0.01 });
      headings.forEach((heading) => activeObserver.observe(heading));
    }

    main.querySelectorAll("pre").forEach((pre) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "reader-btn reader-copy-code";
      button.textContent = "Copy";
      pre.before(button);
      button.addEventListener("click", async () => {
        const text = pre.innerText;
        try {
          await navigator.clipboard.writeText(text);
          button.textContent = "Copied";
          setTimeout(() => { button.textContent = "Copy"; }, 1400);
        } catch {
          button.textContent = "Select";
        }
      });
    });

    const searchInput = searchPanel.querySelector("input");
    const searchResults = searchPanel.querySelector(".reader-search-results");
    const searchIndex = Array.from(main.querySelectorAll("h1, h2, h3, p, li")).map((node, index) => {
      if (!node.id) node.id = `reader-search-${index}`;
      const nearestHeading = node.closest("section")?.querySelector("h1, h2, h3");
      const heading = node.matches("h1, h2, h3") ? node.innerText : nearestHeading?.innerText || "Book section";
      return {
        id: node.id,
        heading,
        text: node.innerText.replace(/\s+/g, " ").trim()
      };
    }).filter((item) => item.text.length > 30);

    const renderSearch = () => {
      const query = searchInput.value.trim().toLowerCase();
      searchResults.innerHTML = "";
      if (query.length < 2) {
        searchResults.innerHTML = '<p style="margin:0;color:var(--reader-muted);font-family:Arial,Helvetica,sans-serif;">Type at least 2 characters to search this ebook.</p>';
        return;
      }
      const matches = searchIndex
        .map((item) => ({ item, score: item.text.toLowerCase().includes(query) ? 1 : item.heading.toLowerCase().includes(query) ? 0.8 : 0 }))
        .filter((row) => row.score > 0)
        .slice(0, 10);

      if (!matches.length) {
        searchResults.innerHTML = '<p style="margin:0;color:var(--reader-muted);font-family:Arial,Helvetica,sans-serif;">No matches found. Try words like RAG, prompt, Python, portfolio, or agent.</p>';
        return;
      }

      matches.forEach(({ item }) => {
        const button = document.createElement("button");
        button.type = "button";
        button.className = "reader-search-result";
        const preview = item.text.length > 160 ? `${item.text.slice(0, 160)}...` : item.text;
        button.innerHTML = `<strong>${escapeHtml(item.heading)}</strong><span>${escapeHtml(preview)}</span>`;
        button.addEventListener("click", () => {
          closeSearch();
          const target = document.getElementById(item.id);
          if (target) {
            target.scrollIntoView({ behavior: "smooth", block: "start" });
            target.classList.add("reader-highlight");
            setTimeout(() => target.classList.remove("reader-highlight"), 1300);
          }
        });
        searchResults.appendChild(button);
      });
    };

    searchInput.addEventListener("input", renderSearch);
    renderSearch();
  });

  function escapeHtml(value) {
    return value
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }
})();

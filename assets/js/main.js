(function () {
  const root = document.documentElement;
  const themeButtons = [
    document.getElementById("theme-toggle"),
    document.getElementById("mobile-theme-toggle"),
  ].filter(Boolean);
  const languageButtons = Array.from(document.querySelectorAll("[data-lang-button]"));

  let i18n = {};
  let currentLanguage = "pt";

  function getTranslation(path, language = currentLanguage) {
    return path.split(".").reduce((value, key) => value?.[key], i18n[language]);
  }

  function setText(selector, value) {
    const element = document.querySelector(selector);
    if (element && value) {
      element.setAttribute("content", value);
    }
  }

  function setTheme(theme) {
    root.classList.toggle("dark", theme === "dark");
    root.classList.toggle("light", theme === "light");
    localStorage.setItem("theme", theme);
  }

  function escapeHTML(value) {
    return String(value ?? "")
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  function renderPill(item, compact = false, extraClass = "") {
    const paddingClass = compact ? "px-2 py-0.5" : "px-2 py-1";
    return `<span class="${paddingClass} ${extraClass}">${escapeHTML(item)}</span>`;
  }

  function renderHeroTags() {
    const container = document.getElementById("hero-tags");
    const tags = getTranslation("hero.tags") || [];

    if (!container) {
      return;
    }

    container.innerHTML = tags
      .map((tag) =>
        renderPill(
          tag,
          false,
          "bg-surface-container border border-outline-variant rounded text-technical-caps text-on-surface-variant"
        )
      )
      .join("");
  }

  function renderContactTags() {
    const container = document.getElementById("contact-tags");
    const tags = getTranslation("contact.tags") || [];

    if (!container) {
      return;
    }

    container.innerHTML = tags
      .map((tag) => renderPill(tag, false, "px-3 py-1 border border-outline-variant rounded text-xs"))
      .join("");
  }

  function renderSpecialties() {
    const container = document.getElementById("specialties-container");
    const items = getTranslation("specialties.items") || [];

    if (!container) {
      return;
    }

    container.innerHTML = items
      .map(
        (item) => `
          <div class="p-stack-md bg-surface-container border border-outline-variant rounded-xl flex flex-col items-center text-center space-y-2">
            <span class="material-symbols-outlined text-primary text-3xl">${escapeHTML(item.icon)}</span>
            <span class="font-technical-caps text-technical-caps text-on-surface">${escapeHTML(item.label)}</span>
          </div>
        `
      )
      .join("");
  }

  function renderTechnicalStack() {
    const container = document.getElementById("stack-container");
    const cards = getTranslation("stack.cards") || [];

    if (!container) {
      return;
    }

    container.innerHTML = cards
      .map(
        (card) => `
          <div class="p-stack-md bg-surface-container border border-outline-variant rounded-xl">
            <h3 class="font-label text-label text-primary uppercase mb-stack-md">${escapeHTML(card.title)}</h3>
            <div class="flex flex-wrap gap-2">
              ${(card.items || [])
                .map((item) =>
                  renderPill(
                    item,
                    false,
                    "bg-surface-container-highest text-[10px] font-bold text-on-surface-variant rounded"
                  )
                )
                .join("")}
            </div>
          </div>
        `
      )
      .join("");
  }

  function renderActivities(items = [], variant = "text-on-surface") {
    if (!items.length) {
      return "";
    }

    return `
      <div class="mb-4">
        <p class="text-label text-primary text-xs uppercase font-bold mb-2">${escapeHTML(
          getTranslation("experience.mainActivities")
        )}</p>
        <ul class="experience-list ${variant} text-sm list-none p-0">
          ${items.map((item) => `<li>${escapeHTML(item)}</li>`).join("")}
        </ul>
      </div>
    `;
  }

  function renderExperienceStack(items = [], compact = false) {
    if (!items.length) {
      return "";
    }

    return `
      <div>
        <p class="text-label text-primary text-xs uppercase font-bold mb-2">${escapeHTML(
          getTranslation("experience.stack")
        )}</p>
        <div class="flex flex-wrap gap-2">
          ${items
            .map((item) =>
              renderPill(
                item,
                compact,
                "bg-background border border-outline-variant rounded text-[10px] text-on-surface-variant"
              )
            )
            .join("")}
        </div>
      </div>
    `;
  }

  function renderProject(project) {
    return `
      <div class="bg-surface-container p-6 rounded-lg border border-outline-variant experience-card transition-all">
        <h4 class="font-bold text-on-surface mb-3 flex items-center gap-2">
          <span class="material-symbols-outlined text-primary">${escapeHTML(project.icon || "work")}</span>
          ${escapeHTML(project.name)}
        </h4>
        <p class="text-on-surface text-sm mb-4">${escapeHTML(project.description)}</p>
        ${renderActivities(project.activities, "text-on-surface-variant")}
        ${renderExperienceStack(project.stack, true)}
      </div>
    `;
  }

  function renderExperienceCard(item) {
    return `
      <div class="bg-surface-container p-6 rounded-lg border border-outline-variant experience-card transition-all">
        <p class="text-on-surface text-sm mb-4">${escapeHTML(item.description)}</p>
        ${renderActivities(item.activities)}
        ${renderExperienceStack(item.stack)}
      </div>
    `;
  }

  function renderExperience() {
    const container = document.getElementById("experience-container");
    const items = getTranslation("experience.items") || [];

    if (!container) {
      return;
    }

    container.innerHTML = items
      .map((item, index) => {
        const markerColor = index === 0 ? "bg-primary" : "bg-outline";
        const periodColor = index === 0 ? "text-primary" : "text-outline";
        const roleColor = index === 0 ? "text-primary" : "text-outline";
        const body = item.projects?.length
          ? `<div class="space-y-8">${item.projects.map(renderProject).join("")}</div>`
          : renderExperienceCard(item);

        return `
          <div class="relative">
            <div class="absolute -left-[41px] top-0 w-4 h-4 rounded-full ${markerColor} border-4 border-background"></div>
            <div class="flex flex-col md:flex-row md:justify-between items-start mb-${index === 0 ? "6" : "4"}">
              <div>
                <h3 class="font-h3 text-h3 text-on-surface">${escapeHTML(item.company)}</h3>
                <p class="text-label font-label ${roleColor} mb-1">${escapeHTML(item.role)}</p>
              </div>
              <span class="font-technical-caps text-technical-caps ${periodColor}">${escapeHTML(item.period)}</span>
            </div>
            ${body}
          </div>
        `;
      })
      .join("");
  }

  function renderEducation() {
    const container = document.getElementById("education-container");
    const items = getTranslation("education.items") || [];

    if (!container) {
      return;
    }

    container.innerHTML = items
      .map(
        (item) => `
          <div class="p-gutter border border-outline-variant rounded-lg bg-surface-container-low">
            <span class="font-technical-caps text-technical-caps text-primary mb-2 block">${escapeHTML(item.period)}</span>
            <h3 class="font-h3 text-h3 text-on-surface">${escapeHTML(item.title)}</h3>
            <p class="text-on-surface-variant mt-2">${escapeHTML(item.institution)}</p>
            <p class="text-outline text-sm mt-1">${escapeHTML(item.description)}</p>
          </div>
        `
      )
      .join("");
  }

  function updateStaticText() {
    document.querySelectorAll("[data-i18n]").forEach((element) => {
      const value = getTranslation(element.dataset.i18n);
      if (typeof value === "string") {
        element.textContent = value;
      }
    });

    document.querySelectorAll("[data-i18n-attr]").forEach((element) => {
      element.dataset.i18nAttr.split(",").forEach((pair) => {
        const [attribute, path] = pair.split(":").map((part) => part.trim());
        const value = getTranslation(path);
        if (attribute && typeof value === "string") {
          element.setAttribute(attribute, value);
        }
      });
    });
  }

  function updateMetadata() {
    const meta = getTranslation("meta") || {};
    root.lang = meta.lang || (currentLanguage === "en" ? "en" : "pt-BR");

    if (meta.title) {
      document.title = meta.title;
    }

    setText('meta[name="description"]', meta.description);
    setText('meta[property="og:title"]', meta.ogTitle || meta.title);
    setText('meta[property="og:description"]', meta.ogDescription || meta.description);
    setText('meta[property="og:image:alt"]', meta.imageAlt);
    setText('meta[name="twitter:title"]', meta.twitterTitle || meta.title);
    setText('meta[name="twitter:description"]', meta.twitterDescription || meta.description);

    const ogLocale = document.querySelector('meta[property="og:locale"]');
    if (ogLocale) {
      ogLocale.setAttribute("content", currentLanguage === "en" ? "en_US" : "pt_BR");
    }

    const schema = document.querySelector('script[type="application/ld+json"]');
    if (schema && meta.jobTitle) {
      try {
        const data = JSON.parse(schema.textContent);
        data.jobTitle = meta.jobTitle;
        schema.textContent = JSON.stringify(data, null, 2);
      } catch (error) {
        console.warn("Unable to update structured data.", error);
      }
    }
  }

  function updateLanguageButtons() {
    languageButtons.forEach((button) => {
      const active = button.dataset.langButton === currentLanguage;
      button.classList.toggle("text-primary", active);
      button.classList.toggle("text-on-surface-variant", !active);
      button.setAttribute("aria-pressed", String(active));
    });
  }

  function setLanguage(language) {
    currentLanguage = language === "en" ? "en" : "pt";

    updateStaticText();
    updateMetadata();
    renderHeroTags();
    renderSpecialties();
    renderTechnicalStack();
    renderExperience();
    renderEducation();
    renderContactTags();
    updateLanguageButtons();

    localStorage.setItem("language", currentLanguage);
  }

  window.setLanguage = setLanguage;

  setTheme(localStorage.getItem("theme") === "light" ? "light" : "dark");

  themeButtons.forEach((button) => {
    button.addEventListener("click", () => {
      setTheme(root.classList.contains("dark") ? "light" : "dark");
    });
  });

  languageButtons.forEach((button) => {
    button.addEventListener("click", () => setLanguage(button.dataset.langButton));
  });

  fetch("i18n.json")
    .then((response) => {
      if (!response.ok) {
        throw new Error(`Unable to load i18n.json: ${response.status}`);
      }
      return response.json();
    })
    .then((data) => {
      i18n = data;
      setLanguage(localStorage.getItem("language") || "pt");
    })
    .catch((error) => {
      console.error(error);
    });
})();

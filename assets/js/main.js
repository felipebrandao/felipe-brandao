(function () {
  const root = document.documentElement;
  const buttons = [
    document.getElementById("theme-toggle"),
    document.getElementById("mobile-theme-toggle"),
  ].filter(Boolean);

  function setTheme(theme) {
    root.classList.toggle("dark", theme === "dark");
    root.classList.toggle("light", theme === "light");
    localStorage.setItem("theme", theme);
  }

  const storedTheme = localStorage.getItem("theme");
  setTheme(storedTheme === "light" ? "light" : "dark");

  buttons.forEach((button) => {
    button.addEventListener("click", () => {
      setTheme(root.classList.contains("dark") ? "light" : "dark");
    });
  });
})();

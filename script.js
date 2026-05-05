/* ─── Typing Text ─── */
const typingStrings = [
  "Generative AI Developer",
  "LLM Engineer",
  "AI Automation Specialist",
  "Machine Learning Engineer",
  "AI Product Builder"
];
let tIdx = 0, cIdx = 0, deleting = false;
const typingEl = document.getElementById("typingText");

function typeWriter() {
  const current = typingStrings[tIdx];
  if (!deleting) {
    typingEl.textContent = current.slice(0, ++cIdx);
    if (cIdx === current.length) { deleting = true; setTimeout(typeWriter, 1800); return; }
  } else {
    typingEl.textContent = current.slice(0, --cIdx);
    if (cIdx === 0) { deleting = false; tIdx = (tIdx + 1) % typingStrings.length; }
  }
  setTimeout(typeWriter, deleting ? 60 : 90);
}
typeWriter();

/* ─── Navbar scroll ─── */
const navbar = document.getElementById("navbar");
window.addEventListener("scroll", () => {
  navbar.classList.toggle("scrolled", window.scrollY > 50);
  highlightNav();
});

/* ─── Hamburger ─── */
const hamburger = document.getElementById("hamburger");
const navLinks = document.getElementById("navLinks");
hamburger.addEventListener("click", () => navLinks.classList.toggle("open"));
navLinks.querySelectorAll("a").forEach(a => a.addEventListener("click", () => navLinks.classList.remove("open")));

/* ─── Active Nav ─── */
function highlightNav() {
  const sections = document.querySelectorAll("section[id]");
  const scrollY = window.scrollY + 120;
  sections.forEach(sec => {
    const link = document.querySelector(`.nav-link[href="#${sec.id}"]`);
    if (!link) return;
    link.classList.toggle("active", scrollY >= sec.offsetTop && scrollY < sec.offsetTop + sec.offsetHeight);
  });
}

/* ─── Counter Animation ─── */
function animateCounters() {
  document.querySelectorAll(".stat-num").forEach(el => {
    const target = +el.dataset.target;
    let count = 0;
    const step = target / 60;
    const timer = setInterval(() => {
      count = Math.min(count + step, target);
      el.textContent = Math.floor(count);
      if (count >= target) clearInterval(timer);
    }, 20);
  });
}

/* ─── Intersection Observer ─── */
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const el = entry.target;
    if (el.classList.contains("skill-card")) {
      const delay = +(el.dataset.delay || 0);
      setTimeout(() => {
        el.classList.add("visible");
        const fill = el.querySelector(".skill-fill");
        if (fill) fill.style.width = fill.dataset.width + "%";
      }, delay);
    }
    if (el.id === "home" || el.classList.contains("hero")) animateCounters();
    observer.unobserve(el);
  });
}, { threshold: 0.15 });

document.querySelectorAll(".skill-card").forEach(c => observer.observe(c));
observer.observe(document.getElementById("home"));

/* ─── GitHub Projects ─── */
const GITHUB_USER = "unik333";
const langColors = {
  Python: "#3572A5", JavaScript: "#f1e05a", TypeScript: "#2b7489",
  HTML: "#e34c26", CSS: "#563d7c", Jupyter: "#DA5B0B",
  Shell: "#89e051", Go: "#00ADD8", Rust: "#dea584", "C++": "#f34b7d"
};
const repoIcons = ["🤖", "🧠", "⚡", "🔮", "🛸", "💡", "🌐", "🔬", "🎯", "🚀"];

async function fetchProjects() {
  const grid = document.getElementById("projectsGrid");
  const loading = document.getElementById("projectsLoading");
  try {
    const res = await fetch(`https://api.github.com/users/${GITHUB_USER}/repos?sort=updated&per_page=9`);
    if (!res.ok) throw new Error("GitHub API error");
    const repos = await res.json();
    loading.remove();
    const filtered = repos.filter(r => !r.fork).slice(0, 9);
    if (!filtered.length) { grid.innerHTML = "<p style='color:var(--text-muted);grid-column:1/-1;text-align:center;padding:40px'>No public repositories found.</p>"; return; }
    filtered.forEach((repo, i) => {
      const color = langColors[repo.language] || "#a78bfa";
      const icon = repoIcons[i % repoIcons.length];
      const desc = repo.description || "An AI-powered project by unik333.";
      const card = document.createElement("a");
      card.href = repo.html_url;
      card.target = "_blank";
      card.rel = "noopener";
      card.className = "project-card";
      card.style.animationDelay = `${i * 80}ms`;
      card.innerHTML = `
        <div class="project-header">
          <span class="project-icon">${icon}</span>
          <span class="project-stars"><i class="fa-solid fa-star"></i> ${repo.stargazers_count}</span>
        </div>
        <h3>${repo.name.replace(/-/g, " ")}</h3>
        <p class="project-desc">${desc.length > 100 ? desc.slice(0, 100) + "…" : desc}</p>
        <div class="project-footer">
          ${repo.language ? `<span class="project-lang"><span class="lang-dot" style="background:${color}"></span>${repo.language}</span>` : "<span></span>"}
          <span class="project-link"><i class="fa-brands fa-github"></i> View</span>
        </div>`;
      grid.appendChild(card);
    });
  } catch (e) {
    loading.innerHTML = "<p style='color:var(--text-muted)'>Could not load projects. <a href='https://github.com/unik333' style='color:var(--purple-light)'>View on GitHub →</a></p>";
  }
}
fetchProjects();

/* ─── Contact Form ─── */
document.getElementById("contactForm").addEventListener("submit", function(e) {
  e.preventDefault();
  const btn = this.querySelector("button[type=submit]");
  const success = document.getElementById("formSuccess");
  btn.disabled = true;
  btn.textContent = "Sending…";
  setTimeout(() => {
    btn.disabled = false;
    btn.innerHTML = '<i class="fa-solid fa-paper-plane"></i> Send Message';
    success.classList.add("show");
    this.reset();
    setTimeout(() => success.classList.remove("show"), 4000);
  }, 1200);
});

/* ─── Smooth Reveal on Scroll ─── */
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = "1";
      entry.target.style.transform = "translateY(0)";
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll(".service-card, .about-grid, .contact-grid").forEach(el => {
  el.style.opacity = "0";
  el.style.transform = "translateY(30px)";
  el.style.transition = "opacity 0.6s ease, transform 0.6s ease";
  revealObserver.observe(el);
});

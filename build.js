#!/usr/bin/env node
/*
 * build.js — pre-renders index.template.html + data.json into a fully static
 * index.html, so the served page contains real, crawlable content and works
 * with JavaScript disabled.
 *
 * Usage:  node build.js
 *
 * data.json stays the single source of truth. Edit it, run this, commit the
 * regenerated index.html (the GitHub Action does this automatically on push).
 */

const fs = require("fs");
const path = require("path");

const ROOT = __dirname;
const data = JSON.parse(fs.readFileSync(path.join(ROOT, "data.json"), "utf8"));
let tpl = fs.readFileSync(path.join(ROOT, "index.template.html"), "utf8");

/* ---- text helpers (mirror the browser versions) ---- */
const esc = (s) =>
  String(s ?? "").replace(/[&<>"']/g, (c) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c])
  );

// **bold** -> <strong>bold</strong>, run on already-escaped text.
const inline = (t) => t.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");

// Rich text: \n -> <br>, "- item" -> bullet list, **bold** -> <strong>.
const formatText = (s) => {
  const lines = esc(s).split(/\r?\n/);
  const parts = [];
  let text = [];
  let list = [];
  const flushText = () => { if (text.length) { parts.push(text.join("<br>")); text = []; } };
  const flushList = () => {
    if (list.length) { parts.push('<ul class="desc-list">' + list.join("") + "</ul>"); list = []; }
  };
  for (const line of lines) {
    const m = line.match(/^\s*[-*]\s+(.*)$/);
    if (m) { flushText(); list.push("<li>" + inline(m[1].trim()) + "</li>"); }
    else { flushList(); text.push(inline(line)); }
  }
  flushText();
  flushList();
  return parts.join("");
};

/* ---- icons ---- */
const downloadIcon =
  '<svg class="btn-icon" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' +
  '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />' +
  '<polyline points="7 10 12 15 17 10" />' +
  '<line x1="12" y1="15" x2="12" y2="3" />' +
  '</svg>';
const mailIcon =
  '<svg class="btn-icon" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' +
  '<path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />' +
  '<polyline points="22,6 12,13 2,6" />' +
  '</svg>';
const githubIcon =
  '<svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true">' +
  '<path d="M12 .5C5.37.5 0 5.87 0 12.5c0 5.3 3.44 9.8 8.21 11.39.6.11.82-.26.82-.58 ' +
  "0-.29-.01-1.04-.02-2.05-3.34.73-4.04-1.61-4.04-1.61-.55-1.39-1.33-1.76-1.33-1.76-1.09-.75.08-.73.08-.73 " +
  "1.2.09 1.83 1.24 1.83 1.24 1.07 1.83 2.81 1.3 3.5.99.11-.78.42-1.3.76-1.6-2.67-.3-5.47-1.34-5.47-5.95 " +
  "0-1.31.47-2.39 1.24-3.23-.13-.3-.54-1.52.11-3.18 0 0 1.01-.32 3.3 1.23a11.5 11.5 0 0 1 6 0c2.29-1.55 " +
  "3.3-1.23 3.3-1.23.65 1.66.24 2.88.12 3.18.77.84 1.23 1.92 1.23 3.23 0 4.62-2.81 5.64-5.49 5.94.43.37.81 " +
  '1.1.81 2.22 0 1.61-.01 2.9-.01 3.29 0 .32.21.7.82.58C20.57 22.29 24 17.79 24 12.5 24 5.87 18.63.5 12 .5z"/></svg>';
const youtubeIcon =
  '<svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true">' +
  '<path d="M23.5 6.2a3 3 0 0 0-2.11-2.12C19.5 3.5 12 3.5 12 3.5s-7.5 0-9.39.58A3 3 0 0 0 .5 6.2 ' +
  "31.4 31.4 0 0 0 0 12a31.4 31.4 0 0 0 .5 5.8 3 3 0 0 0 2.11 2.12C4.5 20.5 12 20.5 12 20.5s7.5 0 " +
  '9.39-.58a3 3 0 0 0 2.11-2.12A31.4 31.4 0 0 0 24 12a31.4 31.4 0 0 0-.5-5.8zM9.6 15.6V8.4l6.2 3.6-6.2 3.6z"/></svg>';
const pinIcon =
  '<svg viewBox="0 0 24 24" width="12" height="12" fill="currentColor" aria-hidden="true">' +
  '<path d="M16 3l5 5-1.5 1.5-1-1-4 4 .5 4.5-2 2-3.5-3.5L4 21l-1-1 4.5-5.5L4 11l2-2 4.5.5 4-4-1-1L15 3z"/></svg>';
const boltIcon =
  '<svg viewBox="0 0 24 24" width="13" height="13" fill="currentColor" aria-hidden="true">' +
  '<path d="M13 2 3 14h7l-1 8 10-12h-7l1-8z"/></svg>';
const awardIcon =
  '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
  '<circle cx="12" cy="8" r="6" /><path d="M8.5 13.5 7 22l5-3 5 3-1.5-8.5" /></svg>';
const linkedinIcon =
  '<svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor" aria-hidden="true">' +
  '<path d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.42v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28zM5.34 7.43a2.06 2.06 0 1 1 0-4.13 2.06 2.06 0 0 1 0 4.13zM7.12 20.45H3.55V9h3.57v11.45zM22.22 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.22.79 24 1.77 24h20.45c.98 0 1.78-.78 1.78-1.73V1.73C24 .77 23.2 0 22.22 0z"/></svg>';

const VISIBLE_LIMIT = 6;

/* ---- badges / small helpers ---- */
const pinBadge = (pinned) =>
  pinned ? '<span class="pin-badge" title="Pinned">' + pinIcon + "Pinned</span>" : "";
const statusBadge = (cls, dot, label, title) =>
  '<span class="status-badge ' + cls + '" title="' + title + '">' +
  '<span class="s-dot ' + dot + '"></span>' + label + "</span>";
const upcomingBadge = (upcoming) =>
  upcoming ? statusBadge("is-soon", "s-dot-soon", "Coming soon", "Coming soon") : "";
const workingBadge = (working) =>
  working ? statusBadge("is-live", "s-dot-live", "In progress", "Actively building") : "";

const pinnedFirst = (items) =>
  [...items].sort((a, b) => (b.pinned ? 1 : 0) - (a.pinned ? 1 : 0));

const coverHTML = (name, cover) => {
  const label = esc(name || "");
  const placeholder =
    '<div class="project-cover project-cover-ph"><span>' + (label || "No preview") + "</span></div>";
  if (!cover) return placeholder;
  return (
    '<img class="project-cover" src="' + esc(cover) + '" alt="' + label + ' cover" loading="lazy" ' +
    "onerror=\"this.style.display='none';this.nextElementSibling.style.display='flex'\" />" +
    '<div class="project-cover project-cover-ph" style="display:none"><span>' +
    (label || "No preview") + "</span></div>"
  );
};

const projectTags = (tags) =>
  Array.isArray(tags) && tags.length
    ? '<div class="project-tags">' +
    tags.map((t) => '<span class="project-tag">' + esc(t) + "</span>").join("") +
    "</div>"
    : "";

const projectLinks = (p) => {
  const links = [];
  if (p.github)
    links.push(
      '<a class="project-link" href="' + esc(p.github) +
      '" target="_blank" rel="noopener" aria-label="GitHub repository" title="GitHub">' +
      githubIcon + "<span>Code</span></a>"
    );
  if (p.youtube)
    links.push(
      '<a class="project-link" href="' + esc(p.youtube) +
      '" target="_blank" rel="noopener" aria-label="YouTube video" title="YouTube">' +
      youtubeIcon + "<span>Video</span></a>"
    );
  return links.length ? '<div class="project-links">' + links.join("") + "</div>" : "";
};

const projectMetric = (metric) =>
  metric
    ? '<div class="project-metric">' + boltIcon + "<span>" + esc(metric) + "</span></div>"
    : "";

// Full <button> for a "See more" control (or a hidden one when not needed).
const seeMoreBtn = (id, gridId, total) => {
  if (total <= VISIBLE_LIMIT)
    return '<button class="btn btn-outline see-more-btn" id="' + id + '" style="display:none"></button>';
  const hidden = total - VISIBLE_LIMIT;
  return (
    '<button class="btn btn-outline see-more-btn" id="' + id +
    '" data-target="' + gridId + '">See more (' + hidden + ")</button>"
  );
};

/* ---- section builders ---- */
const experienceHTML = (data.experience || [])
  .map(
    (e) =>
      '<div class="exp-item">' +
      '<div class="exp-head">' +
      '<h3 class="exp-company">' + esc(e.company) + "</h3>" +
      '<span class="exp-date">' + esc(e.date) + "</span>" +
      "</div>" +
      (e.designation ? '<p class="exp-role">' + esc(e.designation) + "</p>" : "") +
      '<p class="exp-desc">' + formatText(e.description) + "</p>" +
      "</div>"
  )
  .join("");

const chipsHTML = (items) =>
  Array.isArray(items) ? items.map((s) => "<li>" + esc(s) + "</li>").join("") : "";

const projects = pinnedFirst(data.projects || []);
const projectsHTML = projects
  .map(
    (p, i) =>
      '<article class="project-card' +
      (i >= VISIBLE_LIMIT ? " is-hidden" : "") +
      (p.upcoming ? " is-upcoming" : "") +
      (p.working ? " is-working" : "") + '">' +
      pinBadge(p.pinned) +
      ((p.working || p.upcoming)
        ? '<div class="status-badges">' + workingBadge(p.working) + upcomingBadge(p.upcoming) + "</div>"
        : "") +
      coverHTML(p.name, p.cover) +
      '<div class="project-body">' +
      '<h3 class="project-name">' + esc(p.name) + "</h3>" +
      projectMetric(p.metric) +
      '<p class="project-desc">' + formatText(p.description) + "</p>" +
      projectTags(p.tags) +
      (projectLinks(p) ||
        (p.upcoming ? '<div class="project-links"><span class="project-wip">Work in progress</span></div>' :
         p.working ? '<div class="project-links"><span class="project-building">Actively building</span></div>' : "")) +
      "</div>" +
      "</article>"
  )
  .join("");

const articles = pinnedFirst(data.articles || []);
const articlesHTML = articles
  .map(
    (a, i) =>
      '<article class="project-card' + (i >= VISIBLE_LIMIT ? " is-hidden" : "") + '">' +
      pinBadge(a.pinned) +
      coverHTML(a.title, a.cover) +
      '<div class="project-body">' +
      '<h3 class="project-name">' + esc(a.title) + "</h3>" +
      '<p class="project-desc">' + formatText(a.description) + "</p>" +
      projectTags(a.tags) +
      (a.link
        ? '<div class="project-links">' +
        '<a class="project-link" href="' + esc(a.link) +
        '" target="_blank" rel="noopener">Read →</a>' +
        "</div>"
        : "") +
      "</div>" +
      "</article>"
  )
  .join("");

const certs = data.certifications || [];
const certificationsHTML = certs
  .map((c, i) => {
    const viewBtn = c.link
      ? '<a class="cert-link" href="' + esc(c.link) +
        '" target="_blank" rel="noopener">View credential →</a>'
      : "";
    return (
      '<div class="cert-card' + (i >= VISIBLE_LIMIT ? " is-hidden" : "") + '">' +
      '<span class="cert-icon">' + awardIcon + "</span>" +
      '<div class="cert-body">' +
      '<h3 class="cert-name">' + esc(c.name) + "</h3>" +
      (c.issuer ? '<p class="cert-issuer">' + esc(c.issuer) + "</p>" : "") +
      (c.date ? '<span class="cert-date">' + esc(c.date) + "</span>" : "") +
      viewBtn +
      "</div>" +
      "</div>"
    );
  })
  .join("");

const educationHTML = (data.education || [])
  .map(
    (ed) =>
      '<div class="edu-item">' +
      '<div class="edu-main">' +
      '<h3 class="edu-institute">' + esc(ed.institute) + "</h3>" +
      (ed.degree ? '<p class="edu-degree">' + esc(ed.degree) + "</p>" : "") +
      "</div>" +
      '<span class="edu-date">' + esc(ed.date) + "</span>" +
      "</div>"
  )
  .join("");

const social = data.social || {};
const socialLinks = [
  { key: "github", label: "GitHub", icon: githubIcon },
  { key: "linkedin", label: "LinkedIn", icon: linkedinIcon },
  { key: "youtube", label: "YouTube", icon: youtubeIcon },
];
const contactSocialsHTML = socialLinks
  .filter((s) => social[s.key])
  .map(
    (s) =>
      '<a class="social-link" href="' + esc(social[s.key]) +
      '" target="_blank" rel="noopener" aria-label="' + s.label +
      '" title="' + s.label + '">' + s.icon + "</a>"
  )
  .join("");

/* ---- hero bits ---- */
const meta = data.meta || {};
const title = meta.title || (data.name ? data.name + " — Portfolio" : "Portfolio");
const metaDescription = meta.description || "";

const currentBlock = data.current
  ? '<p class="current" id="current">Currently ' + esc(data.current) + "</p>"
  : '<p class="current" id="current" style="display:none"></p>';

const actions = [
  data.resumeUrl
    ? '<a class="btn btn-primary" id="resume-btn" href="' + esc(data.resumeUrl) +
      '" download>' + downloadIcon + " Download Resume</a>"
    : "",
  data.email
    ? '<a class="btn btn-outline" id="mail-btn" href="mailto:' + esc(data.email) +
      '">' + mailIcon + " Mail Me</a>"
    : "",
].join("\n          ");

/* ---- fill template ---- */
const replacements = {
  "{{TITLE}}": esc(title),
  "{{META_DESCRIPTION}}": esc(metaDescription),
  "{{NAME}}": esc(data.name || ""),
  "{{DESIGNATION}}": esc(data.designation || ""),
  "{{CURRENT_BLOCK}}": currentBlock,
  "{{ACTIONS}}": actions,
  "{{ABOUT}}": data.about ? formatText(data.about) : "",
  "{{EXPERIENCE}}": experienceHTML,
  "{{SKILLS}}": chipsHTML(data.skills),
  "{{TOOLS}}": chipsHTML(data.tools),
  "{{PROJECTS}}": projectsHTML,
  "{{PROJECTS_MORE}}": seeMoreBtn("projects-more", "projects", projects.length),
  "{{ARTICLES_SECTION_ATTR}}": articles.length ? "" : ' style="display:none"',
  "{{ARTICLES}}": articlesHTML,
  "{{ARTICLES_MORE}}": seeMoreBtn("articles-more", "articles", articles.length),
  "{{CERTIFICATIONS_SECTION_ATTR}}": certs.length ? "" : ' style="display:none"',
  "{{CERTIFICATIONS}}": certificationsHTML,
  "{{CERTIFICATIONS_MORE}}": seeMoreBtn("certifications-more", "certifications", certs.length),
  "{{EDUCATION}}": educationHTML,
  "{{EMAIL_HREF}}": data.email ? "mailto:" + esc(data.email) : "#",
  "{{EMAIL_TEXT}}": esc(data.email || ""),
  "{{CONTACT_SOCIALS}}": contactSocialsHTML,
  "{{YEAR}}": String(new Date().getFullYear()),
};

for (const [token, value] of Object.entries(replacements)) {
  tpl = tpl.split(token).join(value);
}

const leftover = tpl.match(/{{[A-Z_]+}}/g);
if (leftover) {
  console.error("build.js: unreplaced tokens:", [...new Set(leftover)].join(", "));
  process.exit(1);
}

fs.writeFileSync(path.join(ROOT, "index.html"), tpl);
console.log("build.js: wrote index.html");

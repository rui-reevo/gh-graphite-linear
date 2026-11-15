// Maps a GitHub PR URL to Graphite and Linear Review destinations.
// GitHub:   https://github.com/{org}/{repo}/pull/{number}
// Graphite: https://app.graphite.com/github/pr/{org}/{repo}/{number}
// Linear:   https://linear.review/{org}/{repo}/pull/{number}/review
//           (Linear redirects into the workspace review page)
function parseGithubPr(href) {
  const match = href.match(
    /^https:\/\/github\.com\/([^/]+)\/([^/]+)\/pull\/(\d+)/
  );
  if (!match) return null;
  const [, org, repo, number] = match;
  return { org, repo, number };
}

function githubToGraphite(href) {
  const pr = parseGithubPr(href);
  if (!pr) return null;
  return `https://app.graphite.com/github/pr/${pr.org}/${pr.repo}/${pr.number}`;
}

function githubToLinear(href) {
  const pr = parseGithubPr(href);
  if (!pr) return null;
  return `https://linear.review/${pr.org}/${pr.repo}/pull/${pr.number}/review`;
}

const GRAPHITE_BUTTON_ID = "gh-to-graphite-button";
const LINEAR_BUTTON_ID = "gh-to-linear-button";

// Graphite's official hexagonal logo mark (extracted from app.graphite.com).
const GRAPHITE_MARK =
  '<svg class="gh2g-mark" viewBox="0 0 28 28" width="13" height="13" aria-hidden="true">' +
  '<path fill="currentColor" d="m20.704 7.123-9.27-2.484-6.788 6.793 2.482 9.276 9.27 2.484 6.788-6.793-2.482-9.276Z"/>' +
  '<path fill="currentColor" d="M17.644 0 3.73 3.729 0 17.644l10.187 10.187 13.915-3.729 3.73-13.915L17.643 0Zm2.27 24.312H7.917L1.92 13.915 7.917 3.518h11.997l5.998 10.397-5.998 10.397Z"/>' +
  "</svg>";

// Linear's chevron mark (from linear.app brand assets).
const LINEAR_MARK =
  '<svg class="gh2g-mark" viewBox="0 0 100 100" width="12" height="12" aria-hidden="true">' +
  '<path fill="currentColor" d="M1.22541 61.5228c-.2225-.9485.9071-1.5459 1.5964-.8572l34.9047 34.905c.9417.942 2.5172.443 2.5172-.9006V2.70395c0-.9328 1.1275-1.3989 1.7868-.7386l50.2211 50.2211c.191.191.2978.4507.2978.7231 0 .9055-.9768 1.4273-1.7231.9214L1.22541 61.5228z"/>' +
  "</svg>";

// External-link arrow — signals the link opens off-site.
const EXTERNAL_ARROW =
  '<svg class="gh2g-arrow" viewBox="0 0 16 16" width="11" height="11" aria-hidden="true">' +
  '<path fill="currentColor" d="M5.5 3.5a.75.75 0 000 1.5h4.44L3.22 11.72a.75.75 0 101.06 1.06L11 6.06v4.44a.75.75 0 001.5 0v-6a.75.75 0 00-.75-.75h-6z"/>' +
  "</svg>";

// The visible "#123" span in the PR header — we insert buttons right after
// it. GitHub's redesigned PR page moved the number into a sticky mini-header
// (`span.fgColor-muted` whose text is "#digits"). Older layouts kept it near
// the title h1 (`PH_Title` or `Heading`). CSS module class hashes change per
// deploy, so we match on the stable utility class + text shape.
function findAnchor() {
  for (const el of document.querySelectorAll(".fgColor-muted")) {
    if (/^#\d+$/.test(el.textContent?.trim() || "")) return el;
  }

  const titleArea = document.querySelector(
    'h1[data-component="PH_Title"], h1[data-component="Heading"]'
  )?.parentElement;
  return titleArea?.querySelector(".fgColor-muted") || null;
}

function buildButton({ id, href, title, label, mark }) {
  const button = document.createElement("a");
  button.id = id;
  button.target = "_blank";
  button.rel = "noopener noreferrer";
  button.title = title;
  button.href = href;
  button.className = "gh2g-inline";
  button.innerHTML = mark + `<span>${label}</span>` + EXTERNAL_ARROW;
  return button;
}

function syncOneButton({ id, href, title, label, mark, insertAfter }) {
  const button = document.getElementById(id);
  if (!href) {
    if (button) button.remove();
    return insertAfter;
  }
  if (!button) {
    const next = buildButton({ id, href, title, label, mark });
    insertAfter.insertAdjacentElement("afterend", next);
    return next;
  }
  if (button.href !== href) button.href = href;
  return button;
}

function syncButtons() {
  const graphiteUrl = githubToGraphite(location.href);
  const linearUrl = githubToLinear(location.href);

  if (!graphiteUrl && !linearUrl) {
    document.getElementById(GRAPHITE_BUTTON_ID)?.remove();
    document.getElementById(LINEAR_BUTTON_ID)?.remove();
    return;
  }

  const anchor = findAnchor();
  if (!anchor) return;

  // Order: #N → Graphite → Linear
  const afterGraphite = syncOneButton({
    id: GRAPHITE_BUTTON_ID,
    href: graphiteUrl,
    title: "Open this PR on Graphite",
    label: "Graphite",
    mark: GRAPHITE_MARK,
    insertAfter: anchor,
  });
  syncOneButton({
    id: LINEAR_BUTTON_ID,
    href: linearUrl,
    title: "Open this PR in Linear Review",
    label: "Linear",
    mark: LINEAR_MARK,
    insertAfter: afterGraphite,
  });
}

// GitHub is a Turbo/Pjax app — navigations happen without full reloads.
function watchChanges() {
  let lastHref = location.href;
  const check = () => {
    if (location.href !== lastHref) lastHref = location.href;
    syncButtons();
  };

  for (const method of ["pushState", "replaceState"]) {
    const original = history[method];
    history[method] = function (...args) {
      const result = original.apply(this, args);
      check();
      return result;
    };
  }
  window.addEventListener("popstate", check);

  const observer = new MutationObserver(() => {
    if (
      !document.getElementById(GRAPHITE_BUTTON_ID) ||
      !document.getElementById(LINEAR_BUTTON_ID)
    ) {
      syncButtons();
    }
  });
  observer.observe(document.body, { childList: true, subtree: true });

  setInterval(check, 1000);
}

syncButtons();
watchChanges();

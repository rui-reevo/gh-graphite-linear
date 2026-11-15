# GitHub · Graphite · Linear

A tiny Chrome extension that cross-links pull request review surfaces.

| Page you're on | Button injected | Destination |
|---|---|---|
| Graphite PR | **GitHub** pill | `github.com/<org>/<repo>/pull/<number>` |
| GitHub PR | **Graphite** pill | `app.graphite.com/github/pr/<org>/<repo>/<number>` |
| GitHub PR | **Linear** pill | `linear.review/<org>/<repo>/pull/<number>/review` |

`linear.review` redirects into your Linear workspace review page. There is no Linear → GitHub badge — that direction is one-way by design.

URL mapping:

```
https://app.graphite.com/github/pr/<org>/<repo>/<number>
        ↕
https://github.com/<org>/<repo>/pull/<number>
        →
https://linear.review/<org>/<repo>/pull/<number>/review
```

Works for any GitHub org and repo — nothing is hardcoded.

## Install (unpacked)

1. Open `chrome://extensions` in Chrome.
2. Toggle **Developer mode** on (top-right).
3. Click **Load unpacked** and select this folder.
4. Open any Graphite PR page — a **GitHub** pill appears next to the PR number.
5. Open any GitHub PR page — **Graphite** and **Linear** pills appear next to the PR number.

To update after editing files, click the refresh icon on the extension card.

## Icons

PNG icons follow Chrome’s recommended sizes: **16**, **32**, **48**, and **128**. The mark is a Trinity knot (three lobes for GitHub, Graphite, and Linear). The 128×128 asset keeps ~16px transparent padding for Web Store visual weight.

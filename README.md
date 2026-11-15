# Graphite ↔ GitHub

A tiny Chrome extension that adds cross-links between Graphite and GitHub PR pages — one button in each direction.

| Page you're on | Button injected | Destination |
|---|---|---|
| Graphite PR | **GitHub** pill | `github.com/<org>/<repo>/pull/<number>` |
| GitHub PR | **Graphite** pill | `app.graphite.com/github/pr/<org>/<repo>/<number>` |

URL mapping:

```
https://app.graphite.com/github/pr/<org>/<repo>/<number>
        ↕
https://github.com/<org>/<repo>/pull/<number>
```

Works for any GitHub org and repo — nothing is hardcoded.

## Install (unpacked)

1. Open `chrome://extensions` in Chrome.
2. Toggle **Developer mode** on (top-right).
3. Click **Load unpacked** and select this folder.
4. Open any Graphite PR page — a **GitHub** pill appears next to the PR number.
5. Open any GitHub PR page — a **Graphite** pill appears next to the PR number.

To update after editing files, click the refresh icon on the extension card.

## Icons

PNG icons follow Chrome’s recommended sizes: **16**, **32**, **48**, and **128**. The 128×128 asset keeps ~16px transparent padding so the artwork sits near 96×96 for Web Store visual weight.

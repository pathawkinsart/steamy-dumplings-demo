# Steamy Dumplings — demo build (self-hosted)

Free demo of Steamy Dumplings, self-hosted here so the HCC website's in-site
player can embed it. (Muse share pages send `frame-ancestors 'self'`, which
blocks embedding on any other site.)

- Live URL: https://pathawkinsart.github.io/steamy-dumplings-demo/
- GitHub repo: pathawkinsart/steamy-dumplings-demo (public, branch `main`, GitHub Pages)
- Business model (Patrick 2026-10-13): demo is FREE on the website; the full
  game will be a PAID download (Google Play Store listing planned).

## What's here

- `index.html` — exported standalone build of the `squishy-cuties` web artifact
  (the demo snapshot). 60 assets inlined; dynamically-named assets
  (dumpling sprites, prop PNGs, sounds, candy) load from `assets/`.
- `assets/` — full asset folder copied from `workspace/ts-spaces/squishy-cuties/assets/`
  at export time, so every relative asset URL resolves.

## Updating the demo

This is a SNAPSHOT — it does not auto-update when the app changes. To refresh:

1. Re-export the artifact (artifact.export on slug `squishy-cuties`) — writes
   `workspace/your_files/squishy-cuties/squishy-cuties.html`.
2. `cp ~/workspace/your_files/squishy-cuties/squishy-cuties.html ~/workspace/steamy-dumplings-demo/index.html`
3. If new assets were added, re-copy the assets folder too:
   `rm -rf ~/workspace/steamy-dumplings-demo/assets && cp -r ~/workspace/ts-spaces/squishy-cuties/assets ~/workspace/steamy-dumplings-demo/assets`
4. `cd ~/workspace/steamy-dumplings-demo && git add -A && git commit -m "..." && git push`
5. GitHub Pages rebuilds in ~1-2 minutes (large repo). The HCC site player
   picks it up automatically.

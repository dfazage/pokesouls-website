# PokéSouls : site d'attente

Landing page statique (HTML, CSS, JS sans build) pour recueillir les emails avant le lancement du jeu.

- Site : `index.html`, `css/style.css`, `js/main.js` (FR par défaut, EN selon le navigateur ou le bouton EN/FR)
- Stockage des emails : Supabase, schéma dans `supabase/schema.sql`
- Configuration du formulaire : `js/config.js` (URL du projet et clé publique « anon »)
- Images du jeu : `assets/img` (captures HD-2D), sprites animés : `assets/sprites` (PMD SpriteCollab, CC BY-NC 4.0)

## Récupérer les emails

Supabase, onglet Table Editor, table `waitlist`, bouton Export CSV. La table n'est lisible que depuis le tableau de bord, jamais depuis le site.

## Publier

GitHub Pages : Settings, Pages, Deploy from a branch, `main` / racine. Si tu utilises un domaine perso, mets à jour l'URL de `og:image` dans `index.html`.

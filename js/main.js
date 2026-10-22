(() => {
  "use strict";
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const CFG = window.PS_CONFIG || {};
  const live = !!(CFG.SUPABASE_URL && CFG.SUPABASE_ANON_KEY);
  const isDev = /^(localhost|127\.0\.0\.1)$/.test(location.hostname) || location.protocol === "file:";
  const store = { get: k => { try { return localStorage.getItem(k); } catch { return null; } }, set: (k, v) => { try { localStorage.setItem(k, v); } catch {} } };

  /* ---------- i18n : l'anglais est dans le HTML (langue par défaut), le français ici ---------- */
  const FR = {
    "chap.u": "Unys",
    "chap.s": "Sinnoh",
    "chap.h": "Hoenn",
    "chap.j": "Johto",
    "chap.lock": "Verrouillé",
    "chap.k.st": "Ouvert",
    "chap.k.sub": "Quatre cartes et un secret, jusqu’à Mewtwo",
    "chap.k": "Kanto",
    "chap.here": "▼ En développement",
    "chap.here.k": "▼ Jouable",
    "chap.j.sub": "Japon d’Edo, trois gardiens et Lugia",
    "chap.j.st": "Première carte jouable",
    "boss.6": "Tour Carillon · Johto",
    "chap.lead": "PokéSouls se raconte en cinq chapitres, un par région. Kanto est jouable, Johto est en cours de création. Les trois autres restent verrouillés jusqu’à leur tour.",
    "chap.title": "Un chapitre par région",
    "nav.chapters": "Chapitres",
    "skip": "Aller à l’inscription",
    "notice": "Projet de fan gratuit. On ne te demandera jamais de payer.",
    "nav.game": "Le jeu",
    "nav.bosses": "Les boss",
    "nav.team": "L’équipe",
    "nav.about": "À propos",
    "cta.play": "Jouer à la démo",
    "cta.join": "Rejoindre la liste",
    "hero.h1a": "Une aventure",
    "hero.h1b": "Pokémon souls-like.",
    "hero.lead": "Tu mènes deux Pokémon, un seul sur le terrain à la fois. Tu meurs, tu apprends, tu changes au bon rythme, et tu avances jusqu’au sanctuaire légendaire.",
    "form.label": "Ton adresse email",
    "form.submit": "Rejoindre la liste",
    "form.fine": "Un seul email, à la sortie. Pas de spam, désinscription en un clic. <a href=\"privacy.html\">Confidentialité</a>",
    "cta.teasers": "Voir les teasers",
    "facts.a": "lignées jouables",
    "facts.b": "cartes par chapitre, dont une secrète",
    "facts.c": "gabarits de combat",
    "facts.d": "Pokémon, un seul sur le terrain",
    "game.title": "Un souls-like qui te laisse apprendre",
    "game.lead": "Des boss lisibles, un duo que tu changes en rythme, et des builds que tu façonnes toi-même.",
    "f1.t": "Des boss pour lesquels ça vaut le coup de mourir",
    "f1.p": "Des duels en temps réel contre des légendaires faits pour être lus, pas devinés. Garde ta parade jusqu’au signal, brise leur posture, punis l’ouverture. Chaque boss a un rythme que tu apprends un peu plus à chaque essai.",
    "f2.t": "Deux Pokémon, un seul rythme",
    "f2.p": "Change juste après une esquive ou une parade parfaite et ton partenaire arrive avec une attaque d’entrée gratuite. Cumule les types pour des réactions : Plante puis Feu donne Embrasement, Feu puis Eau donne Vapeur. Associe deux types identiques pour un bonus de résonance. Remplis la jauge de Lien et ton partenaire au repos entre quelques secondes. Perds les deux et la partie est finie.",
    "f3.t": "Repose-toi, façonne, évolue",
    "f3.p": "Les feux de camp soignent les deux Pokémon, font revenir les ennemis et te laissent dépenser ton essence. Place deux CT sur chaque Pokémon, donne-lui un objet tenu, ajoute des vitamines. L’évolution n’est jamais automatique : elle est rare, elle coûte, et certains Pokémon te laissent choisir leur forme.",
    "f4.t": "Des mondes qui vivent",
    "f4.p": "Le jour laisse place à la nuit et la météo change. Les camps ennemis gardent leur butin, un mini-boss rôde sur la carte, et chaque monde s’ouvre sur sa propre cinématique d’arrivée. Chaque carte prend le visage du légendaire qui y règne, des îles gelées à une tour-cloche de l’époque d’Edo.",
    "boss.title": "Deux gardiens, jouables dès maintenant",
    "boss.lead": "Chaque carte se referme autour d’un sanctuaire. Entre dans la brume et le gardien s’éveille. Captures de la version actuelle.",
    "boss.1": "Îles Écume · Kanto",
    "team.title": "Compose ton duo",
    "team.lead": "Trois gabarits de combat et aucune composition imposée. Le soutien vit dans tes CT : n’importe quel Pokémon peut soigner ou protéger.",
    "g.a": "Assaut",
    "g.a.p": "Mêlée rapide, combos, coups dans le dos.",
    "g.r": "Rempart",
    "g.r.p": "Garde, poise élevée, charge de bouclier.",
    "g.d": "Distance",
    "g.d.p": "Tirs, explosions, sorts en zone.",
    "trio.t": "Quel serait ton duo ?",
    "trio.p": "Choisis deux Pokémon. On regarde lesquels reviennent le plus pour décider par quoi continuer.",
    "trio.of": "sur 2 choisis",
    "trio.submit": "Enregistrer mon duo",
    "about.title": "Un projet de fan, fait pour les fans",
    "about.p1": "PokéSouls est un fan game non commercial, développé par un seul passionné qui a grandi avec Pokémon et qui meurt avec plaisir dans les souls-likes.",
    "about.p2": "Le jeu est en plein développement. De nouveaux Pokémon, boss et effets arrivent chaque semaine, et les teasers sortent d’abord sur Instagram.",
    "join.title": "Sois dans la première vague",
    "join.lead": "Laisse ton email. Tu recevras un message à la sortie, et les inscrits jouent en premier.",
    "scam.title": "Attention aux copies",
    "scam.p": "Le seul compte officiel est <a href=\"https://www.instagram.com/pokesouls.fun/\" target=\"_blank\" rel=\"noopener\">@pokesouls.fun</a> sur Instagram. PokéSouls est gratuit : personne ne te demandera de payer.",
    "foot.disc": "Fan game non commercial, non affilié à Nintendo, Creatures Inc. ni GAME FREAK inc. Pokémon et ses personnages sont leurs marques.",
    "foot.cred": "Sprites : PMD SpriteCollab (CC BY-NC 4.0), merci à tous ses artistes.",
    "boss.1d": "Affronte Artikodin sur son nid gelé. Lis ses préparations, esquive, et change de partenaire pour garder la pression.",
    "bn.6": "Raikou",
    "boss.6d": "Fais face à Raikou sous les érables rouges de la Tour Carillon, premier gardien de Johto. Foudre, vitesse et un duel qui punit l’avidité.",
    "road.now": "Maintenant",
    "road.now.t": "Kanto est terminé, Johto est en construction",
    "road.now.p": "Cinq cartes, cinq boss et un secret à Kanto. Johto arrive gardien après gardien.",
    "road.next": "Ensuite",
    "road.next.t": "Le coop à deux joueurs",
    "road.next.p": "La fonction la plus demandée. Chaque joueur garde son propre duo, dans le même monde.",
    "road.always": "Toujours",
    "road.always.t": "Du nouveau chaque semaine",
    "road.always.p": "Pokémon, boss et effets arrivent chaque semaine, et les teasers sortent d’abord sur Instagram.",
    "foot.priv": "Confidentialité",
    "form.ph": "ton@email.com",
    "bn.1": "Artikodin",
    "road.title": "Où on en est"
};
  const MSG = {
    en: {
    "m.ok": "You are on the list. Add your duo below to help us decide what comes next.",
    "m.ok2": "You are on the list.",
    "m.trio": "Duo saved. You are on the list.",
    "m.bad": "Enter a valid email address, like name@domain.com.",
    "m.need3": "Pick two Pokémon first.",
    "m.err": "Sign-up failed. Check your connection and try again in a moment.",
    "m.off": "Sign-up is not open yet. Come back soon."
},
    fr: {
    "m.ok": "Tu es sur la liste. Ajoute ton duo plus bas pour nous aider à choisir la suite.",
    "m.ok2": "Tu es sur la liste.",
    "m.trio": "Duo enregistré. Tu es sur la liste.",
    "m.bad": "Saisis une adresse email valide, par exemple nom@domaine.fr.",
    "m.need3": "Choisis d’abord deux Pokémon.",
    "m.err": "L’inscription a échoué. Vérifie ta connexion et réessaie dans un instant.",
    "m.off": "Les inscriptions ne sont pas encore ouvertes. Reviens bientôt."
}
  };
  const COUNT = { en: n => `${n} trainers already on the list`, fr: n => `${n} dresseurs déjà inscrits` };
  const GROUPS = { en: { A: "Assault", R: "Bulwark", D: "Ranged", S: "Support" }, fr: { A: "Assaut", R: "Rempart", D: "Distance", S: "Soutien" } };
  let lang = store.get("ps_lang") === "fr" ? "fr" : "en";
  $$("[data-i18n]").forEach(e => e.dataset.en = e.textContent);
  $$("[data-i18n-html]").forEach(e => e.dataset.en = e.innerHTML);
  $$("[data-i18n-ph]").forEach(e => e.dataset.en = e.placeholder);
  const t = k => MSG[lang][k];
  const nameOf = k => lang === "fr" && DATA ? DATA.names[k] : k.charAt(0).toUpperCase() + k.slice(1);
  function applyLang() {
    document.documentElement.lang = lang;
    $$("[data-i18n]").forEach(e => { e.textContent = lang === "fr" && FR[e.dataset.i18n] != null ? FR[e.dataset.i18n] : e.dataset.en; });
    $$("[data-i18n-html]").forEach(e => { e.innerHTML = lang === "fr" && FR[e.dataset.i18nHtml] != null ? FR[e.dataset.i18nHtml] : e.dataset.en; });
    $$("[data-i18n-ph]").forEach(e => { e.placeholder = lang === "fr" ? FR[e.dataset.i18nPh] : e.dataset.en; });
    $("#lang").textContent = lang === "fr" ? "EN" : "FR";
    document.title = lang === "fr" ? "PokéSouls : une aventure Pokémon souls-like" : "PokéSouls: a souls-like Pokémon adventure";
    updateCount(); updateTrioUi();
  }
  $("#lang").addEventListener("click", () => { lang = lang === "fr" ? "en" : "fr"; store.set("ps_lang", lang); applyLang(); });

  /* ---------- sprites animés : vraies feuilles PMDCollab, rangée 0 = face caméra ---------- */
  let DATA = null;
  const sprites = [];
  function mountSprite(el) {
    const k = el.dataset.spr, m = DATA.sprites[k]; if (!m) return;
    const [fw, fh, n, sw, sh] = m, s = parseFloat(el.dataset.scale || 3);
    Object.assign(el.style, { width: fw * s + "px", height: fh * s + "px", backgroundImage: `url(assets/sprites/${k}/Idle.png)`, backgroundSize: `${sw * s}px ${sh * s}px`, backgroundPosition: "0 0" });
    sprites.push({ el, fw: fw * s, n, i: Math.floor(Math.random() * n) });
  }
  function tickSprites() { for (const s of sprites) { s.i = (s.i + 1) % s.n; s.el.style.backgroundPositionX = -s.i * s.fw + "px"; } }

  /* ---------- sélecteur de trio ---------- */
  const picked = [];
  function buildPicker() {
    const box = $("#picker");
    for (const g of ["A", "R", "D", "S"]) {
      const h = document.createElement("p"); h.className = "pick-h"; h.dataset.g = g; box.appendChild(h);
      for (const [gab, key] of DATA.roster) if (gab === g) {
        const b = document.createElement("button"); b.type = "button"; b.className = "pick"; b.dataset.key = key; b.setAttribute("aria-pressed", "false");
        b.innerHTML = `<img src="assets/portraits/${key}.png" alt="" width="40" height="40" loading="lazy">`;
        b.addEventListener("click", () => {
          const i = picked.indexOf(key);
          if (i >= 0) picked.splice(i, 1); else { if (picked.length >= 2) picked.shift(); picked.push(key); }
          $$(".pick", box).forEach(p => p.setAttribute("aria-pressed", String(picked.includes(p.dataset.key))));
          updateTrioUi();
        });
        box.appendChild(b);
      }
    }
  }
  function updateTrioUi() {
    $("#trio-n").textContent = picked.length;
    $("#trio-names").textContent = picked.length ? " : " + picked.map(nameOf).join(", ") : "";
    $$(".pick-h").forEach(h => h.textContent = GROUPS[lang][h.dataset.g]);
    $$(".pick").forEach(p => { p.title = nameOf(p.dataset.key); p.setAttribute("aria-label", nameOf(p.dataset.key)); });
  }

  /* ---------- inscription ---------- */
  const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  async function rpc(fn, body) {
    const r = await fetch(`${CFG.SUPABASE_URL}/rest/v1/rpc/${fn}`, { method: "POST", headers: { "Content-Type": "application/json", apikey: CFG.SUPABASE_ANON_KEY }, body: JSON.stringify(body) });
    if (!r.ok) throw new Error("http " + r.status);
    return r.json();
  }
  async function join(email, trio, source) {
    if (!live) {
      if (!isDev) throw new Error("off");
      const all = JSON.parse(store.get("ps_dev_list") || "[]"); all.push({ email, trio, source, at: Date.now() }); store.set("ps_dev_list", JSON.stringify(all)); return;
    }
    await rpc("join_waitlist", { p_email: email, p_lang: lang, p_trio: trio && trio.length ? trio : null, p_source: source });
  }
  function setStatus(form, kind, msg) { const s = $(".status", form); s.className = "status " + (kind || ""); s.innerHTML = msg || ""; }
  $$("form[data-join]").forEach(form => {
    form.addEventListener("submit", async e => {
      e.preventDefault();
      if ($("[name=company]", form).value) return; // piège à robots
      const email = $("[name=email]", form).value.trim().toLowerCase(), isTrio = form.hasAttribute("data-trio");
      if (!EMAIL.test(email) || email.length > 254) { setStatus(form, "err", t("m.bad")); $("[name=email]", form).focus(); return; }
      if (isTrio && picked.length < 2) { setStatus(form, "err", t("m.need3")); return; }
      const btn = $("button[type=submit]", form); btn.disabled = true; setStatus(form, "", "…");
      try {
        const source = isTrio ? "trio" : form.closest(".hero") ? "hero" : "footer";
        await join(email, isTrio ? picked : null, source);
        store.set("ps_email", email);
        $$("[name=email]").forEach(i => { if (!i.value) i.value = email; });
        if (isTrio) { setStatus(form, "ok", t("m.trio")); }
        else if (form.closest(".hero")) { setStatus(form, "ok", t("m.ok").replace(/(.*)/, `$1 <a href="#trio">↓</a>`)); }
        else setStatus(form, "ok", t("m.ok2"));
        $$("form[data-join]").forEach(f => f.classList.add("done"));
        updateCount(true);
      } catch (err) {
        setStatus(form, "err", err.message === "off" ? t("m.off") : t("m.err"));
      } finally { btn.disabled = false; }
    });
  });
  const saved = store.get("ps_email"); if (saved) $$("[name=email]").forEach(i => i.value = saved);

  /* ---------- compteur d'inscrits (affiché à partir de 25) ---------- */
  let total = 0;
  async function loadCount() { if (!live) return; try { total = Number(await rpc("waitlist_count", {})) || 0; updateCount(); } catch {} }
  function updateCount(bump) { if (bump) total += 1; const el = $("[data-count]"); if (!el) return; if (total >= 25) { el.hidden = false; el.textContent = COUNT[lang](total); } }

  /* ---------- braises du hero ---------- */
  function embers() {
    const c = $("#embers"), x = c.getContext("2d"); let w, h, ps = [], run = true;
    const size = () => { w = c.width = c.clientWidth; h = c.height = c.clientHeight; };
    const mk = init => ({ x: Math.random() * w, y: init ? Math.random() * h : h + 10, r: 0.8 + Math.random() * 2.2, v: 0.25 + Math.random() * 0.8, dx: (Math.random() - .5) * .4, a: .3 + Math.random() * .6, ph: Math.random() * 6 });
    size(); ps = Array.from({ length: 46 }, () => mk(true)); addEventListener("resize", size);
    new IntersectionObserver(([e]) => { run = e.isIntersecting; if (run) loop(); }).observe(c);
    function loop() { if (!run) return; x.clearRect(0, 0, w, h); for (const p of ps) { p.y -= p.v; p.x += p.dx + Math.sin(p.y / 40 + p.ph) * .3; if (p.y < -10) Object.assign(p, mk(false)); x.beginPath(); x.fillStyle = `rgba(255,${150 + (p.r * 30) | 0},60,${p.a * Math.min(1, p.y / h + .2)})`; x.shadowColor = "#ff8a2a"; x.shadowBlur = 10; x.arc(p.x, p.y, p.r, 0, 7); x.fill(); } requestAnimationFrame(loop); }
    loop();
  }


  /* ---------- clips : lecture seulement quand ils sont visibles ---------- */
  const clips = $$("video[data-clip]");
  if (reduce) clips.forEach(v => { v.controls = true; });
  else if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver(es => es.forEach(e => { const v = e.target; if (e.isIntersecting) { v.play().catch(() => {}); } else v.pause(); }), { rootMargin: "80px", threshold: 0.2 });
    clips.forEach(v => io.observe(v));
  }

  /* ---------- démarrage ---------- */
  applyLang();
  fetch("assets/data.json").then(r => r.json()).then(d => {
    DATA = d; $$("[data-spr]").forEach(mountSprite); buildPicker(); applyLang();
    if (!reduce) setInterval(tickSprites, 170);
  });
  if (!reduce) embers();
  loadCount();
})();

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
    "boss.jt": "Chapitre II : Johto, premier gardien",
    "boss.6": "Tour Carillon",
    "boss.soon": "En préparation",
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
    "hero.lead": "Tu mènes une équipe de trois, tu meurs, tu apprends, et tu avances jusqu’au sanctuaire secret.",
    "form.label": "Ton adresse email",
    "form.submit": "Rejoindre la liste",
    "form.fine": "Un seul email, à la sortie. Pas de spam, désinscription en un clic. <a href=\"privacy.html\">Confidentialité</a>",
    "cta.teasers": "Voir les teasers",
    "facts.a": "lignées jouables",
    "facts.b": "cartes par chapitre, dont une secrète",
    "facts.c": "gabarits de combat",
    "facts.d": "boss final à abattre",
    "game.title": "Un souls-like qui te laisse apprendre",
    "game.lead": "Des combats de boss passionnants, un système de combat bien à lui, et des builds que tu façonnes toi-même.",
    "f1.t": "Des boss pour lesquels ça vaut le coup de mourir",
    "f1.p": "Des duels de boss en temps réel, conçus pour être excitants et fun. Des attaques larges et lisibles, des phases qui changent le combat, et un rythme que tu apprends un peu plus à chaque essai.",
    "f2.t": "Un gameplay unique",
    "f2.p": "Des combos de changement de classe et de combinaison de types. Change de Pokémon en plein combat pour enchaîner les attaques et cumuler les éléments : Plante puis Feu donne Embrasement, Feu puis Eau donne Vapeur. On expérimente encore sur cet aspect, et c’est celui qu’on préfère.",
    "f3.t": "Façonne ton build avec des objets",
    "f3.p": "Vitamines, super bonbons et CT te permettent d’affiner chaque Pokémon : plus de dégâts ici, plus de PV là, une nouvelle capacité adaptée à son type. Même équipe, builds très différents.",
    "f4.t": "L’évolution se mérite",
    "f4.p": "Pas d’évolution automatique à chaque niveau. Elle est rare, spectaculaire, et elle change la façon de jouer ton Pokémon.",
    "boss.title": "Quatre cartes, quatre gardiens, un secret",
    "boss.lead": "Chaque carte se referme autour d’un sanctuaire. Regarde ce qui se passe quand tu y entres.",
    "boss.1": "Îles Écume",
    "boss.2": "Centrale abandonnée",
    "boss.3": "Mont Braise",
    "boss.4": "Laboratoire oublié",
    "boss.5": "Carte secrète. Bats Mewtwo pour la trouver.",
    "team.title": "Compose ton équipe de trois",
    "team.lead": "Quatre gabarits de combat, aucune composition imposée. Un Pokémon Eau peut tenir la ligne, tirer de loin ou soigner.",
    "g.a": "Assaut",
    "g.a.p": "Mêlée rapide, combos, coups dans le dos.",
    "g.r": "Rempart",
    "g.r.p": "Garde, poise élevée, contrôle de zone.",
    "g.d": "Distance",
    "g.d.p": "Tirs, pièges, sorts en zone.",
    "g.s": "Soutien",
    "g.s.p": "Soins à l’entrée, purification, aura.",
    "trio.t": "Quel serait ton trio ?",
    "trio.p": "Choisis trois Pokémon. On regarde lesquels reviennent le plus pour décider par quoi continuer.",
    "trio.of": "sur 3 choisis",
    "trio.submit": "Enregistrer mon trio",
    "about.title": "Un projet de fan, fait pour les fans",
    "about.p1": "PokéSouls est un fan game non commercial, développé par un seul passionné qui a grandi avec Pokémon et qui meurt avec plaisir dans les souls-likes.",
    "about.p2": "Le jeu est en plein développement. De nouveaux Pokémon, boss et effets arrivent chaque semaine, et les teasers sortent d’abord sur Instagram.",
    "join.title": "Sois dans la première vague",
    "join.lead": "Laisse ton email. Tu recevras un message à la sortie, et les inscrits jouent en premier.",
    "scam.title": "Attention aux copies",
    "scam.p": "Le seul compte officiel est <a href=\"https://www.instagram.com/pokesouls.fun/\" target=\"_blank\" rel=\"noopener\">@pokesouls.fun</a> sur Instagram. PokéSouls est gratuit : personne ne te demandera de payer, de télécharger un exécutable ou de te connecter avec ton compte.",
    "foot.disc": "Fan game non commercial, non affilié à Nintendo, Creatures Inc. ni GAME FREAK inc. Pokémon et ses personnages sont leurs marques.",
    "foot.cred": "Sprites : PMD SpriteCollab (CC BY-NC 4.0), merci à tous ses artistes.",
    "foot.priv": "Confidentialité",
    "form.ph": "ton@email.com",
    "bn.1": "Artikodin",
    "bn.2": "Électhor",
    "bn.3": "Sulfura",
    "bn.4": "Mewtwo",
    "bn.5": "???"
};
  const MSG = {
    en: {
    "m.ok": "You are on the list. Add your trio below to help us decide what comes next.",
    "m.ok2": "You are on the list.",
    "m.trio": "Trio saved. You are on the list.",
    "m.bad": "Enter a valid email address, like name@domain.com.",
    "m.need3": "Pick three Pokémon first.",
    "m.err": "Sign-up failed. Check your connection and try again in a moment.",
    "m.off": "Sign-up is not open yet. Come back soon."
},
    fr: {
    "m.ok": "Tu es sur la liste. Ajoute ton trio plus bas pour nous aider à choisir la suite.",
    "m.ok2": "Tu es sur la liste.",
    "m.trio": "Trio enregistré. Tu es sur la liste.",
    "m.bad": "Saisis une adresse email valide, par exemple nom@domaine.fr.",
    "m.need3": "Choisis d’abord trois Pokémon.",
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
          if (i >= 0) picked.splice(i, 1); else { if (picked.length >= 3) picked.shift(); picked.push(key); }
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
      if (isTrio && picked.length < 3) { setStatus(form, "err", t("m.need3")); return; }
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

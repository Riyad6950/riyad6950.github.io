/* ============================================================
   Md. Tanvir Islam Riyad — Portfolio scripts
   White × Red × Black · cursor · parallax · tilt · magnetic
   ============================================================ */
(function () {
    "use strict";

    /* -----------------------------------------------------------
       CONFIG — set your GitHub username for live repo count.
       Leave "" to keep the static demo numbers.
    ----------------------------------------------------------- */
    var GITHUB_USERNAME = "Riyad6950";

    var doc = document;
    var root = doc.documentElement;
    var prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    var finePointer = window.matchMedia("(pointer:fine)").matches;

    /* Low-power detection — weak/low-RAM machines & touch devices get a lighter
       "lite" build (no parallax, spotlight, big blurs or smooth-scroll engine).
       deviceMemory reports GB capped at 8, so ≤4 catches ~2GB/4GB PCs. */
    var lowPower = (navigator.deviceMemory && navigator.deviceMemory <= 4) ||
                   (navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 4) ||
                   (navigator.connection && navigator.connection.saveData) || false;
    if (lowPower || !finePointer) root.classList.add("lite");

    var lenis = null;                       // set in §16 (smooth scroll)
    function lockScroll()   { root.classList.add("is-locked");    if (lenis) lenis.stop(); }
    function unlockScroll() { root.classList.remove("is-locked"); if (lenis) lenis.start(); }

    /* ===========================================================
       1. Theme toggle (persisted)
    =========================================================== */
    var themeToggle = doc.getElementById("themeToggle");
    function setTheme(t) {
        root.setAttribute("data-theme", t);
        try { localStorage.setItem("ryd-theme", t); } catch (e) {}
        var meta = doc.querySelector('meta[name="theme-color"]');
        if (meta) meta.setAttribute("content", t === "light" ? "#ffffff" : "#000000");
    }
    if (themeToggle) {
        themeToggle.addEventListener("click", function () {
            setTheme(root.getAttribute("data-theme") === "light" ? "dark" : "light");
        });
    }

    /* ===========================================================
       2. Navbar + mobile menu
    =========================================================== */
    var navbar = doc.getElementById("navbar");
    var navToggle = doc.getElementById("navToggle");
    var navLinks = doc.getElementById("navLinks");

    function onScrollNav() {
        navbar.classList.toggle("scrolled", window.scrollY > 30);
    }
    function closeMenu() {
        navLinks.classList.remove("open");
        navToggle.classList.remove("open");
        navToggle.setAttribute("aria-expanded", "false");
    }
    navToggle.addEventListener("click", function () {
        var open = navLinks.classList.toggle("open");
        navToggle.classList.toggle("open", open);
        navToggle.setAttribute("aria-expanded", String(open));
    });
    navLinks.querySelectorAll(".nav-link").forEach(function (l) { l.addEventListener("click", closeMenu); });
    doc.addEventListener("click", function (e) {
        if (navLinks.classList.contains("open") && !navLinks.contains(e.target) && !navToggle.contains(e.target)) closeMenu();
    });

    /* ===========================================================
       3. Scroll progress
    =========================================================== */
    var progress = doc.getElementById("scrollProgress");
    function onScrollProgress() {
        var h = doc.documentElement;
        var s = h.scrollTop / (h.scrollHeight - h.clientHeight || 1);
        progress.style.width = (s * 100).toFixed(2) + "%";
    }

    /* ===========================================================
       4. Active nav link
    =========================================================== */
    var navMap = {};
    navLinks.querySelectorAll(".nav-link").forEach(function (l) { navMap[l.getAttribute("href").slice(1)] = l; });
    var spy = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) {
            if (en.isIntersecting) {
                var id = en.target.id;
                Object.keys(navMap).forEach(function (k) { navMap[k].classList.toggle("active", k === id); });
            }
        });
    }, { rootMargin: "-45% 0px -50% 0px" });
    doc.querySelectorAll("main section[id]").forEach(function (s) { if (navMap[s.id]) spy.observe(s); });

    /* ===========================================================
       5. Reveal on scroll (+ hero title words)
    =========================================================== */
    var revealObs = new IntersectionObserver(function (entries, obs) {
        entries.forEach(function (en) {
            if (en.isIntersecting) { en.target.classList.add("in-view"); obs.unobserve(en.target); }
        });
    }, { threshold: 0.12, rootMargin: "0px 0px -8% 0px" });
    doc.querySelectorAll(".reveal").forEach(function (el) { revealObs.observe(el); });

    [".skills-grid", ".projects-grid", ".github-grid", ".about-cards"].forEach(function (sel) {
        var grid = doc.querySelector(sel);
        if (!grid) return;
        grid.querySelectorAll(".reveal").forEach(function (item, i) { item.style.setProperty("--d", (i * 0.09).toFixed(2) + "s"); });
    });

    // hero title kinetic reveal
    var heroTitle = doc.querySelector(".hero-title");
    if (heroTitle) window.setTimeout(function () { heroTitle.classList.add("in"); }, 250);

    /* ===========================================================
       6. Animated counters
    =========================================================== */
    function animateCount(el) {
        var target = parseFloat(el.getAttribute("data-count")) || 0;
        var suffix = el.getAttribute("data-suffix") || "";
        var dur = 1500, start = performance.now();
        function tick(now) {
            var p = Math.min((now - start) / dur, 1);
            var eased = 1 - Math.pow(1 - p, 3);
            el.textContent = Math.round(target * eased) + suffix;
            if (p < 1) requestAnimationFrame(tick); else el.textContent = target + suffix;
        }
        requestAnimationFrame(tick);
    }
    var countObs = new IntersectionObserver(function (entries, obs) {
        entries.forEach(function (en) { if (en.isIntersecting) { animateCount(en.target); obs.unobserve(en.target); } });
    }, { threshold: 0.6 });
    doc.querySelectorAll(".stat-num[data-count]").forEach(function (el) {
        if (prefersReduced) el.textContent = el.getAttribute("data-count") + (el.getAttribute("data-suffix") || "");
        else countObs.observe(el);
    });

    /* ===========================================================
       7. Skill / language bars
    =========================================================== */
    var fillObs = new IntersectionObserver(function (entries, obs) {
        entries.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add("in-view"); obs.unobserve(en.target); } });
    }, { threshold: 0.35 });
    doc.querySelectorAll(".skill-card, .lang-card").forEach(function (el) { fillObs.observe(el); });

    /* ===========================================================
       8. Contribution graph
    =========================================================== */
    (function buildContrib() {
        var graph = doc.getElementById("contribGraph");
        if (!graph) return;
        var frag = doc.createDocumentFragment();
        for (var i = 0; i < 52 * 7; i++) {
            var c = doc.createElement("span");
            var r = Math.random();
            var lvl = r > 0.92 ? 4 : r > 0.8 ? 3 : r > 0.6 ? 2 : r > 0.35 ? 1 : 0;
            c.className = "contrib-cell lvl" + lvl;
            c.title = "Contribution activity";
            frag.appendChild(c);
        }
        graph.appendChild(frag);
    })();

    /* ===========================================================
       9. Live GitHub activity (graceful fallback to demo numbers)
    =========================================================== */
    function ghOK(r) { return r.ok ? r.json() : Promise.reject(r.status); }
    function noop() {}
    function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]; }); }

    function setStat(key, value, suffix) {
        var el = doc.querySelector('.stat-num[data-gh="' + key + '"]');
        if (!el || value == null || isNaN(value)) return;
        el.setAttribute("data-count", value);
        el.setAttribute("data-suffix", suffix || "");
        // Re-animate to the live value (a counter already in view would otherwise
        // finish on the old number and clobber whatever we set here).
        if (prefersReduced) el.textContent = value + (suffix || "");
        else animateCount(el);
    }

    function renderLangs(langs) {
        var box = doc.getElementById("langBars");
        if (!box || !langs.length) return;
        var top = langs.slice(0, 5);
        var total = top.reduce(function (s, l) { return s + l.n; }, 0) || 1;
        box.innerHTML = "";
        top.forEach(function (l) {
            var pct = Math.max(2, Math.round((l.n / total) * 100));
            var row = doc.createElement("div");
            row.className = "lang-row";
            row.innerHTML = '<span class="lang-name">' + esc(l.name) + '</span>' +
                '<div class="lang-track"><span style="--w:' + pct + '%"></span></div>' +
                '<span class="lang-pct">' + pct + '%</span>';
            box.appendChild(row);
        });
        var card = box.closest(".lang-card");
        if (card) { card.classList.remove("in-view"); void card.offsetWidth; card.classList.add("in-view"); }
    }

    function renderRealContrib(days) {
        var graph = doc.getElementById("contribGraph");
        if (!graph || !days || !days.length) return;
        graph.innerHTML = "";
        var frag = doc.createDocumentFragment();
        days.forEach(function (d) {
            var c = doc.createElement("span");
            c.className = "contrib-cell lvl" + (typeof d.level === "number" ? d.level : 0);
            c.title = d.date + " · " + d.count + " contribution" + (d.count === 1 ? "" : "s");
            frag.appendChild(c);
        });
        graph.appendChild(frag);
        return days.reduce(function (s, d) { return s + (d.count || 0); }, 0);
    }

    function loadGitHub() {
        if (!GITHUB_USERNAME) return;
        var base = "https://api.github.com/users/" + GITHUB_USERNAME;

        // public repositories
        fetch(base).then(ghOK).then(function (u) {
            if (typeof u.public_repos === "number") setStat("repos", u.public_repos, "+");
        }).catch(noop);

        // languages (aggregated from repos)
        fetch(base + "/repos?per_page=100&sort=updated").then(ghOK).then(function (repos) {
            if (!Array.isArray(repos)) return;
            var counts = {};
            repos.forEach(function (r) { if (r.language) counts[r.language] = (counts[r.language] || 0) + 1; });
            var langs = Object.keys(counts).map(function (k) { return { name: k, n: counts[k] }; })
                .sort(function (a, b) { return b.n - a.n; });
            if (langs.length) { setStat("langs", langs.length, ""); renderLangs(langs); }
        }).catch(noop);

        // real contribution graph (third-party aggregator) + total
        fetch("https://github-contributions-api.jogruber.de/v4/" + GITHUB_USERNAME + "?y=last")
            .then(ghOK).then(function (data) {
                if (data && Array.isArray(data.contributions)) {
                    var total = renderRealContrib(data.contributions);
                    if (total != null) setStat("contrib", total, "+");
                }
            }).catch(noop);
    }
    loadGitHub();

    /* ===========================================================
       10. Contact form
    =========================================================== */
    var form = doc.getElementById("contactForm");
    var statusEl = doc.getElementById("formStatus");
    function validEmail(v) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v); }
    if (form) {
        form.addEventListener("submit", function (e) {
            e.preventDefault();
            var name = form.elements.name, email = form.elements.email, message = form.elements.message, ok = true;
            [name, email, message].forEach(function (f) { f.classList.remove("invalid"); });
            if (!name.value.trim()) { name.classList.add("invalid"); ok = false; }
            if (!validEmail(email.value.trim())) { email.classList.add("invalid"); ok = false; }
            if (!message.value.trim()) { message.classList.add("invalid"); ok = false; }
            if (!ok) { statusEl.textContent = "Please fill in all fields with a valid email."; statusEl.className = "form-status error"; return; }

            var channel = (e.submitter && e.submitter.getAttribute("data-send")) || "mail";
            var first = name.value.trim().split(" ")[0];

            if (channel === "whatsapp") {
                var waText = encodeURIComponent(
                    "Hi Riyad! I'm " + name.value.trim() + " (" + email.value.trim() + ").\n\n" + message.value.trim()
                );
                statusEl.textContent = "Thanks, " + first + "! Opening WhatsApp…";
                statusEl.className = "form-status success";
                window.open("https://wa.me/601112778527?text=" + waText, "_blank", "noopener");
            } else {
                var subject = encodeURIComponent("Portfolio message from " + name.value.trim());
                var body = encodeURIComponent(name.value.trim() + " (" + email.value.trim() + ") wrote:\n\n" + message.value.trim());
                statusEl.textContent = "Thanks, " + first + "! Opening your mail app…";
                statusEl.className = "form-status success";
                window.location.href = "mailto:10vir69@gmail.com?subject=" + subject + "&body=" + body;
            }
            form.reset();
        });
        form.querySelectorAll("input, textarea").forEach(function (f) {
            f.addEventListener("input", function () { f.classList.remove("invalid"); });
        });
    }

    /* ===========================================================
       11. Master scroll listener
    =========================================================== */
    var ticking = false;
    window.addEventListener("scroll", function () {
        if (!ticking) { window.requestAnimationFrame(function () { onScrollNav(); onScrollProgress(); ticking = false; }); ticking = true; }
    }, { passive: true });
    onScrollNav(); onScrollProgress();

    /* ===========================================================
       12. Custom cursor — red "RYD" badge that follows the pointer.
            Pure event-driven (no rAF loop): instant, and costs nothing
            while the mouse is still. Same RYD cursor on every device with
            a fine pointer — including low-power ones — because it is cheap.
    =========================================================== */
    if (finePointer && !prefersReduced) {
        var ring = doc.getElementById("cursorRing");
        var labelEl = doc.getElementById("cursorLabel");
        doc.body.classList.add("custom-cursor");

        var shown = false, state = "default", down = false;
        // Everything you can interact with → the hover state fires the SAME way
        // everywhere, so the cursor change is consistent across all sections.
        var HOVER_SEL = 'a, button, input, textarea, select, label, [role="button"],' +
            ' [data-cursor], .magnetic, .glass-card, .tag, .nav-link, .nav-toggle,' +
            ' .back-top, .scroll-cue';
        // small text links → a compact dot cursor instead of the big arrow
        var MINI_SEL = '.nav-link, .footer-nav a, .footer-bottom a, .github-note a';

        function applyState() {
            ring.classList.toggle("is-hover", state === "hover");
            ring.classList.toggle("is-mini", state === "mini");
            ring.classList.toggle("is-type", state === "type");
            ring.classList.toggle("is-pixel", state === "pixel");
            ring.classList.toggle("has-label", state === "label");
            ring.classList.toggle("is-down", down);
        }
        function setState(s, label) {
            if (s === "label") labelEl.textContent = label || "";
            if (s === state) return;
            state = s; applyState();
        }

        // Position updates instantly on move (no transition on transform → zero lag)
        window.addEventListener("mousemove", function (e) {
            ring.style.transform = "translate3d(" + e.clientX + "px," + e.clientY + "px,0) translate(-50%,-50%)";
            if (!shown) { shown = true; ring.style.opacity = "1"; }
        }, { passive: true });

        window.addEventListener("mousedown", function () { down = true; applyState(); });
        window.addEventListener("mouseup",   function () { down = false; applyState(); });
        doc.addEventListener("mouseleave", function () { shown = false; ring.style.opacity = "0"; });
        doc.addEventListener("mouseenter", function () { shown = true; ring.style.opacity = "1"; });

        // Contextual state via one delegated listener (cheap, no per-element handlers)
        doc.addEventListener("mouseover", function (e) {
            var t = e.target;
            if (!t || !t.closest) return;
            if (t.closest(".contrib-graph")) { setState("pixel"); return; }   // tiny 2×2 pixel
            if (t.closest("input, textarea, select")) { setState("type"); return; }  // "Type..." dots
            var labelHost = t.closest("[data-cursor]");
            if (labelHost) { setState("label", labelHost.getAttribute("data-cursor")); return; }
            if (t.closest(MINI_SEL)) { setState("mini"); return; }   // small links → small cursor
            if (t.closest(HOVER_SEL)) { setState("hover"); return; }
            setState("default");
        }, { passive: true });
    }

    /* ===========================================================
       12b. Magnetic "merge" — curated CTAs & social links.
            On hover the RYD cursor hides (it "mixes" into the box), the box
            pops red and drifts toward the pointer within a capped area, then
            snaps back on leave. Limited to ~15 elements and the base centre is
            captured once on enter (no per-move layout reads) → cheap, runs even
            in lite mode so weak machines still get the effect.
    =========================================================== */
    if (finePointer && !prefersReduced) {
        var cursorEl = doc.getElementById("cursorRing");
        var MAGNET_SEL = ".rail-link, .contact-social, .footer-social, .back-top," +
            " .btn--nav, .hero-buttons .btn, [data-send]";
        doc.querySelectorAll(MAGNET_SEL).forEach(function (el) {
            var bx = 0, by = 0, strength = 0.1, cap = 5;   // gentle drift (~70% less than before)
            el.addEventListener("mouseenter", function () {
                var r = el.getBoundingClientRect();          // base centre, captured once
                bx = r.left + r.width / 2; by = r.top + r.height / 2;
                el.classList.add("is-magnet");
                if (cursorEl) cursorEl.style.opacity = "0";  // cursor "merges" into the box
            });
            el.addEventListener("mousemove", function (e) {
                var x = Math.max(-cap, Math.min(cap, (e.clientX - bx) * strength));
                var y = Math.max(-cap, Math.min(cap, (e.clientY - by) * strength));
                el.style.transform = "translate(" + x.toFixed(1) + "px," + y.toFixed(1) + "px) scale(1.07)";
            });
            el.addEventListener("mouseleave", function () {
                el.classList.remove("is-magnet");
                el.style.transform = "";
                if (cursorEl) cursorEl.style.opacity = "1";
            });
        });
    }

    /* ===========================================================
       13. Pointer FX — parallax + mouse spotlight in ONE rAF loop that
            STOPS itself when the pointer settles (≈0 idle cost), and only
            runs on capable machines. Card tilt + magnetic pull were removed
            on purpose: they tracked the mouse (the "boxes move when I move"
            feel) and ran getBoundingClientRect on every move. Cards now just
            pop (scale) on hover via CSS — no direction, no per-frame layout.
    =========================================================== */
    if (finePointer && !prefersReduced && !lowPower) {
        var parallaxEls = Array.prototype.slice.call(doc.querySelectorAll("[data-parallax]"));
        var spotlight = doc.getElementById("spotlight");

        var px = 0, py = 0, cx = 0, cy = 0;                                  // parallax (-1..1)
        var sx = window.innerWidth / 2, sy = window.innerHeight / 2;         // spotlight target
        var csx = sx, csy = sy;                                             // spotlight current
        var rafId = null, idle = 0;

        function pointerFX() {
            cx += (px - cx) * 0.06; cy += (py - cy) * 0.06;
            for (var i = 0; i < parallaxEls.length; i++) {
                var el = parallaxEls[i];
                var d = parseFloat(el.getAttribute("data-parallax")) || 0;
                el.style.transform = "translate3d(" + (-cx * d * 100).toFixed(2) + "px," +
                                      (-cy * d * 100).toFixed(2) + "px,0)";
            }
            if (spotlight) {
                csx += (sx - csx) * 0.08; csy += (sy - csy) * 0.08;
                spotlight.style.transform = "translate3d(" + csx.toFixed(1) + "px," + csy.toFixed(1) + "px,0)";
            }
            // settle detection → stop the loop until the next move
            var moving = Math.abs(px - cx) + Math.abs(py - cy) + Math.abs(sx - csx) + Math.abs(sy - csy);
            idle = moving > 0.05 ? 0 : idle + 1;
            if (idle > 30) { rafId = null; return; }
            rafId = requestAnimationFrame(pointerFX);
        }
        function kick() { if (rafId == null && !doc.hidden) rafId = requestAnimationFrame(pointerFX); }

        window.addEventListener("mousemove", function (e) {
            px = (e.clientX / window.innerWidth - 0.5) * 2;
            py = (e.clientY / window.innerHeight - 0.5) * 2;
            sx = e.clientX; sy = e.clientY;
            if (spotlight && spotlight.style.opacity !== "1") spotlight.style.opacity = "1";
            kick();
        }, { passive: true });

        doc.addEventListener("visibilitychange", function () { if (!doc.hidden) kick(); });
    }

    /* ===========================================================
       16. Smooth scrolling (Lenis) + smooth anchor jumps
    =========================================================== */
    if (window.Lenis && !prefersReduced && !lowPower) {
        lenis = new Lenis({
            lerp: 0.1,            // responsive yet smooth (no fixed-duration float)
            smoothWheel: true,
            wheelMultiplier: 1,
            touchMultiplier: 1.5
        });
        // skip work while the tab is hidden (browser throttles rAF anyway)
        (function rafLenis(time) { if (!doc.hidden) lenis.raf(time); requestAnimationFrame(rafLenis); })();
        // keep navbar + progress in sync with Lenis' virtual scroll
        lenis.on("scroll", function () { onScrollNav(); onScrollProgress(); });
        // if the intro is still locking the page, hold Lenis until it opens
        if (root.classList.contains("is-locked")) lenis.stop();

        doc.querySelectorAll('a[href^="#"]').forEach(function (a) {
            a.addEventListener("click", function (e) {
                var href = a.getAttribute("href");
                if (href && href.length > 1) {
                    var target = doc.querySelector(href);
                    if (target) { e.preventDefault(); closeMenu(); lenis.scrollTo(target, { offset: -72 }); }
                }
            });
        });
    } else {
        // Lite / reduced-motion: skip the smooth-scroll engine entirely and lean on
        // native CSS scrolling. `scroll-margin-top` on the sections handles the
        // navbar offset, so anchor jumps still land in the right place.
        doc.querySelectorAll('a[href^="#"]').forEach(function (a) {
            a.addEventListener("click", function () { closeMenu(); });
        });
    }

    /* ===========================================================
       18. Award-inspired effects
            #13 split reveal · #14 clip reveal · #6 watermarks ·
            #5 scroll parallax · #15 velocity marquee · #8 text-swap · #17 spotlight
    =========================================================== */
    var fxObs = new IntersectionObserver(function (entries, obs) {
        entries.forEach(function (en) {
            if (en.isIntersecting) { en.target.classList.add("in-view"); obs.unobserve(en.target); }
        });
    }, { threshold: 0.25, rootMargin: "0px 0px -6% 0px" });

    // #13 masked word reveal — wrap each word, preserving nested elements (e.g. .accent-text)
    if (!prefersReduced) {
        doc.querySelectorAll("[data-split]").forEach(function (el) {
            var walker = doc.createTreeWalker(el, NodeFilter.SHOW_TEXT, null);
            var texts = [], n;
            while ((n = walker.nextNode())) texts.push(n);
            texts.forEach(function (tn) {
                if (!tn.textContent.trim()) return;
                var parts = tn.textContent.split(/(\s+)/);
                var frag = doc.createDocumentFragment();
                parts.forEach(function (p) {
                    if (p.trim() === "") { frag.appendChild(doc.createTextNode(p)); return; }
                    var w = doc.createElement("span"); w.className = "r-w";
                    var i = doc.createElement("span"); i.className = "r-i"; i.textContent = p;
                    w.appendChild(i); frag.appendChild(w);
                });
                tn.parentNode.replaceChild(frag, tn);
            });
            el.classList.add("split");
            var idx = 0;
            el.querySelectorAll(".r-i").forEach(function (i) { i.style.transitionDelay = (idx++ * 0.035).toFixed(3) + "s"; });
            fxObs.observe(el);
        });
    }

    // #14 clip-path media reveals
    // On touch devices, bypass the animation and show immediately — Intersection
    // Observer can mis-fire on mobile when content-visibility:auto hides sections.
    doc.querySelectorAll(".clip-reveal").forEach(function (el) {
        if (prefersReduced || !finePointer) el.classList.add("in-view"); else fxObs.observe(el);
    });

    // #6 giant faint section numbers (auto, from each eyebrow number)
    doc.querySelectorAll(".section-head").forEach(function (head) {
        var num = head.querySelector(".eyebrow-num");
        if (!num) return;
        var wm = doc.createElement("span");
        wm.className = "section-watermark";
        wm.setAttribute("aria-hidden", "true");
        wm.setAttribute("data-scroll-speed", "0.06");
        wm.textContent = num.textContent.trim();
        head.appendChild(wm);
    });

    // #8 button text-swap (wrap the label, keep the icon)
    doc.querySelectorAll(".btn").forEach(function (btn) {
        var tn = Array.prototype.filter.call(btn.childNodes, function (c) {
            return c.nodeType === 3 && c.textContent.trim();
        })[0];
        if (!tn) return;
        var label = tn.textContent.trim();
        var wrap = doc.createElement("span"); wrap.className = "btn-tx";
        var a = doc.createElement("span"); a.className = "btn-tx-in"; a.textContent = label;
        var b = doc.createElement("span"); b.className = "btn-tx-in btn-tx-cl"; b.setAttribute("aria-hidden", "true"); b.textContent = label;
        wrap.appendChild(a); wrap.appendChild(b);
        btn.replaceChild(wrap, tn);
    });

    // #5 scroll parallax + #15 scroll-velocity marquee skew
    var speedEls = Array.prototype.slice.call(doc.querySelectorAll("[data-scroll-speed]"));
    var marqueeEl = doc.querySelector(".marquee");
    if (!prefersReduced && !lowPower && (speedEls.length || marqueeEl)) {
        var lastY = window.scrollY, vh = window.innerHeight;
        window.addEventListener("resize", function () { vh = window.innerHeight; }, { passive: true });
        function fxScroll() {
            var y = window.scrollY;
            if (speedEls.length) {
                // batch reads, then writes (avoid layout thrash)
                var rects = speedEls.map(function (el) { return el.getBoundingClientRect(); });
                speedEls.forEach(function (el, i) {
                    var off = rects[i].top + rects[i].height / 2 - vh / 2;
                    var sp = parseFloat(el.getAttribute("data-scroll-speed")) || 0;
                    el.style.transform = "translate3d(0," + (-off * sp).toFixed(1) + "px,0)";
                });
            }
            if (marqueeEl) {
                var v = Math.max(-9, Math.min(9, (y - lastY) * 0.4));
                marqueeEl.style.transform = "skewX(" + v.toFixed(2) + "deg)";
            }
            lastY = y;
        }
        if (lenis) lenis.on("scroll", fxScroll);
        else window.addEventListener("scroll", fxScroll, { passive: true });
        fxScroll();
    }

    // #17 red spotlight — now driven by the unified pointer-FX loop in §13
    //     (one rAF for parallax + spotlight, and it idles when the mouse stops).

    /* ===========================================================
       17. Intro gate (loader) + Exit gate
    =========================================================== */
    (function gates() {
        var introGate = doc.getElementById("introGate");
        var exitGate = doc.getElementById("exitGate");
        var exitBtn = doc.getElementById("exitBtn");
        var reenterBtn = doc.getElementById("reenterBtn");

        // --- Intro ---
        if (introGate) {
            if (prefersReduced) {
                unlockScroll();
                introGate.style.display = "none";
            } else {
                var bar = doc.getElementById("introBar");
                var cnt = doc.getElementById("introCount");
                var t0 = performance.now(), dur = 1500;
                (function count(now) {
                    var p = Math.min((now - t0) / dur, 1);
                    var v = Math.round(p * 100);
                    if (cnt) cnt.textContent = v;
                    if (bar) bar.style.width = v + "%";
                    if (p < 1) requestAnimationFrame(count);
                })(t0);
                // panels open via CSS at 1.7s; release scroll as they part, then retire the node
                window.setTimeout(unlockScroll, 2500);
                window.setTimeout(function () {
                    introGate.style.display = "none";
                    // iOS Safari IO can mis-fire during overflow:hidden scroll-lock, leaving hero
                    // with is-still (orbits paused). Force-clear it once the gate is gone.
                    if (!finePointer) {
                        var h = doc.querySelector(".hero");
                        if (h) h.classList.remove("is-still");
                    }
                }, 3100);
            }
        } else {
            unlockScroll();
        }

        // --- Exit ---  → hands off to the hypnosis exit portal (demoes/outro)
        if (exitGate && exitBtn) {
            exitBtn.addEventListener("click", function () {
                // Straight to the exit-portal animation — no "See You Soon" curtain/delay
                window.location.href = "demoes/outro/index.html";
            });
            if (reenterBtn) {
                reenterBtn.addEventListener("click", function () {
                    exitGate.classList.add("gate--open");  // panels slide back out
                    exitGate.setAttribute("aria-hidden", "true");
                    unlockScroll();
                });
            }
        }
    })();

    /* ===========================================================
       19. Pause looping animations when their section is off-screen.
            Spinning orbits, floating chips, the pulse dot and the marquee
            keep burning the GPU even when scrolled past — this stops them
            until they return to view, which matters most over long sessions
            and on weak hardware.
    =========================================================== */
    if (!prefersReduced && "IntersectionObserver" in window) {
        [["hero", "is-still"], ["marquee", "is-still"]].forEach(function (pair) {
            var el = doc.querySelector("." + pair[0]);
            if (!el) return;
            new IntersectionObserver(function (entries) {
                el.classList.toggle(pair[1], !entries[0].isIntersecting);
            }, { rootMargin: "120px" }).observe(el);
        });
    }

    /* ===========================================================
       20. Pre-fetch the exit-portal PAGE while the visitor browses.
            The exit page (demoes/outro) used to load a ~3.3 MB PNG
            spiral per theme — so we pre-downloaded ~6.6 MB here, which
            itself stole bandwidth on low-RAM machines. The spiral is now
            a zero-byte inline-SVG vector, so there's nothing heavy left
            to warm: we just prefetch the 14 KB HTML so the click-to-exit
            navigation is instant. Skipped on data-saver.
    =========================================================== */
    (function prefetchExitPortal() {
        if (navigator.connection && navigator.connection.saveData) return;
        function warm() {
            var link = doc.createElement("link");
            link.rel = "prefetch";
            link.as = "document";
            link.href = "demoes/outro/index.html";
            doc.head.appendChild(link);
        }
        function start() { window.setTimeout(warm, 300); }
        if (doc.readyState === "complete") start();
        else window.addEventListener("load", start, { once: true });
    })();

    /* ===========================================================
       21. Mobile gyroscope — profile card tilts with phone movement.
            Uses DeviceOrientationEvent (beta = front/back, gamma = left/right).
            iOS 13+ requires requestPermission() inside a user gesture; we ask
            on the first touchstart so the dialog appears before the user scrolls.
    =========================================================== */
    if (!finePointer && !prefersReduced) {
        var gyroCard = doc.querySelector(".profile-card");
        var gBeta = 0, gGamma = 0, cBeta = 0, cGamma = 0, gyroRaf = null;

        function gyroStep() {
            cBeta  += (gBeta  - cBeta)  * 0.08;
            cGamma += (gGamma - cGamma) * 0.08;
            if (gyroCard) {
                gyroCard.style.transform =
                    "perspective(900px) rotateX(" + (cBeta * 0.35).toFixed(2) + "deg)" +
                    " rotateY(" + (cGamma * 0.5).toFixed(2) + "deg)";
            }
            gyroRaf = (Math.abs(gBeta - cBeta) + Math.abs(gGamma - cGamma)) > 0.04
                ? requestAnimationFrame(gyroStep) : null;
        }

        function onDeviceOrientation(e) {
            if (e.gamma == null) return;
            // Offset beta by ~80 so portrait-held phone reads as neutral (0,0)
            gBeta  = Math.max(-25, Math.min(25, (e.beta  || 0) - 80));
            gGamma = Math.max(-25, Math.min(25,  e.gamma || 0));
            if (!gyroRaf) gyroRaf = requestAnimationFrame(gyroStep);
        }

        function setupGyro() {
            window.addEventListener("deviceorientation", onDeviceOrientation, { passive: true });
        }

        if (typeof DeviceOrientationEvent !== "undefined" &&
            typeof DeviceOrientationEvent.requestPermission === "function") {
            // iOS 13+ — must request inside a user gesture
            doc.addEventListener("touchstart", function initGyro() {
                doc.removeEventListener("touchstart", initGyro);
                DeviceOrientationEvent.requestPermission()
                    .then(function (r) { if (r === "granted") setupGyro(); })
                    .catch(function () {});
            }, { passive: true });
        } else if (typeof DeviceOrientationEvent !== "undefined") {
            setupGyro();
        }
    }

    console.log("%cRYD. %cportfolio — white × red × black", "color:#ff2d2d;font-weight:bold;font-size:14px", "color:inherit");
})();

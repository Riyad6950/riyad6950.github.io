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
            if (typeof u.public_repos === "number") setStat("repos", u.public_repos, "");
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
                    if (total != null) setStat("contrib", total, "");
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
       12. Custom cursor — frame-synced, instant dot + trailing ring
            with contextual state graphics (hover / click / type / label)
    =========================================================== */
    if (finePointer && !prefersReduced) {
        var dot = doc.getElementById("cursorDot");
        var ring = doc.getElementById("cursorRing");
        var labelEl = doc.getElementById("cursorLabel");
        doc.body.classList.add("custom-cursor");

        var mx = window.innerWidth / 2, my = window.innerHeight / 2;   // target (live mouse)
        var rx = mx, ry = my;                                         // ring (trails)
        var shown = false, state = "default", down = false;

        function applyState() {
            ring.classList.toggle("is-hover", state === "hover");
            ring.classList.toggle("is-text", state === "text");
            ring.classList.toggle("has-label", state === "label");
            ring.classList.toggle("is-down", down);
            dot.style.opacity = (!shown || state === "text" || state === "label") ? "0" : "1";
        }
        function setState(s, label) {
            if (s === "label") labelEl.textContent = label || "";
            if (s === state) return;
            state = s; applyState();
        }

        // Dot updates instantly on move (zero latency); ring trails in rAF.
        window.addEventListener("mousemove", function (e) {
            mx = e.clientX; my = e.clientY;
            dot.style.transform = "translate3d(" + mx + "px," + my + "px,0) translate(-50%,-50%)";
            if (!shown) { shown = true; ring.style.opacity = "1"; applyState(); }
        }, { passive: true });

        window.addEventListener("mousedown", function () { down = true; applyState(); });
        window.addEventListener("mouseup", function () { down = false; applyState(); });
        doc.addEventListener("mouseleave", function () { shown = false; dot.style.opacity = ring.style.opacity = "0"; });
        doc.addEventListener("mouseenter", function () { shown = true; ring.style.opacity = "1"; applyState(); });

        // Contextual state via delegation (cheap, no per-element listeners)
        doc.addEventListener("mouseover", function (e) {
            var t = e.target;
            if (!t || !t.closest) return;
            var labelHost = t.closest("[data-cursor]");
            if (labelHost) { setState("label", labelHost.getAttribute("data-cursor")); return; }
            if (t.closest("input, textarea")) { setState("text"); return; }
            if (t.closest('a, button, .magnetic, [data-tilt], .nav-link, .nav-toggle, label')) { setState("hover"); return; }
            setState("default");
        }, { passive: true });

        // rAF only drives the trailing ring (dot is already instant from mousemove)
        (function cursorLoop() {
            rx += (mx - rx) * 0.25;   // tight enough to feel attached, soft enough to glide
            ry += (my - ry) * 0.25;
            ring.style.transform = "translate3d(" + rx + "px," + ry + "px,0) translate(-50%,-50%)";
            requestAnimationFrame(cursorLoop);
        })();
    }

    /* ===========================================================
       13. Mouse parallax (multi-layer, depth via data-parallax)
    =========================================================== */
    var parallaxEls = Array.prototype.slice.call(doc.querySelectorAll("[data-parallax]"));
    if (parallaxEls.length && !prefersReduced && finePointer) {
        var px = 0, py = 0, cx = 0, cy = 0;
        window.addEventListener("mousemove", function (e) {
            px = (e.clientX / window.innerWidth - 0.5) * 2;   // -1..1
            py = (e.clientY / window.innerHeight - 0.5) * 2;
        }, { passive: true });
        (function parallaxLoop() {
            cx += (px - cx) * 0.06; cy += (py - cy) * 0.06;
            parallaxEls.forEach(function (el) {
                var d = parseFloat(el.getAttribute("data-parallax")) || 0;
                var mvX = -cx * d * 100, mvY = -cy * d * 100;
                el.style.transform = "translate3d(" + mvX.toFixed(2) + "px," + mvY.toFixed(2) + "px,0)";
            });
            requestAnimationFrame(parallaxLoop);
        })();
    }

    /* ===========================================================
       14. Magnetic elements (attract toward cursor)
    =========================================================== */
    if (finePointer && !prefersReduced) {
        doc.querySelectorAll(".magnetic").forEach(function (el) {
            var isBtn = el.classList.contains("btn") || el.classList.contains("exit-btn");
            var strength = isBtn ? 0.07 : 0.24;   // very subtle pull on buttons
            var cap = isBtn ? 4 : 11;              // hard max displacement (px)
            el.addEventListener("mousemove", function (e) {
                var r = el.getBoundingClientRect();
                var x = (e.clientX - (r.left + r.width / 2)) * strength;
                var y = (e.clientY - (r.top + r.height / 2)) * strength;
                x = Math.max(-cap, Math.min(cap, x));
                y = Math.max(-cap, Math.min(cap, y));
                el.style.transform = "translate(" + x.toFixed(1) + "px," + y.toFixed(1) + "px)";
            });
            el.addEventListener("mouseleave", function () { el.style.transform = "translate(0,0)"; });
        });
    }

    /* ===========================================================
       15. 3D tilt on cards
    =========================================================== */
    if (finePointer && !prefersReduced) {
        doc.querySelectorAll("[data-tilt]").forEach(function (el) {
            var max = 7; // degrees
            el.addEventListener("mouseenter", function () { el.style.transition = "transform 0.12s ease-out"; });
            el.addEventListener("mousemove", function (e) {
                var r = el.getBoundingClientRect();
                var tx = (e.clientX - r.left) / r.width - 0.5;
                var ty = (e.clientY - r.top) / r.height - 0.5;
                el.style.transform = "perspective(900px) rotateX(" + (-ty * max).toFixed(2) + "deg) rotateY(" + (tx * max).toFixed(2) + "deg)";
            });
            el.addEventListener("mouseleave", function () {
                el.style.transition = "";        // restore CSS transition
                el.style.transform = "";          // restore CSS animation (e.g. profile-card float)
            });
        });
    }

    /* ===========================================================
       16. Smooth scrolling (Lenis) + smooth anchor jumps
    =========================================================== */
    if (window.Lenis && !prefersReduced) {
        lenis = new Lenis({
            lerp: 0.1,            // responsive yet smooth (no fixed-duration float)
            smoothWheel: true,
            wheelMultiplier: 1,
            touchMultiplier: 1.5
        });
        (function rafLenis(time) { lenis.raf(time); requestAnimationFrame(rafLenis); })();
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
    }

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
                window.setTimeout(function () { introGate.style.display = "none"; }, 3100);
            }
        } else {
            unlockScroll();
        }

        // --- Exit ---
        if (exitGate && exitBtn) {
            exitBtn.addEventListener("click", function () {
                exitGate.classList.remove("gate--open");   // panels slide in to cover
                exitGate.setAttribute("aria-hidden", "false");
                lockScroll();
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

    console.log("%cRYD. %cportfolio — white × red × black", "color:#ff2d2d;font-weight:bold;font-size:14px", "color:inherit");
})();

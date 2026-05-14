(function () {
  /* ── Tracks ── */
  var TRACKS = [
    { name: "Lofi Girl – Study Beats", id: "jfKfPfyJRdk" },
    { name: "Chillhop Radio",          id: "5yx6BWlEVcY" },
    { name: "Coffee Shop Ambience",    id: "DWcJFNfaw9c" },
    { name: "Midnight Study Session",  id: "MbFon3XQKBE" },
  ];
  var PEAKS = [10, 16, 8, 18, 14, 20, 11, 17, 9, 15];
  var idx = 0, playing = false, elapsed = 0;
  var timerInt = null, waveInt = null;

  /* ── Inject CSS ── */
  var style = document.createElement("style");
  style.textContent = [
    "@import url('https://fonts.googleapis.com/css2?family=Nunito:wght@600;700&display=swap');",
    "#lc-widget{position:fixed;bottom:24px;right:24px;z-index:999999;width:240px;",
    "background:linear-gradient(160deg,#1e1b2e 0%,#16213e 60%,#0f3460 100%);",
    "border-radius:20px;padding:16px 14px 12px;",
    "box-shadow:0 0 0 1px rgba(160,130,255,.2),0 12px 40px rgba(0,0,0,.6);",
    "font-family:'Nunito',sans-serif;overflow:hidden;user-select:none;}",

    "#lc-widget .star{position:absolute;width:2px;height:2px;border-radius:50%;background:rgba(255,255,255,.75);pointer-events:none;}",

    "#lc-widget .moon{position:absolute;top:12px;right:16px;width:34px;height:34px;",
    "background:radial-gradient(circle at 38% 38%,#fff8d6,#ffd97d);border-radius:50%;",
    "box-shadow:0 0 18px 6px rgba(255,220,100,.4);animation:lcMoon 4s ease-in-out infinite;}",
    "@keyframes lcMoon{0%,100%{box-shadow:0 0 18px 6px rgba(255,220,100,.35)}50%{box-shadow:0 0 28px 10px rgba(255,220,100,.55)}}",

    "#lc-widget .scene{position:relative;height:130px;margin-bottom:8px;}",
    "#lc-widget .desk{position:absolute;bottom:0;left:-14px;right:-14px;height:22px;background:linear-gradient(180deg,#3d2b1f,#2a1d15);border-radius:4px 4px 0 0;}",

    "#lc-widget .books{position:absolute;bottom:22px;left:10px;display:flex;flex-direction:column-reverse;gap:2px;}",
    "#lc-widget .book{height:7px;border-radius:2px;}",

    "#lc-widget .mug{position:absolute;bottom:22px;right:68px;width:20px;height:16px;background:linear-gradient(160deg,#c0392b,#922b21);border-radius:0 0 5px 5px;}",
    "#lc-widget .mug::after{content:'';position:absolute;right:-6px;top:2px;width:6px;height:8px;border:2px solid #c0392b;border-left:none;border-radius:0 5px 5px 0;}",

    "#lc-widget .steam-wrap{position:absolute;bottom:44px;right:71px;display:flex;gap:3px;}",
    "#lc-widget .steam{width:3px;border-radius:2px;background:linear-gradient(to top,rgba(255,255,255,.4),transparent);opacity:0;}",
    "#lc-widget.playing .steam{animation:lcSteam 2.2s ease-in-out infinite;}",
    "#lc-widget.playing .steam:nth-child(2){animation-delay:.5s}",
    "#lc-widget.playing .steam:nth-child(3){animation-delay:1s}",
    "@keyframes lcSteam{0%{height:12px;opacity:.5;transform:translateY(0)}100%{height:12px;opacity:0;transform:translateY(-14px)}}",

    "#lc-widget .laptop{position:absolute;bottom:22px;right:10px;}",
    "#lc-widget .laptop-screen{width:48px;height:32px;background:linear-gradient(135deg,#0d1b2a,#1a3a5c);border:2px solid #3a5a7a;border-radius:3px 3px 0 0;display:flex;align-items:center;justify-content:center;}",
    "#lc-widget .screen-glow{width:30px;height:17px;background:linear-gradient(135deg,rgba(162,155,254,.25),rgba(108,92,231,.25));border-radius:2px;}",
    "#lc-widget.playing .screen-glow{animation:lcScreen 5s ease-in-out infinite;}",
    "@keyframes lcScreen{0%,100%{opacity:1}50%{opacity:.6}}",
    "#lc-widget .laptop-base{width:54px;height:5px;background:#3a5a7a;border-radius:0 0 3px 3px;margin-left:-3px;}",

    "#lc-widget .cat{position:absolute;bottom:20px;left:50%;transform:translateX(-50%);}",
    "#lc-widget .cat-body{width:46px;height:34px;background:radial-gradient(ellipse at 50% 40%,#f5c88a,#e8a85c);border-radius:50% 50% 45% 45%/60% 60% 40% 40%;position:relative;box-shadow:inset -3px -3px 7px rgba(0,0,0,.18);animation:lcBreath 3.5s ease-in-out infinite;}",
    "@keyframes lcBreath{0%,100%{transform:scaleY(1)}50%{transform:scaleY(1.04)}}",
    "#lc-widget .tail{position:absolute;bottom:-2px;right:-20px;width:24px;height:9px;border:4px solid #e8a85c;border-top:none;border-radius:0 0 18px 18px;transform-origin:left center;animation:lcTail 3s ease-in-out infinite;}",
    "@keyframes lcTail{0%,100%{transform:rotate(-15deg)}50%{transform:rotate(15deg)}}",
    "#lc-widget .paw{position:absolute;bottom:-5px;width:16px;height:9px;background:#e8a85c;border-radius:50% 50% 40% 40%;}",
    "#lc-widget .paw.l{left:2px;transform:rotate(10deg)}#lc-widget .paw.r{right:2px;transform:rotate(-10deg)}",

    "#lc-widget .cat-head{position:absolute;top:-30px;left:50%;transform:translateX(-50%);width:38px;height:34px;background:radial-gradient(ellipse at 50% 55%,#f5c88a,#e8a85c);border-radius:50% 50% 45% 45%/55% 55% 45% 45%;}",
    "#lc-widget .ear{position:absolute;top:-9px;width:0;height:0;border-left:6px solid transparent;border-right:6px solid transparent;border-bottom:12px solid #e8a85c;}",
    "#lc-widget .ear.l{left:3px}#lc-widget .ear.r{right:3px}",

    "#lc-widget .cap{position:absolute;top:-14px;left:50%;animation:lcCap 3.5s ease-in-out infinite;}",
    "@keyframes lcCap{0%,100%{transform:translateX(-50%) rotate(-3deg)}50%{transform:translateX(-50%) rotate(3deg)}}",
    "#lc-widget .cap-top{width:20px;height:7px;background:#2c2c54;border-radius:3px 3px 0 0;position:absolute;bottom:6px;left:50%;transform:translateX(-50%);}",
    "#lc-widget .cap-brim{width:32px;height:6px;background:#2c2c54;border-radius:2px;position:relative;box-shadow:0 2px 4px rgba(0,0,0,.4);}",
    "#lc-widget .cap-tassel{position:absolute;right:2px;top:0;width:2px;height:11px;background:#f5a623;border-radius:1px;}",
    "#lc-widget .cap-tassel::after{content:'●';font-size:5px;color:#f5a623;position:absolute;bottom:-5px;left:-1px}",

    "#lc-widget .eyes{position:absolute;top:13px;left:50%;transform:translateX(-50%);display:flex;gap:7px;}",
    "#lc-widget .eye{width:9px;height:5px;border-bottom:2.5px solid #4a2c00;border-radius:0 0 7px 7px;animation:lcBlink 5s ease-in-out infinite;}",
    "@keyframes lcBlink{0%,90%,100%{transform:scaleY(1)}95%{transform:scaleY(.1)}}",
    "#lc-widget .nose{position:absolute;top:19px;left:50%;transform:translateX(-50%);width:5px;height:3px;background:#e57fa0;border-radius:50%;}",
    "#lc-widget .whiskers{position:absolute;top:19px;display:flex;flex-direction:column;gap:3px;}",
    "#lc-widget .whiskers.wl{left:-13px;align-items:flex-end}#lc-widget .whiskers.wr{right:-13px}",
    "#lc-widget .w{width:16px;height:1.5px;background:rgba(100,70,30,.45);border-radius:2px;}",

    "#lc-widget .note{position:absolute;font-size:13px;color:rgba(162,155,254,.85);opacity:0;pointer-events:none;}",
    "#lc-widget.playing .note:nth-child(1){top:10px;left:8px;animation:lcN1 3.5s ease-in-out 0s infinite}",
    "#lc-widget.playing .note:nth-child(2){top:18px;right:8px;animation:lcN2 3.5s ease-in-out 1.2s infinite}",
    "#lc-widget.playing .note:nth-child(3){top:4px;left:48%;animation:lcN3 3.5s ease-in-out 2.4s infinite}",
    "@keyframes lcN1{0%{opacity:0;transform:translateY(0) rotate(-10deg)}20%{opacity:.9}100%{opacity:0;transform:translateY(-30px) rotate(12deg)}}",
    "@keyframes lcN2{0%{opacity:0;transform:translateY(0) rotate(8deg)}20%{opacity:.9}100%{opacity:0;transform:translateY(-26px) rotate(-12deg)}}",
    "@keyframes lcN3{0%{opacity:0;transform:translateY(0) rotate(-5deg)}20%{opacity:.9}100%{opacity:0;transform:translateY(-34px) rotate(8deg)}}",

    "#lc-widget .ctrl{position:relative;z-index:2;display:flex;flex-direction:column;gap:8px;}",
    "#lc-widget .lbl{text-align:center;color:#a29bfe;font-size:10px;font-weight:700;letter-spacing:.1em;text-transform:uppercase;opacity:.8;}",
    "#lc-widget .track-nm{text-align:center;color:#dfe6e9;font-size:11px;font-weight:700;min-height:16px;}",
    "#lc-widget .wave{display:flex;align-items:center;justify-content:center;gap:3px;height:22px;}",
    "#lc-widget .bar{width:3px;height:3px;background:linear-gradient(to top,#6c5ce7,#a29bfe);border-radius:2px;opacity:.25;transition:height .15s ease;}",
    "#lc-widget.playing .bar{opacity:1;}",
    "#lc-widget .btn-row{display:flex;align-items:center;justify-content:center;gap:8px;}",
    "#lc-widget .ibtn{background:rgba(255,255,255,.07);border:1px solid rgba(255,255,255,.13);color:#dfe6e9;border-radius:50%;width:32px;height:32px;cursor:pointer;font-size:13px;display:flex;align-items:center;justify-content:center;outline:none;transition:background .2s;}",
    "#lc-widget .ibtn:hover{background:rgba(162,155,254,.22)}",
    "#lc-widget .ibtn.play{width:42px;height:42px;font-size:16px;background:linear-gradient(135deg,#a29bfe,#6c5ce7);border:none;box-shadow:0 4px 14px rgba(108,92,231,.5);}",
    "#lc-widget .vol-row{display:flex;align-items:center;gap:7px;padding:0 4px;}",
    "#lc-widget .vol-row input{flex:1;accent-color:#a29bfe;cursor:pointer;-webkit-appearance:none;appearance:none;height:3px;background:rgba(255,255,255,.15);border-radius:3px;outline:none;}",
    "#lc-widget .vol-row input::-webkit-slider-thumb{-webkit-appearance:none;width:11px;height:11px;border-radius:50%;background:#a29bfe;}",
    "#lc-widget .bottom-row{display:flex;align-items:center;justify-content:space-between;padding:0 2px;}",
    "#lc-widget .timer{display:flex;align-items:center;gap:5px;font-size:10px;color:rgba(255,255,255,.4);}",
    "#lc-widget .tdot{width:5px;height:5px;border-radius:50%;background:#a29bfe;opacity:0;}",
    "#lc-widget.playing .tdot{opacity:1;animation:lcDot 1s ease-in-out infinite;}",
    "@keyframes lcDot{0%,100%{transform:scale(1)}50%{transform:scale(1.5)}}",
    "#lc-widget .yt-btn{background:transparent;border:1px solid rgba(162,155,254,.3);color:rgba(162,155,254,.75);font-size:10px;border-radius:7px;padding:3px 8px;cursor:pointer;font-family:inherit;}",
    "#lc-widget .hint{text-align:center;font-size:9px;color:rgba(255,255,255,.18);}",
  ].join("");
  document.head.appendChild(style);

  /* ── Inject HTML ── */
  var wrap = document.createElement("div");
  wrap.innerHTML = [
    '<div id="lc-widget">',
      '<div class="star" style="top:15%;left:18%"></div>',
      '<div class="star" style="top:7%;left:74%"></div>',
      '<div class="star" style="top:28%;left:54%"></div>',
      '<div class="moon"></div>',
      '<div class="scene">',
        '<div class="note">&#9834;</div>',
        '<div class="note">&#9835;</div>',
        '<div class="note">&#9833;</div>',
        '<div class="books">',
          '<div class="book" style="width:34px;background:#e74c6e"></div>',
          '<div class="book" style="width:30px;background:#f5a623"></div>',
          '<div class="book" style="width:38px;background:#4ecdc4"></div>',
        '</div>',
        '<div class="mug"></div>',
        '<div class="steam-wrap">',
          '<div class="steam" style="height:12px"></div>',
          '<div class="steam" style="height:9px"></div>',
          '<div class="steam" style="height:14px"></div>',
        '</div>',
        '<div class="laptop">',
          '<div class="laptop-screen"><div class="screen-glow"></div></div>',
          '<div class="laptop-base"></div>',
        '</div>',
        '<div class="cat">',
          '<div class="cat-body">',
            '<div class="tail"></div>',
            '<div class="paw l"></div>',
            '<div class="paw r"></div>',
            '<div class="cat-head">',
              '<div class="ear l"></div>',
              '<div class="ear r"></div>',
              '<div class="cap"><div class="cap-top"></div><div class="cap-brim"><div class="cap-tassel"></div></div></div>',
              '<div class="eyes"><div class="eye"></div><div class="eye"></div></div>',
              '<div class="nose"></div>',
              '<div class="whiskers wl"><div class="w"></div><div class="w"></div></div>',
              '<div class="whiskers wr"><div class="w"></div><div class="w"></div></div>',
            '</div>',
          '</div>',
        '</div>',
        '<div class="desk"></div>',
      '</div>',
      '<div class="ctrl">',
        '<div class="lbl">Now Vibing</div>',
        '<div class="track-nm" id="lc-track">&#9654; Tap to vibe</div>',
        '<div class="wave" id="lc-wave">',
          '<div class="bar"></div><div class="bar"></div><div class="bar"></div>',
          '<div class="bar"></div><div class="bar"></div><div class="bar"></div>',
          '<div class="bar"></div><div class="bar"></div><div class="bar"></div>',
          '<div class="bar"></div>',
        '</div>',
        '<div class="btn-row">',
          '<button class="ibtn" id="lc-prev">&#9198;</button>',
          '<button class="ibtn play" id="lc-play">&#9654;</button>',
          '<button class="ibtn" id="lc-next">&#9197;</button>',
        '</div>',
        '<div class="vol-row">',
          '<span style="font-size:12px;color:#a29bfe">&#128264;</span>',
          '<input type="range" id="lc-vol" min="0" max="100" value="70">',
          '<span style="font-size:12px;color:#a29bfe">&#128266;</span>',
        '</div>',
        '<div class="bottom-row">',
          '<div class="timer"><div class="tdot"></div><span id="lc-time">00:00</span></div>',
          '<button class="yt-btn" id="lc-open">Open &#8599;</button>',
        '</div>',
        '<div class="hint">opens YouTube in new tab</div>',
      '</div>',
    '</div>',
  ].join("");
  document.body.appendChild(wrap);

  /* ── YouTube iframe ── */
  var frame = document.createElement("iframe");
  frame.setAttribute("width", "1");
  frame.setAttribute("height", "1");
  frame.setAttribute("frameborder", "0");
  frame.setAttribute("allow", "autoplay; encrypted-media");
  frame.style.cssText = "position:fixed;opacity:0;pointer-events:none;top:-10px;left:-10px;";
  frame.src = "about:blank";
  document.body.appendChild(frame);

  /* ── Logic ── */
  var widget  = document.getElementById("lc-widget");
  var playBtn = document.getElementById("lc-play");
  var trackEl = document.getElementById("lc-track");
  var timeEl  = document.getElementById("lc-time");
  var bars    = document.querySelectorAll("#lc-wave .bar");

  function ytSrc(id) {
    return "https://www.youtube-nocookie.com/embed/" + id
      + "?autoplay=1&loop=1&playlist=" + id
      + "&controls=0&disablekb=1&rel=0&modestbranding=1";
  }

  function fmt(s) {
    return ("0" + Math.floor(s / 60)).slice(-2) + ":" + ("0" + (s % 60)).slice(-2);
  }

  function animWave() {
    bars.forEach(function (b, i) {
      b.style.height = (playing ? Math.max(4, PEAKS[i] * (0.35 + Math.random() * 0.7)) : 3) + "px";
    });
  }

  function startPlaying() {
    frame.src = ytSrc(TRACKS[idx].id);
    widget.classList.add("playing");
    playBtn.innerHTML = "&#9646;&#9646;";
    trackEl.textContent = TRACKS[idx].name;
    waveInt  = setInterval(animWave, 160);
    timerInt = setInterval(function () { elapsed++; timeEl.textContent = fmt(elapsed); }, 1000);
  }

  function stopPlaying() {
    frame.src = "about:blank";
    widget.classList.remove("playing");
    playBtn.innerHTML = "&#9654;";
    trackEl.textContent = "— Paused —";
    clearInterval(waveInt);
    clearInterval(timerInt);
    animWave();
  }

  function toggle() {
    playing = !playing;
    playing ? startPlaying() : stopPlaying();
  }

  function goTo(dir) {
    idx = (idx + dir + TRACKS.length) % TRACKS.length;
    elapsed = 0;
    timeEl.textContent = "00:00";
    if (playing) { stopPlaying(); playing = true; startPlaying(); }
  }

  playBtn.addEventListener("click", toggle);
  document.getElementById("lc-prev").addEventListener("click", function () { goTo(-1); });
  document.getElementById("lc-next").addEventListener("click", function () { goTo(1); });
  document.getElementById("lc-open").addEventListener("click", function () {
    window.open("https://www.youtube.com/watch?v=" + TRACKS[idx].id, "_blank");
  });
})();

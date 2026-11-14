/* See eagle.js for the student project module contract. */
(function(){
  window.STUDENT_PROJECTS = window.STUDENT_PROJECTS || {};
  window.STUDENT_PROJECTS['opportunity'] = {
    title: { en: "Dust Storm", uk: "Пилова буря" },
    type: "game",
    init: function(container){
      container.innerHTML = '';
      var wrap = document.createElement('div');
      wrap.style.position = 'relative';
      wrap.style.width = '100%';
      wrap.style.height = '100%';
      container.appendChild(wrap);

      var canvas = document.createElement('canvas');
      canvas.style.width = '100%';
      canvas.style.height = '100%';
      canvas.style.display = 'block';
      wrap.appendChild(canvas);
      var ctx = canvas.getContext('2d');

      var hud = document.createElement('div');
      hud.style.position = 'absolute';
      hud.style.top = '8px';
      hud.style.left = '8px';
      hud.style.right = '8px';
      hud.style.display = 'flex';
      hud.style.justifyContent = 'space-between';
      hud.style.fontFamily = "'IBM Plex Mono', monospace";
      hud.style.fontSize = '11px';
      hud.style.color = '#eef1fb';
      hud.innerHTML = '<span class="opBattery">Батарея: 100%</span><span class="opTime">Час: 0с</span>';
      wrap.appendChild(hud);

      var btn = document.createElement('button');
      btn.type = 'button';
      btn.textContent = 'Розгорнути панелі (тримай)';
      btn.style.position = 'absolute';
      btn.style.bottom = '10px';
      btn.style.left = '50%';
      btn.style.transform = 'translateX(-50%)';
      btn.style.padding = '8px 14px';
      btn.style.borderRadius = '999px';
      btn.style.border = '1px solid #2a3660';
      btn.style.background = '#17213f';
      btn.style.color = '#eef1fb';
      btn.style.fontFamily = "'Work Sans', sans-serif";
      btn.style.fontSize = '12px';
      btn.style.cursor = 'pointer';
      wrap.appendChild(btn);

      function resize(){
        var r = container.getBoundingClientRect();
        var dpr = window.devicePixelRatio || 1;
        canvas.width = Math.max(1, r.width * dpr);
        canvas.height = Math.max(1, r.height * dpr);
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      }
      resize();
      var ro = new ResizeObserver(resize);
      ro.observe(container);

      var battery = 100;
      var elapsed = 0;
      var shielding = false;
      var gameOver = false;
      var particles = [];
      for (var i = 0; i < 40; i++){
        particles.push({ x: Math.random(), y: Math.random(), s: Math.random() * 2 + 1, v: Math.random() * 0.3 + 0.1 });
      }

      function onDown(e){ e.preventDefault(); shielding = true; }
      function onUp(){ shielding = false; }
      function onKeyDown(e){ if (e.key === ' ' || e.key === 'Enter') shielding = true; }
      function onKeyUp(e){ if (e.key === ' ' || e.key === 'Enter') shielding = false; }
      btn.addEventListener('pointerdown', onDown);
      window.addEventListener('pointerup', onUp);
      btn.addEventListener('keydown', onKeyDown);
      btn.addEventListener('keyup', onKeyUp);

      var raf, running = true, last = performance.now();
      var batteryEl = hud.querySelector('.opBattery');
      var timeEl = hud.querySelector('.opTime');

      function loop(now){
        if (!running) return;
        var dt = Math.min((now - last) / 1000, 0.1);
        last = now;
        if (!gameOver){
          elapsed += dt;
          var drain = shielding ? 2.5 : 7;
          battery -= drain * dt;
          if (battery <= 0){ battery = 0; gameOver = true; }
        }

        var w = container.clientWidth, h = container.clientHeight;
        ctx.fillStyle = '#4a2415';
        ctx.fillRect(0, 0, w, h);

        ctx.fillStyle = 'rgba(226,102,59,0.55)';
        particles.forEach(function(pt){
          pt.y += pt.v * dt;
          if (pt.y > 1) pt.y = 0;
          ctx.beginPath();
          ctx.arc(pt.x * w, pt.y * h, pt.s, 0, Math.PI * 2);
          ctx.fill();
        });

        ctx.fillStyle = shielding ? '#7fd8a6' : '#e2663b';
        ctx.fillRect(w * 0.5 - 20, h * 0.75, 40, 18);
        ctx.fillStyle = shielding ? '#bfe9d2' : '#6b3a28';
        ctx.fillRect(w * 0.5 - 26, h * 0.68, 52, shielding ? 16 : 8);

        batteryEl.textContent = 'Батарея: ' + Math.round(battery) + '%';
        timeEl.textContent = 'Час: ' + Math.floor(elapsed) + 'с';

        if (gameOver){
          ctx.fillStyle = 'rgba(11,16,32,0.75)';
          ctx.fillRect(0, 0, w, h);
          ctx.fillStyle = '#eef1fb';
          ctx.font = '14px Fraunces, serif';
          ctx.textAlign = 'center';
          ctx.fillText('Зв’язок втрачено.', w / 2, h / 2 - 8);
          ctx.font = '11px "IBM Plex Mono", monospace';
          ctx.fillText('Протримався ' + Math.floor(elapsed) + ' секунд', w / 2, h / 2 + 14);
          ctx.textAlign = 'left';
        }

        raf = requestAnimationFrame(loop);
      }
      raf = requestAnimationFrame(loop);

      return function cleanup(){
        running = false;
        if (raf) cancelAnimationFrame(raf);
        ro.disconnect();
        btn.removeEventListener('pointerdown', onDown);
        window.removeEventListener('pointerup', onUp);
        btn.removeEventListener('keydown', onKeyDown);
        btn.removeEventListener('keyup', onKeyUp);
      };
    }
  };
})();

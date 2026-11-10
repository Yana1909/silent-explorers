/*
  Student project module contract:
  window.STUDENT_PROJECTS[<location id>] = {
    title: string,           // short project name
    author: string,          // student name
    type: "animation"|"game",
    init(container, item){   // container is an empty <div>, ~16:10, already sized by CSS
      // build your canvas/DOM inside `container`, start your loop/game,
      // return a cleanup() function that stops timers and removes listeners.
    }
  };
*/
(function(){
  window.STUDENT_PROJECTS = window.STUDENT_PROJECTS || {};
  window.STUDENT_PROJECTS['eagle'] = {
    title: "Посадка «Орла»",
    author: "Приклад проєкту",
    type: "animation",
    init: function(container){
      var canvas = document.createElement('canvas');
      canvas.style.width = '100%';
      canvas.style.height = '100%';
      canvas.style.display = 'block';
      container.appendChild(canvas);
      var ctx = canvas.getContext('2d');
      var raf, running = true;

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

      var stars = [];
      for (var i = 0; i < 60; i++){
        stars.push({ x: Math.random(), y: Math.random() * 0.6, r: Math.random() * 1.4 + 0.3 });
      }

      var t0 = performance.now();
      var CYCLE = 7000;

      function draw(now){
        if (!running) return;
        var w = container.clientWidth, h = container.clientHeight;
        var t = (now - t0) % CYCLE;
        var p = t / CYCLE;

        ctx.fillStyle = '#0b1020';
        ctx.fillRect(0, 0, w, h);

        stars.forEach(function(s){
          ctx.globalAlpha = 0.5 + 0.5 * Math.sin((now / 500) + s.x * 10);
          ctx.fillStyle = '#ffffff';
          ctx.beginPath();
          ctx.arc(s.x * w, s.y * h, s.r, 0, Math.PI * 2);
          ctx.fill();
        });
        ctx.globalAlpha = 1;

        var groundY = h * 0.78;
        ctx.fillStyle = '#2a2b36';
        ctx.fillRect(0, groundY, w, h - groundY);
        ctx.fillStyle = '#1c1d26';
        for (var cx = 0; cx < w; cx += 40){
          ctx.beginPath();
          ctx.ellipse(cx, groundY + 6, 14, 5, 0, 0, Math.PI * 2);
          ctx.fill();
        }

        var descend = Math.min(p / 0.6, 1);
        var landerY = groundY - 70 - (1 - descend) * (h * 0.5);
        var landerX = w * 0.5;

        if (p < 0.62) {
          var flameLen = 10 + Math.sin(now / 40) * 4;
          ctx.fillStyle = '#ffb25c';
          ctx.beginPath();
          ctx.moveTo(landerX - 6, landerY + 22);
          ctx.lineTo(landerX + 6, landerY + 22);
          ctx.lineTo(landerX, landerY + 22 + flameLen);
          ctx.closePath();
          ctx.fill();
        }

        ctx.fillStyle = '#d9a15b';
        ctx.fillRect(landerX - 18, landerY - 10, 36, 24);
        ctx.fillStyle = '#b98649';
        ctx.fillRect(landerX - 26, landerY + 10, 10, 14);
        ctx.fillRect(landerX + 16, landerY + 10, 10, 14);
        ctx.fillStyle = '#eef1fb';
        ctx.fillRect(landerX - 6, landerY - 20, 12, 12);

        if (p > 0.58 && p < 0.9){
          var dp = (p - 0.58) / 0.32;
          ctx.globalAlpha = (1 - dp) * 0.5;
          ctx.fillStyle = '#9a8a6a';
          ctx.beginPath();
          ctx.ellipse(landerX, groundY, 20 + dp * 70, 8 + dp * 18, 0, 0, Math.PI * 2);
          ctx.fill();
          ctx.globalAlpha = 1;
        }

        if (p > 0.72){
          var fa = Math.min((p - 0.72) / 0.1, 1);
          ctx.strokeStyle = '#eef1fb';
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.moveTo(landerX + 40, groundY);
          ctx.lineTo(landerX + 40, groundY - 30 * fa);
          ctx.stroke();
          if (fa > 0.9){
            ctx.fillStyle = '#eef1fb';
            ctx.fillRect(landerX + 40, groundY - 30, 16, 10);
            ctx.strokeStyle = '#2a3660';
            ctx.strokeRect(landerX + 40, groundY - 30, 16, 10);
          }
        }

        ctx.fillStyle = '#aab2cf';
        ctx.font = '11px monospace';
        ctx.fillText(p < 0.6 ? 'Знижуємось…' : 'Місяць. Тиша.', 12, h - 12);

        raf = requestAnimationFrame(draw);
      }
      raf = requestAnimationFrame(draw);

      return function cleanup(){
        running = false;
        if (raf) cancelAnimationFrame(raf);
        ro.disconnect();
      };
    }
  };
})();

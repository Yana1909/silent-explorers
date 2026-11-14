/* Opportunity: Dust Storm — standalone student project module.
 * Register this file after the shared project helpers have loaded.
 */
(function () {
  'use strict';
  window.STUDENT_PROJECTS = window.STUDENT_PROJECTS || {};
  window.STUDENT_PROJECTS.opportunity = {
    title: { en: 'Dust Storm', uk: 'Пилова буря' },
    type: 'game',
    init: function (container) {
      container.innerHTML = '';
      var root = document.createElement('div');
      root.className = 'op-game';
      root.style.cssText = 'position:relative;width:100%;height:100%;min-height:240px;overflow:hidden;background:#301a18;color:#fff;font-family:system-ui,sans-serif;touch-action:none;';
      var canvas = document.createElement('canvas');
      canvas.setAttribute('aria-label', 'Opportunity rover dodging rocks in a Martian dust storm');
      canvas.style.cssText = 'display:block;width:100%;height:100%;';
      var hud = document.createElement('div');
      hud.style.cssText = 'position:absolute;inset:10px 12px auto;display:flex;justify-content:space-between;align-items:center;pointer-events:none;font:600 12px/1.4 "IBM Plex Mono",monospace;text-shadow:0 1px 4px #25100d;';
      var score = document.createElement('span');
      var best = document.createElement('span');
      hud.append(score, best);
      var message = document.createElement('div');
      message.style.cssText = 'position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);width:90%;text-align:center;text-shadow:0 2px 8px #311710;pointer-events:none;';
      var controls = document.createElement('div');
      controls.style.cssText = 'position:absolute;left:0;right:0;bottom:10px;display:flex;justify-content:space-between;padding:0 14px;pointer-events:none;';
      function makePad(label, side) {
        var b = document.createElement('button');
        b.type = 'button'; b.textContent = label; b.setAttribute('aria-label', side === 'left' ? 'Move rover left' : 'Move rover right');
        b.style.cssText = 'width:58px;height:52px;border:1px solid #f6c39a99;border-radius:14px;background:#341a17bb;color:#fff;font-size:23px;pointer-events:auto;touch-action:none;';
        controls.appendChild(b); return b;
      }
      var leftBtn = makePad('←', 'left'), rightBtn = makePad('→', 'right');
      root.append(canvas, hud, message, controls); container.appendChild(root);
      var ctx = canvas.getContext('2d');
      if (!ctx) return function () { container.innerHTML = ''; };
      var dpr = 1, w = 1, h = 1, raf = 0, alive = true, last = 0, elapsed = 0, scoreValue = 0;
      var running = false, ended = false, playerX = .5, targetX = .5, obstacles = [], dust = [], keys = Object.create(null);
      var bestValue = 0;
      try { bestValue = Number(localStorage.getItem('opportunity-dust-best') || 0); } catch (_) {}
      var lang = (typeof window.getLang === 'function' && window.getLang() === 'uk') ? 'uk' : 'en';
      var strings = { en: { score:'DISTANCE', best:'BEST', start:'Opportunity: Dust Storm', hint:'← → or A / D • move mouse • touch the arrows', begin:'Tap or press an arrow key to drive', over:'Storm impact', again:'Tap or press an arrow key to try again' }, uk: { score:'ШЛЯХ', best:'РЕКОРД', start:'Opportunity: Пилова буря', hint:'← → або A / D • рух мишкою • торкайся стрілок', begin:'Торкнись або натисни стрілку, щоб їхати', over:'Удар у бурі', again:'Торкнись або натисни стрілку, щоб спробувати ще' } };
      function tr(k) { return strings[lang][k]; }
      function renderMessage() {
        message.innerHTML = '<div style="font:700 clamp(18px,4vw,28px) Fraunces,Georgia,serif;margin-bottom:8px">' + (ended ? tr('over') : tr('start')) + '</div><div style="font-size:12px;line-height:1.5">' + (ended ? tr('again') : tr('hint') + '<br>' + tr('begin')) + '</div>';
      }
      function renderHud() { score.textContent = tr('score') + '  ' + Math.floor(scoreValue); best.textContent = tr('best') + '  ' + Math.floor(bestValue); }
      function resize() {
        var rect = root.getBoundingClientRect(); w = Math.max(1, rect.width); h = Math.max(1, rect.height); dpr = Math.min(window.devicePixelRatio || 1, 2);
        canvas.width = Math.round(w * dpr); canvas.height = Math.round(h * dpr); ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      }
      var observer = new ResizeObserver(resize); observer.observe(root); resize();
      for (var i=0;i<72;i++) dust.push({x:Math.random(), y:Math.random(), r:Math.random()*1.7+.3, a:Math.random()*.14+.04, drift:Math.random()*.08+.02});
      function start() { if (ended) { elapsed=0; scoreValue=0; obstacles=[]; playerX=.5; targetX=.5; ended=false; } running=true; message.style.display='none'; last=performance.now(); }
      function keyDown(e) {
        if (['ArrowLeft','ArrowRight',' ','a','A','d','D'].indexOf(e.key) >= 0) e.preventDefault();
        keys[e.key.toLowerCase()] = true;
        if (!running && ['ArrowLeft','ArrowRight','a','d',' '].indexOf(e.key) >= 0) start();
      }
      function keyUp(e) { keys[e.key.toLowerCase()] = false; }
      function pointerMove(e) { var r=canvas.getBoundingClientRect(); targetX=Math.max(.08,Math.min(.92,(e.clientX-r.left)/r.width)); if (!running && !ended) start(); }
      function pointerDown(e) { if (e.target === leftBtn || e.target === rightBtn) return; if (!running) start(); pointerMove(e); }
      function padDown(side, e) { e.preventDefault(); keys[side]=true; if (!running) start(); }
      function padUp(side) { keys[side]=false; }
      function bindPad(btn, side) { btn.addEventListener('pointerdown', function(e){padDown(side,e);}); btn.addEventListener('pointerup', function(){padUp(side);}); btn.addEventListener('pointercancel', function(){padUp(side);}); btn.addEventListener('lostpointercapture', function(){padUp(side);}); }
      bindPad(leftBtn,'left'); bindPad(rightBtn,'right');
      window.addEventListener('keydown',keyDown); window.addEventListener('keyup',keyUp);
      canvas.addEventListener('pointermove',pointerMove); root.addEventListener('pointerdown',pointerDown);
      var removeLang = typeof window.onLangChange === 'function' ? window.onLangChange(function (next) { lang=next; renderMessage(); renderHud(); }) : function(){};
      renderHud(); renderMessage();
      function drawRover(x,y,scale) {
        ctx.save(); ctx.translate(x,y); ctx.scale(scale,scale);
        ctx.fillStyle='#201716'; [[-17,-14],[17,-14],[-17,14],[17,14]].forEach(function(p){ctx.fillRect(p[0]-4,p[1]-5,8,10);});
        ctx.fillStyle='#e9d7bb'; ctx.fillRect(-14,-15,28,30); ctx.fillStyle='#aab5b0'; ctx.fillRect(-9,-11,18,10);
        ctx.fillStyle='#d79755'; ctx.beginPath(); ctx.arc(0,-18,7,0,Math.PI*2); ctx.fill();
        ctx.strokeStyle='#f6d5a5'; ctx.lineWidth=2; ctx.beginPath(); ctx.moveTo(0,-24); ctx.lineTo(0,-31); ctx.stroke(); ctx.restore();
      }
      function frame(now) {
        if (!alive) return;
        var dt=Math.min((now-last)/1000,.05); last=now;
        if (running && !ended) {
          elapsed+=dt; scoreValue+=dt*12;
          var dir=(keys.arrowleft||keys.a||keys.left?-1:0)+(keys.arrowright||keys.d||keys.right?1:0);
          if (dir) targetX=Math.max(.08,Math.min(.92,playerX+dir*dt*1.25));
          playerX += (targetX-playerX)*Math.min(1,dt*7);
          if (Math.random()<dt*(1.0+elapsed*.035)) obstacles.push({x:.09+Math.random()*.82,y:-24,r:9+Math.random()*13,rot:Math.random()*6.28,spin:(Math.random()-.5)*2});
          var speed=100+Math.min(130,elapsed*2.4);
          obstacles.forEach(function(o){o.y+=speed*dt;o.rot+=o.spin*dt;}); obstacles=obstacles.filter(function(o){return o.y<h+40;});
          var px=playerX*w, py=h*.76;
          if (obstacles.some(function(o){return Math.hypot(o.x*w-px,o.y-py)<o.r+16;})) {
            ended=true; running=false; bestValue=Math.max(bestValue,Math.floor(scoreValue)); try{localStorage.setItem('opportunity-dust-best',bestValue);}catch(_){}; renderMessage(); message.style.display='block';
          }
        }
        ctx.fillStyle='#552c23'; ctx.fillRect(0,0,w,h);
        var grad=ctx.createLinearGradient(0,0,w,h); grad.addColorStop(0,'rgba(226,130,83,.16)'); grad.addColorStop(1,'rgba(24,15,19,.3)'); ctx.fillStyle=grad;ctx.fillRect(0,0,w,h);
        dust.forEach(function(p){p.y+=dt*(p.drift+(running?.16:0));p.x-=dt*.035;if(p.y>1)p.y=0;if(p.x<0)p.x=1;ctx.fillStyle='rgba(255,202,151,'+p.a+')';ctx.beginPath();ctx.arc(p.x*w,p.y*h,p.r,0,Math.PI*2);ctx.fill();});
        obstacles.forEach(function(o){ctx.save();ctx.translate(o.x*w,o.y);ctx.rotate(o.rot);ctx.fillStyle='#34231f';ctx.strokeStyle='#9a5b3d';ctx.lineWidth=2;ctx.beginPath();for(var j=0;j<7;j++){var a=j*Math.PI*2/7,rr=o.r*(.72+(j%2)*.3);if(!j)ctx.moveTo(Math.cos(a)*rr,Math.sin(a)*rr);else ctx.lineTo(Math.cos(a)*rr,Math.sin(a)*rr);}ctx.closePath();ctx.fill();ctx.stroke();ctx.restore();});
        drawRover(playerX*w,h*.76,Math.max(.72,Math.min(1.15,w/420)));
        if (running && !ended) renderHud();
        raf=requestAnimationFrame(frame);
      }
      raf=requestAnimationFrame(frame);
      return function cleanup() {
        alive=false; cancelAnimationFrame(raf); observer.disconnect(); removeLang();
        window.removeEventListener('keydown',keyDown); window.removeEventListener('keyup',keyUp);
        canvas.removeEventListener('pointermove',pointerMove); root.removeEventListener('pointerdown',pointerDown);
        padUp('left'); padUp('right'); container.innerHTML='';
      };
    }
  };
})();

/* Spirit 360 panorama explorer for Silent Explorers.
 * Replace projects/spirit.js with this file. Uses the project's global THREE.
 */
(function () {
  'use strict';
  window.STUDENT_PROJECTS = window.STUDENT_PROJECTS || {};

  var words = {
    en: {
      title: "Spirit Panorama Explorer", start: "Start exploring", intro: "Turn left and right around five panoramas from Spirit's journey.",
      kicker: "SPIRIT · GUSEV CRATER", drag: "Drag left or right to look around", close: "Close explorer", quiz: "Photo quiz",
      source: "NASA Photojournal", coverage: "The photos are wrapped around a cylindrical 360° viewer. The original images have different amounts of captured scenery, so some views may repeat at the edges. The McMurdo panorama is a false-color image with exaggerated colors.",
      missing: "Could not load this panorama. Check that the original JPEG is in assets/img/spirit/.", read: "Field note", notesRead: "{n} of {total} notes explored",
      quizPrompt: "Choose one answer. You only get one attempt for this photo.", quizCorrect: "Correct!", quizWrong: "Not quite. This photo's answer is now locked.", quizUsed: "You already answered this photo's quiz.",
      review: "Open related note", dismiss: "Close panel", imageAlt: "Panorama photographed by the Spirit rover",
      names: ["Legacy · Bonneville", "Spirit's Destination", "McMurdo", "West Valley", "Bonestell South"],
      photos: [
        {file:"PIA07342~orig.jpg", nasa:"https://science.nasa.gov/photojournal/legacy-panorama-on-spirits-way-to-bonneville/", horizon:.16,
          marks:[
            {x:56,y:55,title:"Bonneville ejecta",kind:"Impact geology",body:"The ground here crosses from smoother plains into the rockier blanket thrown out when Bonneville Crater formed."},
            {x:67,y:55,title:"Tracks toward the lander",kind:"Spirit's route",body:"Follow Spirit's tracks back toward the right of center to find the landing site in the distance."},
            {x:83,y:68,title:"Columbia Memorial Station",kind:"Landing site",body:"Spirit's lander is about 200 metres away, near the tracks on the right side of the panorama."}
          ],
          quiz:{q:"What crater formed the ejecta blanket in this view?",answers:["Bonneville Crater","Gale Crater","Endurance Crater"],correct:0,clue:0}
        },
        {file:"PIA05591~orig.jpg", nasa:"https://science.nasa.gov/photojournal/spirits-destination-panorama/", horizon:.15,
          marks:[
            {x:26,y:18,title:"Spirit's heatshield",kind:"Mission landmark",body:"A tiny bright remnant of the rover's heatshield sits just below the horizon, left of center."},
            {x:51,y:43,title:"Dark drift",kind:"Surface feature",body:"Dark drift material can be seen in the center of the panorama."},
            {x:87,y:18,title:"Columbia Hills",kind:"Spirit's destination",body:"The hills Spirit was heading toward rise along the right side of the panorama."}
          ],
          quiz:{q:"What tiny bright object is visible below the left part of the horizon?",answers:["Spirit's heatshield","A rover wheel","A solar panel"],correct:0,clue:0}
        },
        {file:"PIA16441~orig.jpg", nasa:"https://science.nasa.gov/photojournal/spirit-mars-rover-in-mcmurdo-panorama-false-color/", horizon:.15,
          marks:[
            {x:38,y:16,title:"Low Ridge",kind:"Winter site · Gusev Crater",body:"Spirit stayed on this small hill through the 2006 Martian winter, with its solar panels tilted toward the Sun."},
            {x:42,y:50,title:"Bright wheel trench",kind:"Sulfur-rich salty minerals",body:"A trench dug by Spirit's right-front wheel, which could no longer rotate, exposed bright, sulfur-rich material beneath the surface."},
            {x:32,y:76,title:"Spirit's rover hardware",kind:"The rover and its surroundings",body:"The rover's own structure fills the foreground, with the Martian landscape beyond it."}
          ],
          quiz:{q:"What did the trench from Spirit's stuck right-front wheel expose?",answers:["Water ice","Sulfur-rich soil","Fresh lava"],correct:1,clue:1}
        },
        {file:"PIA10216~orig.jpg", nasa:"https://science.nasa.gov/photojournal/spirits-west-valley-panorama/", horizon:.18,
          marks:[
            {x:27,y:27,title:"Tsiolkovski Ridge",kind:"Columbia Hills landmark",body:"This rock-dotted ridge lies across the left third of the view, about 30 metres beyond Home Plate."},
            {x:54,y:86,title:"Home Plate",kind:"Field site",body:"Spirit photographed this view from near the western edge of the low plateau where it spent the closing months of 2007."},
            {x:83,y:15,title:"Husband Hill",kind:"Horizon landmark",body:"The highest point on the right side of this horizon is Husband Hill, about 800 metres north of Spirit."}
          ],
          quiz:{q:"Which hill is the highest point on the right side of this view?",answers:["Husband Hill","McCool Hill","Grissom Hill"],correct:0,clue:2}
        },
        {file:"PIA11051~orig.jpg", nasa:"https://science.nasa.gov/photojournal/southern-half-of-spirits-bonestell-panorama/", horizon:.28,
          marks:[
            {x:20,y:17,title:"McCool Hill",kind:"Horizon landmark",body:"NASA identifies McCool Hill as the highest point on the horizon in this southern half of the Bonestell panorama."},
            {x:52,y:77,title:"Home Plate",kind:"Field site",body:"The low plateau is about 80 metres across; its edges and Spirit's wheel tracks appear in the foreground."},
            {x:52,y:38,title:"Von Braun",kind:"Possible rover destination",body:"This smaller hill with a light-toned cap lies to the right of McCool Hill, closer to Home Plate."}
          ],
          quiz:{q:"Which hill is the highest point on the horizon in this southern view?",answers:["Husband Hill","McCool Hill","Von Braun"],correct:1,clue:0}
        }
      ]
    },
    uk: {
      title:"Панорами Spirit", start:"Почати дослідження", intro:"Обертайся ліворуч і праворуч навколо п'яти панорам із подорожі Spirit.",
      kicker:"SPIRIT · КРАТЕР ГУСЄВА", drag:"Перетягуй ліворуч або праворуч", close:"Закрити дослідження", quiz:"Вікторина за фото",
      source:"NASA Photojournal", coverage:"Фото розгорнуті навколо циліндричного огляду 360°. Оригінальні знімки мають різне охоплення, тому біля країв зображення може повторюватися. Панорама Мак-Мердо подана в несправжніх, посилених кольорах.",
      missing:"Не вдалося завантажити панораму. Перевір, чи оригінальний JPEG лежить у assets/img/spirit/.", read:"Польова нотатка", notesRead:"Досліджено нотаток: {n} з {total}",
      quizPrompt:"Обери одну відповідь. Для кожного фото є лише одна спроба.", quizCorrect:"Правильно!", quizWrong:"Не зовсім. Відповідь для цього фото заблоковано.", quizUsed:"Ти вже відповів(-ла) на вікторину за цим фото.",
      review:"Відкрити відповідну нотатку", dismiss:"Закрити панель", imageAlt:"Панорама, знята марсоходом Spirit",
      names:["Legacy · Бонневіль","Ціль Spirit","Мак-Мердо","Західна долина","Бонестелл · південь"],
      photos:[
        {marks:[
          {title:"Викиди Бонневіля",kind:"Геологія ударного кратера",body:"Тут рівнина переходить у кам'янистий покрив, викинутий під час утворення кратера Бонневіль."},
          {title:"Сліди до посадкової платформи",kind:"Маршрут Spirit",body:"Якщо простежити сліди Spirit праворуч від центру, можна знайти місце посадки вдалині."},
          {title:"Посадкова платформа Columbia Memorial",kind:"Місце посадки",body:"Посадкова платформа Spirit розташована приблизно за 200 метрів біля слідів праворуч на панорамі."}
        ],quiz:{q:"Який кратер утворив покрив викидів на цьому знімку?",answers:["Кратер Бонневіль","Кратер Гейл","Кратер Ендюранс"],correct:0}},
        {marks:[
          {title:"Теплозахисний екран Spirit",kind:"Орієнтир місії",body:"Маленький світлий уламок теплозахисного екрана видно під горизонтом ліворуч від центру."},
          {title:"Темний дрейф",kind:"Особливість поверхні",body:"Темний дрейфовий матеріал видно в центрі панорами."},
          {title:"Колумбійські пагорби",kind:"Ціль Spirit",body:"Пагорби, до яких прямував Spirit, здіймаються праворуч на панорамі."}
        ],quiz:{q:"Який маленький світлий об'єкт видно під лівою частиною горизонту?",answers:["Теплозахисний екран Spirit","Колесо марсохода","Сонячна панель"],correct:0}},
        {marks:[
          {title:"Низький хребет",kind:"Місце зимівлі · кратер Гусєва",body:"Узимку 2006 року Spirit стояв на цьому невеликому пагорбі, нахиливши сонячні панелі до Сонця."},
          {title:"Яскрава колія колеса",kind:"Солі, багаті на сірку",body:"Канавка від правого переднього колеса Spirit, яке більше не оберталося, оголила під поверхнею світлий матеріал, багатий на сірку."},
          {title:"Обладнання Spirit",kind:"Марсохід і його околиці",body:"Передній план займає сам марсохід, а за ним видно марсіанський ландшафт."}
        ],quiz:{q:"Що відкрила канавка від застряглого правого переднього колеса Spirit?",answers:["Водяний лід","Ґрунт, багатий на сірку","Свіжу лаву"],correct:1}},
        {marks:[
          {title:"Хребет Ціолковського",kind:"Орієнтир Колумбійських пагорбів",body:"Кам'янистий хребет розташований у лівій третині знімка, приблизно за 30 метрів від Home Plate."},
          {title:"Home Plate",kind:"Місце дослідження",body:"Spirit зняв цей краєвид біля західного краю низького плато, де провів останні місяці 2007 року."},
          {title:"Пагорб Хасбенд",kind:"Орієнтир на горизонті",body:"Найвища точка праворуч на горизонті — пагорб Хасбенд, приблизно за 800 метрів на північ від Spirit."}
        ],quiz:{q:"Який пагорб є найвищою точкою праворуч на цьому знімку?",answers:["Пагорб Хасбенд","Пагорб Мак-Кул","Пагорб Гріссом"],correct:0}},
        {marks:[
          {title:"Пагорб Мак-Кул",kind:"Орієнтир на горизонті",body:"NASA вказує Мак-Кул як найвищу точку горизонту в південній половині панорами Бонестелл."},
          {title:"Home Plate",kind:"Місце дослідження",body:"Низьке плато має близько 80 метрів у поперечнику; на передньому плані видно його краї та сліди Spirit."},
          {title:"Фон Браун",kind:"Можлива ціль марсохода",body:"Цей менший пагорб зі світлим виходом порід лежить праворуч від Мак-Кула, ближче до Home Plate."}
        ],quiz:{q:"Який пагорб є найвищою точкою горизонту на цьому південному знімку?",answers:["Пагорб Хасбенд","Пагорб Мак-Кул","Фон Браун"],correct:1}}
      ]
    }
  };

  var order = [2,1,4,0,3];
  var basePhotos = words.en.photos;
  words.en.photos = order.map(function(i){ return basePhotos[i]; });
  words.uk.photos = order.map(function(i){ return words.uk.photos[i]; });
  words.en.names = ["Legacy · Bonneville", "Spirit's Destination", "McMurdo", "West Valley", "Bonestell South"];
  words.uk.names = ["Legacy · Бонневіль", "Ціль Spirit", "Мак-Мердо", "Західна долина", "Бонестелл · південь"];
  var photoInfo = words.en.photos;

  var STYLE_ID = "spirit-360-style";
  var css = `
    .sp-preview{position:absolute;inset:0;display:flex;flex-direction:column;justify-content:flex-end;align-items:flex-start;gap:12px;padding:24px;color:#fff;background:linear-gradient(0deg,#080a0bdc,transparent 78%),url('assets/img/spirit/PIA16441~orig.jpg') center/cover;font:500 15px/1.5 system-ui,sans-serif}
    .sp-preview h2{margin:0;font-size:clamp(24px,4vw,42px)}.sp-preview p{margin:0;max-width:50ch;color:#e0ded8}
    .sp-button,.sp-tab,.sp-close,.sp-mark,.sp-answer{font:inherit;cursor:pointer}.sp-button{border:0;border-radius:999px;background:#de7048;color:#1c120e;padding:12px 20px;font-weight:800}
    .sp-app{position:fixed;inset:0;z-index:99999;background:#171817;color:#f5f1e8;font:500 14px/1.45 system-ui,sans-serif;display:grid;grid-template-rows:auto 1fr auto;overflow:hidden}
    .sp-top{display:flex;align-items:center;gap:12px;padding:10px 14px;background:#10110f;border-bottom:1px solid #49463e;z-index:3}.sp-brand{min-width:160px}.sp-kicker{display:block;color:#eaa17f;font-size:10px;font-weight:800;letter-spacing:.15em}.sp-title{font-size:16px;font-weight:800}
    .sp-tabs{display:flex;gap:6px;overflow:auto;flex:1}.sp-tab{white-space:nowrap;border:1px solid #514c42;border-radius:999px;background:#25251f;color:#eee6d9;padding:8px 11px}.sp-tab[aria-current=true]{background:#de7048;color:#1c120e;border-color:#de7048}
    .sp-close{border:1px solid #625c50;border-radius:50%;width:40px;height:40px;background:transparent;color:#fff;font-size:22px;flex:none}.sp-main{position:relative;min-height:0}.sp-view{position:absolute;inset:0;overflow:hidden;touch-action:none;cursor:grab;background:#292720;user-select:none}.sp-view.sp-drag{cursor:grabbing}.sp-canvas{position:absolute;inset:0;width:100%;height:100%;display:block}.sp-hot{position:absolute;inset:0;pointer-events:none;z-index:2}.sp-mark{pointer-events:auto;position:absolute;transform:translate(-50%,-50%);width:36px;height:36px;border:2px solid white;border-radius:50%;background:#dc714b;color:white;font-weight:900;box-shadow:0 0 0 6px #dc714b55}.sp-mark.sp-read{background:#5d8466;box-shadow:0 0 0 6px #5d846655}.sp-mark.sp-offscreen{background:#4b5960;box-shadow:0 0 0 6px #4b596055}.sp-mark span{position:absolute;left:42px;top:3px;white-space:nowrap;border-radius:5px;padding:4px 7px;background:#111e;color:white;font-size:12px;font-weight:700}
    .sp-hint{position:absolute;left:14px;bottom:12px;padding:8px 11px;border:1px solid #625c50;border-radius:999px;background:#10110fcf;pointer-events:none}.sp-side{position:absolute;z-index:4;right:0;top:0;bottom:0;width:min(360px,90vw);padding:24px;background:#20211d;border-left:1px solid #49463e;overflow:auto;box-shadow:-15px 0 44px #0006}.sp-side h2{margin:12px 0;font-size:24px;line-height:1.15}.sp-side p{color:#d5d0c6}.sp-meta{color:#eaa17f;font-size:11px;font-weight:800;letter-spacing:.1em;text-transform:uppercase}.sp-panel-x{position:absolute;right:12px;top:12px;border:1px solid #625c50;border-radius:50%;width:36px;height:36px;background:transparent;color:#fff;font-size:20px;cursor:pointer}.sp-answer-list{display:grid;gap:8px}.sp-answer{width:100%;text-align:left;border:1px solid #696151;border-radius:8px;background:#302e26;color:white;padding:10px 12px}.sp-answer:disabled{opacity:.65;cursor:default}.sp-feedback{min-height:1.5em}.sp-feedback.ok{color:#9ad2a6;font-weight:800}.sp-progress{padding:9px 11px;border-radius:8px;background:#302e26;color:#f2dbc5}.sp-foot{display:flex;justify-content:space-between;gap:12px;padding:9px 14px;background:#10110f;color:#c4bbaa;font-size:11px}.sp-foot a{color:#eaa17f}.sp-hide{display:none!important}.sp-error{position:absolute;inset:0;display:grid;place-content:center;text-align:center;padding:28px;background:#25231f}
    @media(max-width:760px){.sp-top{flex-wrap:wrap;padding:8px;gap:7px}.sp-brand{flex:1}.sp-tabs{order:3;flex-basis:100%;width:100%}.sp-mark span{display:none}.sp-side{top:auto;left:0;right:0;bottom:0;width:auto;max-height:58vh;border-left:0;border-top:1px solid #49463e;border-radius:18px 18px 0 0;box-shadow:0 -12px 40px #0008}.sp-foot{font-size:10px}}
    @media(prefers-reduced-motion:reduce){.sp-app *{scroll-behavior:auto!important;transition:none!important}}
  `;

  function currentLang(){ return window.getLang && window.getLang()==="uk" ? "uk" : "en"; }
  function escapeHtml(value){ return String(value).replace(/[&<>"']/g,function(c){ return ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[c]; }); }

  window.STUDENT_PROJECTS.spirit = {
    title:{en:"Spirit Panorama Explorer",uk:"Панорами Spirit"}, type:"panorama",
    init:function(container){
      container.innerHTML="";
      var lang=currentLang(), data=words[lang], current=0, app=null, view=null, side=null, source=null, canvas=null, renderer=null, scene=null, camera=null, mesh=null, texture=null, overlay=null, image=null, raf=0;
      var yaw=0, dragYaw=0, downX=0, pointer=null, radius=500, geometryHeight=0, meshOffsetY=0, noteState={}, quizState={};
      var noteKey="silent-explorers:spirit-cylinder-notes-v1", quizKey="silent-explorers:spirit-cylinder-quiz-v1";
      try{noteState=JSON.parse(localStorage.getItem(noteKey)||"{}")}catch(e){noteState={}}
      try{quizState=JSON.parse(localStorage.getItem(quizKey)||"{}")}catch(e){quizState={}}
      var listeners=[];
      function listen(node,event,fn,opts){node.addEventListener(event,fn,opts);listeners.push(function(){node.removeEventListener(event,fn,opts)})}
      function make(tag,className,parent){var el=document.createElement(tag);if(className)el.className=className;if(parent)parent.appendChild(el);return el}
      function translate(key){return words[lang][key]||words.en[key]||key}
      function refreshPreview(){previewTitle.textContent=translate("title");previewText.textContent=translate("intro");start.textContent=translate("start")}
      if(!document.getElementById(STYLE_ID)){var style=document.createElement("style");style.id=STYLE_ID;style.textContent=css;document.head.appendChild(style)}
      var preview=make("div","sp-preview",container),previewTitle=make("h2","",preview),previewText=make("p","",preview),start=make("button","sp-button",preview);start.type="button";refreshPreview();

      function disposeCylinder(){if(raf)cancelAnimationFrame(raf);raf=0;if(renderer){renderer.dispose();if(renderer.domElement.parentNode)renderer.domElement.remove()}if(mesh){mesh.geometry.dispose();mesh.material.dispose()}if(texture)texture.dispose();if(overlay)overlay.remove();renderer=scene=camera=mesh=texture=overlay=null}
      function markerPosition(mark){var theta=(mark.x/100)*Math.PI*2;return new THREE.Vector3(Math.sin(theta)*radius,(.5-mark.y/100)*geometryHeight,Math.cos(theta)*radius)}
      function positionMarkers(){if(!camera||!mesh||!overlay)return;var marks=photoInfo[current].marks;Array.prototype.forEach.call(overlay.children,function(button,i){var world=markerPosition(marks[i]);mesh.localToWorld(world);var local=world.clone();camera.worldToLocal(local);var p=world.clone().project(camera);var onScreen=local.z<0&&p.z>-1&&p.z<1&&Math.abs(p.x)<1&&Math.abs(p.y)<1;button.classList.toggle("sp-offscreen",!onScreen);if(!onScreen){if(local.z>=0){p.x=local.x>=0?.92:-.92;p.y=Math.max(-.82,Math.min(.82,local.y/Math.max(1,Math.abs(local.z))))}else{p.x=Math.max(-.92,Math.min(.92,p.x));p.y=Math.max(-.82,Math.min(.82,p.y))}}button.style.display="";button.style.left=((p.x+1)*50)+"%";button.style.top=((1-p.y)*50)+"%"})}
      function resize(){if(!renderer||!view||!camera)return;var w=Math.max(1,view.clientWidth),h=Math.max(1,view.clientHeight);renderer.setSize(w,h,false);camera.aspect=w/h;camera.updateProjectionMatrix();positionMarkers()}
      function renderFrame(){if(!renderer)return;camera.rotation.set(0,yaw,0,"YXZ");renderer.render(scene,camera);positionMarkers();raf=requestAnimationFrame(renderFrame)}
      function startCylinder(){
        if(!window.THREE||!image||!image.naturalWidth)return;
        disposeCylinder();var aspect=image.naturalWidth/image.naturalHeight;geometryHeight=(Math.PI*2*radius)/aspect;
        var horizon=photoInfo[current].horizon||.2;meshOffsetY=(horizon-.5)*geometryHeight;
        scene=new THREE.Scene();scene.background=new THREE.Color(0x171817);camera=new THREE.PerspectiveCamera(80,1,.1,radius*3);camera.position.set(0,-radius*.35,0);camera.rotation.order="YXZ";
        renderer=new THREE.WebGLRenderer({antialias:true,alpha:false});renderer.domElement.className="sp-canvas";renderer.setPixelRatio(Math.min(window.devicePixelRatio||1,2));if("outputEncoding" in renderer)renderer.outputEncoding=THREE.sRGBEncoding;view.appendChild(renderer.domElement);
        texture=new THREE.Texture(image);texture.needsUpdate=true;if("encoding" in texture)texture.encoding=THREE.sRGBEncoding;
        var geo=new THREE.CylinderGeometry(radius,radius,geometryHeight,256,1,true,0,Math.PI*2),mat=new THREE.MeshBasicMaterial({map:texture,side:THREE.BackSide});mesh=new THREE.Mesh(geo,mat);mesh.position.y=meshOffsetY;scene.add(mesh);
        overlay=make("div","sp-hot",view);yaw=0;drawMarkers();resize();renderFrame();
      }
      function save(object,key){try{localStorage.setItem(key,JSON.stringify(object))}catch(e){}}
      function noteCount(){return Object.keys(noteState).filter(function(key){return noteState[key]}).length}
      function progressText(){return translate("notesRead").replace("{n}",noteCount()).replace("{total}",15)}
      function drawMarkers(){
        if(!overlay)return;overlay.innerHTML="";
        data.photos[current].marks.forEach(function(mark,index){var key=data.photos[current].file+":"+index,button=make("button","sp-mark"+(noteState[key]?" sp-read":""),overlay);button.type="button";button.textContent=String(index+1);button.setAttribute("aria-label",translate("read")+": "+mark.title);var label=make("span","",button);label.textContent=mark.title;button.addEventListener("click",function(e){e.stopPropagation();showNote(index)})});positionMarkers()
      }
      function closeSide(){side.classList.add("sp-hide")}
      function showNote(index){var mark=data.photos[current].marks[index],key=data.photos[current].file+":"+index;side.innerHTML="";var close=make("button","sp-panel-x",side);close.type="button";close.textContent="×";close.setAttribute("aria-label",translate("dismiss"));close.addEventListener("click",closeSide);var meta=make("span","sp-meta",side);meta.textContent=mark.kind;var title=make("h2","",side);title.textContent=mark.title;var body=make("p","",side);body.textContent=mark.body;var progress=make("p","sp-progress",side);noteState[key]=true;save(noteState,noteKey);progress.textContent=progressText();side.classList.remove("sp-hide");drawMarkers()}
      function showQuiz(){
        var photo=data.photos[current],quiz=photo.quiz,answerKey=photo.file,record=quizState[answerKey];side.innerHTML="";var close=make("button","sp-panel-x",side);close.type="button";close.textContent="×";close.setAttribute("aria-label",translate("dismiss"));close.addEventListener("click",closeSide);
        var meta=make("span","sp-meta",side);meta.textContent=translate("quiz");var title=make("h2","",side);title.textContent=translate("names")[current];var q=make("p","",side);q.textContent=quiz.q;var prompt=make("p","",side);prompt.textContent=translate("quizPrompt");var list=make("div","sp-answer-list",side);
        quiz.answers.forEach(function(answer,index){var button=make("button","sp-answer",list);button.type="button";button.textContent=answer;button.disabled=!!record;button.addEventListener("click",function(){if(quizState[answerKey])return;var correct=index===quiz.correct;quizState[answerKey]={choice:index,correct:correct};save(quizState,quizKey);feedback.textContent=correct?translate("quizCorrect"):translate("quizWrong");feedback.classList.toggle("ok",correct);Array.prototype.forEach.call(list.children,function(item){item.disabled=true})});});
        var feedback=make("p","sp-feedback",side);feedback.setAttribute("aria-live","polite");var clue=make("button","sp-answer",side);clue.type="button";clue.textContent=translate("review");clue.style.marginTop="12px";clue.addEventListener("click",function(){showNote(quiz.clue)});
        if(record){feedback.textContent=record.correct?translate("quizCorrect"):translate("quizUsed");feedback.classList.toggle("ok",record.correct)}side.classList.remove("sp-hide")
      }
      function loadPhoto(index){
        current=(index+data.photos.length)%data.photos.length;disposeCylinder();var tabs=app.querySelectorAll(".sp-tab");tabs.forEach(function(tab,i){tab.setAttribute("aria-current",i===current?"true":"false")});
        var old=view.querySelector(".sp-error");if(old)old.remove();image=new Image();image.alt=translate("imageAlt");image.draggable=false;
        image.onload=function(){if(!app)return;startCylinder()};image.onerror=function(){if(!app)return;var error=make("div","sp-error",view);error.textContent=translate("missing")};image.src="assets/img/spirit/"+photoInfo[current].file;
        source.href=photoInfo[current].nasa;source.textContent=translate("source");closeSide()
      }
      function pointerDown(e){if(e.target.closest("button"))return;pointer=e.pointerId;downX=e.clientX;dragYaw=yaw;view.classList.add("sp-drag");try{view.setPointerCapture(e.pointerId)}catch(err){}}
      function pointerMove(e){if(pointer!==e.pointerId)return;yaw=dragYaw+(downX-e.clientX)*.0045}
      function pointerUp(e){if(pointer!==e.pointerId)return;pointer=null;view.classList.remove("sp-drag")}
      function keydown(e){if(!app)return;if(e.key==="Escape")closeApp();else if(e.key==="ArrowRight")loadPhoto(current+1);else if(e.key==="ArrowLeft")loadPhoto(current-1)}
      function buildApp(){
        if(app)return;document.body.dataset.spiritOldOverflow=document.body.style.overflow;document.body.style.overflow="hidden";app=make("div","sp-app",document.body);app.setAttribute("role","dialog");app.setAttribute("aria-modal","true");app.setAttribute("aria-label",translate("title"));
        var top=make("header","sp-top",app),brand=make("div","sp-brand",top),kicker=make("span","sp-kicker",brand),heading=make("span","sp-title",brand),tabs=make("nav","sp-tabs",top);kicker.textContent=translate("kicker");heading.textContent=translate("title");tabs.setAttribute("aria-label",translate("title"));
        data.photos.forEach(function(photo,i){var tab=make("button","sp-tab",tabs);tab.type="button";tab.textContent=translate("names")[i];tab.setAttribute("aria-current",i===current?"true":"false");tab.addEventListener("click",function(){loadPhoto(i)})});
        var quizButton=make("button","sp-tab",top);quizButton.type="button";quizButton.textContent=translate("quiz");quizButton.addEventListener("click",showQuiz);var close=make("button","sp-close",top);close.type="button";close.textContent="×";close.setAttribute("aria-label",translate("close"));close.addEventListener("click",closeApp);
        var main=make("main","sp-main",app);view=make("div","sp-view",main);var hint=make("div","sp-hint",view);hint.textContent=translate("drag");side=make("aside","sp-side sp-hide",main);
        var foot=make("footer","sp-foot",app),coverage=make("span","",foot);coverage.textContent=translate("coverage");source=make("a","",foot);source.target="_blank";source.rel="noopener noreferrer";
        listen(view,"pointerdown",pointerDown);listen(view,"pointermove",pointerMove);listen(view,"pointerup",pointerUp);listen(view,"pointercancel",pointerUp);listen(document,"keydown",keydown);listen(window,"resize",resize);
        if(window.onLangChange){var off=window.onLangChange(function(){if(!app)return;lang=currentLang();data=words[lang];kicker.textContent=translate("kicker");heading.textContent=translate("title");hint.textContent=translate("drag");coverage.textContent=translate("coverage");quizButton.textContent=translate("quiz");close.setAttribute("aria-label",translate("close"));tabs.querySelectorAll(".sp-tab").forEach(function(tab,i){tab.textContent=translate("names")[i]});if(!side.classList.contains("sp-hide")){if(side.querySelector(".sp-answer-list"))showQuiz();else{var openTitle=side.querySelector("h2");var found=data.photos[current].marks.findIndex(function(mark){return mark.title===openTitle.textContent});showNote(found<0?0:found)}}drawMarkers()});listeners.push(off)}
        loadPhoto(current)
      }
      function closeApp(){if(!app)return;disposeCylinder();listeners.splice(0).forEach(function(fn){try{fn()}catch(e){}});document.body.style.overflow=document.body.dataset.spiritOldOverflow||"";delete document.body.dataset.spiritOldOverflow;app.remove();app=null;view=side=source=null;start.focus({preventScroll:true})}
      function onStart(){buildApp()}
      start.addEventListener("click",onStart);
      var offPreview=window.onLangChange?window.onLangChange(function(){lang=currentLang();data=words[lang];refreshPreview()}):null;
      return function cleanup(){start.removeEventListener("click",onStart);if(offPreview)offPreview();closeApp();container.innerHTML=""}
    }
  };
})();

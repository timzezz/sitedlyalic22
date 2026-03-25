const themeBtn = document.querySelector('.theme-btn');
function toggleTheme(){
  const html = document.documentElement;
  const isDark = html.getAttribute('data-theme')==='dark';
  html.setAttribute('data-theme', isDark?'light':'dark');
  themeBtn.textContent = isDark ? '☀️' : '🌙';
}

// ===== NAVIGATION =====
function showPage(id, btn){
  document.querySelectorAll('.page').forEach(p=>p.classList.remove('active'));
  document.querySelectorAll('.nav-tab').forEach(b=>b.classList.remove('active'));
  document.getElementById('page-'+id).classList.add('active');
  btn.classList.add('active');
}

// ===== QUIZ DATA =====
const questions = [
  {
    q: "Чему равна вероятность достоверного события?",
    options:["0","0.5","1","Может быть любым числом"],
    answer:2, explain:"Достоверное событие всегда произойдёт, поэтому P = 1."
  },
  {
    q: "Что вычисляет факториал n!?",
    formula: "n! = ?",
    options:["Сумму 1+2+…+n","Произведение 1·2·3·…·n","Число сочетаний","Степень числа"],
    answer:1, explain:"n! = 1·2·3·…·n — произведение всех натуральных чисел от 1 до n."
  },
  {
    q: "Чему равно 5!?",
    options:["25","100","120","60"],
    answer:2, explain:"5! = 1·2·3·4·5 = 120."
  },
  {
    q: "Что вычисляет формула C(n, k)?",
    formula: "C(n,k) = n! / (k!(n-k)!)",
    options:["Перестановки","Число размещений","Число сочетаний","Факториал"],
    answer:2, explain:"C(n,k) — число способов выбрать k элементов из n без учёта порядка."
  },
  {
    q: "За что отвечает CSS в веб-разработке?",
    options:["Структура страницы","Серверная логика","Оформление и стили","База данных"],
    answer:2, explain:"CSS (Cascading Style Sheets) — язык описания внешнего вида HTML-документа."
  },
  {
    q: "Что такое алгоритм?",
    options:["Язык программирования","Точная конечная последовательность действий","Тип данных","База данных"],
    answer:1, explain:"Алгоритм — конечная точная последовательность действий для решения задачи."
  },
  {
    q: "Результат операции AND для значений 1 и 0?",
    formula: "1 AND 0 = ?",
    options:["1","0","−1","Неопределено"],
    answer:1, explain:"AND даёт 1 только если оба операнда равны 1. 1 AND 0 = 0."
  },
  {
    q: "Результат операции OR для значений 0 и 1?",
    formula: "0 OR 1 = ?",
    options:["0","1","2","−1"],
    answer:1, explain:"OR даёт 1 если хотя бы один операнд равен 1. 0 OR 1 = 1."
  },
  {
    q: "Сколько бит в одном байте?",
    options:["4","6","8","16"],
    answer:2, explain:"1 байт = 8 бит — это стандарт современных вычислительных систем."
  },
  {
    q: "Текст из 50 символов кодируется 8 битами на символ. Каков объём в байтах?",
    options:["50","400","100","200"],
    answer:0, explain:"50 символов × 8 бит = 400 бит = 400/8 = 50 байт."
  }
];

let currentQ = 0, score = 0, answered = false;

function buildQuiz(){
  const container = document.getElementById('quiz-questions');
  container.innerHTML = '';
  questions.forEach((q, i) => {
    const letters = ['A','B','C','D'];
    const opts = q.options.map((o,j)=>`
      <button class="option" onclick="selectAnswer(${i},${j})">
        <span class="opt-letter">${letters[j]}</span>${o}
      </button>`).join('');
    const formulaHTML = q.formula ? `<code class="q-formula">${q.formula}</code>` : '';
    container.innerHTML += `
    <div class="question-card ${i===0?'active':''}" id="qcard-${i}">
      <span class="q-num">Вопрос ${i+1} из ${questions.length}</span>
      <p class="q-text">${q.q}</p>
      ${formulaHTML}
      <div class="options">${opts}</div>
      <div class="q-feedback" id="qfb-${i}"></div>
      <div class="quiz-nav"><button class="btn-next" id="qnext-${i}" onclick="nextQuestion(${i})">${i===questions.length-1?'Завершить →':'Далее →'}</button></div>
    </div>`;
  });
  updateProgress();
}

function selectAnswer(qIdx, optIdx){
  if(answered) return;
  answered = true;
  const q = questions[qIdx];
  const opts = document.querySelectorAll(`#qcard-${qIdx} .option`);
  opts.forEach(o=>o.classList.add('disabled'));
  opts[optIdx].classList.add(optIdx===q.answer?'correct':'wrong');
  if(optIdx===q.answer){ score++; }
  else { opts[q.answer].classList.add('correct'); }
  const fb = document.getElementById(`qfb-${qIdx}`);
  fb.textContent = (optIdx===q.answer?'✅ Верно! ':'❌ Неверно. ') + q.explain;
  fb.className = `q-feedback show ${optIdx===q.answer?'ok':'fail'}`;
  document.getElementById(`qnext-${qIdx}`).classList.add('show');
}

function nextQuestion(qIdx){
  document.getElementById(`qcard-${qIdx}`).classList.remove('active');
  if(qIdx+1 < questions.length){
    currentQ = qIdx+1;
    answered = false;
    document.getElementById(`qcard-${currentQ}`).classList.add('active');
    updateProgress();
  } else {
    showResult();
  }
}

function updateProgress(){
  const pct = (currentQ/questions.length)*100;
  document.getElementById('progress-fill').style.width = pct+'%';
}

function showResult(){
  document.getElementById('progress-fill').style.width='100%';
  document.querySelectorAll('.question-card').forEach(c=>c.style.display='none');
  const pct = score/questions.length;
  const stars = pct>=0.9?'⭐⭐⭐': pct>=0.6?'⭐⭐':'⭐';
  const label = pct>=0.9?'Отлично! Материал освоен.' : pct>=0.6?'Хорошо! Повтори слабые места.' : 'Нужно повторить теорию.';
  document.getElementById('result-stars').textContent = stars;
  document.getElementById('result-score').textContent = `${score}/${questions.length}`;
  document.getElementById('result-label').textContent = label;
  document.getElementById('result-screen').classList.add('show');
}

function restartQuiz(){
  currentQ=0; score=0; answered=false;
  document.getElementById('result-screen').classList.remove('show');
  document.querySelectorAll('.question-card').forEach(c=>{ c.style.display=''; c.classList.remove('active'); });
  document.getElementById('qcard-0').classList.add('active');
  updateProgress();
  buildQuiz();
}

buildQuiz();

// ===== PRACTICE =====
function factorial(n){ if(n<=1) return 1; let r=1; for(let i=2;i<=n;i++) r*=i; return r; }

function calcFactorial(){
  const n = parseInt(document.getElementById('fact-n').value);
  const el = document.getElementById('fact-result');
  if(isNaN(n)||n<0||n>20){ el.textContent='⚠ Введи n от 0 до 20'; el.className='calc-result error'; return; }
  el.textContent=`${n}! = ${factorial(n)}`; el.className='calc-result';
}

function calcCombination(){
  const n = parseInt(document.getElementById('fact-n').value);
  const k = parseInt(document.getElementById('comb-k').value);
  const el = document.getElementById('comb-result');
  if(isNaN(n)||isNaN(k)||k>n||k<0){ el.textContent='⚠ Проверь значения (k ≤ n)'; el.className='calc-result error'; return; }
  const c = factorial(n)/(factorial(k)*factorial(n-k));
  el.textContent=`C(${n},${k}) = ${n}! / (${k}!·${n-k}!) = ${c}`; el.className='calc-result';
}

function calcBernoulli(){
  const n=parseFloat(document.getElementById('ber-n').value);
  const k=parseFloat(document.getElementById('ber-k').value);
  const p=parseFloat(document.getElementById('ber-p').value);
  const el=document.getElementById('ber-result');
  const steps=document.getElementById('ber-steps');
  if(isNaN(n)||isNaN(k)||isNaN(p)||p<0||p>1||k>n){ el.textContent='⚠ Проверь значения'; el.className='calc-result error'; steps.innerHTML=''; return; }
  const cnk = factorial(n)/(factorial(k)*factorial(n-k));
  const pk = Math.pow(p,k);
  const q1 = Math.pow(1-p,n-k);
  const res = cnk*pk*q1;
  el.textContent=`P(${k}) ≈ ${res.toFixed(6)}`; el.className='calc-result';
  steps.innerHTML=`
    <span class="score-tag">C(${n},${k}) = ${cnk}</span>
    <span class="score-tag">p^${k} ≈ ${pk.toFixed(4)}</span>
    <span class="score-tag">(1-p)^${n-k} ≈ ${q1.toFixed(4)}</span>`;
}

// Bits
let bits = new Array(8).fill(0);
function renderBits(){
  const d = document.getElementById('bits-display');
  d.innerHTML = bits.map((b,i)=>`<button class="bit-btn ${b?'on':''}" onclick="toggleBit(${i})">${b}</button>`).join('');
  const dec = bits.reduce((acc,b,i)=>acc+b*Math.pow(2,7-i),0);
  document.getElementById('bit-decimal').textContent = dec;
  document.getElementById('bit-binary').textContent = bits.join('');
}
function toggleBit(i){ bits[i]=bits[i]?0:1; renderBits(); }
function resetBits(){ bits=new Array(8).fill(0); renderBits(); }
function randomBits(){ bits=bits.map(()=>Math.random()>.5?1:0); renderBits(); }
renderBits();

function calcLogic(){
  const a=parseInt(document.getElementById('logic-a').value);
  const b=parseInt(document.getElementById('logic-b').value);
  const res=document.getElementById('logic-results');
  const fmt=(label,val)=>`<div class="calc-result" style="justify-content:space-between;padding:.5rem .8rem">
    <span style="color:var(--text-dim);font-size:.8rem">${label}</span>
    <span class="${val?'val-1':'val-0'}" style="font-size:1rem;font-weight:700">${val}</span></div>`;
  res.innerHTML = fmt(`${a} AND ${b}`,a&b)+fmt(`${a} OR ${b}`,a|b)+fmt(`NOT ${a}`,a?0:1)+fmt(`NOT ${b}`,b?0:1);
}
calcLogic();

function calcEncoding(){
  const chars=parseInt(document.getElementById('enc-chars').value);
  const bits=parseInt(document.getElementById('enc-bits').value);
  const el=document.getElementById('enc-result');
  if(isNaN(chars)||isNaN(bits)||chars<1||bits<1){ el.textContent='⚠ Введи корректные числа'; el.className='calc-result error'; return; }
  const totalBits=chars*bits;
  const bytes=totalBits/8;
  const kb=(bytes/1024).toFixed(3);
  el.textContent=`${totalBits} бит = ${bytes} байт ≈ ${kb} КБ`; el.className='calc-result';
}
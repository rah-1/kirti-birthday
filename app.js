'use strict';
// Add the chosen YouTube URL here before sharing the surprise.
const YOUTUBE_URL = '';
const ANSWER = 'ILOVEYOU';
const board = document.querySelector('#board');
const keyboard = document.querySelector('#keyboard');
document.querySelector('#play').onclick = () => {
  document.querySelector('#welcome').hidden = true;
  const game = document.querySelector('#game');
  game.hidden = false;
  game.focus({ preventScroll: true });
};
let guesses = [], current = '', busy = false, solved = false;
let toastTimer;
function score(guess, answer = ANSWER) {
  const result = Array(8).fill('absent'), remaining = answer.split('');
  [...guess].forEach((letter, i) => {if (letter === remaining[i]) {result[i] = 'correct'; remaining[i] = null;}});
  [...guess].forEach((letter, i) => {if (result[i] !== 'correct') {const place = remaining.indexOf(letter); if (place !== -1) {result[i] = 'present'; remaining[place] = null;}}});
  return result;
}
function render() {
  board.replaceChildren();
  for (let row = 0; row < 6; row++) for (let col = 0; col < 8; col++) {
    const tile = document.createElement('div'); tile.className = 'tile';
    const letter = guesses[row]?.word[col] || (row === guesses.length ? current[col] : '') || '';
    tile.textContent = letter;
    if (guesses[row]) tile.classList.add(guesses[row].colors[col]); else if (letter) tile.classList.add('filled');
    tile.setAttribute('aria-label', letter ? `${letter}${guesses[row] ? ', ' + guesses[row].colors[col] : ''}` : 'Empty');
    board.append(tile);
  }
}
function toast(message) {const el = document.querySelector('#toast'); el.textContent = message; el.classList.add('visible'); clearTimeout(toastTimer); toastTimer = setTimeout(() => el.classList.remove('visible'), 2500);}
async function input(key) {
  if (busy || solved || guesses.length === 6 || document.querySelector('#game').hidden || document.querySelector('dialog').open) return;
  if (key === 'BACKSPACE') {current = current.slice(0,-1);render();return;}
  if (key !== 'ENTER') {if (/^[A-Z]$/.test(key) && current.length < 8) {current += key;render();}return;}
  if (current.length !== 8) {toast('Not enough letters'); [...board.children].slice(guesses.length*8,guesses.length*8+8).forEach(el=>el.classList.add('shake')); return;}
  busy = true;
  const word = current, colors = score(word), row = guesses.length;
  for (let i=0;i<8;i++) {await new Promise(resolve=>setTimeout(resolve,140)); const tile = board.children[row*8+i];tile.classList.add('flip'); await new Promise(resolve=>setTimeout(resolve,250));tile.classList.add(colors[i]);tile.setAttribute('aria-label',`${word[i]}, ${colors[i]}`);}
  guesses.push({word,colors});current='';
  const rank = {absent:1,present:2,correct:3};
  [...word].forEach((letter,i)=>{const keyEl=keyboard.querySelector(`[data-key="${letter}"]`);if(rank[colors[i]]>(rank[keyEl.dataset.state]||0)){keyEl.classList.remove('absent','present','correct');keyEl.classList.add(colors[i]);keyEl.dataset.state=colors[i];}});
  busy=false;
  if(word===ANSWER){solved=true;toast('You got it ♥');document.querySelector('#success').hidden=false;document.querySelector('#continue').focus();}
  else if(guesses.length===6) document.querySelector('#retry').hidden=false;
}
['QWERTYUIOP','ASDFGHJKL','ENTER ZXCVBNM BACKSPACE'].forEach((row,index)=>{const div=document.createElement('div');div.className='keyrow';const keys=index===2?['ENTER',...'ZXCVBNM','BACKSPACE']:row.split('');keys.forEach(key=>{const button=document.createElement('button');button.className='key'+(key.length>1?' wide':'');button.dataset.key=key;button.textContent=key==='BACKSPACE'?'⌫':key;button.setAttribute('aria-label',key==='BACKSPACE'?'Delete letter':key);button.addEventListener('click',()=>input(key));div.append(button);});keyboard.append(div);});
document.addEventListener('keydown',event=>{if(event.ctrlKey||event.metaKey||event.altKey||document.querySelector('dialog').open||solved||document.querySelector('#game').hidden)return;const key=event.key.toUpperCase();if(/^[A-Z]$/.test(key)||['ENTER','BACKSPACE'].includes(key)){event.preventDefault();input(key);}});
document.querySelector('#again').onclick=()=>{guesses=[];current='';solved=false;document.querySelector('#retry').hidden=true;keyboard.querySelectorAll('button').forEach(el=>{el.classList.remove('absent','present','correct');delete el.dataset.state;});render();};
document.querySelector('#help').onclick=()=>document.querySelector('dialog').showModal();document.querySelector('#close-help').onclick=()=>document.querySelector('dialog').close();
const chapters=[...document.querySelectorAll('.chapter')];
chapters.forEach(chapter=>{let index=0;const title=chapter.querySelector('.writing');const original=title.textContent;title.setAttribute('aria-label',original);[...title.childNodes].forEach(node=>{if(node.nodeType!==3)return;const fragment=document.createDocumentFragment();for(const char of node.textContent){if(char===' '){fragment.append(document.createTextNode(' '));continue;}const span=document.createElement('span');span.className='ink';span.textContent=char;span.setAttribute('aria-hidden','true');span.style.setProperty('--delay',`${index++*65+300}ms`);fragment.append(span);}node.replaceWith(fragment);});chapter.dataset.duration=index*65+500;});
const observer=new IntersectionObserver(entries=>{entries.forEach(entry=>{const chapter=entry.target;chapter.classList.toggle('active',entry.isIntersecting);if(entry.isIntersecting){document.querySelector('.story-progress span').style.width=`${(chapters.indexOf(chapter)+1)/chapters.length*100}%`;if(!chapter.classList.contains('written')&&!chapter._timer)chapter._timer=setTimeout(()=>{chapter.classList.add('written');chapter._timer=null;},Number(chapter.dataset.duration));}else if(chapter._timer){clearTimeout(chapter._timer);chapter._timer=null;}});},{root:document.querySelector('#story'),threshold:.55});
document.querySelector('#continue').onclick=()=>{document.querySelector('#game').hidden=true;const story=document.querySelector('#story');story.hidden=false;story.focus();chapters.forEach(chapter=>observer.observe(chapter));};
function youtubeId(url){try{const u=new URL(url);if(u.hostname==='youtu.be')return u.pathname.slice(1).split('/')[0];if(['youtube.com','www.youtube.com','m.youtube.com'].includes(u.hostname))return u.searchParams.get('v')||u.pathname.split('/')[2];}catch{}return null;}
const id=youtubeId(YOUTUBE_URL);if(id&&/^[\w-]{11}$/.test(id)){const iframe=document.createElement('iframe');iframe.src=`https://www.youtube-nocookie.com/embed/${id}?playsinline=1`;iframe.title='A birthday surprise for Kirti';iframe.allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share';iframe.allowFullscreen=true;document.querySelector('#video').replaceChildren(iframe);}
render();

'use strict';
// Original vector gardens: each birthday page grows a different flower bed.
const gardens = [
  { name: 'Sunflower meadow', flower: 'sunflower', sky: '#faeed4', glow: '#f4cb72', hill: '#a3b77c', grass: '#66884f' },
  { name: 'White lily hillside', flower: 'lily', sky: '#eaf2e7', glow: '#e6d9a3', hill: '#9fbba0', grass: '#537e64' },
  { name: 'A field of cosmos', flower: 'cosmos', sky: '#f9e7e7', glow: '#edb9ae', hill: '#b5bd8a', grass: '#6e8a58' },
  { name: 'Lavender hills', flower: 'lavender', sky: '#eee9f6', glow: '#e4c9df', hill: '#a4b3a0', grass: '#607e70' },
  { name: 'Poppies in the sunshine', flower: 'poppy', sky: '#fcebdc', glow: '#f1c58a', hill: '#b4bd82', grass: '#738951' },
  { name: 'All the flowers, for you', flower: 'mixed', sky: '#f9efd9', glow: '#efd29c', hill: '#a6b58a', grass: '#607f56' }
];
const petals = (count, shape, color) => Array.from({ length: count }, (_, i) => `<g transform="rotate(${i * 360 / count})" fill="${color}">${shape}</g>`).join('');
const stem = '<path d="M0 0Q-5 30 0 63" fill="none" stroke="#426344" stroke-width="2.2"/><path d="M-1 42Q-26 20-23 37Q-20 50-1 48M-1 32Q22 14 20 29Q17 39-1 39" fill="#547849"/>';
const flowerSymbols = `<defs>
  <symbol id="flower-sunflower" viewBox="-34 -36 68 104">${stem}${petals(13, '<ellipse cy="-16" rx="5.5" ry="15"/>', '#efbb39')}${petals(13, '<ellipse cy="-14" rx="3.5" ry="11"/>', '#ffd762')}<circle r="12" fill="#6b482f"/><circle r="8" fill="#84603a"/><path d="M-5-4h1m5-2h1m3 5h1M-4 3h1m5 3h1" stroke="#d3a15c" stroke-width="2" stroke-linecap="round"/></symbol>
  <symbol id="flower-lily" viewBox="-34 -36 68 104">${stem}${petals(6, '<path d="M0 5C-18-4-14-21 0-31C14-21 18-4 0 5Z" stroke="#dce3cf" stroke-width=".8"/>', '#fffdf0')}${petals(6, '<path d="M0 0Q-3-12 0-25" fill="none" stroke="#cad6ad" stroke-width="1"/>', '#fffdf0')}<circle r="5" fill="#b7c780"/><path d="M0 0-9-12M0 0 9-12M0 0 0-17" stroke="#c6ab5b" stroke-width="1.2"/><g fill="#b28b39"><ellipse cx="-9" cy="-12" rx="2" ry="3"/><ellipse cx="9" cy="-12" rx="2" ry="3"/><ellipse cy="-17" rx="2" ry="3"/></g></symbol>
  <symbol id="flower-cosmos" viewBox="-34 -36 68 104">${stem}${petals(8, '<path d="M0 3C-12-4-13-19-6-24L0-22 6-24C13-19 12-4 0 3Z"/>', '#de8da9')}${petals(8, '<path d="M0-3 0-19" stroke="#f6bacb" stroke-width="1.3"/>', '#de8da9')}<circle r="5" fill="#e8bd59"/></symbol>
  <symbol id="flower-lavender" viewBox="-34 -36 68 104">${stem}<path d="M0 13V-29" stroke="#507253" stroke-width="2"/>${Array.from({length:7},(_,i)=>`<ellipse cx="${i%2?4:-4}" cy="${9-i*5.5}" rx="4.5" ry="6" transform="rotate(${i%2?25:-25} ${i%2?4:-4} ${9-i*5.5})" fill="${i%2?'#b7a0d5':'#8d78b4'}"/>`).join('')}<ellipse cy="-30" rx="3" ry="5" fill="#c7b4e3"/></symbol>
  <symbol id="flower-poppy" viewBox="-34 -36 68 104">${stem}${petals(5, '<path d="M0 5C-21 1-25-16-13-24C-3-32 10-23 12-12C14 0 5 4 0 5Z"/>', '#e47d64')}<circle r="6" fill="#61494a"/><circle r="3" fill="#d1ac63"/></symbol>
  <symbol id="flower-daisy" viewBox="-34 -36 68 104">${stem}${petals(10, '<ellipse cy="-12" rx="3.5" ry="10"/>', '#fff8de')}<circle r="6" fill="#e9b849"/></symbol>
</defs>`;
function meadowScene(garden, index) {
  // Seeded variation keeps the same garden when revisiting a page.
  let seed = 97 + index * 43;
  const random = () => { seed = (seed * 16807) % 2147483647; return (seed - 1) / 2147483646; };
  let flowers = '';
  const mixed = ['sunflower', 'lily', 'cosmos', 'lavender', 'poppy', 'daisy'];
  for (let row = 0; row < 4; row++) {
    const count = 46 - row * 6;
    for (let col = 0; col < count; col++) {
      const x = (col + random() * .8) * 1240 / count - 20;
      const y = 190 + row * 69 + Math.sin(x / 160 + index) * 20 + random() * 27;
      const size = 35 + row * 23 + random() * 19;
      const flower = garden.flower === 'mixed' ? mixed[Math.floor(random() * mixed.length)] : garden.flower;
      flowers += `<g transform="translate(${x.toFixed(1)} ${y.toFixed(1)}) rotate(${(random()*20-10).toFixed(1)})"><use href="#flower-${index}-${flower}" x="${-size/2}" y="${-size*.35}" width="${size}" height="${size*1.53}"/></g>`;
    }
  }
  return `<svg class="meadow" viewBox="0 0 1200 500" preserveAspectRatio="xMidYMax slice" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">${flowerSymbols.replaceAll('id="flower-', `id="flower-${index}-`)}<path d="M0 142Q190 28 420 116T850 98T1200 86V500H0Z" fill="${garden.hill}"/><path d="M0 190Q270 93 590 172T1200 133V500H0Z" fill="${garden.grass}" opacity=".7"/><path d="M0 264Q240 153 520 233T1200 191V500H0Z" fill="${garden.grass}"/><g class="flower-bed">${flowers}</g><path d="M0 487Q230 453 470 485T1200 476V500H0Z" fill="#385d3c" opacity=".28"/></svg>`;
}
document.querySelectorAll('.chapter').forEach((chapter, index) => {
  const garden = gardens[index % gardens.length];
  chapter.style.setProperty('--sky', garden.sky);
  chapter.style.setProperty('--glow', garden.glow);
  chapter.dataset.garden = garden.flower;
  const landscape = document.createElement('div');
  landscape.className = 'landscape';
  landscape.setAttribute('aria-hidden', 'true');
  landscape.innerHTML = '<span class="meadow-sun"></span><span class="cloud cloud-one"></span><span class="cloud cloud-two"></span>' + meadowScene(garden, index);
  const footer = document.createElement('div');
  footer.className = 'garden-footer';
  const label = document.createElement('span');
  label.textContent = `${String(index + 1).padStart(2, '0')} / 06 · ${garden.name}`;
  footer.append(label);
  if (index < gardens.length - 1) {
    const next = document.createElement('button');
    next.textContent = '↓';
    next.setAttribute('aria-label', 'Next birthday message');
    next.onclick = () => chapter.nextElementSibling.scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth', block: 'start' });
    footer.append(next);
  } else {
    const heart = document.createElement('span');
    heart.textContent = '♡';
    heart.className = 'garden-heart';
    footer.append(heart);
  }
  chapter.prepend(landscape);
  chapter.append(footer);
});

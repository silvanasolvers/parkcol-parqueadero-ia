const steps = [...document.querySelectorAll('.step')];
const card = document.getElementById('questionCard');
const kicker = document.getElementById('cardKicker');
const title = document.getElementById('questionTitle');
const meta = document.getElementById('questionMeta');
const car = document.querySelector('.game-car');
const progressBar = document.getElementById('progressBar');
const progressLabel = document.getElementById('progressLabel');
let active = -1;

function updateWorld() {
  const world = document.querySelector('.scroll-world');
  const rect = world.getBoundingClientRect();
  const max = world.offsetHeight - window.innerHeight;
  const scrolled = Math.min(Math.max(-rect.top, 0), max);
  const pct = max ? scrolled / max : 0;
  const idx = Math.min(steps.length - 1, Math.max(0, Math.floor(pct * steps.length)));

  if (idx !== active) {
    active = idx;
    const s = steps[idx].dataset;
    card.animate([{opacity:.35, transform:'translateY(-45%) scale(.98)'},{opacity:1, transform:'translateY(-50%) scale(1)'}], {duration:340, easing:'cubic-bezier(.2,.8,.2,1)'});
    kicker.textContent = s.kicker;
    title.textContent = s.question;
    meta.textContent = s.meta;
  }

  const carTravel = Math.min(1, Math.max(0, (pct * steps.length % 1)));
  const isMobile = window.innerWidth < 680;
  const yLimit = isMobile ? 210 : Math.min(360, Math.max(220, window.innerHeight - 470));
  const y = carTravel * yLimit;
  const laneShift = idx % 2 === 0 ? (isMobile ? -42 : -72) : (isMobile ? 44 : 74);
  car.style.transform = `translate(${laneShift}px, ${y}px) rotate(${idx % 2 === 0 ? -2 : 2}deg)`;
  progressBar.style.width = `${Math.round(pct * 100)}%`;
  progressLabel.textContent = `${Math.round(pct * 100)}%`;
}

window.addEventListener('scroll', updateWorld, {passive:true});
window.addEventListener('resize', updateWorld);
updateWorld();

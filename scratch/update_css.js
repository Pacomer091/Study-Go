const fs = require('fs');

let css = fs.readFileSync('styles.css', 'utf8');

// 1. Icon utilities after input, textarea, select
const iconUtils = `
/* ============ Vector Icon Utilities ============ */
.icon-svg {
  width: 20px;
  height: 20px;
  display: inline-block;
  vertical-align: middle;
  flex-shrink: 0;
}
.sec-ico, .tile-ico, .stat-ico, .meta-ico {
  display: inline-flex;
  align-items: center;
  justify-content: center;
}
.sec-ico .icon-svg {
  width: 20px;
  height: 20px;
  color: var(--primary);
}
.tile-ico .icon-svg {
  width: 28px;
  height: 28px;
  color: var(--primary);
}
.stat-ico .icon-svg {
  width: 24px;
  height: 24px;
  color: var(--primary);
}
.stat-card:nth-child(1) .stat-ico .icon-svg { color: var(--primary); }
.stat-card:nth-child(2) .stat-ico .icon-svg { color: var(--green); }
.stat-card:nth-child(3) .stat-ico .icon-svg { color: #3b82f6; }
.stat-card:nth-child(4) .stat-ico .icon-svg { color: #d946ef; }
`;

css = css.replace('input, textarea, select {\n  font-family: inherit;\n}', 'input, textarea, select {\n  font-family: inherit;\n}' + iconUtils);

// 2. Brand logo img
const brandLogoCss = `
.brand-logo-img {
  width: 44px;
  height: 44px;
  border-radius: 12px;
  object-fit: contain;
  background: #ffffff;
  padding: 3px;
  box-shadow: 0 4px 14px rgba(99, 102, 241, 0.28);
  border: 1px solid var(--border);
  flex-shrink: 0;
  transition: transform .2s ease;
}
.brand-logo-img:hover {
  transform: scale(1.06) rotate(-3deg);
}
`;

css = css.replace('.brand-logo {', brandLogoCss + '\n.brand-logo {');

// 3. Nav item .ico
css = css.replace('.nav-item .ico {\n  font-size: 19px;\n  width: 24px;\n  text-align: center;\n  transition: transform .2s ease;\n}', `.nav-item .ico {
  width: 24px;
  height: 24px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  transition: transform .2s ease;
}`);

// 4. Hero logo wrap and logo img
const oldHeroEmoji = `.hero-emoji-wrap {
  position: relative;
  z-index: 2;
  flex-shrink: 0;
  width: 110px;
  height: 110px;
  display: grid;
  place-items: center;
}

.hero-emoji {
  font-size: 64px;
  animation: float 3s ease-in-out infinite;
  filter: drop-shadow(0 12px 20px rgba(0, 0, 0, 0.25));
}

.hero-sparkle {
  position: absolute;
  font-size: 22px;
  animation: sparkle 2.4s ease-in-out infinite;
}
.hero-sparkle.s1 { top: 0; right: 8px; animation-delay: 0.3s; }
.hero-sparkle.s2 { bottom: 6px; left: 6px; animation-delay: 1.2s; }`;

const newHeroLogo = `.hero-logo-wrap {
  position: relative;
  z-index: 2;
  flex-shrink: 0;
  width: 110px;
  height: 110px;
  display: grid;
  place-items: center;
}

.hero-logo-img {
  width: 104px;
  height: 104px;
  border-radius: 24px;
  object-fit: contain;
  background: #ffffff;
  padding: 6px;
  box-shadow: 0 16px 36px rgba(0, 0, 0, 0.3), 0 0 0 3px rgba(255, 255, 255, 0.35);
  animation: float 3s ease-in-out infinite;
}`;

css = css.replace(oldHeroEmoji, newHeroLogo);

// 5. Additional components: avatar, bus-badge, ods, goals, splitter
const componentsCss = `
/* ============ Avatar ============ */
.avatar {
  width: 46px;
  height: 46px;
  border-radius: 14px;
  display: grid;
  place-items: center;
  color: #ffffff;
  flex-shrink: 0;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12);
  transition: transform .2s ease;
}
.card:hover .avatar {
  transform: scale(1.08);
}

/* ============ Bus Badge ============ */
.bus-badge {
  background: var(--primary-gradient);
  color: #ffffff;
  padding: 8px 12px;
  border-radius: 12px;
  font-weight: 800;
  font-size: 13px;
  letter-spacing: 0.03em;
  box-shadow: 0 4px 12px rgba(99, 102, 241, 0.3);
  flex-shrink: 0;
}

/* ============ ODS ============ */
.ods-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(230px, 1fr));
  gap: 16px;
}
.ods-card {
  background: var(--card);
  backdrop-filter: var(--glass);
  -webkit-backdrop-filter: var(--glass);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: 22px;
  box-shadow: var(--shadow-xs);
  transition: all .25s ease;
}
.ods-card:hover {
  transform: translateY(-3px);
  box-shadow: var(--shadow);
}
.ods-num {
  font-family: "Space Grotesk", "Plus Jakarta Sans", sans-serif;
  font-size: 24px;
  font-weight: 800;
  color: var(--primary);
  margin-bottom: 6px;
}
.ods-card h4 {
  font-size: 15.5px;
  font-weight: 800;
  margin-bottom: 8px;
}
.ods-card p {
  font-size: 13px;
  color: var(--text-2);
  line-height: 1.5;
}

/* ============ Goals ============ */
.goal-row {
  display: flex;
  align-items: center;
  gap: 14px;
}
.goal-title {
  font-size: 14.5px;
  font-weight: 700;
  margin-bottom: 8px;
  display: flex;
  align-items: center;
  gap: 6px;
}
.goal-track {
  height: 10px;
  background: var(--primary-soft);
  border-radius: var(--radius-full);
  overflow: hidden;
}
.goal-fill {
  height: 100%;
  background: var(--primary-gradient);
  border-radius: var(--radius-full);
  transition: width .5s ease;
}
.goal-pct {
  font-size: 13.5px;
  font-weight: 800;
  color: var(--primary);
  min-width: 42px;
  text-align: right;
}

/* ============ Splitter (Dobles Grados) ============ */
.splitter {
  display: flex;
  flex-direction: column;
  gap: 14px;
  background: var(--card);
  backdrop-filter: var(--glass);
  -webkit-backdrop-filter: var(--glass);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: 22px;
  box-shadow: var(--shadow-sm);
}
.split-result {
  margin-top: 16px;
  background: var(--card);
  backdrop-filter: var(--glass);
  -webkit-backdrop-filter: var(--glass);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: 20px;
  box-shadow: var(--shadow-xs);
}
.split-item {
  display: flex;
  align-items: center;
  gap: 14px;
  margin-bottom: 12px;
}
.split-item .bar-track {
  flex: 1;
}

/* ============ Bottomnav Icons ============ */
.bottomnav-item .ico {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 22px;
  height: 22px;
}
`;

css += componentsCss;

fs.writeFileSync('styles.css', css, 'utf8');
console.log('styles.css updated successfully!');

import { prepareSessionBlocks, selectNextBlock } from './adaptive-engine';
import { evaluate } from './evaluator';
import { advance, clearState, loadState, saveState, type QuizState } from './quiz-store';
import { createSeed } from './random';
import { estimateFromAnswers, TRAITS } from './tirt-estimator';
import type { QuizBlock, ShownBlock, Trait } from './types';
import QRCode from 'qrcode';

type LocaleCode = 'zh' | 'en';
type Percentiles = Record<Trait, number>;

const TOTAL_BLOCKS = 20;

const labels: Record<LocaleCode, { best: string; worst: string; next: string; complete: string }> = {
  zh: { best: '最符合', worst: '最不符合', next: '确认，下一题', complete: '查看结果' },
  en: { best: 'Fits me', worst: 'Not me', next: 'Confirm and continue', complete: 'View result' },
};

const traitNames: Record<LocaleCode, Record<Trait, string>> = {
  zh: { O: '探索新鲜感', C: '自律执行力', E: '社交能量', A: '共情合作感', N: '情绪敏锐度' },
  en: {
    O: 'Openness',
    C: 'Conscientiousness',
    E: 'Extraversion',
    A: 'Agreeableness',
    N: 'Emotional sensitivity',
  },
};

const traitExplain: Record<LocaleCode, Record<Trait, string>> = {
  zh: {
    O: '分高时更爱尝试新想法，分低时更偏好清楚、稳定、验证过的方法。',
    C: '分高时更会计划和收尾，分低时更容易边做边调整，不喜欢被流程锁住。',
    E: '分高时更容易从互动里获得能量，分低时更需要独处和安静空间。',
    A: '分高时更会照顾关系和感受，分低时更直接，更看重判断本身。',
    N: '分高时更快察觉压力和风险，分低时更容易先稳住情绪处理事情。',
  },
  en: {
    O: 'Interest in new ideas, abstract concepts, and alternative perspectives.',
    C: 'Planning, execution stability, and attention to quality.',
    E: 'Energy from social interaction, expression, and external stimulation.',
    A: 'Empathy, cooperation, and attention to other people’s feelings.',
    N: 'Sensitivity to stress, risk, and emotional shifts.',
  },
};

const levelNames: Record<LocaleCode, string[]> = {
  zh: ['极低', '偏低', '中等', '偏高', '极高'],
  en: ['Very low', 'Low', 'Moderate', 'High', 'Very high'],
};

interface Runtime {
  locale: LocaleCode;
  sourceBlocks: QuizBlock[];
  blocks: ShownBlock[];
  state: QuizState | null;
  selectedBest: string | null;
  selectedWorst: string | null;
  ready: Promise<void> | null;
}

export function mountQuizApp(): void {
  const app = document.querySelector<HTMLElement>('[data-quiz-app]');
  if (!app) return;

  const locale = normalizeLocale(app.dataset.locale);
  const runtime: Runtime = {
    locale,
    sourceBlocks: [],
    blocks: [],
    state: null,
    selectedBest: null,
    selectedWorst: null,
    ready: null,
  };

  const dom = getDom();
  if (!dom) return;

  dom.start.addEventListener('click', () => {
    void startSession(runtime, dom);
  });
  dom.restart.addEventListener('click', () => reset(runtime, dom));
  dom.restartResult.addEventListener('click', () => reset(runtime, dom));
  dom.next.addEventListener('click', () => submitAnswer(runtime, dom));
  dom.shareResult.addEventListener('click', () => {
    void showSharePoster(runtime, dom);
  });
  dom.shareClose.addEventListener('click', () => dom.shareModal.classList.add('hidden'));
  dom.posterSave.addEventListener('click', () => savePoster(dom));

  runtime.ready = init(runtime, dom);
}

async function init(runtime: Runtime, dom: DomRefs): Promise<void> {
  const response = await fetch(assetPath('data/items_tirt.json'));
  if (!response.ok) {
    throw new Error(`Unable to load item bank: ${response.status}`);
  }
  const data = (await response.json()) as { blocks: QuizBlock[] };
  runtime.sourceBlocks = data.blocks;
  runtime.state = loadState();
  if (runtime.state && !isValidState(runtime.sourceBlocks, runtime.state)) {
    clearState();
    runtime.state = null;
  }

  if (runtime.state) {
    runtime.blocks = prepareSessionBlocks(runtime.sourceBlocks, runtime.state.seed);
    if (runtime.state.currentBlockId) showQuiz(runtime, dom);
    else showResult(runtime, dom);
    return;
  }

  showIntro(dom);
}

async function startSession(runtime: Runtime, dom: DomRefs): Promise<void> {
  dom.start.disabled = true;
  await runtime.ready;
  dom.start.disabled = false;
  if (runtime.sourceBlocks.length === 0) return;

  const seed = createSeed();
  runtime.blocks = prepareSessionBlocks(runtime.sourceBlocks, seed);
  const estimate = estimateFromAnswers(runtime.blocks, []);
  const first = selectNextBlock(runtime.blocks, [], estimate, seed);
  runtime.state = { seed, answers: [], currentBlockId: first?.id ?? null };
  saveState(runtime.state);
  showQuiz(runtime, dom);
}

function isValidState(blocks: QuizBlock[], state: QuizState): boolean {
  const blockIds = new Set(blocks.map((block) => block.id));
  const itemIds = new Set(blocks.flatMap((block) => block.items.map((item) => item.id)));
  const currentIsValid = state.currentBlockId === null || blockIds.has(state.currentBlockId);
  const answersAreValid = state.answers.every(
    (answer) =>
      blockIds.has(answer.blockId) && itemIds.has(answer.bestItemId) && itemIds.has(answer.worstItemId),
  );
  return currentIsValid && answersAreValid;
}

function submitAnswer(runtime: Runtime, dom: DomRefs): void {
  if (!runtime.state?.currentBlockId || !runtime.selectedBest || !runtime.selectedWorst) return;

  const outcome = advance(runtime.blocks, runtime.state, {
    blockId: runtime.state.currentBlockId,
    bestItemId: runtime.selectedBest,
    worstItemId: runtime.selectedWorst,
  });

  runtime.state = outcome.state;
  if (outcome.complete) showResult(runtime, dom);
  else renderCurrentBlock(runtime, dom);
}

function reset(runtime: Runtime, dom: DomRefs): void {
  clearState();
  runtime.state = null;
  runtime.selectedBest = null;
  runtime.selectedWorst = null;
  showIntro(dom);
}

function showIntro(dom: DomRefs): void {
  dom.intro.classList.remove('hidden');
  dom.quiz.classList.add('hidden');
  dom.result.classList.add('hidden');
}

function showQuiz(runtime: Runtime, dom: DomRefs): void {
  dom.intro.classList.add('hidden');
  dom.quiz.classList.remove('hidden');
  dom.result.classList.add('hidden');
  renderCurrentBlock(runtime, dom);
}

function renderCurrentBlock(runtime: Runtime, dom: DomRefs): void {
  if (!runtime.state) return;

  runtime.selectedBest = null;
  runtime.selectedWorst = null;
  dom.next.disabled = true;

  const estimate = estimateFromAnswers(runtime.blocks, runtime.state.answers);
  const progressPercent = Math.round((runtime.state.answers.length / TOTAL_BLOCKS) * 100);
  dom.accuracy.textContent = `${estimate.accuracy}%`;
  dom.counter.textContent = `${runtime.state.answers.length + 1}/${TOTAL_BLOCKS} 题 ·`;
  dom.progressPercent.textContent = `${progressPercent}%`;
  dom.progressFill.style.width = `${progressPercent}%`;
  dom.confidenceFill.style.width = `${estimate.accuracy}%`;

  const block = runtime.blocks.find((item) => item.id === runtime.state?.currentBlockId);
  if (!block) {
    showResult(runtime, dom);
    return;
  }

  dom.options.innerHTML = '';
  for (const item of block.items) {
    const text = item.text[runtime.locale] ?? item.text.en ?? Object.values(item.text)[0] ?? '';
    const row = document.createElement('div');
    row.className =
      'grid gap-4 rounded-[28px] border hairline bg-white p-4 dark:border-slate-800 dark:bg-slate-950 sm:grid-cols-[minmax(0,1fr)_minmax(120px,150px)_minmax(120px,150px)] sm:items-center sm:p-5';
    row.innerHTML = `
      <p class="text-xl font-bold leading-8 text-slate-800 dark:text-slate-100 sm:text-2xl sm:leading-9">${escapeHtml(text)}</p>
      <div class="grid grid-cols-2 gap-3 sm:contents">
        <button type="button" data-role="best" data-item="${item.id}" aria-pressed="false" class="choice-button min-h-16 rounded-3xl border border-slate-300 px-3 py-3 text-base font-black leading-tight text-slate-600 transition hover:border-teal-700 hover:text-teal-800 dark:border-slate-700 dark:text-slate-300 dark:hover:border-teal-300 dark:hover:text-teal-200 sm:min-h-20 sm:px-4 sm:text-lg">${labels[runtime.locale].best}</button>
        <button type="button" data-role="worst" data-item="${item.id}" aria-pressed="false" class="choice-button min-h-16 rounded-3xl border border-slate-300 px-3 py-3 text-base font-black leading-tight text-slate-600 transition hover:border-amber-700 hover:text-amber-800 dark:border-slate-700 dark:text-slate-300 dark:hover:border-amber-300 dark:hover:text-amber-200 sm:min-h-20 sm:px-4 sm:text-lg">${labels[runtime.locale].worst}</button>
      </div>
    `;
    dom.options.append(row);
  }

  dom.options.querySelectorAll<HTMLButtonElement>('button').forEach((button) => {
    button.addEventListener('click', () => toggleChoice(runtime, dom, button));
  });
}

function toggleChoice(runtime: Runtime, dom: DomRefs, button: HTMLButtonElement): void {
  const role = button.dataset.role;
  const item = button.dataset.item;
  if (!role || !item) return;

  if (role === 'best') {
    runtime.selectedBest = runtime.selectedBest === item ? null : item;
    if (runtime.selectedWorst === item) runtime.selectedWorst = null;
  } else {
    runtime.selectedWorst = runtime.selectedWorst === item ? null : item;
    if (runtime.selectedBest === item) runtime.selectedBest = null;
  }

  syncButtons(runtime, dom);
}

function syncButtons(runtime: Runtime, dom: DomRefs): void {
  dom.options.querySelectorAll<HTMLButtonElement>('button').forEach((button) => {
    const active =
      (button.dataset.role === 'best' && button.dataset.item === runtime.selectedBest) ||
      (button.dataset.role === 'worst' && button.dataset.item === runtime.selectedWorst);
    button.setAttribute('aria-pressed', String(active));
    button.classList.toggle('bg-teal-700', active && button.dataset.role === 'best');
    button.classList.toggle('border-teal-700', active && button.dataset.role === 'best');
    button.classList.toggle('shadow-lg', active);
    button.classList.toggle('bg-amber-700', active && button.dataset.role === 'worst');
    button.classList.toggle('border-amber-700', active && button.dataset.role === 'worst');
    button.classList.toggle('text-white', active);
  });

  dom.next.disabled = !(
    runtime.selectedBest &&
    runtime.selectedWorst &&
    runtime.selectedBest !== runtime.selectedWorst
  );
  dom.next.textContent =
    (runtime.state?.answers.length ?? 0) + 1 === TOTAL_BLOCKS
      ? labels[runtime.locale].complete
      : labels[runtime.locale].next;
}

function showResult(runtime: Runtime, dom: DomRefs): void {
  dom.intro.classList.add('hidden');
  dom.quiz.classList.add('hidden');
  dom.result.classList.remove('hidden');

  const estimate = estimateFromAnswers(runtime.blocks, runtime.state?.answers ?? []);
  const report = evaluate(estimate, runtime.locale);
  dom.resultTitle.textContent = report.title;
  dom.resultSubtitle.textContent = report.subtitle;
  dom.resultSummary.textContent = report.summary;
  renderExamples(dom, report.examples);
  renderTraitBars(dom, runtime.locale, estimate.percentiles);
  renderRadar(dom.radar, runtime.locale, estimate.percentiles);
}

function renderExamples(dom: DomRefs, examples: string[]): void {
  dom.resultExamples.innerHTML = '';
  examples.forEach((example, index) => {
    const item = document.createElement('div');
    item.className =
      'rounded-[24px] border border-slate-200 bg-white p-4 text-base font-bold leading-7 text-slate-800 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100';
    item.innerHTML = `
      <div class="mb-2 data-label text-xs text-teal-700 dark:text-teal-300">EXAMPLE ${index + 1}</div>
      <div>${escapeHtml(example)}</div>
    `;
    dom.resultExamples.append(item);
  });
}

function renderTraitBars(dom: DomRefs, locale: LocaleCode, percentiles: Percentiles): void {
  dom.traitBars.innerHTML = '';
  for (const trait of TRAITS) {
    const value = percentiles[trait];
    const level = getLevel(value, locale);
    const percentileText =
      locale === 'zh' ? `明显程度 ${value}/100` : `Strength ${value}/100`;
    const row = document.createElement('div');
    row.className = 'rounded-[28px] bg-slate-50 p-4 dark:bg-slate-900/70';
    row.innerHTML = `
      <div class="mb-2 flex items-start justify-between gap-3">
        <div>
          <div class="text-xl font-black text-slate-900 dark:text-white">${traitNames[locale][trait]}</div>
          <div class="mt-1 text-sm font-semibold text-slate-500 dark:text-slate-400">${level} · ${percentileText}</div>
        </div>
        <span class="data-label text-2xl font-black text-slate-950 dark:text-white">${value}</span>
      </div>
      <p class="mb-3 text-sm font-medium leading-6 text-slate-600 dark:text-slate-300">${traitExplain[locale][trait]}</p>
      <div class="h-3 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800">
        <div class="h-3 rounded-full bg-slate-950 dark:bg-slate-100" style="width: ${value}%"></div>
      </div>
    `;
    dom.traitBars.append(row);
  }
}

function getLevel(value: number, locale: LocaleCode): string {
  const index = value < 15 ? 0 : value < 40 ? 1 : value < 60 ? 2 : value < 85 ? 3 : 4;
  return levelNames[locale][index];
}

async function showSharePoster(runtime: Runtime, dom: DomRefs): Promise<void> {
  const estimate = estimateFromAnswers(runtime.blocks, runtime.state?.answers ?? []);
  const report = evaluate(estimate, runtime.locale);
  const url = await renderPoster(
    runtime.locale,
    report.title,
    report.subtitle,
    report.summary,
    report.examples,
    estimate.percentiles,
  );
  dom.posterImage.src = url;
  dom.posterSave.dataset.url = url;
  dom.shareModal.classList.remove('hidden');
}

function savePoster(dom: DomRefs): void {
  const url = dom.posterSave.dataset.url;
  if (!url) return;
  const link = document.createElement('a');
  link.href = url;
  link.download = 'tirt-ocean-story.png';
  link.click();
}

async function renderPoster(
  locale: LocaleCode,
  title: string,
  subtitle: string,
  summary: string,
  examples: string[],
  percentiles: Percentiles,
): Promise<string> {
  const canvas = document.createElement('canvas');
  canvas.width = 1080;
  canvas.height = 1920;
  const ctx = canvas.getContext('2d');
  if (!ctx) return '';

  ctx.fillStyle = '#07111f';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = '#0f766e';
  ctx.fillRect(0, 0, canvas.width, 18);

  ctx.fillStyle = '#f8fafc';
  ctx.font = '900 86px system-ui';
  wrapText(ctx, title, 84, 210, 900, 96);
  ctx.fillStyle = '#94a3b8';
  ctx.font = '700 34px system-ui';
  wrapText(ctx, subtitle, 88, 420, 880, 46);

  ctx.fillStyle = '#0f1b2d';
  roundRect(ctx, 70, 550, 940, 530, 42);
  ctx.fill();
  ctx.fillStyle = '#e2e8f0';
  ctx.font = '700 34px system-ui';
  const summaryEnd = wrapText(ctx, summary, 110, 625, 860, 50);

  let exampleY = summaryEnd + 34;
  ctx.font = '800 26px system-ui';
  for (const example of examples.slice(0, 3)) {
    ctx.fillStyle = '#5eead4';
    ctx.fillText('·', 110, exampleY);
    ctx.fillStyle = '#f8fafc';
    exampleY = wrapText(ctx, example, 150, exampleY, 780, 36) + 30;
  }

  let y = Math.max(1090, exampleY + 42);
  for (const trait of TRAITS) {
    const value = percentiles[trait];
    ctx.fillStyle = '#e2e8f0';
    ctx.font = '800 36px system-ui';
    ctx.fillText(traitNames[locale][trait], 90, y);
    ctx.fillStyle = '#94a3b8';
    ctx.font = '700 30px system-ui';
    ctx.fillText(String(value), 930, y);
    ctx.fillStyle = '#263449';
    roundRect(ctx, 90, y + 24, 900, 18, 9);
    ctx.fill();
    ctx.fillStyle = '#5eead4';
    roundRect(ctx, 90, y + 24, 900 * (value / 100), 18, 9);
    ctx.fill();
    y += 96;
  }

  const qrSize = 170;
  const footerY = Math.min(1650, Math.max(1560, y + 24));
  await drawQrCode(ctx, 'https://billzi2016.github.io/tirt-ocean-quiz/', 800, footerY - 18, qrSize);

  ctx.fillStyle = '#5eead4';
  ctx.font = '900 42px system-ui';
  ctx.fillText(locale === 'zh' ? '测测你是什么' : 'What kind of person', 90, footerY + 32);
  ctx.fillText(locale === 'zh' ? '样的人？' : 'are you?', 90, footerY + 86);
  ctx.fillStyle = '#94a3b8';
  ctx.font = '700 28px system-ui';
  ctx.fillText('billzi2016.github.io/tirt-ocean-quiz', 90, footerY + 138);

  return canvas.toDataURL('image/png');
}

async function drawQrCode(
  ctx: CanvasRenderingContext2D,
  value: string,
  x: number,
  y: number,
  size: number,
): Promise<void> {
  ctx.fillStyle = '#f8fafc';
  roundRect(ctx, x, y, size, size, 22);
  ctx.fill();
  const dataUrl = await QRCode.toDataURL(value, {
    margin: 1,
    width: size - 24,
    color: { dark: '#07111f', light: '#f8fafc' },
  });
  const image = new Image();
  image.src = dataUrl;
  await image.decode();
  ctx.drawImage(image, x + 12, y + 12, size - 24, size - 24);
}

function wrapText(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  maxWidth: number,
  lineHeight: number,
): number {
  const chars = Array.from(text);
  let line = '';
  let currentY = y;
  for (const char of chars) {
    const test = line + char;
    if (ctx.measureText(test).width > maxWidth && line) {
      ctx.fillText(line, x, currentY);
      line = char;
      currentY += lineHeight;
    } else {
      line = test;
    }
  }
  if (line) ctx.fillText(line, x, currentY);
  return currentY + lineHeight;
}

function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number,
): void {
  const r = Math.min(radius, width / 2, height / 2);
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + width, y, x + width, y + height, r);
  ctx.arcTo(x + width, y + height, x, y + height, r);
  ctx.arcTo(x, y + height, x, y, r);
  ctx.arcTo(x, y, x + width, y, r);
  ctx.closePath();
}

function renderRadar(canvas: HTMLCanvasElement, locale: LocaleCode, percentiles: Percentiles): void {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const size = canvas.width;
  const center = size / 2;
  const radius = size * 0.29;
  const dark = document.documentElement.classList.contains('dark');
  ctx.clearRect(0, 0, size, size);
  ctx.strokeStyle = dark ? '#475569' : '#cbd5e1';
  ctx.lineWidth = 2;

  for (const step of [0.15, 0.4, 0.6, 0.85, 1]) {
    drawPolygon(ctx, center, radius * step);
  }

  ctx.strokeStyle = dark ? '#94a3b8' : '#334155';
  for (let index = 0; index < TRAITS.length; index += 1) {
    const point = radarPoint(index, center, radius);
    ctx.beginPath();
    ctx.moveTo(center, center);
    ctx.lineTo(point.x, point.y);
    ctx.stroke();
  }

  ctx.fillStyle = dark ? 'rgba(45, 212, 191, 0.24)' : 'rgba(15, 118, 110, 0.18)';
  ctx.strokeStyle = dark ? '#5eead4' : '#0f766e';
  ctx.lineWidth = 5;
  ctx.beginPath();
  TRAITS.forEach((trait, index) => {
    const point = radarPoint(index, center, radius * (percentiles[trait] / 100));
    if (index === 0) ctx.moveTo(point.x, point.y);
    else ctx.lineTo(point.x, point.y);
  });
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = dark ? '#e2e8f0' : '#0f172a';
  ctx.font = '800 28px system-ui';
  ctx.textBaseline = 'middle';
  TRAITS.forEach((trait, index) => {
    const point = radarPoint(index, center, radius + 86);
    ctx.textAlign = index === 1 || index === 2 ? 'left' : index === 3 || index === 4 ? 'right' : 'center';
    ctx.fillText(traitNames[locale][trait], point.x, point.y);
  });
}

function drawPolygon(ctx: CanvasRenderingContext2D, center: number, radius: number): void {
  ctx.beginPath();
  for (let index = 0; index < TRAITS.length; index += 1) {
    const point = radarPoint(index, center, radius);
    if (index === 0) ctx.moveTo(point.x, point.y);
    else ctx.lineTo(point.x, point.y);
  }
  ctx.closePath();
  ctx.stroke();
}

function radarPoint(index: number, center: number, radius: number): { x: number; y: number } {
  const angle = -Math.PI / 2 + (Math.PI * 2 * index) / TRAITS.length;
  return { x: center + Math.cos(angle) * radius, y: center + Math.sin(angle) * radius };
}

function normalizeLocale(value: string | undefined): LocaleCode {
  return value === 'en' ? 'en' : 'zh';
}

function assetPath(path: string): string {
  const base = import.meta.env.BASE_URL.endsWith('/')
    ? import.meta.env.BASE_URL
    : `${import.meta.env.BASE_URL}/`;
  return `${base}${path}`;
}

function escapeHtml(value: string): string {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

interface DomRefs {
  intro: HTMLElement;
  quiz: HTMLElement;
  result: HTMLElement;
  start: HTMLButtonElement;
  next: HTMLButtonElement;
  restart: HTMLButtonElement;
  restartResult: HTMLButtonElement;
  shareResult: HTMLButtonElement;
  shareModal: HTMLElement;
  shareClose: HTMLButtonElement;
  posterImage: HTMLImageElement;
  posterSave: HTMLButtonElement;
  options: HTMLElement;
  accuracy: HTMLElement;
  counter: HTMLElement;
  progressPercent: HTMLElement;
  progressFill: HTMLElement;
  confidenceFill: HTMLElement;
  resultTitle: HTMLElement;
  resultSubtitle: HTMLElement;
  resultSummary: HTMLElement;
  resultExamples: HTMLElement;
  traitBars: HTMLElement;
  radar: HTMLCanvasElement;
}

function getDom(): DomRefs | null {
  const refs = {
    intro: byId<HTMLElement>('intro'),
    quiz: byId<HTMLElement>('quiz'),
    result: byId<HTMLElement>('result'),
    start: byId<HTMLButtonElement>('start'),
    next: byId<HTMLButtonElement>('next'),
    restart: byId<HTMLButtonElement>('restart'),
    restartResult: byId<HTMLButtonElement>('restart-result'),
    shareResult: byId<HTMLButtonElement>('share-result'),
    shareModal: byId<HTMLElement>('share-modal'),
    shareClose: byId<HTMLButtonElement>('share-close'),
    posterImage: byId<HTMLImageElement>('poster-image'),
    posterSave: byId<HTMLButtonElement>('poster-save'),
    options: byId<HTMLElement>('options'),
    accuracy: byId<HTMLElement>('accuracy'),
    counter: byId<HTMLElement>('block-counter'),
    progressPercent: byId<HTMLElement>('progress-percent'),
    progressFill: byId<HTMLElement>('progress-fill'),
    confidenceFill: byId<HTMLElement>('confidence-fill'),
    resultTitle: byId<HTMLElement>('result-title'),
    resultSubtitle: byId<HTMLElement>('result-subtitle'),
    resultSummary: byId<HTMLElement>('result-summary'),
    resultExamples: byId<HTMLElement>('result-examples'),
    traitBars: byId<HTMLElement>('trait-bars'),
    radar: byId<HTMLCanvasElement>('radar'),
  };

  return Object.values(refs).every(Boolean) ? (refs as DomRefs) : null;
}

function byId<T extends HTMLElement>(id: string): T | null {
  return document.getElementById(id) as T | null;
}

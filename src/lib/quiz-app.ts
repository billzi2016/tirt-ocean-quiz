import { prepareSessionBlocks, selectNextBlock } from './adaptive-engine';
import { evaluate } from './evaluator';
import { advance, clearState, loadState, saveState, type QuizState } from './quiz-store';
import { createSeed } from './random';
import { estimateFromAnswers, TRAITS } from './tirt-estimator';
import type { QuizBlock, ShownBlock, Trait } from './types';

type LocaleCode = 'zh' | 'en';
type Percentiles = Record<Trait, number>;

const TOTAL_BLOCKS = 20;

const labels: Record<LocaleCode, { best: string; worst: string; next: string; complete: string }> = {
  zh: { best: '最符合', worst: '最不符合', next: '确认，下一题', complete: '查看结果' },
  en: { best: 'Most like me', worst: 'Least like me', next: 'Confirm and continue', complete: 'View result' },
};

const traitNames: Record<LocaleCode, Record<Trait, string>> = {
  zh: { O: '开放性', C: '尽责性', E: '外向性', A: '宜人性', N: '情绪敏感度' },
  en: {
    O: 'Openness',
    C: 'Conscientiousness',
    E: 'Extraversion',
    A: 'Agreeableness',
    N: 'Emotional sensitivity',
  },
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
  dom.accuracy.textContent = `${estimate.accuracy}%`;
  dom.counter.textContent = `${runtime.state.answers.length + 1} / ${TOTAL_BLOCKS}`;
  dom.progressFill.style.width = `${Math.round((runtime.state.answers.length / TOTAL_BLOCKS) * 100)}%`;
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
      'grid gap-3 border hairline bg-white p-3 dark:border-slate-800 dark:bg-slate-950 sm:col-span-3 sm:grid-cols-[minmax(0,1fr)_88px_88px] sm:items-center';
    row.innerHTML = `
      <p class="text-base leading-7 text-slate-800 dark:text-slate-100">${escapeHtml(text)}</p>
      <button type="button" data-role="best" data-item="${item.id}" aria-pressed="false" class="choice-button border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-600 transition hover:border-teal-700 hover:text-teal-800 dark:border-slate-700 dark:text-slate-300 dark:hover:border-teal-300 dark:hover:text-teal-200">${labels[runtime.locale].best}</button>
      <button type="button" data-role="worst" data-item="${item.id}" aria-pressed="false" class="choice-button border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-600 transition hover:border-amber-700 hover:text-amber-800 dark:border-slate-700 dark:text-slate-300 dark:hover:border-amber-300 dark:hover:text-amber-200">${labels[runtime.locale].worst}</button>
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
  renderTraitBars(dom, runtime.locale, estimate.percentiles);
  renderRadar(dom.radar, estimate.percentiles);
}

function renderTraitBars(dom: DomRefs, locale: LocaleCode, percentiles: Percentiles): void {
  dom.traitBars.innerHTML = '';
  for (const trait of TRAITS) {
    const value = percentiles[trait];
    const row = document.createElement('div');
    row.innerHTML = `
      <div class="mb-1 flex items-center justify-between text-sm">
        <span class="font-semibold text-slate-800 dark:text-slate-100">${traitNames[locale][trait]}</span>
        <span class="data-label text-slate-500 dark:text-slate-400">${value}</span>
      </div>
      <div class="h-2 bg-slate-100 dark:bg-slate-800">
        <div class="h-2 bg-slate-950 dark:bg-slate-100" style="width: ${value}%"></div>
      </div>
    `;
    dom.traitBars.append(row);
  }
}

function renderRadar(canvas: HTMLCanvasElement, percentiles: Percentiles): void {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const size = canvas.width;
  const center = size / 2;
  const radius = size * 0.34;
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
  ctx.font = '600 24px system-ui';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  TRAITS.forEach((trait, index) => {
    const point = radarPoint(index, center, radius + 44);
    ctx.fillText(trait, point.x, point.y);
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
  options: HTMLElement;
  accuracy: HTMLElement;
  counter: HTMLElement;
  progressFill: HTMLElement;
  confidenceFill: HTMLElement;
  resultTitle: HTMLElement;
  resultSubtitle: HTMLElement;
  resultSummary: HTMLElement;
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
    options: byId<HTMLElement>('options'),
    accuracy: byId<HTMLElement>('accuracy'),
    counter: byId<HTMLElement>('block-counter'),
    progressFill: byId<HTMLElement>('progress-fill'),
    confidenceFill: byId<HTMLElement>('confidence-fill'),
    resultTitle: byId<HTMLElement>('result-title'),
    resultSubtitle: byId<HTMLElement>('result-subtitle'),
    resultSummary: byId<HTMLElement>('result-summary'),
    traitBars: byId<HTMLElement>('trait-bars'),
    radar: byId<HTMLCanvasElement>('radar'),
  };

  return Object.values(refs).every(Boolean) ? (refs as DomRefs) : null;
}

function byId<T extends HTMLElement>(id: string): T | null {
  return document.getElementById(id) as T | null;
}

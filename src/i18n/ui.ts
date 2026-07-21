import type { Locale } from './locales';

type Dictionary = Record<Locale, Record<string, string>>;

export const ui: Dictionary = {
  zh: {
    product: 'TIRT Ocean',
    start: '开始测评',
    restart: '重新开始',
    best: '最符合',
    worst: '最不符合',
    next: '确认，下一题',
    complete: '查看结果',
    progress: '进度',
    accuracy: '模型分析准确度',
    adaptive: '自适应题序',
    light: '亮色',
    dark: '暗色',
    introTitle: '迫选法大五人格自适应测评',
    introCopy: '每题选择一个最符合和一个最不符合。系统会根据前序作答调整下一题，并在会话内随机化题目和选项顺序。',
    result: '测评结果',
    disclaimer: '结果用于自我理解与研究展示，不构成临床诊断或筛选结论。',
    responses: '开放响应数据',
    blocks: '迫选题块',
    adaptiveFoot: '自适应会话随机题序',
  },
  en: {
    product: 'TIRT Ocean',
    start: 'Start',
    restart: 'Restart',
    best: 'Most like me',
    worst: 'Least like me',
    next: 'Confirm and continue',
    complete: 'View result',
    progress: 'Progress',
    accuracy: 'Model confidence',
    adaptive: 'Adaptive order',
    light: 'Light',
    dark: 'Dark',
    introTitle: 'Adaptive forced-choice Big Five assessment',
    introCopy:
      'Choose one statement that is most like you and one that is least like you. The next block adapts to your answers, with session-level shuffled blocks and options.',
    result: 'Result',
    disclaimer: 'The result is for self-understanding and research demonstration, not clinical diagnosis or screening.',
    responses: 'Open responses',
    blocks: 'Forced-choice blocks',
    adaptiveFoot: 'Adaptive shuffled order',
  },
};

export function t(locale: Locale, key: string): string {
  return ui[locale][key] ?? ui.zh[key] ?? key;
}

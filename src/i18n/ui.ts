import type { Locale } from './locales';

type Dictionary = Record<Locale, Record<string, string>>;

export const ui: Dictionary = {
  zh: {
    product: 'TIRT Ocean',
    start: '开始 3 分钟测评',
    restart: '重新开始',
    best: '最符合',
    worst: '最不符合',
    next: '确认，下一题',
    complete: '查看结果',
    progress: '进度',
    accuracy: '结果置信度',
    adaptive: '下一组题目',
    light: '亮色',
    dark: '暗色',
    introTitle: '3 分钟完成权威五大人格评估',
    introCopy: '基于 1,015,342 人次开放作答数据校准，结合学术论文中的迫选建模方法。每题只选“最像我”和“最不像我”，系统会边答边调整题目，用更短时间给出更清晰的画像。',
    result: '测评结果',
    disclaimer: '结果用于自我理解与研究展示，不构成临床诊断或筛选结论。',
    responses: '百万级开放数据校准',
    blocks: '20 题快速完成',
    adaptiveFoot: '边答边调整题目',
    sharePoster: '生成打卡图',
    saveImage: '保存图片',
    close: '关闭',
    longPress: '长按图片保存，适合朋友圈 / Story 竖版分享。',
    percentileHint: '分数不是好坏判断，只表示这个特点在你身上有多明显。',
  },
  en: {
    product: 'TIRT Ocean',
    start: 'Start the 3-minute test',
    restart: 'Restart',
    best: 'Most like me',
    worst: 'Least like me',
    next: 'Confirm and continue',
    complete: 'View result',
    progress: 'Progress',
    accuracy: 'Confidence',
    adaptive: 'Next set',
    light: 'Light',
    dark: 'Dark',
    introTitle: 'A research-backed Big Five profile in 3 minutes',
    introCopy:
      'Calibrated with 1,015,342 public responses and built on forced-choice modeling from psychometric research. Pick what is most and least like you; the test adapts as you answer.',
    result: 'Result',
    disclaimer: 'The result is for self-understanding and research demonstration, not clinical diagnosis or screening.',
    responses: 'Million-scale calibration',
    blocks: '20-question flow',
    adaptiveFoot: 'Adapts as you answer',
    sharePoster: 'Create story card',
    saveImage: 'Save image',
    close: 'Close',
    longPress: 'Long-press the image to save. Built for vertical social sharing.',
    percentileHint: 'Scores are not good or bad. They show how strongly each pattern appears in your answers.',
  },
};

export function t(locale: Locale, key: string): string {
  return ui[locale][key] ?? ui.zh[key] ?? key;
}

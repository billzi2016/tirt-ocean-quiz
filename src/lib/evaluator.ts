import { TRAITS } from './tirt-estimator';
import type { Estimate, Evaluation, Trait } from './types';

const zhNames: Record<Trait, string> = {
  O: '开放性',
  C: '尽责性',
  E: '外向性',
  A: '宜人性',
  N: '情绪敏感度',
};

const enNames: Record<Trait, string> = {
  O: 'Openness',
  C: 'Conscientiousness',
  E: 'Extraversion',
  A: 'Agreeableness',
  N: 'Emotional sensitivity',
};

const archetypes: Record<string, { zh: Evaluation; en: Evaluation }> = {
  'O-C': {
    zh: {
      title: '系统架构师',
      subtitle: '高开放性 + 高尽责性',
      summary: '你倾向于把新想法落到清晰结构里，既重视探索，也重视把事情推进到可交付状态。',
    },
    en: {
      title: 'System Architect',
      subtitle: 'High openness + high conscientiousness',
      summary: 'You tend to turn new ideas into clear structure, balancing exploration with dependable execution.',
    },
  },
  'C-N': {
    zh: {
      title: '稳态执行者',
      subtitle: '高尽责性 + 高情绪觉察',
      summary: '你对责任、风险和细节都有较高敏感度，适合处理需要持续校准的复杂任务。',
    },
    en: {
      title: 'Steady Operator',
      subtitle: 'High conscientiousness + high emotional sensitivity',
      summary: 'You notice responsibility, risk, and detail quickly, which suits complex work that needs constant calibration.',
    },
  },
  'O-A': {
    zh: {
      title: '独立观察者',
      subtitle: '高开放性 + 高宜人性',
      summary: '你容易从多个角度理解人和问题，既保留好奇心，也愿意让观点对他人可用。',
    },
    en: {
      title: 'Independent Observer',
      subtitle: 'High openness + high agreeableness',
      summary: 'You look at people and problems from several angles while keeping your ideas useful to others.',
    },
  },
  'E-C': {
    zh: {
      title: '行动组织者',
      subtitle: '高外向性 + 高尽责性',
      summary: '你更容易在互动中推动进展，把目标、节奏和团队注意力组织到一起。',
    },
    en: {
      title: 'Action Organizer',
      subtitle: 'High extraversion + high conscientiousness',
      summary: 'You often create momentum through interaction, aligning goals, pace, and group attention.',
    },
  },
};

export function evaluate(estimate: Estimate, lang: 'zh' | 'en'): Evaluation {
  const ranked = [...TRAITS].sort((a, b) => estimate.percentiles[b] - estimate.percentiles[a]);
  const key = [ranked[0], ranked[1]].sort().join('-');
  const found = archetypes[key];
  if (found) return found[lang];

  const names = lang === 'zh' ? zhNames : enNames;
  const title = lang === 'zh' ? `${names[ranked[0]]}主导型` : `${names[ranked[0]]}-led profile`;
  const subtitle =
    lang === 'zh'
      ? `最高维度：${names[ranked[0]]}，次高维度：${names[ranked[1]]}`
      : `Top traits: ${names[ranked[0]]} and ${names[ranked[1]]}`;
  const summary =
    lang === 'zh'
      ? '你的结果显示出一个相对清晰的主导倾向。报告会优先解释最高两个维度如何共同影响你的行动方式。'
      : 'Your result shows a clear leading pattern. The report focuses on how your two highest traits shape your usual mode of action.';

  return { title, subtitle, summary };
}

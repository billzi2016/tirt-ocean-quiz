import { TRAITS } from './tirt-estimator';
import type { Estimate, Evaluation, Trait } from './types';

const zhNames: Record<Trait, string> = {
  O: '探索新鲜感',
  C: '自律执行力',
  E: '社交能量',
  A: '共情合作',
  N: '情绪敏锐度',
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
      title: '会把脑洞落地的人',
      subtitle: '想得远，也会把步骤排清楚',
      summary: '你不是只爱新鲜感，也不只是按计划做事。你更像是先找到一个有意思的方向，再把它拆成可以推进的路径。',
      examples: [
        '开新项目时，你可能先问“这个问题能不能换个角度看”，然后很快开始列步骤。',
        '别人还在聊概念时，你会自然地想：谁来做、先做哪一步、怎么判断做成了。',
        '你不太喜欢只有灵感没有收尾，也不太喜欢只有流程没有想象空间。',
      ],
    },
    en: {
      title: 'System Architect',
      subtitle: 'High openness + high conscientiousness',
      summary: 'You tend to turn new ideas into clear structure, balancing exploration with dependable execution.',
      examples: [
        'At the start of a project, you may ask for a new angle and then quickly turn it into steps.',
        'When others stay at the idea level, you start thinking about owners, sequence, and finish line.',
        'You may lose patience with pure inspiration that never becomes usable.',
      ],
    },
  },
  'C-N': {
    zh: {
      title: '容易提前把坑看见的人',
      subtitle: '会负责，也会对风险很敏感',
      summary: '你通常不会等事情炸了才处理。你会提前感到哪里不稳，然后想办法把它压住。',
      examples: [
        '快到截止日期时，你可能比别人更早进入紧绷状态，但这也会推着你检查细节。',
        '团队说“应该没事”时，你会继续追问：如果出问题，最可能卡在哪里。',
        '你适合处理需要稳住节奏的事，但也容易因为责任感过强而消耗自己。',
      ],
    },
    en: {
      title: 'Steady Operator',
      subtitle: 'High conscientiousness + high emotional sensitivity',
      summary: 'You notice responsibility, risk, and detail quickly, which suits complex work that needs constant calibration.',
      examples: [
        'Before a deadline, you may feel the pressure early and use it to check the work.',
        'When a team says “it should be fine,” you still ask where it could break.',
        'You can stabilize difficult work, but responsibility may drain you if it never turns off.',
      ],
    },
  },
  'O-A': {
    zh: {
      title: '会换位思考的探索者',
      subtitle: '好奇心强，也会顾及人的处境',
      summary: '你不只是想法多，也会在意这些想法落到别人身上是什么感受。',
      examples: [
        '讨论一个争议问题时，你可能会先想：双方各自在害怕什么。',
        '你愿意接受新观点，但不太喜欢用新观点压别人一头。',
        '你经常能把一个冷冰冰的问题，重新讲成别人能理解的版本。',
      ],
    },
    en: {
      title: 'Independent Observer',
      subtitle: 'High openness + high agreeableness',
      summary: 'You look at people and problems from several angles while keeping your ideas useful to others.',
      examples: [
        'In a disagreement, you may first wonder what each side is afraid of.',
        'You can accept new ideas without using them to make other people feel small.',
        'You often translate a cold problem into language other people can actually use.',
      ],
    },
  },
  'E-C': {
    zh: {
      title: '能把场子带起来的人',
      subtitle: '有互动能量，也重视推进结果',
      summary: '你不只是喜欢热闹。更关键的是，你会把互动变成行动，把大家的注意力拉回目标。',
      examples: [
        '开会冷场时，你可能会主动把问题抛出来，让讨论重新动起来。',
        '你不太满足于“聊得挺好”，你会想接下来谁负责、什么时候交。',
        '你适合推动协作，但也要小心别替所有人背节奏。',
      ],
    },
    en: {
      title: 'Action Organizer',
      subtitle: 'High extraversion + high conscientiousness',
      summary: 'You often create momentum through interaction, aligning goals, pace, and group attention.',
      examples: [
        'When a meeting stalls, you may throw out the question that gets people moving again.',
        'A good conversation is not enough for you; you want to know what happens next.',
        'You can drive collaboration, but you may end up carrying more of the rhythm than you need to.',
      ],
    },
  },
};

export function evaluate(estimate: Estimate, lang: 'zh' | 'en'): Evaluation {
  const ranked = [...TRAITS].sort((a, b) => estimate.percentiles[b] - estimate.percentiles[a]);
  const key = [ranked[0], ranked[1]].sort().join('-');
  const found = archetypes[key];
  if (found) return found[lang];

  const names = lang === 'zh' ? zhNames : enNames;
  const title = lang === 'zh' ? `${names[ranked[0]]}更明显` : `${names[ranked[0]]}-led pattern`;
  const subtitle =
    lang === 'zh'
      ? `最高维度：${names[ranked[0]]}，次高维度：${names[ranked[1]]}`
      : `Top traits: ${names[ranked[0]]} and ${names[ranked[1]]}`;
  const summary =
    lang === 'zh'
      ? `你的作答里，${names[ranked[0]]}和${names[ranked[1]]}最突出。下面这些例子比单纯分数更重要。`
      : 'Your result shows a clear leading pattern. The report focuses on how your two highest traits shape your usual mode of action.';
  const examples =
    lang === 'zh'
      ? [
          `遇到新任务时，你更可能先用“${names[ranked[0]]}”那一面反应。`,
          `和别人合作时，“${names[ranked[1]]}”会明显影响你的沟通方式。`,
          '如果某条例子不像你，通常说明这个特点只在特定场景下出现。',
        ]
      : [
          `In a new task, your first reaction is often shaped by ${names[ranked[0]]}.`,
          `In collaboration, ${names[ranked[1]]} strongly affects how you communicate.`,
          'If one example feels off, the pattern may only appear in specific situations.',
        ];

  return { title, subtitle, summary, examples };
}

import { TRAITS } from './tirt-estimator';
import type { Estimate, Evaluation, Trait } from './types';
import type { Locale } from '../i18n/locales';

const traitNamesRecord: Record<Locale, Record<Trait, string>> = {
  zh: { O: '探索新鲜感', C: '自律执行力', E: '社交能量', A: '共情合作', N: '情绪敏锐度' },
  en: { O: 'Openness', C: 'Conscientiousness', E: 'Extraversion', A: 'Agreeableness', N: 'Emotional sensitivity' },
  es: { O: 'Apertura', C: 'Responsabilidad', E: 'Extraversión', A: 'Amabilidad', N: 'Sensibilidad emocional' },
  fr: { O: 'Ouverture', C: 'Conscienciosité', E: 'Extraversion', A: 'Agréabilité', N: 'Sensibilité émotionnelle' },
  ja: { O: '開放性', C: '誠実性', E: '外向性', A: '協調性', N: '情緒敏感性' },
  ru: { O: 'Открытость', C: 'Добросовестность', E: 'Экстраверсия', A: 'Доброжелательность', N: 'Эмоциональность' },
  ko: { O: '개방성', C: '성실성', E: '외향성', A: '우호성', N: '정서적 민감성' },
  pt: { O: 'Abertura', C: 'Conscienciosidade', E: 'Extroversão', A: 'Amabilidade', N: 'Sensibilidade emocional' },
  hi: { O: 'खुलापन', C: 'कर्तव्यनिष्ठता', E: 'बहिर्मुखता', A: 'सहमतता', N: 'भावनात्मक संवेदनशीलता' },
  de: { O: 'Offenheit', C: 'Gewissenhaftigkeit', E: 'Extraversion', A: 'Verträglichkeit', N: 'Emotionale Empfindlichkeit' },
};

const archetypes: Record<string, Partial<Record<Locale, Evaluation>>> = {
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
    es: {
      title: 'Arquitecto de Sistemas',
      subtitle: 'Alta apertura + alta responsabilidad',
      summary: 'Tiendes a transformar nuevas ideas en estructuras claras, equilibrando la exploración con una ejecución fiable.',
      examples: [
        'Al iniciar un proyecto, primero buscas un nuevo ángulo y luego lo desglosas rápidamente en pasos.',
        'Mientras otros discuten conceptos, tú piensas en responsables, secuencia y criterios de éxito.',
        'No te satisface la inspiración que no se traduce en algo práctico.',
      ],
    },
    fr: {
      title: 'Architecte de Systèmes',
      subtitle: 'Haute ouverture + haute conscienciosité',
      summary: 'Vous avez tendance à transformer les nouvelles idées en structures claires, conciliant exploration et exécution rigoureuse.',
      examples: [
        'Au début d’un projet, vous cherchez un nouvel angle puis le traduisez rapidement en étapes.',
        'Quand les autres débattent de concepts, vous pensez responsabilité, calendrier et résultats.',
        'Vous appréciez peu l’inspiration pure qui ne devient jamais opérationnelle.',
      ],
    },
    ja: {
      title: 'アイデアを形にするアーキテクト',
      subtitle: '高い開放性 × 高い誠実性',
      summary: '探求心と確実な実行力のバランスに優れ、新しい発想を明確な構造や実行手順へと落とし込むタイプです。',
      examples: [
        'プロジェクトの開始時、新しい視点を提案した直後に具体的なステップを書き始める。',
        '他人が概念を議論している間に、担当者・順序・完了基準を自然と考え始める。',
        '形にならないアイデアや、想像力のないマニュアル作業のどちらにも物足りなさを感じる。',
      ],
    },
    ru: {
      title: 'Архитектор систем',
      subtitle: 'Высокая открытость + высокая добросовестность',
      summary: 'Вы умеете превращать новые идеи в чёткую структуру, сочетая поиск решений с надёжной реализацией.',
      examples: [
        'В начале проекта вы ищете свежий взгляд, а затем быстро составляете план действий.',
        'Пока другие спорят о концепциях, вы уже думаете о сроках, ответственных и результате.',
        'Вам не нравится чистый вдохновенный порыв без понятного финала.',
      ],
    },
    ko: {
      title: '아이디어를 현실화하는 시스템 설계자',
      subtitle: '높은 개방성 + 높은 성실성',
      summary: '새로운 아이디어를 명확한 구조로 변환하며, 탐색과 확실한 실행력 사이의 균형을 잘 잡습니다.',
      examples: [
        '새 프로젝트를 시작할 때 새로운 관점을 제안한 후 빠르게 실행 단계를 정리합니다.',
        '다른 이들이 개념 논의에 머물 때, 담당자·순서·완료 기준을 자연스럽게 떠올립니다.',
        '실행으로 이어지지 않는 순수 아이디어나 상상력이 결여된 절차 모두에 아쉬움을 느낍니다.',
      ],
    },
    pt: {
      title: 'Arquiteto de Sistemas',
      subtitle: 'Alta abertura + alta conscienciosidade',
      summary: 'Você costuma transformar novas ideias em estruturas claras, equilibrando exploração e execução confiável.',
      examples: [
        'No início de um projeto, busca um novo ângulo e rapidamente o transforma em passos práticos.',
        'Enquanto outros debatem conceitos, você pensa em responsáveis, ordem e linha de chegada.',
        'Perde a paciência com inspirações puras que nunca se tornam algo aplicável.',
      ],
    },
    hi: {
      title: 'सिस्टम आर्किटेक्ट',
      subtitle: 'उच्च खुलापन + उच्च कर्तव्यनिष्ठता',
      summary: 'आप नए विचारों को स्पष्ट संरचना में बदलने की प्रवृत्ति रखते हैं, अन्वेषण और विश्वसनीय निष्पादन में संतुलन बनाते हैं।',
      examples: [
        'किसी परियोजना की शुरुआत में, आप एक नया कोण खोजते हैं और फिर जल्दी से उसे चरणों में विभाजित करते हैं।',
        'जब अन्य लोग केवल विचारों पर चर्चा कर रहे होते हैं, तब आप जिम्मेदारी और प्रक्रिया के बारे में सोचते हैं।',
        'आप बिना किसी व्यावहारिक परिणाम वाले केवल हवाई विचारों से निराश हो सकते हैं।',
      ],
    },
    de: {
      title: 'Systemarchitekt',
      subtitle: 'Hohe Offenheit + Hohe Gewissenhaftigkeit',
      summary: 'Sie verwandeln neue Ideen in klare Strukturen und verbinden Neugier mit verlässlicher Umsetzung.',
      examples: [
        'Zu Beginn eines Projekts suchen Sie nach neuen Ansätzen und erstellen direkt konkrete Schritte.',
        'Während andere noch über Konzepte reden, denken Sie bereits an Verantwortlichkeiten und Fristen.',
        'Rein theoretische Inspirationen ohne praktischen Nutzen stellen Sie selten zufrieden.',
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
    es: {
      title: 'Operador Firme',
      subtitle: 'Alta responsabilidad + alta sensibilidad emocional',
      summary: 'Detectas rápidamente los riesgos y detalles, lo que te permite anticiparte a los problemas antes de que ocurran.',
      examples: [
        'Antes de una fecha límite, sientes la presión antes y la usas para revisar los detalles.',
        'Cuando el equipo dice "todo saldrá bien", tú preguntas dónde podría fallar.',
        'Estabilizas situaciones complejas, pero el exceso de responsabilidad puede agotarte.',
      ],
    },
    fr: {
      title: 'Opérateur Vigilant',
      subtitle: 'Haute conscienciosité + haute sensibilité émotionnelle',
      summary: 'Vous repérez très vite les risques et les détails, ce qui vous permet de corriger le tir avant les problèmes.',
      examples: [
        'Avant une échéance, vous ressentez la pression tôt et l’utilisez pour vérifier le travail.',
        'Quand l’équipe dit « ça va aller », vous demandez où se trouve le point de rupture potentiel.',
        'Vous stabilisez les projets complexes, mais la responsabilité constante peut vous épuiser.',
      ],
    },
    ja: {
      title: 'リスクを察知し着実に進めるガードマン',
      subtitle: '高い誠実性 × 高い情緒敏感性',
      summary: '責任感とリスクに対する鋭い感性を持ち、トラブルが起きる前に未然に防ぐ着実なアプローチを取ります。',
      examples: [
        '締め切り前、人より早く緊張感を感じ、それを細部のチェックに活かす。',
        '周囲が「たぶん大丈夫」と言っている時も、「万が一のボトルネック」を問い直す。',
        '不安定な状況を収束させるのが得意だが、責任感の強さゆえに疲れを溜めやすい。',
      ],
    },
    ru: {
      title: 'Надёжный контролёр',
      subtitle: 'Высокая добросовестность + высокая эмоциональность',
      summary: 'Вы быстро замечаете риски и детали, что помогает вам предотвращать проблемы до их появления.',
      examples: [
        'Перед дедлайном вы раньше других чувствуете давление и используете его для проверки деталей.',
        'Когда команда говорит «всё будет хорошо», вы спрашиваете, где именно может произойти сбой.',
        'Вы отлично стабилизируете процессы, но груз ответственности может вызывать усталость.',
      ],
    },
    ko: {
      title: '위험을 미리 감지하는 신중한 관리자',
      subtitle: '높은 성실성 + 높은 정서적 민감성',
      summary: '책임감과 위험 감지 능력이 뛰어나 문제가 터지기 전에 미리 대비하고 세부 사항을 챙깁니다.',
      examples: [
        '마감이 다가오면 남들보다 먼저 긴장감을 느끼고 이를 디테일 점검에 활용합니다.',
        '팀이 "괜찮을 거야"라고 할 때, 문제가 생길 만한 지점을 다시 한번 질문합니다.',
        '복잡한 상황을 안정시키는 데 능하지만, 과도한 책임감으로 스스로 지칠 수 있습니다.',
      ],
    },
    pt: {
      title: 'Operador Cuidadoso',
      subtitle: 'Alta conscienciosidade + alta sensibilidade emocional',
      summary: 'Você percebe riscos e detalhes rapidamente, o que ajuda a prevenir falhas antes que elas aconteçam.',
      examples: [
        'Antes de um prazo, sente a pressão cedo e a usa para revisar minuciosamente o trabalho.',
        'Quando a equipe diz "vai dar tudo certo", você pergunto onde o processo pode falhar.',
        'Consegue estabilizar projetos difíceis, mas a responsabilidade constante pode ser desgastante.',
      ],
    },
    hi: {
      title: 'सतर्क संचालक',
      subtitle: 'उच्च कर्तव्यनिष्ठता + उच्च भावनात्मक संवेदनशीलता',
      summary: 'आप जोखिमों और विवरणों को जल्दी पहचानते हैं, जिससे आप समस्याओं को उत्पन्न होने से पहले रोकने में सक्षम होते हैं।',
      examples: [
        'समय-सीमा से पहले, आप दबाव जल्दी महसूस करते हैं और इसका उपयोग काम की जाँच के लिए करते हैं।',
        'जब टीम कहती है "सब ठीक रहेगा", तब भी आप पूछते हैं कि समस्या कहाँ आ सकती है।',
        'आप कठिन कार्यों को स्थिर कर सकते हैं, लेकिन जिम्मेदारी का बोझ आपको थका भी सकता है।',
      ],
    },
    de: {
      title: 'Umsichtiger Verwalter',
      subtitle: 'Hohe Gewissenhaftigkeit + Hohe emotionale Empfindlichkeit',
      summary: 'Sie bemerken Risiken und Details frühzeitig und verhindern Probleme, bevor sie entstehen.',
      examples: [
        'Vor einer Frist spüren Sie den Druck früh und nutzen ihn zur gründlichen Prüfung.',
        'Wenn das Team sagt „wird schon klappen“, fragen Sie nach potenziellen Schwachstellen.',
        'Sie bringen Stabilität in komplexe Aufgaben, verbrauchen dabei aber auch viel eigene Energie.',
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
    es: {
      title: 'Explorador Empático',
      subtitle: 'Alta apertura + alta amabilidad',
      summary: 'Exploras nuevas perspectivas teniendo siempre en cuenta los sentimientos y la situación de los demás.',
      examples: [
        'En un debate, primero intentas entender qué teme o busca cada una de las partes.',
        'Aceptas nuevas ideas sin usarlas para hacer sentir inferiores a los demás.',
        'Sueles traducir problemas abstractos a un lenguaje accesible para todos.',
      ],
    },
    fr: {
      title: 'Explorateur Empathique',
      subtitle: 'Haute ouverture + haute agréabilité',
      summary: 'Vous explorez de nouvelles perspectives tout en restant très attentif à l’impact humain de vos idées.',
      examples: [
        'Dans un débat, vous cherchez d’abord à comprendre ce que chaque partie essaie de protéger.',
        'Vous accueillez de nouvelles idées sans vous en servir pour rabaisser autrui.',
        'Vous savez traduire un problème complexe en termes simples et humains.',
      ],
    },
    ja: {
      title: '共感力のある探求者',
      subtitle: '高い開放性 × 高い協調性',
      summary: '豊かな好奇心を持ちながらも、他人の立場や感情に寄り添い、温かみのあるアプローチを取れる人です。',
      examples: [
        '意見が対立した時、双方の主張の背景にある不安や要望をまず理解しようとする。',
        '新しい考え方を受け入れる柔軟性があるが、それを他人に押し付けることはしない。',
        '難解で冷たい課題を、誰もが理解しやすい言葉に翻訳するのが得意。',
      ],
    },
    ru: {
      title: 'Эмпатичный исследователь',
      subtitle: 'Высокая открытость + высокая доброжелательность',
      summary: 'Вы исследуете мир и новые идеи, не забывая о чувствах и интересах окружающих.',
      examples: [
        'В споре вы сначала думаете о том, чего опасается каждая из сторон.',
        'Вы открыты новому, но не используете новые знания для превосходства над другими.',
        'Вы умеете объяснять сложные абстрактные вещи простым и человечным языком.',
      ],
    },
    ko: {
      title: '공감 능력을 갖춘 탐구자',
      subtitle: '높은 개방성 + 높은 우호성',
      summary: '호기심이 풍부할 뿐만 아니라, 그 생각이 타인에게 어떤 영향을 미칠지 깊이 배려합니다.',
      examples: [
        '논쟁이 생겼을 때 각 입장에서 무엇을 우려하는지 먼저 헤아려 봅니다.',
        '새로운 관점을 잘 수용하지만, 그것으로 남을 누르거나 과시하려 하지 않습니다.',
        '차가운 전문적 문제를 사람이 이해하기 쉬운 따뜻한 언어로 재해석해 냅니다.',
      ],
    },
    pt: {
      title: 'Explorador Empático',
      subtitle: 'Alta abertura + alta amabilidade',
      summary: 'Você explora o mundo e novas ideias sempre levando em consideração o lado humano e as pessoas.',
      examples: [
        'Numa discussão, tenta entender primeiro o que cada lado está tentando defender ou temendo.',
        'Aceita novas ideias sem usá-las para fazer os outros se sentirem menores.',
        'Consegue traduzir problemas complexos numa linguagem simples e acessível para todos.',
      ],
    },
    hi: {
      title: 'सहानुभूतिपूर्ण अन्वेषक',
      subtitle: 'उच्च खुलापन + उच्च सहमतता',
      summary: 'आप नए विचारों की खोज करते हैं और साथ ही दूसरों की भावनाओं का भी पूरा ध्यान रखते हैं।',
      examples: [
        'किसी विवाद में, आप पहले यह समझने की कोशिश करते हैं कि प्रत्येक पक्ष किस बात से चिंतित है।',
        'आप दूसरों को नीचा दिखाए बिना नए विचारों को स्वीकार कर सकते हैं।',
        'आप अक्सर कठिन समस्याओं को ऐसी भाषा में बदल देते हैं जिसे लोग आसानी से समझ सकें।',
      ],
    },
    de: {
      title: 'Empathischer Entdecker',
      subtitle: 'Hohe Offenheit + Hohe Verträglichkeit',
      summary: 'Sie erkunden neue Perspektiven und achten dabei stets auf das Wohl und die Gefühle anderer.',
      examples: [
        'Bei Meinungsverschiedenheiten versuchen Sie zuerst die Sorgen beider Seiten zu verstehen.',
        'Sie nehmen neue Ideen auf, ohne andere damit zu belehren.',
        'Sie können komplizierte Sachverhalte verständlich und einfühlsam vermitteln.',
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
    es: {
      title: 'Organizador de Acción',
      subtitle: 'Alta extraversión + alta responsabilidad',
      summary: 'Generas impulso a través de la interacción, alineando metas, ritmo y la atención del grupo.',
      examples: [
        'Cuando una reunión se estanca, lanzas la pregunta adecuada para reactivar el diálogo.',
        'No te basta con una buena charla; quieres saber quién se responsabiliza y cuáles son los plazos.',
        'Impulsas la colaboración con gran energía, pero debes cuidar no cargarlo todo sobre tus hombros.',
      ],
    },
    fr: {
      title: 'Moteur d’Action',
      subtitle: 'Haute extraversion + haute conscienciosité',
      summary: 'Vous créez une dynamique collective efficace en liant énergie relationnelle et objectifs concrets.',
      examples: [
        'Si una réunion stagne, vous relancez le débat avec la bonne question.',
        'Une bonne discussion ne suffit pas : vous voulez savoir qui fait quoi et pour quand.',
        'Vous êtes parfait pour faire avancer les projets, mais attention à ne pas tout porter seul.',
      ],
    },
    ja: {
      title: '場を活性化し成果へ導く推進者',
      subtitle: '高い外向性 × 高い誠実性',
      summary: '高い対話エネルギーと実行力を持ち、議論を活性化させながら全員の意識を目標達成へと導きます。',
      examples: [
        '会議が停滞した時、積極的に発言して議論を再び動かす。',
        '「楽しかった」だけで終わらせず、次のアクションと担当者・期限を明確にしたくなる。',
        'チームの推進力となるが得意だが、全員のペースを一人で背負い込みすぎないよう注意が必要。',
      ],
    },
    ru: {
      title: 'Двигатель результатов',
      subtitle: 'Высокая экстраверсия + высокая добросовестность',
      summary: 'Вы создаёте движение через общение, направляя внимание группы на конкретные цели.',
      examples: [
        'Если встреча зашла в тупик, вы задаёте вопрос, который заставляет всех двигаться дальше.',
        'Вам мало просто хорошей беседы; вам нужно знать, кто отвечает за следующий шаг.',
        'Вы отлично объединяете людей ради результата, но берегитесь перегрузки.',
      ],
    },
    ko: {
      title: '실행을 이끄는 행동파 조직가',
      subtitle: '높은 외향성 + 높은 성실성',
      summary: '활발한 소통을 바탕으로 동력을 만들어 내며, 사람들의 관심을 목표 달성과 실행으로 모읍니다.',
      examples: [
        '회의가 침체될 때 먼저 이슈를 던져 논의를 다시 활성화시킵니다.',
        '단순히 "좋은 대화였다"로 끝나지 않고, 누가 언제까지 담당할지 확정하려 합니다.',
        '협업을 이끄는 주도성이 뛰어나지만, 모든 진행 속도를 혼자 짊어지지 않도록 조심해야 합니다.',
      ],
    },
    pt: {
      title: 'Organizador de Ação',
      subtitle: 'Alta extroversão + alta conscienciosidade',
      summary: 'Você cria dinamismo por meio da interação, alinhando objetivos, ritmo e o foco do grupo.',
      examples: [
        'Quando uma reunião trava, você lança a pergunta certa para fazer o grupo andar.',
        'Uma boa conversa não basta: você quer definir os próximos passos e prazos.',
        'Lidera a colaboração com maestria, mas precisa tomar cuidado para não carregar o ritmo de todos.',
      ],
    },
    hi: {
      title: 'कार्य आयोजक',
      subtitle: 'उच्च बहिर्मुखता + उच्च कर्तव्यनिष्ठता',
      summary: 'आप बातचीत के माध्यम से ऊर्जा पैदा करते हैं और लक्ष्यों और समूह का ध्यान एक दिशा में लाते हैं।',
      examples: [
        'जब कोई बैठक रुक जाती है, तो आप वह प्रश्न पूछते हैं जो चर्चा को फिर से शुरू करता है।',
        'केवल एक अच्छी बातचीत आपके लिए पर्याप्त नहीं है; आप जानना चाहते हैं कि आगे क्या कदम उठाना है।',
        'आप सहयोग को आगे बढ़ा सकते हैं, लेकिन सभी की जिम्मेदारी खुद पर न लें।',
      ],
    },
    de: {
      title: 'Handlungsorganisator',
      subtitle: 'Hohe Extraversion + Hohe Gewissenhaftigkeit',
      summary: 'Sie schaffen Dynamik durch Austausch und richten Energie und Fokus auf konkrete Ergebnisse.',
      examples: [
        'Wenn ein Meeting ins Stocken gerät, bringen Sie die Diskussion mit gezielten Fragen wieder in Gang.',
        'Ein nettes Gespräch reicht Ihnen nicht – Sie wollen wissen, wer was bis wann erledigt.',
        'Sie treiben Projekte kraftvoll voran, sollten aber darauf achten, nicht alles allein zu tragen.',
      ],
    },
  },
};

export function evaluate(estimate: Estimate, lang: Locale): Evaluation {
  const ranked = [...TRAITS].sort((a, b) => estimate.percentiles[b] - estimate.percentiles[a]);
  const key = [ranked[0], ranked[1]].sort().join('-');
  const found = archetypes[key]?.[lang] ?? archetypes[key]?.en ?? archetypes[key]?.zh;
  if (found) return found;

  const names = traitNamesRecord[lang] ?? traitNamesRecord.en;
  
  const titleMap: Record<Locale, string> = {
    zh: `${names[ranked[0]]}更明显`,
    en: `${names[ranked[0]]}-led pattern`,
    es: `Patrón liderado por ${names[ranked[0]]}`,
    fr: `Profil dominé par : ${names[ranked[0]]}`,
    ja: `${names[ranked[0]]}が顕著なタイプ`,
    ru: `Тип с преобладанием: ${names[ranked[0]]}`,
    ko: `${names[ranked[0]]} 성향 우세형`,
    pt: `Padrão liderado por ${names[ranked[0]]}`,
    hi: `${names[ranked[0]]}-प्रमुख पैटर्न`,
    de: `Muster geprägt von ${names[ranked[0]]}`,
  };

  const subtitleMap: Record<Locale, string> = {
    zh: `最高维度：${names[ranked[0]]}，次高维度：${names[ranked[1]]}`,
    en: `Top traits: ${names[ranked[0]]} and ${names[ranked[1]]}`,
    es: `Rasgos principales: ${names[ranked[0]]} y ${names[ranked[1]]}`,
    fr: `Traits principaux : ${names[ranked[0]]} et ${names[ranked[1]]}`,
    ja: `主要特性：${names[ranked[0]]} / サブ特性：${names[ranked[1]]}`,
    ru: `Главные черты: ${names[ranked[0]]} и ${names[ranked[1]]}`,
    ko: `주요 특성: ${names[ranked[0]]}, 부 특성: ${names[ranked[1]]}`,
    pt: `Principais traços: ${names[ranked[0]]} e ${names[ranked[1]]}`,
    hi: `प्रमुख लक्षण: ${names[ranked[0]]} और ${names[ranked[1]]}`,
    de: `Haupteigenschaften: ${names[ranked[0]]} und ${names[ranked[1]]}`,
  };

  const summaryMap: Record<Locale, string> = {
    zh: `你的作答里，${names[ranked[0]]}和${names[ranked[1]]}最突出。下面这些例子比单纯分数更重要。`,
    en: 'Your result shows a clear leading pattern. The report focuses on how your two highest traits shape your usual mode of action.',
    es: 'Tus respuestas muestran un patrón claro. El informe se centra en cómo tus dos rasgos más altos guían tu forma de actuar.',
    fr: 'Vos réponses révèlent un profil bien défini. Le rapport explique comment vos deux traits dominants influencent vos actions.',
    ja: '回答から明確な行動パターンが読み取れます。上位2つの特性があなたの行動に与える影響に注目してください。',
    ru: 'Ваши ответы показывают четкий ведущий паттерн. Отчет показывает, как две главные черты формируют ваш стиль действий.',
    ko: '답변 결과 명확한 주도적 성향이 나타났습니다. 상위 두 가지 특성이 당신의 행동 방식에 미치는 영향에 집중해 보세요.',
    pt: 'Seus resultados mostram um padrão claro. O relatório foca em como seus dois traços mais altos moldam suas ações.',
    hi: 'आपका परिणाम एक स्पष्ट प्रमुख पैटर्न दिखाता है। यह रिपोर्ट बताती है कि आपके दो उच्चतम लक्षण आपकी कार्रवाई को कैसे आकार देते हैं।',
    de: 'Ihr Ergebnis zeigt ein klares Hauptmuster. Der Bericht beschreibt, wie Ihre zwei stärksten Eigenschaften Ihr Handeln prägen.',
  };

  const examplesMap: Record<Locale, string[]> = {
    zh: [
      `遇到新任务时，你更可能先用“${names[ranked[0]]}”那一面反应。`,
      `和别人合作时，“${names[ranked[1]]}”会明显影响你的沟通方式。`,
      '如果某条例子不像你，通常说明这个特点只在特定场景下出现。',
    ],
    en: [
      `In a new task, your first reaction is often shaped by ${names[ranked[0]]}.`,
      `In collaboration, ${names[ranked[1]]} strongly affects how you communicate.`,
      'If one example feels off, the pattern may only appear in specific situations.',
    ],
    es: [
      `Ante una nueva tarea, tu primera reacción suele estar marcada por ${names[ranked[0]]}.`,
      `Al colaborar con otros, ${names[ranked[1]]} influye notablemente en tu forma de comunicarte.`,
      'Si un ejemplo no encaja del todo, suele indicar que esa característica aparece en situaciones específicas.',
    ],
    fr: [
      `Face à una nouvelle tâche, votre première réaction est guidée par : ${names[ranked[0]]}.`,
      `En collaboration, ${names[ranked[1]]} influence fortement votre façon de communiquer.`,
      'Si un exemple semble moins pertinent, il se peut que ce trait ne ressorte que dans certains contextes.',
    ],
    ja: [
      `新しい課題に直面した時、まず「${names[ranked[0]]}」の側面が強く表れます。`,
      `他者と協力する際、「${names[ranked[1]]}」がコミュニケーションに大きな影響を与えます。`,
      '一部の例がしっくりこない場合、その特徴は特定の場面限定で表れている可能性があります。',
    ],
    ru: [
      `При новой задаче ваша первая реакция определяется чертой "${names[ranked[0]]}".`,
      `В командной работе "${names[ranked[1]]}" сильно влияет на ваш стиль общения.`,
      'Если какой-то пример кажется неточным, эта черта может проявляться только в особых ситуации.',
    ],
    ko: [
      `새로운 과제를 맡았을 때 가장 먼저 "${names[ranked[0]]}" 측면이 반응합니다.`,
      `다른 이들과 협업할 때 "${names[ranked[1]]}" 성향이 소통 방식에 큰 영향을 줍니다.`,
      '특정 예시가 자신과 다르게 느껴진다면, 해당 특징이 특정 상황에서만 발현되는 것일 수 있습니다.',
    ],
    pt: [
      `Diante de uma nova tarefa, sua primeira reação é moldada por ${names[ranked[0]]}.`,
      `Ao colaborar com outros, ${names[ranked[1]]} afeta fortemente como você se comunica.`,
      'Se um exemplo parecer fora do tom, esse traço pode aparecer apenas em situações específicas.',
    ],
    hi: [
      `किसी नए कार्य में, आपकी पहली प्रतिक्रिया अक्सर ${names[ranked[0]]} द्वारा आकार लेती है।`,
      `सहयोग में, ${names[ranked[1]]} आपके संवाद करने के तरीके को गहराई से प्रभावित करता है।`,
      'यदि कोई उदाहरण अलग लगता है, तो वह विशेषता केवल विशिष्ट स्थितियों में दिखाई दे सकती है।',
    ],
    de: [
      `Bei neuen Aufgaben wird Ihre erste Reaktion meist von ${names[ranked[0]]} geprägt.`,
      `In der Zusammenarbeit beeinflusst ${names[ranked[1]]} Ihre Kommunikation stark.`,
      'Falls ein Beispiel nicht ganz passt, zeigt sich diese Eigenschaft meist nur in bestimmten Situationen.',
    ],
  };

  return {
    title: titleMap[lang] ?? titleMap.en,
    subtitle: subtitleMap[lang] ?? subtitleMap.en,
    summary: summaryMap[lang] ?? summaryMap.en,
    examples: examplesMap[lang] ?? examplesMap.en,
  };
}

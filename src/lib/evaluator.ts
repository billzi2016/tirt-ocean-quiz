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
  it: { O: 'Apertura', C: 'Coscienziosità', E: 'Estroversione', A: 'Gradevolezza', N: 'Sensibilità emotiva' },
  uk: { O: 'Відкритість', C: 'Сумлінність', E: 'Екстраверсія', A: 'Доброзичливість', N: 'Емоційність' },
  ar: { O: 'الانفتاح', C: 'تفاني الضمير', E: 'الانبساط', A: 'القبول', N: 'الحساسية العاطفية' },
  tr: { O: 'Açıklık', C: 'Sorumluluk', E: 'Dışadönüklük', A: 'Uyumluluk', N: 'Duygusal Hassasiyet' },
  nl: { O: 'Openheid', C: 'Zorgvuldigheid', E: 'Extraversie', A: 'Vriendelijkheid', N: 'Emotionele Gevoeligheid' },
  pl: { O: 'Otwartość', C: 'Sumienność', E: 'Ekstrawersja', A: 'Ugodowość', N: 'Wrażliwość emocjonalna' },
  vi: { O: 'Cởi mở', C: 'Tận tụy', E: 'Hướng ngoại', A: 'Dễ chịu', N: 'Nhạy cảm cảm xúc' },
  th: { O: 'การเปิดรับประสบการณ์', C: 'ความมีระเบียบวินัย', E: 'การแสดงตัว', A: 'ความเป็นมิตร', N: 'ความไวต่ออารมณ์' },
  id: { O: 'Keterbukaan', C: 'Kehati-hatian', E: 'Ekstraversi', A: 'Keramahan', N: 'Sensitivitas Emosional' },
  sv: { O: 'Öppenhet', C: 'Samvetsgrannhet', E: 'Extraversion', A: 'Vänlighet', N: 'Emotionell känslighet' },
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
    it: `Modello guidato da ${names[ranked[0]]}`,
    uk: `Тип з преобладанням: ${names[ranked[0]]}`,
    ar: `نمط موجه بـ ${names[ranked[0]]}`,
    tr: `${names[ranked[0]]} Ağırlıklı Model`,
    nl: `Patroon geleid door ${names[ranked[0]]}`,
    pl: `Wzorzec dominujący: ${names[ranked[0]]}`,
    vi: `Mẫu đặc trưng: ${names[ranked[0]]}`,
    th: `รูปแบบที่นำโดย ${names[ranked[0]]}`,
    id: `Pola utama: ${names[ranked[0]]}`,
    sv: `Mönster präglat av ${names[ranked[0]]}`,
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
    it: `Tratti principali: ${names[ranked[0]]} e ${names[ranked[1]]}`,
    uk: `Головні риси: ${names[ranked[0]]} та ${names[ranked[1]]}`,
    ar: `السمات الرئيسية: ${names[ranked[0]]} و ${names[ranked[1]]}`,
    tr: `Öne çıkan özellikler: ${names[ranked[0]]} ve ${names[ranked[1]]}`,
    nl: `Belangrijkste eigenschappen: ${names[ranked[0]]} en ${names[ranked[1]]}`,
    pl: `Główne cechy: ${names[ranked[0]]} oraz ${names[ranked[1]]}`,
    vi: `Tính cách nổi bật: ${names[ranked[0]]} và ${names[ranked[1]]}`,
    th: `ลักษณะเด่น: ${names[ranked[0]]} และ ${names[ranked[1]]}`,
    id: `Sifat utama: ${names[ranked[0]]} dan ${names[ranked[1]]}`,
    sv: `Huvuddrag: ${names[ranked[0]]} och ${names[ranked[1]]}`,
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
    it: 'I tuoi risultati mostrano un modello chiaro. Il report evidenzia come i tuoi due tratti principali guidano le tue azioni.',
    uk: 'Ваші відповіді показують чіткий провідний паттерн. Звіт описує вплив двох основних рис на вашу поведінку.',
    ar: 'تظهر نتائجك نمطًا قياديًا واضحًا. يركز التقرير على كيفية تشكيل أعلى سماتك لأسلوب عملك المعتاد.',
    tr: 'Sonuçlarınız net bir ana model gösteriyor. Rapor, öne çıkan iki özelliğinizin eylemlerinizi nasıl şekillendirdiğine odaklanır.',
    nl: 'Uw resultaat toont een duidelijk leidend patroon. Het rapport beschrijft hoe uw twee sterkste eigenschappen uw handelen sturen.',
    pl: 'Twoje wyniki wskazują na wyraźny wzorzec. Raport skupia się na tym, jak dwie dominujące cechy kształtują Twoje działania.',
    vi: 'Kết quả của bạn thể hiện xu hướng nổi bật rõ ràng. Báo cáo tập trung vào cách 2 đặc tính cao nhất định hình hành động của bạn.',
    th: 'ผลลัพธ์ของคุณแสดงรูปแบบที่ชัดเจน รายงานมุ่งเน้นไปที่วิธีที่สองลักษณะเด่นส่งผลต่อแนวทางการกระทำของคุณ',
    id: 'Hasil Anda menunjukkan pola utama yang jelas. Laporan ini berfokus pada bagaimana dua sifat tertinggi Anda membentuk tindakan Anda.',
    sv: 'Ditt resultat visar ett tydligt mönster. Rapporten fokuserar på hur dina två starkaste drag formar ditt handlande.',
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
      'Если какой-то пример кажется неточным, эта черта может проявляться только в особых ситуациях.',
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
    it: [
      `Di fronte a un nuovo compito, la tua prima reazione è spesso guidata da ${names[ranked[0]]}.`,
      `Nella collaborazione, ${names[ranked[1]]} influenza notevolmente il tuo modo di comunicare.`,
      'Se un esempio sembra meno adatto, quel tratto potrebbe emergere solo in situazioni specifiche.',
    ],
    uk: [
      `При виконанні нового завдання ваша перша реакція визначається рисою "${names[ranked[0]]}".`,
      `У співпраці "${names[ranked[1]]}" відчутно впливає на стиль вашого спілкування.`,
      'Якщо якийсь приклад здається неточним, ця риса може проявлятися лише за певних умов.',
    ],
    ar: [
      `عند مواجهة مهمة جديدة، غالبًا ما تتشكل ردة فعلك الأولى بواسطة ${names[ranked[0]]}.`,
      `في التعاون مع الآخرين، يؤثر ${names[ranked[1]]} بشكل قوي على أسلوب تواصلك.`,
      'إذا بدا أحد الأمثلة غير متطابق، فقد تظهر هذه السمة في مواقف محددة فقط.',
    ],
    tr: [
      `Yeni bir görevle karşılaştığınızda ilk tepkiniz genellikle ${names[ranked[0]]} ile şekillenir.`,
      `İşbirliği yaparken ${names[ranked[1]]} iletişim kurma biçiminizi güçlü bir şekilde etkiler.`,
      'Bir örnek uymuyorsa, bu özellik yalnızca belirli durumlarda ortaya çıkıyor olabilir.',
    ],
    nl: [
      `Bij een nieuwe taak wordt uw eerste reactie meestal gevormd door ${names[ranked[0]]}.`,
      `In samenwerking beïnvloedt ${names[ranked[1]]} uw manier van communiceren sterk.`,
      'Als een voorbeeld niet helemaal klopt, komt deze eigenschap mogelijk alleen in specifieke situaties naar voren.',
    ],
    pl: [
      `W obliczu nowego zadania Twoja pierwsza reakcja jest zazwyczaj kształtowana przez ${names[ranked[0]]}.`,
      `W współpracy ${names[ranked[1]]} silnie wpływa na Twój sposób komunikacji.`,
      'Jeśli jeden z przykładów wydaje się niepasujący, cecha ta może ujawniać się tylko w określonych sytuacjach.',
    ],
    vi: [
      `Khi gặp nhiệm vụ mới, phản ứng đầu tiên của bạn thường được định hình bởi ${names[ranked[0]]}.`,
      `Khi hợp tác, ${names[ranked[1]]} ảnh hưởng mạnh mẽ đến cách bạn giao tiếp.`,
      'Nếu có ví dụ chưa hoàn toàn đúng với bạn, đặc điểm đó có thể chỉ xuất hiện trong những hoàn cảnh nhất định.',
    ],
    th: [
      `เมื่อเผชิญกับงานใหม่ ปฏิกิริยาแรกของคุณมักจะถูกกำหนดโดย ${names[ranked[0]]}`,
      `ในการทำงานร่วมกัน ${names[ranked[1]]} ส่งผลต่อวิธีการสื่อสารของคุณอย่างมาก`,
      'หากตัวอย่างหนึ่งดูไม่ตรงนัก คุณลักษณะนี้อาจปรากฏขึ้นในสถานการณ์เฉพาะเท่านั้น',
    ],
    id: [
      `Saat menghadapi tugas baru, reaksi pertama Anda sering kali dibentuk oleh ${names[ranked[0]]}.`,
      `Dalam kolaborasi, ${names[ranked[1]]} sangat memengaruhi cara Anda berkomunikasi.`,
      'Jika salah satu contoh terasa tidak pas, sifat tersebut mungkin hanya muncul dalam situasi tertentu.',
    ],
    sv: [
      `Ställd inför en ny uppgift formas din första reaktion ofta av ${names[ranked[0]]}.`,
      `I samarbete påverkar ${names[ranked[1]]} starkt hur du kommunicerar.`,
      'Om ett exempel kändes fel kanske detta drag bara visar sig i specifika situationer.',
    ],
  };

  return {
    title: titleMap[lang] ?? titleMap.en,
    subtitle: subtitleMap[lang] ?? subtitleMap.en,
    summary: summaryMap[lang] ?? summaryMap.en,
    examples: examplesMap[lang] ?? examplesMap.en,
  };
}

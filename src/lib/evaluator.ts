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
  th: { O: 'การเปิดรับ', C: 'ความมีระเบียบ', E: 'การแสดงตัว', A: 'ความเป็นมิตร', N: 'ความไวต่ออารมณ์' },
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
    it: {
      title: 'Architetto di Sistemi',
      subtitle: 'Alta apertura + alta coscienziosità',
      summary: 'Tendi a trasformare nuove idee in strutture chiare, bilanciando l’esplorazione con un’esecuzione affidabile.',
      examples: [
        'All’inizio di un progetto, cerchi un nuovo angolo e poi lo trasformi rapidamente in passaggi.',
        'Mentre gli altri discutono concetti, tu pensi a responsabili, sequenza e traguardo.',
        'Perdi la pazienza con l’ispirazione pura che non diventa mai applicabile.',
      ],
    },
    uk: {
      title: 'Архітектор систем',
      subtitle: 'Висока відкритість + висока сумлінність',
      summary: 'Ви схильні перетворювати нові ідеї на чітку структуру, поєднуючи пошук з надійним виконанням.',
      examples: [
        'На початку проєкту ви шукаєте новий погляд, а потім швидко перетворюєте його на кроки.',
        'Поки інші зупиняються на ідеях, ви думаєте про відповідальних, послідовність та результат.',
        'Вам не вистачає терпіння до чистого натхнення, яке ніколи не стає практичним.',
      ],
    },
    ar: {
      title: 'مهندس الأنظمة',
      subtitle: 'انفتاح عالٍ + تفاني الضمير العالي',
      summary: 'تميل إلى تحويل الأفكار الجديدة إلى هيكل واضح، موازناً بين الاستكشاف والتنفيذ الموثوق.',
      examples: [
        'في بداية المشروع، قد تطلب زاوية جديدة ثم تحولها بسرعة إلى خطوات.',
        'عندما يتوقف الآخرون عند مستوى الفكرة، تبدأ في التفكير في المسؤولين والتسلسل وخط النهاية.',
        'قد تفقد الصبر مع الإلهام الخالص الذي لا يصبح قابلاً للاستخدام أبداً.',
      ],
    },
    tr: {
      title: 'Sistem Mimarı',
      subtitle: 'Yüksek açıklık + yüksek sorumluluk',
      summary: 'Yeni fikirleri net yapılara dönüştürme eğilimindesinizdir; keşif ile güvenilir uygulamayı dengelersiniz.',
      examples: [
        'Bir projenin başlangıcında yeni bir açı arar ve ardından bunu hızla adımlara dönüştürürsünüz.',
        'Diğerleri fikir düzeyinde kaldığında, sorumluları, sırayı ve bitiş çizgisini düşünmeye başlarsınız.',
        'Kullanılabilir hale gelmeyen saf ilham karşısında sabrınızı kaybedebilirsiniz.',
      ],
    },
    nl: {
      title: 'Systeemarchitect',
      subtitle: 'Hoge openheid + hoge zorgvuldigheid',
      summary: 'U zet nieuwe ideeën om in een heldere structuur en combineert verkenning met betrouwbare uitvoering.',
      examples: [
        'Aan het begin van een project zoekt u naar een nieuwe invalshoek en vertaalt deze snel in stappen.',
        'Wanneer anderen op het niveau van ideeën blijven, denkt u al aan eigenaren, volgorde en de finish.',
        'U kunt uw geduld verliezen bij zuivere inspiratie die nooit praktisch toepasbaar wordt.',
      ],
    },
    pl: {
      title: 'Architekt Systemowy',
      subtitle: 'Wysoka otwartość + wysoka sumienność',
      summary: 'Masz tendencję do przekształcania nowych pomysłów w jasne struktury, łącząc poszukiwania z niezawodną realizacją.',
      examples: [
        'Na początku projektu szukasz nowego ujęcia, a następnie szybko przekształcasz je w etapy.',
        'Gdy inni pozostają na poziomie koncepcji, Ty myślisz o odpowiedzialności, kolejności i celu końcowym.',
        'Możesz tracić cierpliwość do czystej inspiracji, która nigdy nie staje się użyteczna.',
      ],
    },
    vi: {
      title: 'Kiến trúc sư hệ thống',
      subtitle: 'Độ cởi mở cao + độ tận tụy cao',
      summary: 'Bạn có xu hướng biến các ý tưởng mới thành cấu trúc rõ ràng, cân bằng giữa khám phá và thực thi tin cậy.',
      examples: [
        'Khi bắt đầu một dự án, bạn tìm kiếm góc nhìn mới rồi nhanh chóng chuyển nó thành các bước thực hiện.',
        'Khi người khác dừng ở mức ý tưởng, bạn bắt đầu nghĩ về người chịu trách nhiệm, trình tự và đích đến.',
        'Bạn có thể mất kiên nhẫn với cảm hứng thuần túy mà không bao giờ trở thành thực tế.',
      ],
    },
    th: {
      title: 'สถาปนิกระบบ',
      subtitle: 'เปิดรับประสบการณ์สูง + มีระเบียบวินัยสูง',
      summary: 'คุณมักจะเปลี่ยนความคิดใหม่ๆ ให้เป็นโครงสร้างที่ชัดเจน ปรับสมดุลระหว่างการสำรวจและการลงมือทำอย่างน่าเชื่อถือ',
      examples: [
        'เมื่อเริ่มต้นโครงการ คุณอาจมองหามุมมองใหม่แล้วเปลี่ยนให้เป็นขั้นตอนอย่างรวดเร็ว',
        'เมื่อคนอื่นหยุดอยู่แค่ระดับความคิด คุณเริ่มคิดถึงผู้รับผิดชอบ ลำดับขั้นตอน และจุดหมาย',
        'คุณอาจหมดความอดทนกับแรงบันดาลใจบริสุทธิ์ที่ไม่เคยนำไปใช้งานได้จริง',
      ],
    },
    id: {
      title: 'Arsitek Sistem',
      subtitle: 'Keterbukaan tinggi + kehati-hatian tinggi',
      summary: 'Anda cenderung mengubah ide-ide baru menjadi struktur yang jelas, menyeimbangkan eksplorasi dengan eksekusi yang dapat diandalkan.',
      examples: [
        'Pada awal proyek, Anda mungkin mencari sudut pandang baru lalu dengan cepat mengubahnya menjadi langkah-langkah.',
        'Ketika orang lain tetap berada di tingkat ide, Anda mulai memikirkan penanggung jawab, urutan, dan garis akhir.',
        'Anda mungkin kehilangan kesabaran dengan inspirasi murni yang tidak pernah bisa digunakan.',
      ],
    },
    sv: {
      title: 'Systemarkitekt',
      subtitle: 'Hög öppenhet + hög samvetsgrannhet',
      summary: 'Du har en tendens att omvandla nya idéer till en tydlig struktur och balanserar utforskande med pålitligt genomförande.',
      examples: [
        'I början av ett projekt söker du en ny vinkel och omvandlar den snabbt till konkreta steg.',
        'När andra stannar vid idénivån börjar du tänka på ansvariga, sekvens och mållinje.',
        'Du kan tappa tålamodet med ren inspiration som aldrig blir användbar.',
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
        'Quando a equipe diz "vai dar tudo certo", você pergunta onde o processo pode falhar.',
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
    it: {
      title: 'Operatore Stabile',
      subtitle: 'Alta coscienziosità + alta sensibilità emotiva',
      summary: 'Noti rapidamente responsabilità, rischi e dettagli, il che si adatta a lavori complessi che richiedono calibrazione.',
      examples: [
        'Prima di una scadenza, senti la pressione in anticipo e la usi per controllare il lavoro.',
        'Quando il team dice "andrà tutto bene", tu chiedi comunque dove potrebbe rompersi.',
        'Puoi stabilizzare lavori difficili, ma la responsabilità può prosciugarti se non stacchi mai.',
      ],
    },
    uk: {
      title: 'Надійний контролер',
      subtitle: 'Висока сумлінність + висока емоційність',
      summary: 'Ви швидко помічаєте відповідальність, ризики та деталі, що підходить для складної роботи.',
      examples: [
        'До дедлайну ви відчуваєте тиск раніше й використовуєте його для перевірки деталей.',
        'Коли команда каже «все буде добре», ви запитуєте, де це може зламатися.',
        'Ви можете стабілізувати складну роботу, але відповідальність може виснажувати.',
      ],
    },
    ar: {
      title: 'مشغل ثابت',
      subtitle: 'تفاني الضمير العالي + الحساسية العاطفية العالية',
      summary: 'تلاحظ المسؤولية والمخاطر والتفاصيل بسرعة، مما يناسب العمل المعقد الذي يتطلب ضبطاً مستمراً.',
      examples: [
        'قبل الموعد النهائي، قد تشعر بالضغط مبكرًا وتستخدمه للتحقق من العمل.',
        'عندما يقول الفريق "سيكون الأمر على ما يرام"، تسأل عن المكان الذي قد ينكسر فيه.',
        'يمكنك تثبيت العمل الصعب، لكن المسؤولية قد تنهكك إذا لم تتوقف.',
      ],
    },
    tr: {
      title: 'Dengeli Uygulayıcı',
      subtitle: 'Yüksek sorumluluk + yüksek duygusal hassasiyet',
      summary: 'Sorumluluğu, riski ve detayları hızlıca fark edersiniz; bu da sürekli ayar gerektiren karmaşık işlere uygundur.',
      examples: [
        'Teslim tarihinden önce baskıyı erkenden hisseder ve bunu işi kontrol etmek için kullanırsınız.',
        'Ekip "sorun yok" dediğinde, yine de nerede bozulabileceğini sorarsınız.',
        'Zor işleri dengeleyebilirsiniz, ancak sorumluluk hiç bitmezse sizi tüketebilir.',
      ],
    },
    nl: {
      title: 'Stabiele Beheerder',
      subtitle: 'Hoge zorgvuldigheid + hoge emotionele gevoeligheid',
      summary: 'U opmerkt verantwoordelijkheid, risico en detail snel, wat past bij complex werk dat constante afstemming vraagt.',
      examples: [
        'Vóór een deadline voelt u de druk vroeg en gebruikt u deze om het werk te controleren.',
        'Wanneer een team zegt "het komt wel goed", vraagt u toch waar het fout kan gaan.',
        'U kunt moeilijk werk stabiliseren, maar verantwoordelijkheid kan u uitputten als u deze nooit loslaat.',
      ],
    },
    pl: {
      title: 'Stabilny Operator',
      subtitle: 'Wysoka sumienność + wysoka wrażliwość emocjonalna',
      summary: 'Szybko dostrzegasz odpowiedzialność, ryzyko i detale, co sprawdza się w złożonej pracy wymagającej ciągłej korekty.',
      examples: [
        'Przed terminem wcześniej odczuwasz presję i wykorzystujesz ją do sprawdzania wykonania.',
        'Gdy zespół mówi „będzie dobrze”, Ty nadal pytasz, co może się zepsuć.',
        'Potrafisz ustabilizować trudną pracę, ale odpowiedzialność może Cię wyczerpać, jeśli nigdy nie odpuszczasz.',
      ],
    },
    vi: {
      title: 'Người vận hành vững vàng',
      subtitle: 'Độ tận tụy cao + độ nhạy cảm cảm xúc cao',
      summary: 'Bạn nhanh chóng nhận ra trách nhiệm, rủi ro và chi tiết, phù hợp với công việc phức tạp cần hiệu chỉnh liên tục.',
      examples: [
        'Trước hạn chót, bạn cảm nhận áp lực sớm và dùng nó để kiểm tra lại công việc.',
        'Khi nhóm nói "sẽ ổn thôi", bạn vẫn hỏi xem điểm nào có thể bị hỏng.',
        'Bạn có thể làm ổn định công việc khó khăn, nhưng trách nhiệm có thể làm bạn kiệt sức nếu không nghỉ ngơi.',
      ],
    },
    th: {
      title: 'ผู้ดำเนินการที่มั่นคง',
      subtitle: 'มีระเบียบวินัยสูง + มีความไวต่ออารมณ์สูง',
      summary: 'คุณสังเกตเห็นความรับผิดชอบ ความเสี่ยง และรายละเอียดได้อย่างรวดเร็ว เหมาะกับงานซับซ้อนที่ต้องปรับแต่งอยู่เสมอ',
      examples: [
        'ก่อนถึงกำหนดเวลา คุณอาจรู้สึกถึงความกดดันเร็วและใช้มันในการตรวจสอบงาน',
        'เมื่อทีมบอกว่า "น่าจะเรียบร้อยดี" คุณยังคงถามว่าจุดไหนอาจจะพังได้',
        'คุณสามารถทำให้งานที่ยากมั่นคงขึ้นได้ แต่ความรับผิดชอบอาจสูบพลังคุณหากไม่เคยปิดสวิตช์เลย',
      ],
    },
    id: {
      title: 'Operator Stabil',
      subtitle: 'Kehati-hatian tinggi + sensitivitas emosional tinggi',
      summary: 'Anda dengan cepat menyadari tanggung jawab, risiko, dan detail, yang cocok untuk pekerjaan rumit yang membutuhkan penyesuaian konstan.',
      examples: [
        'Sebelum tenggat waktu, Anda mungkin merasakan tekanan lebih awal dan menggunakannya untuk memeriksa pekerjaan.',
        'Ketika tim mengatakan "pasti baik-baik saja," Anda tetap bertanya di mana masalah bisa terjadi.',
        'Anda dapat menstabilkan pekerjaan yang sulit, tetapi tanggung jawab dapat menguras energi Anda jika tidak pernah berhenti.',
      ],
    },
    sv: {
      title: 'Stadig Operatör',
      subtitle: 'Hög samvetsgrannhet + hög emotionell känslighet',
      summary: 'Du märker ansvar, risk och detaljer snabbt, vilket passar komplext arbete som kräver ständig kalibrering.',
      examples: [
        'Före en deadline känner du trycket tidigt och använder det för att kontrollera arbetet.',
        'När ett team säger "det ordnar sig", frågar du ändå var det kan spricka.',
        'Du kan stabilisera svårt arbete, men ansvar kan dränera dig om det aldrig stängs av.',
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
    it: {
      title: 'Osservatore Indipendente',
      subtitle: 'Alta apertura + alta gradevolezza',
      summary: 'Guardi le persone e i problemi da diverse angolazioni mantenendo le tue idee utili agli altri.',
      examples: [
        'In un disaccordo, potresti prima chiederti di cosa ha paura ciascuna parte.',
        'Puoi accettare nuove idee senza usarle per far sentire gli altri inferiori.',
        'Spesso traduci un problema freddo in un linguaggio che gli altri possono usare.',
      ],
    },
    uk: {
      title: 'Емпатичний дослідник',
      subtitle: 'Висока відкритість + висока доброзичливість',
      summary: 'Ви дивитеся на людей та проблеми під різними кутами, зберігаючи ідеї корисними для інших.',
      examples: [
        'У розбіжностях ви перш за все думаєте, чого боїться кожна зі сторін.',
        'Ви сприймаєте нові ідеї, не використовуючи їх для приниження інших.',
        'Ви часто перекладаєте складні проблеми зрозумілою для інших мовою.',
      ],
    },
    ar: {
      title: 'ملاحظ مستقل',
      subtitle: 'انفتاح عالٍ + قبول عالٍ',
      summary: 'تنظر إلى الأشخاص والمشكلات من زوايا متعددة مع الحفاظ على أن تكون أفكارك مفيدة للآخرين.',
      examples: [
        'في حالات الاختلاف، قد تتساءل أولاً عما يخشاه كل طرف.',
        'يمكنك قبول الأفكار الجديدة دون استخدامها لجعل الآخرين يشعرون بالصغر.',
        'غالباً ما تترجم المشاكل المعقدة إلى لغة يمكن للآخرين استخدامها بالفعل.',
      ],
    },
    tr: {
      title: 'Bağımsız Gözlemci',
      subtitle: 'Yüksek açıklık + yüksek uyumluluk',
      summary: 'İnsanlara ve sorunlara birden fazla açıdan bakarken fikirlerinizi başkaları için yararlı tutarsınız.',
      examples: [
        'Bir anlaşmazlıkta öncelikle her iki tarafın neyden korktuğunu merak edebilirsiniz.',
        'Yeni fikirleri başkalarını küçük düşürmek için kullanmadan kabul edebilirsiniz.',
        'Soğuk bir sorunu sıklıkla başkalarının kullanabileceği bir dile çevirirsiniz.',
      ],
    },
    nl: {
      title: 'Onafhankelijke Waarnemer',
      subtitle: 'Hoge openheid + hoge vriendelijkheid',
      summary: 'U bekijkt mensen en problemen vanuit meerdere hoeken en houdt uw ideeën waardevol voor anderen.',
      examples: [
        'Bij een meningsverschil vraagt u zich eerst af waar elke kant bang voor is.',
        'U kunt nieuwe ideeën accepteren zonder ze te gebruiken om anderen zich minder te laten voelen.',
        'U vertaalt een ingewikkeld probleem vaak naar taal die anderen echt kunnen gebruiken.',
      ],
    },
    pl: {
      title: 'Niezależny Obserwator',
      subtitle: 'Wysoka otwartość + wysoka ugodowość',
      summary: 'Patrzysz na ludzi i problemy z wielu perspektyw, dbając o to, by Twoje pomysły były przydatne dla innych.',
      examples: [
        'W przypadku sporu możesz najpierw zastanowić się, czego obawia się każda ze stron.',
        'Potrafisz przyjmować nowe pomysły bez używania ich do wprawiania innych w zakłopotanie.',
        'Często przekładasz trudne problemy na język, którego inni naprawdę mogą użyć.',
      ],
    },
    vi: {
      title: 'Người quan sát độc lập',
      subtitle: 'Độ cởi mở cao + độ dễ chịu cao',
      summary: 'Bạn nhìn nhận con người và vấn đề từ nhiều góc độ trong khi vẫn giữ cho ý tưởng của mình hữu ích với người khác.',
      examples: [
        'Khi bất đồng, bạn có thể tự hỏi mỗi bên đang lo sợ điều gì trước.',
        'Bạn có thể tiếp nhận ý tưởng mới mà không dùng chúng để hạ thấp người khác.',
        'Bạn thường diễn giải một vấn đề khô khô khốc thành ngôn ngữ mà người khác dễ tiếp thu.',
      ],
    },
    th: {
      title: 'ผู้สังเกตการณ์อิสระ',
      subtitle: 'เปิดรับประสบการณ์สูง + มีความเป็นมิตรสูง',
      summary: 'คุณมองผู้คนและปัญหาจากหลายมุมมองในขณะที่รักษาความคิดของคุณให้เป็นประโยชน์ต่อผู้อื่น',
      examples: [
        'เมื่อมีความเห็นไม่ตรงกัน คุณอาจสงสัยก่อนว่าแต่ละฝ่ายกลัวอะไร',
        'คุณสามารถยอมรับความคิดใหม่ๆ โดยไม่ใช้มันทำให้คนอื่นรู้สึก ด้อยกว่า',
        'คุณมักจะแปลปัญหาที่เย็นชาให้อยู่ในภาษาที่คนอื่นนำไปใช้ได้จริง',
      ],
    },
    id: {
      title: 'Pengamat Independen',
      subtitle: 'Keterbukaan tinggi + keramahan tinggi',
      summary: 'Anda melihat orang dan masalah dari berbagai sudut pandang sambil menjaga ide-ide Anda tetap berguna bagi orang lain.',
      examples: [
        'Dalam perbedaan pendapat, Anda mungkin pertama-tama bertanya-tanya apa yang ditakuti setiap pihak.',
        'Anda dapat menerima ide-ide baru tanpa menggunakannya untuk membuat orang lain merasa kecil.',
        'Anda sering menerjemahkan masalah yang rumit ke dalam bahasa yang benar-benar dapat digunakan orang lain.',
      ],
    },
    sv: {
      title: 'Oberoende Observatör',
      subtitle: 'Hög öppenhet + hög vänlighet',
      summary: 'Du ser på människor och problem från flera vinklar medan du håller dina idéer användbara för andra.',
      examples: [
        'Vid en oenighet kan du först undra vad vardera sidan är rädd för.',
        'Du kan acceptera nya idéer utan att använda dem för att få andra att känna sig mindre.',
        'Du översätter ofta ett svårt problem till ett språk som andra faktiskt kan använda.',
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
      subtitle: 'उच्च बहिर्मुخता + उच्च कर्तव्यनिष्ठता',
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
    it: {
      title: 'Organizzatore d’Azione',
      subtitle: 'Alta estroversione + alta coscienziosità',
      summary: 'Spesso crei slancio attraverso l’interazione, allineando obiettivi, ritmo e attenzione del gruppo.',
      examples: [
        'Quando una riunione si ferma, potresti fare la domanda che rimette in moto le persone.',
        'Una buona conversazione non ti basta; vuoi sapere cosa succede dopo.',
        'Puoi guidare la collaborazione, ma potresti finire per sostenere più ritmo del necessario.',
      ],
    },
    uk: {
      title: 'Організатор дій',
      subtitle: 'Висока екстраверсія + висока сумлінність',
      summary: 'Ви часто створюєте імпульс через взаємодію, узгоджуючи цілі, темп та увагу групи.',
      examples: [
        'Коли зустріч зупиняється, ви ставите запитання, яке змушує людей рухатися далі.',
        'Хорошої розмови вам недостатньо; ви хочете знати, що буде далі.',
        'Ви можете вести співпрацю, але можете брати на себе більше темпу, ніж потрібно.',
      ],
    },
    ar: {
      title: 'منظم العمليات',
      subtitle: 'انبساط عالٍ + تفاني الضمير العالي',
      summary: 'غالباً ما تخلق زخماً من خلال التفاعل، ومحاذاة الأهداف والوتيرة واهتمام المجموعة.',
      examples: [
        'عندما يتوقف الاجتماع، قد تطرح السؤال الذي يعيد الحركة للناس.',
        'المحادثة الجيدة ليست كافية بالنسبة لك؛ تريد معرفة ما سيحدث بعد ذلك.',
        'يمكنك قيادة التعاون، ولكن قد تنتهي بحمل إيقاع أكبر مما تحتاجه.',
      ],
    },
    tr: {
      title: 'Eylem Organizatörü',
      subtitle: 'Yüksek dışadönüklük + yüksek sorumluluk',
      summary: 'Etkileşim yoluyla ivme yaratır, hedefleri, tempoyu ve grubun dikkatini hizalarsınız.',
      examples: [
        'Bir toplantı tıkandığında insanları tekrar harekete geçiren soruyu sorabilirsiniz.',
        'İyi bir sohbet sizin için yeterli değildir; bundan sonra ne olacağını bilmek istersiniz.',
        'İşbirliğini yönlendirebilirsiniz ancak gerekenden fazla tempoyu sırtlanabilirsiniz.',
      ],
    },
    nl: {
      title: 'Actie-Organisator',
      subtitle: 'Hoge extraversie + hoge zorgvuldigheid',
      summary: 'U creëert vaak momentum door interactie en brengt doelen, tempo en groepsaandacht op één lijn.',
      examples: [
        'Wanneer een vergadering vastloopt, stelt u de vraag die mensen weer in beweging krijgt.',
        'Een goed gesprek is voor u niet genoeg; u wilt weten wat er nu gaat gebeuren.',
        'U kunt samenwerking stimuleren, maar u kunt uiteindelijk meer ritme dragen dan nodig is.',
      ],
    },
    pl: {
      title: 'Organizator Działań',
      subtitle: 'Wysoka ekstrawersja + wysoka sumienność',
      summary: 'Często tworzysz dynamikę poprzez interakcję, wyrównując cele, tempo i uwagę grupy.',
      examples: [
        'Gdy spotkanie utknie w miejscu, możesz zadać pytanie, które ponownie pobudzi ludzi do działania.',
        'Dobra rozmowa Ci nie wystarcza; chcesz wiedzieć, co wydarzy się dalej.',
        'Potrafisz napędzać współpracę, ale możesz skończyć na dźwiganiu większego tempa niż trzeba.',
      ],
    },
    vi: {
      title: 'Người tổ chức hành động',
      subtitle: 'Độ hướng ngoại cao + độ tận tụy cao',
      summary: 'Bạn thường tạo ra đà phát triển thông qua tương tác, căn chỉnh mục tiêu, nhịp độ và sự chú ý của nhóm.',
      examples: [
        'Khi cuộc họp bế tắc, bạn có thể đưa ra câu hỏi giúp mọi người chuyển động trở lại.',
        'Một cuộc trò chuyện hay là chưa đủ với bạn; bạn muốn biết điều gì xảy ra tiếp theo.',
        'Bạn có thể thúc đẩy sự hợp tác, nhưng có thể vô tình gánh vác nhịp độ nhiều hơn mức cần thiết.',
      ],
    },
    th: {
      title: 'นักจัดระเบียบการกระทำ',
      subtitle: 'การแสดงตัวสูง + มีระเบียบวินัยสูง',
      summary: 'คุณมักจะสร้างแรงขับเคลื่อนผ่านการมีปฏิสัมพันธ์ ปรับเป้าหมาย จังหวะ และความสนใจของกลุ่มให้ตรงกัน',
      examples: [
        'เมื่อการประชุมหยุดชะงัก คุณอาจโยนคำถามที่ทำให้ผู้คนกลับมาเคลื่อนไหวอีกครั้ง',
        'การสนทนาที่ดีไม่เพียงพอสำหรับคุณ คุณต้องการทราบว่าจะเกิดอะไรขึ้นต่อไป',
        'คุณสามารถขับเคลื่อนการทำงานร่วมกันได้ แต่อาจจบลงด้วยการแบกรับจังหวะมากกว่าที่จำเป็น',
      ],
    },
    id: {
      title: 'Pengatur Tindakan',
      subtitle: 'Ekstraversi tinggi + kehati-hatian tinggi',
      summary: 'Anda sering menciptakan momentum melalui interaksi, menyelaraskan tujuan, ritme, dan perhatian kelompok.',
      examples: [
        'Ketika rapat mandek, Anda mungkin melempar pertanyaan yang membuat orang bergerak kembali.',
        'Percakapan yang baik saja tidak cukup bagi Anda; Anda ingin tahu apa yang terjadi selanjutnya.',
        'Anda dapat mendorong kolaborasi, tetapi Anda mungkin berakhir membawa lebih banyak ritme daripada yang Anda butuhkan.',
      ],
    },
    sv: {
      title: 'Handlingsorganisatör',
      subtitle: 'Hög extraversion + hög samvetsgrannhet',
      summary: 'Du skapar ofta momentum genom interaktion och samordnar mål, tempo och gruppens uppmärksamhet.',
      examples: [
        'När ett möte kör fast ställer du frågan som får igång folk igen.',
        'Ett bra samtal räcker inte för dig; du vill veta vad som händer härnäst.',
        'Du kan driva samarbete, men du kan sluta med att bära mer av rytmen än du behöver.',
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

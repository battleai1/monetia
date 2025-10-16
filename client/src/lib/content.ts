import avatar1 from '@assets/generated_images/Female_testimonial_avatar_1_02e8cd77.png';
import avatar2 from '@assets/generated_images/Male_testimonial_avatar_1_b9c9a16b.png';
import avatar3 from '@assets/generated_images/Female_testimonial_avatar_2_f752114d.png';
import avatar4 from '@assets/generated_images/Male_testimonial_avatar_2_4efbfb1b.png';
import avatar5 from '@assets/generated_images/Female_testimonial_avatar_3_9f361eca.png';

export interface Comment {
  id: string;
  author: string;
  authorAvatar?: string;
  text: string;
  likes: number;
  timestamp: string;
}

export interface SalesReel {
  id: string;
  title: string;
  hook?: string;
  videoUrl: string;
  posterUrl?: string;
  ctaText?: string;
  isFinal?: boolean;
  author: string;
  authorAvatar?: string;
  descriptionBrief: string;
  descriptionFull: string;
  comments: Comment[];
}

export interface LessonReel {
  id: string;
  lessonTitle: string;
  videoUrl: string;
  posterUrl?: string;
  captionBrief: string;
  captionFull: string;
  nextCtaText?: string;
  isFinal?: boolean;
  author: string;
  authorAvatar?: string;
}

export interface Testimonial {
  id: string;
  author: string;
  role?: string;
  thumbUrl: string;
  videoUrl: string;
  highlight?: string;
}

export const salesReels: SalesReel[] = [
  { 
    id: "s1", 
    title: "Каждый день похож на вчера?", 
    hook: "Стоп. Можно иначе.", 
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4", 
    posterUrl: "https://via.placeholder.com/400x720/270/fff?text=Reel+1", 
    author: "Пирамида трафика",
    authorAvatar: avatar1,
    descriptionBrief: "Застряли в рутине? Есть способ выйти из круга...",
    descriptionFull: "Застряли в рутине? Есть способ выйти из круга. Вертикальные видео открывают новые возможности для тех, кто готов действовать. #вертикальноевидео #трафик",
    comments: [
      { id: "c1-1", author: "Анна М.", authorAvatar: avatar2, text: "Это именно то, что мне нужно было услышать! 🔥", likes: 42, timestamp: "2ч" },
      { id: "c1-2", author: "Дмитрий К.", authorAvatar: avatar3, text: "Наконец-то понятное объяснение! Спасибо", likes: 28, timestamp: "5ч" },
      { id: "c1-3", author: "Елена В.", text: "Уже пробую, результаты есть! 💪", likes: 65, timestamp: "1д" }
    ]
  },
  { 
    id: "s2", 
    title: "Обычные люди и вертикальные видео", 
    hook: "Не блогеры. Обычные.", 
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4", 
    posterUrl: "https://via.placeholder.com/400x720/280/fff?text=Reel+2", 
    author: "Пирамида трафика",
    authorAvatar: avatar2,
    descriptionBrief: "Не нужно быть блогером, чтобы начать...",
    descriptionFull: "Не нужно быть блогером, чтобы начать. Обычные люди получают результаты с помощью простой системы создания контента.",
    comments: [
      { id: "c2-1", author: "Сергей П.", authorAvatar: avatar4, text: "Я не блогер, но уже вижу первые просмотры!", likes: 51, timestamp: "3ч" },
      { id: "c2-2", author: "Мария Л.", text: "Система действительно работает ✨", likes: 39, timestamp: "6ч" },
      { id: "c2-3", author: "Александр Н.", authorAvatar: avatar5, text: "Простота - вот что меня зацепило", likes: 33, timestamp: "8ч" }
    ]
  },
  { 
    id: "s3", 
    title: "Поворот: система, а не хаос", 
    hook: "Просто следуй шагам", 
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4", 
    posterUrl: "https://via.placeholder.com/400x720/290/fff?text=Reel+3", 
    author: "Пирамида трафика",
    authorAvatar: avatar3,
    descriptionBrief: "Система, которой легко следовать...",
    descriptionFull: "Система, которой легко следовать. Шаг за шагом от идеи до результата. Никакого хаоса — только чёткий план действий.",
    comments: [
      { id: "c3-1", author: "Ольга С.", authorAvatar: avatar1, text: "Шаг за шагом - именно так и нужно!", likes: 48, timestamp: "4ч" },
      { id: "c3-2", author: "Игорь М.", authorAvatar: avatar2, text: "Хаоса больше нет, есть структура 👍", likes: 37, timestamp: "7ч" },
      { id: "c3-3", author: "Татьяна Б.", text: "Всё понятно даже новичку!", likes: 55, timestamp: "12ч" }
    ]
  },
  { 
    id: "s4", 
    title: "ИИ ускоряет создание вертикальных видео", 
    hook: "Без сложных съёмок", 
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4", 
    posterUrl: "https://via.placeholder.com/400x720/300/fff?text=Reel+4", 
    author: "Пирамида трафика",
    authorAvatar: avatar4,
    descriptionBrief: "ИИ делает 80% работы за вас...",
    descriptionFull: "ИИ делает 80% работы за вас. Создание роликов становится в разы быстрее. Генерация, озвучка, монтаж — всё автоматизировано.",
    comments: [
      { id: "c4-1", author: "Виктор Р.", text: "ИИ реально упрощает всё! 🤖", likes: 72, timestamp: "1ч" },
      { id: "c4-2", author: "Наталья К.", authorAvatar: avatar3, text: "Автоматизация - мечта любого создателя", likes: 44, timestamp: "5ч" },
      { id: "c4-3", author: "Максим Д.", authorAvatar: avatar5, text: "Без камеры и студии - просто огонь!", likes: 61, timestamp: "9ч" }
    ]
  },
  { 
    id: "s5", 
    title: "Жизнь после: свобода и творчество", 
    hook: "Ближе, чем кажется", 
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4", 
    posterUrl: "https://via.placeholder.com/400x720/310/fff?text=Reel+5", 
    author: "Пирамида трафика",
    authorAvatar: avatar5,
    descriptionBrief: "Представьте: работаете откуда хотите...",
    descriptionFull: "Представьте: работаете откуда хотите, создаёте контент в своём ритме. Это ближе, чем кажется. Свобода начинается с первого шага.",
    comments: [
      { id: "c5-1", author: "Юлия Т.", authorAvatar: avatar2, text: "Свобода - это то, к чему я стремлюсь! 🌟", likes: 83, timestamp: "2ч" },
      { id: "c5-2", author: "Андрей В.", text: "Работаю из любой точки мира теперь", likes: 56, timestamp: "6ч" },
      { id: "c5-3", author: "Екатерина П.", authorAvatar: avatar4, text: "Это не мечта, это реальность!", likes: 69, timestamp: "10ч" }
    ]
  },
  { 
    id: "s6", 
    title: "Голоса учеников: короткие истории", 
    hook: "Смотри, что говорят", 
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4", 
    posterUrl: "https://via.placeholder.com/400x720/320/fff?text=Reel+6", 
    author: "Пирамида трафика",
    authorAvatar: avatar1,
    descriptionBrief: "Реальные истории реальных людей...",
    descriptionFull: "Реальные истории реальных людей, которые начали с нуля. Их опыт показывает — это работает для каждого.",
    comments: [
      { id: "c6-1", author: "Павел Г.", authorAvatar: avatar3, text: "Вдохновляют истории других людей! 💪", likes: 47, timestamp: "3ч" },
      { id: "c6-2", author: "Светлана И.", text: "И я начала с нуля, сейчас результат есть", likes: 58, timestamp: "7ч" },
      { id: "c6-3", author: "Артём Ф.", authorAvatar: avatar1, text: "Работает для всех, проверено!", likes: 41, timestamp: "11ч" }
    ]
  },
  { 
    id: "s7", 
    title: "Как это устроено внутри", 
    hook: "Понятная механика", 
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4", 
    posterUrl: "https://via.placeholder.com/400x720/330/fff?text=Reel+7", 
    author: "Пирамида трафика",
    authorAvatar: avatar2,
    descriptionBrief: "Заглянем под капот системы...",
    descriptionFull: "Заглянем под капот системы. Простая механика без лишних сложностей. Всё логично и понятно с первого раза.",
    comments: [
      { id: "c7-1", author: "Кристина Ж.", text: "Механика простая, но эффективная!", likes: 52, timestamp: "4ч" },
      { id: "c7-2", author: "Денис О.", authorAvatar: avatar5, text: "Под капотом всё гениально просто ⚙️", likes: 45, timestamp: "8ч" },
      { id: "c7-3", author: "Алина Ш.", authorAvatar: avatar2, text: "Логика работы понятна сразу", likes: 38, timestamp: "13ч" }
    ]
  },
  { 
    id: "s8", 
    title: "Что внутри «Пирамиды трафика»", 
    hook: "Шаблоны. Поддержка. Путь.", 
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4", 
    posterUrl: "https://via.placeholder.com/400x720/340/fff?text=Reel+8", 
    author: "Пирамида трафика",
    authorAvatar: avatar3,
    descriptionBrief: "Готовые шаблоны, поддержка 24/7...",
    descriptionFull: "Готовые шаблоны, поддержка 24/7, пошаговый путь к результату. Всё что нужно — уже внутри. Вам остаётся только начать.",
    comments: [
      { id: "c8-1", author: "Роман З.", authorAvatar: avatar4, text: "Шаблоны экономят кучу времени! 🚀", likes: 76, timestamp: "1ч" },
      { id: "c8-2", author: "Вера С.", text: "Поддержка действительно круглосуточная", likes: 63, timestamp: "5ч" },
      { id: "c8-3", author: "Николай Л.", authorAvatar: avatar1, text: "Всё готово, просто бери и делай!", likes: 54, timestamp: "9ч" }
    ]
  },
  { 
    id: "s9", 
    title: "Готов начать?", 
    hook: "Сделай шаг", 
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackOnStreetAndDirt.mp4", 
    posterUrl: "https://via.placeholder.com/400x720/350/fff?text=Reel+9", 
    ctaText: "Начать свою пирамиду трафика", 
    isFinal: true,
    author: "Пирамида трафика",
    authorAvatar: avatar4,
    descriptionBrief: "Первый шаг определяет всё...",
    descriptionFull: "Первый шаг определяет всё. Начните свою пирамиду трафика прямо сейчас и измените свой подход к привлечению клиентов навсегда.",
    comments: [
      { id: "c9-1", author: "Людмила А.", authorAvatar: avatar3, text: "Начинаю прямо сейчас! 🔥", likes: 91, timestamp: "30мин" },
      { id: "c9-2", author: "Владимир Х.", text: "Первый шаг сделал, не пожалел!", likes: 78, timestamp: "2ч" },
      { id: "c9-3", author: "Ирина Ч.", authorAvatar: avatar5, text: "Это реально работает!", likes: 85, timestamp: "4ч" }
    ]
  }
];

export const lessons: LessonReel[] = [
  {
    id: "l1",
    lessonTitle: "М1. Что такое бесплатный вертикальный трафик",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4",
    posterUrl: "https://via.placeholder.com/400x720/270/fff?text=Lesson+1",
    captionBrief: "Почему вертикальные видео — главный источник бесплатного трафика.",
    captionFull: "Экосистема Reels/Shorts/TikTok, роль первых 3 секунд, удержание, базовая логика публикаций.",
    nextCtaText: "Следующий урок",
    author: "Пирамида трафика Академия",
    authorAvatar: avatar5
  },
  {
    id: "l2",
    lessonTitle: "М2. Формула сильного хука (0–3 сек)",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/VolkswagenGTIReview.mp4",
    posterUrl: "https://via.placeholder.com/400x720/280/fff?text=Lesson+2",
    captionBrief: "Хуки: боль, интрига, шок-факт. Визуальные приёмы.",
    captionFull: "Готовые шаблоны, примеры формулировок и тестирование удержания.",
    nextCtaText: "Следующий урок",
    author: "Пирамида трафика Академия",
    authorAvatar: avatar1
  },
  {
    id: "l3",
    lessonTitle: "М3. ИИ-инструменты для генерации видео",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4",
    posterUrl: "https://via.placeholder.com/400x720/290/fff?text=Lesson+3",
    captionBrief: "Как собирать ролики без съёмки.",
    captionFull: "Скрипты, генерация кадров, озвучка, автоматизация публикаций. Рекомендации по весу и кодекам.",
    nextCtaText: "Следующий урок",
    author: "Пирамида трафика Академия",
    authorAvatar: avatar2
  },
  {
    id: "l4",
    lessonTitle: "М4. Публикация и сигналы алгоритмов",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WhatCarCanYouGetForAGrand.mp4",
    posterUrl: "https://via.placeholder.com/400x720/300/fff?text=Lesson+4",
    captionBrief: "Когда постить, как подписывать, что влияет на показ.",
    captionFull: "Хэштеги, сабтайтлы, ритм монтажа, первые 24 часа.",
    nextCtaText: "Следующий урок",
    author: "Пирамида трафика Академия",
    authorAvatar: avatar3
  },
  {
    id: "l5",
    lessonTitle: "М5. Безопасные практики и рост",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
    posterUrl: "https://via.placeholder.com/400x720/310/fff?text=Lesson+5",
    captionBrief: "Как масштабироваться и не выгореть.",
    captionFull: "Контент-план, пачки роликов, контроль качества и аналитика.",
    nextCtaText: "К финалу",
    author: "Пирамида трафика Академия",
    authorAvatar: avatar4
  },
  {
    id: "l6",
    lessonTitle: "Финал: следующий шаг",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
    posterUrl: "https://via.placeholder.com/400x720/320/fff?text=Lesson+6",
    captionBrief: "Подведём итоги и пригласим на основной продукт.",
    captionFull: "Что дальше: поддержка, материалы, сообщество.",
    nextCtaText: "К финалу",
    isFinal: true,
    author: "Пирамида трафика Академия",
    authorAvatar: avatar5
  }
];

export const testimonials: Testimonial[] = [
  { id: "t1", author: "Мария", role: "Студент", thumbUrl: avatar1, videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4", highlight: "«Думала, что не получится — получилось»" },
  { id: "t2", author: "Антон", role: "Предприниматель", thumbUrl: avatar2, videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4", highlight: "«Главное — начать и делать»" },
  { id: "t3", author: "Елена", role: "Маркетолог", thumbUrl: avatar3, videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4", highlight: "«Трафик пошёл на 3-й день»" },
  { id: "t4", author: "Дмитрий", role: "Фрилансер", thumbUrl: avatar4, videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4", highlight: "«Теперь не трачу на рекламу»" },
  { id: "t5", author: "Анна", role: "Блогер", thumbUrl: avatar5, videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4", highlight: "«Первые подписчики за неделю»" },
  { id: "t6", author: "Михаил", role: "Владелец бизнеса", thumbUrl: avatar1, videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4", highlight: "«Клиенты сами пишут теперь»" },
  { id: "t7", author: "Ольга", role: "Копирайтер", thumbUrl: avatar2, videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackOnStreetAndDirt.mp4", highlight: "«Научилась за выходные»" },
  { id: "t8", author: "Игорь", role: "Тренер", thumbUrl: avatar3, videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4", highlight: "«Заявок стало в 3 раза больше»" },
  { id: "t9", author: "Светлана", role: "Дизайнер", thumbUrl: avatar4, videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/VolkswagenGTIReview.mp4", highlight: "«Вижу реальный результат»" },
  { id: "t10", author: "Алексей", role: "Консультант", thumbUrl: avatar5, videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4", highlight: "«Органика работает лучше таргета»" },
  { id: "t11", author: "Наталья", role: "Психолог", thumbUrl: avatar1, videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WhatCarCanYouGetForAGrand.mp4", highlight: "«Страх камеры прошёл»" },
  { id: "t12", author: "Сергей", role: "Эксперт", thumbUrl: avatar2, videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4", highlight: "«Просто и понятно объяснили»" },
  { id: "t13", author: "Татьяна", role: "Коуч", thumbUrl: avatar3, videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4", highlight: "«Первый вирусный ролик за 2 недели»" },
  { id: "t14", author: "Владимир", role: "Инфобизнесмен", thumbUrl: avatar4, videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4", highlight: "«Окупилось сразу»" },
  { id: "t15", author: "Юлия", role: "Стилист", thumbUrl: avatar5, videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4", highlight: "«Записи идут каждый день»" },
  { id: "t16", author: "Павел", role: "Разработчик", thumbUrl: avatar1, videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4", highlight: "«Технически всё просто»" },
  { id: "t17", author: "Екатерина", role: "Нутрициолог", thumbUrl: avatar2, videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4", highlight: "«Люди начали доверять»" },
  { id: "t18", author: "Роман", role: "Предприниматель", thumbUrl: avatar3, videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4", highlight: "«Масштабируется легко»" },
  { id: "t19", author: "Виктория", role: "Риэлтор", thumbUrl: avatar4, videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4", highlight: "«Продажи выросли вдвое»" },
  { id: "t20", author: "Артём", role: "Фотограф", thumbUrl: avatar5, videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackOnStreetAndDirt.mp4", highlight: "«Ниша откликается моментально»" }
];

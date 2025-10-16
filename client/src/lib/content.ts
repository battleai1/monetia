import avatar1 from '@assets/generated_images/Female_testimonial_avatar_1_02e8cd77.png';
import avatar2 from '@assets/generated_images/Male_testimonial_avatar_1_b9c9a16b.png';
import avatar3 from '@assets/generated_images/Female_testimonial_avatar_2_f752114d.png';
import avatar4 from '@assets/generated_images/Male_testimonial_avatar_2_4efbfb1b.png';
import avatar5 from '@assets/generated_images/Female_testimonial_avatar_3_9f361eca.png';

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
    ctaText: "Смотреть дальше",
    author: "Нейротрафик",
    authorAvatar: avatar1,
    descriptionBrief: "Застряли в рутине? Есть способ выйти из круга...",
    descriptionFull: "Застряли в рутине? Есть способ выйти из круга. Вертикальные видео открывают новые возможности для тех, кто готов действовать. #вертикальноевидео #трафик"
  },
  { 
    id: "s2", 
    title: "Обычные люди и вертикальные видео", 
    hook: "Не блогеры. Обычные.", 
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4", 
    posterUrl: "https://via.placeholder.com/400x720/280/fff?text=Reel+2", 
    ctaText: "Дальше",
    author: "Нейротрафик",
    authorAvatar: avatar2,
    descriptionBrief: "Не нужно быть блогером, чтобы начать...",
    descriptionFull: "Не нужно быть блогером, чтобы начать. Обычные люди получают результаты с помощью простой системы создания контента."
  },
  { 
    id: "s3", 
    title: "Поворот: система, а не хаос", 
    hook: "Просто следуй шагам", 
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4", 
    posterUrl: "https://via.placeholder.com/400x720/290/fff?text=Reel+3", 
    ctaText: "Ок",
    author: "Нейротрафик",
    authorAvatar: avatar3,
    descriptionBrief: "Система, которой легко следовать...",
    descriptionFull: "Система, которой легко следовать. Шаг за шагом от идеи до результата. Никакого хаоса — только чёткий план действий."
  },
  { 
    id: "s4", 
    title: "ИИ ускоряет создание вертикальных видео", 
    hook: "Без сложных съёмок", 
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4", 
    posterUrl: "https://via.placeholder.com/400x720/300/fff?text=Reel+4", 
    ctaText: "Продолжить",
    author: "Нейротрафик",
    authorAvatar: avatar4,
    descriptionBrief: "ИИ делает 80% работы за вас...",
    descriptionFull: "ИИ делает 80% работы за вас. Создание роликов становится в разы быстрее. Генерация, озвучка, монтаж — всё автоматизировано."
  },
  { 
    id: "s5", 
    title: "Жизнь после: свобода и творчество", 
    hook: "Ближе, чем кажется", 
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4", 
    posterUrl: "https://via.placeholder.com/400x720/310/fff?text=Reel+5", 
    ctaText: "Дальше",
    author: "Нейротрафик",
    authorAvatar: avatar5,
    descriptionBrief: "Представьте: работаете откуда хотите...",
    descriptionFull: "Представьте: работаете откуда хотите, создаёте контент в своём ритме. Это ближе, чем кажется. Свобода начинается с первого шага."
  },
  { 
    id: "s6", 
    title: "Голоса учеников: короткие истории", 
    hook: "Смотри, что говорят", 
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4", 
    posterUrl: "https://via.placeholder.com/400x720/320/fff?text=Reel+6", 
    ctaText: "Ещё",
    author: "Нейротрафик",
    authorAvatar: avatar1,
    descriptionBrief: "Реальные истории реальных людей...",
    descriptionFull: "Реальные истории реальных людей, которые начали с нуля. Их опыт показывает — это работает для каждого."
  },
  { 
    id: "s7", 
    title: "Как это устроено внутри", 
    hook: "Понятная механика", 
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4", 
    posterUrl: "https://via.placeholder.com/400x720/330/fff?text=Reel+7", 
    ctaText: "Ок",
    author: "Нейротрафик",
    authorAvatar: avatar2,
    descriptionBrief: "Заглянем под капот системы...",
    descriptionFull: "Заглянем под капот системы. Простая механика без лишних сложностей. Всё логично и понятно с первого раза."
  },
  { 
    id: "s8", 
    title: "Что внутри «Нейротрафика»", 
    hook: "Шаблоны. Поддержка. Путь.", 
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4", 
    posterUrl: "https://via.placeholder.com/400x720/340/fff?text=Reel+8", 
    ctaText: "К финалу",
    author: "Нейротрафик",
    authorAvatar: avatar3,
    descriptionBrief: "Готовые шаблоны, поддержка 24/7...",
    descriptionFull: "Готовые шаблоны, поддержка 24/7, пошаговый путь к результату. Всё что нужно — уже внутри. Вам остаётся только начать."
  },
  { 
    id: "s9", 
    title: "Готов начать?", 
    hook: "Сделай шаг", 
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackOnStreetAndDirt.mp4", 
    posterUrl: "https://via.placeholder.com/400x720/350/fff?text=Reel+9", 
    ctaText: "Начать бесплатное обучение", 
    isFinal: true,
    author: "Нейротрафик",
    authorAvatar: avatar4,
    descriptionBrief: "Первый шаг определяет всё...",
    descriptionFull: "Первый шаг определяет всё. Начните бесплатное обучение прямо сейчас и измените свой подход к трафику навсегда."
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
    author: "Нейротрафик Академия",
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
    author: "Нейротрафик Академия",
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
    author: "Нейротрафик Академия",
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
    author: "Нейротрафик Академия",
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
    author: "Нейротрафик Академия",
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
    author: "Нейротрафик Академия",
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

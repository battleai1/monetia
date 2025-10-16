import LessonCaption from '../LessonCaption';

export default function LessonCaptionExample() {
  return (
    <div className="relative h-screen bg-gradient-to-b from-purple-900 to-black">
      <LessonCaption
        lessonId="l1"
        brief="Почему вертикальные видео — главный источник бесплатного трафика."
        full="Экосистема Reels/Shorts/TikTok, роль первых 3 секунд, удержание, базовая логика публикаций."
      />
    </div>
  );
}

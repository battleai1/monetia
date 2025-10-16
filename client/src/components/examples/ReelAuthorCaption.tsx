import ReelAuthorCaption from '../ReelAuthorCaption';
import avatar1 from '@assets/generated_images/Female_testimonial_avatar_1_02e8cd77.png';

export default function ReelAuthorCaptionExample() {
  return (
    <div className="relative h-screen bg-gradient-to-b from-purple-900 to-black">
      <ReelAuthorCaption
        reelId="s1"
        author="Нейротрафик"
        authorAvatar={avatar1}
        title="Каждый день похож на вчера?"
        descriptionBrief="Застряли в рутине? Есть способ выйти из круга..."
        descriptionFull="Застряли в рутине? Есть способ выйти из круга. Вертикальные видео открывают новые возможности для тех, кто готов действовать. #вертикальноевидео #трафик"
      />
    </div>
  );
}

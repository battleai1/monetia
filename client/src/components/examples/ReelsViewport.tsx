import ReelsViewport from '../ReelsViewport';
import ReelCard from '../ReelCard';

export default function ReelsViewportExample() {
  const mockReels = [
    { id: 's1', videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4', hook: 'Стоп. Можно иначе.' },
    { id: 's2', videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4', hook: 'Не блогеры. Обычные.' },
    { id: 's3', videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4', hook: 'Просто следуй шагам' },
  ];

  return (
    <ReelsViewport totalReels={mockReels.length}>
      {mockReels.map((reel, index) => (
        <ReelCard
          key={reel.id}
          id={reel.id}
          videoUrl={reel.videoUrl}
          hook={reel.hook}
          isActive={true}
          mode="sales"
        />
      ))}
    </ReelsViewport>
  );
}

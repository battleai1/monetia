import ReelCard from '../ReelCard';

export default function ReelCardExample() {
  return (
    <div className="h-screen bg-black">
      <ReelCard
        id="s1"
        videoUrl="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"
        posterUrl="https://via.placeholder.com/400x720/270/fff?text=Reel"
        hook="Стоп. Можно иначе."
        ctaText="Смотреть дальше"
        isActive={true}
        mode="sales"
      />
    </div>
  );
}

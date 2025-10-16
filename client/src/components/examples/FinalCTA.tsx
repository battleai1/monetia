import FinalCTA from '../FinalCTA';

export default function FinalCTAExample() {
  return (
    <div className="relative h-screen bg-gradient-to-b from-purple-900 to-black">
      <FinalCTA
        text="Начать бесплатное обучение"
        onClick={() => console.log('CTA clicked')}
        visible={true}
      />
    </div>
  );
}

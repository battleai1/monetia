import ProgressStrips from '../ProgressStrips';

export default function ProgressStripsExample() {
  return (
    <div className="relative h-screen bg-black">
      <ProgressStrips total={9} current={2} progress={65} />
    </div>
  );
}

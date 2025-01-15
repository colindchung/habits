interface DailyLearnsProps {
  date: string;
  learnsData: {
    title: string;
    description: string;
  }[];
  startupData: {
    title: string;
    description: string;
  }[];
}

function DailyLearns({ date, learnsData, startupData }: DailyLearnsProps) {
  return (
    <section className="pt-8">
      <h2 className="text-2xl font-semibold">Today&apos;s Learns</h2>
      <div>
        {learnsData.map((learn) => (
          <div key={learn.title}>
            <h2>{learn.title}</h2>
            <p>{learn.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

export default DailyLearns;

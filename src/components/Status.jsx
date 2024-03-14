export default function Status({ className, title, bestTime, statValue }) {
  return (
    <div className={className}>
      <div className={bestTime}>
        <h4>{title}</h4>
      </div>
      <p>{statValue}</p>
    </div>
  );
}

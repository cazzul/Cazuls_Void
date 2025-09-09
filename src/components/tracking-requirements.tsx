export default function TrackingRequirements() {
  return (
    <div className="mb-6">
      <h3 className="text-lg font-bold mb-3" style={{ color: 'var(--color-accent)' }}>Track:</h3>
      <ul className="space-y-2 text-sm" style={{ color: 'var(--color-foreground)' }}>
        <li className="flex items-center">
          <span className="mr-2" style={{ color: 'var(--color-running)' }}>✔</span> 
          Miles Running
        </li>
        <li className="flex items-center">
          <span className="mr-2" style={{ color: 'var(--color-mtb)' }}>✔</span> 
          Miles Biking
        </li>
        <li className="flex items-center">
          <span className="mr-2" style={{ color: 'var(--color-mtb)' }}>✔</span> 
          Working Sets of Chest
        </li>
        <li className="flex items-center">
          <span className="mr-2" style={{ color: 'var(--color-accent)' }}>✔</span> 
          Working Sets of Back
        </li>
        <li className="flex items-center">
          <span className="mr-2" style={{ color: 'var(--color-border)' }}>✔</span> 
          Working Sets of Biceps
        </li>
        <li className="flex items-center">
          <span className="mr-2" style={{ color: 'var(--color-running)' }}>✔</span> 
          Working Sets of Triceps
        </li>
        <li className="flex items-center">
          <span className="mr-2" style={{ color: 'var(--color-accent)' }}>✔</span> 
          Working Sets of Hamstrings
        </li>
        <li className="flex items-center">
          <span className="mr-2" style={{ color: 'var(--color-lifting)' }}>✔</span> 
          Working Sets of Shoulders
        </li>
        <li className="flex items-center">
          <span className="mr-2" style={{ color: 'var(--color-border)' }}>✔</span> 
          Working Sets of Quads
        </li>
      </ul>
    </div>
  );
} 
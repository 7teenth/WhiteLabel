export function InlineError({ message }: { message: string }) {
  if (!message) return null;
  return (
    <div style={{ color: '#b00020', marginTop: '0.5rem', fontSize: '0.9rem' }} role="alert">
      {message}
    </div>
  );
}

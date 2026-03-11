export function Spinner({ size = 32 }: { size?: number }) {
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: '50%',
        border: '4px solid rgba(0,0,0,0.1)',
        borderTopColor: 'rgba(0,0,0,0.6)',
        animation: 'spin 1s linear infinite',
      }}
    />
  );
}

// keyframes are global; for small projects it's ok to use a style tag.
const style = document.createElement('style');
style.textContent = `@keyframes spin { from { transform: rotate(0deg);} to { transform: rotate(360deg);} }`;
document.head.appendChild(style);

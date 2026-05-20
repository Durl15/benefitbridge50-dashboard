export function StatusBadge({ status }: { status: 'ready' | 'pending' | 'complete' }) {
  const colors = {
    ready: 'bg-amber-100 text-amber-900',
    pending: 'bg-blue-100 text-blue-900',
    complete: 'bg-green-100 text-green-900'
  };
  return <span className={px-3 py-1 rounded-full text-sm font-medium }>{status}</span>;
}

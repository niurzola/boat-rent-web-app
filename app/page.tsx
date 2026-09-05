import Link from 'next/link';

export default function Page() {
  return (
    <div className="flex min-h-screen flex-col gap-4 mx-5">
      <div className="grid grid-cols-2 gap-4">
        <Link href="/brodovi" className="border rounded-lg p-4 shadow-sm block hover:bg-muted">
          <h1 className="text-center text-lg font-medium">Brodovi</h1>
        </Link>
        <Link href="/rezervacije" className="border rounded-lg p-4 shadow-sm block hover:bg-muted">
          <h1 className="text-center text-lg font-medium">Raspored</h1>
        </Link>
        <Link href="/prihodi" className="border rounded-lg p-4 shadow-sm block hover:bg-muted">
          <h1 className="text-center text-lg font-medium">Prihodi</h1>
        </Link>
        <Link href="/cijene" className="border rounded-lg p-4 shadow-sm block hover:bg-muted">
          <h1 className="text-center text-lg font-medium">Cijene</h1>
        </Link>
      </div>
    </div>
  );
}

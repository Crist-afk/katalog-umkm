// US-28: loading skeleton di halaman detail produk
export default function Loading() {
  return (
    <div className="grid gap-8 py-8 md:grid-cols-2 md:py-12">
      <div className="aspect-square w-full animate-pulse rounded-2xl bg-permukaan" />
      <div className="flex flex-col gap-4">
        <div className="h-4 w-32 animate-pulse rounded bg-permukaan" />
        <div className="h-3 w-20 animate-pulse rounded bg-permukaan" />
        <div className="h-8 w-3/4 animate-pulse rounded-xl bg-permukaan" />
        <div className="h-7 w-28 animate-pulse rounded-md bg-permukaan" />
        <div className="flex flex-col gap-2">
          <div className="h-3 w-full animate-pulse rounded bg-permukaan" />
          <div className="h-3 w-5/6 animate-pulse rounded bg-permukaan" />
          <div className="h-3 w-4/5 animate-pulse rounded bg-permukaan" />
        </div>
        <div className="h-11 w-full animate-pulse rounded-lg bg-permukaan sm:w-48" />
      </div>
    </div>
  );
}

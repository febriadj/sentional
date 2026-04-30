export default function Loading() {
    return (
        <main className="bg-background min-h-screen">
            <div className="mx-auto max-w-5xl space-y-6 px-4 py-10">
                <div className="border-border bg-card animate-pulse rounded-xl border p-6">
                    <div className="flex items-center gap-4">
                        <div className="bg-muted size-16 shrink-0 rounded-full" />
                        <div className="flex-1 space-y-2">
                            <div className="bg-muted h-5 w-40 rounded-md" />
                            <div className="bg-muted h-4 w-28 rounded-md" />
                            <div className="bg-muted h-3 w-24 rounded-md" />
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                    {[0, 1].map((i) => (
                        <div
                            key={i}
                            className="border-border bg-card animate-pulse rounded-xl border p-6"
                        >
                            <div className="bg-muted mb-4 h-4 w-32 rounded-md" />
                            <div className="bg-muted h-52 w-full rounded-lg" />
                        </div>
                    ))}
                </div>

                <div className="grid grid-cols-3 gap-3 lg:grid-cols-6">
                    {Array.from({ length: 6 }).map((_, i) => (
                        <div
                            key={i}
                            className="border-border bg-card animate-pulse rounded-xl border p-4"
                        >
                            <div className="bg-muted mb-3 h-3 w-16 rounded" />
                            <div className="bg-muted h-6 w-12 rounded" />
                        </div>
                    ))}
                </div>

                <div className="border-border bg-card animate-pulse space-y-6 rounded-xl border p-6">
                    <div className="bg-muted h-4 w-44 rounded-md" />
                    <div className="grid grid-cols-3 gap-6">
                        {Array.from({ length: 3 }).map((_, i) => (
                            <div key={i} className="bg-muted h-24 rounded-lg" />
                        ))}
                    </div>
                    <div className="grid grid-cols-2 gap-6">
                        <div className="bg-muted h-32 rounded-lg" />
                        <div className="bg-muted h-32 rounded-lg" />
                    </div>
                    <div className="bg-muted h-20 w-full rounded-lg" />
                </div>
            </div>
        </main>
    );
}

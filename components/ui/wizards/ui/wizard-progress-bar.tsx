export function WizardProgress({ total, current }: { total: number; current: number }) {
    return (
        <div className="flex gap-3 mb-6">
            {[...Array(total)].map((_, i) => (
                <div
                    key={i}
                    className={`h-2 flex-1 rounded-full ${
                        current >= i ? "bg-primary dark:bg-secondary" : "bg-muted"
                    }`}
                />
            ))}
        </div>
    )
}
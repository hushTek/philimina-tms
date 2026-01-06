
export default async function Page ({ params }: { params: Promise<{ ClientID: string }> }) {
    
    const { ClientID } = await params

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">Client { ClientID }</h1>
            <p className="text-muted-foreground">Track and manage client details here.</p>
        </div>
    )
}
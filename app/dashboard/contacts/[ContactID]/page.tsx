
export default async function Page ({ params }: { params: Promise<{ ContactID: string }> }) {
    
    const { ContactID } = await params

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">Contact { ContactID }</h1>
            <p className="text-muted-foreground">Track and manage contact details here.</p>
        </div>
    )
}
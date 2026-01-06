

export default async function Page ({ params }: { params: Promise<{ ApplicationID: string }>  }) { 
    
    const { ApplicationID } = await params  
    
    return (
        <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Application { ApplicationID }</h1>
      <p className="text-muted-foreground">Track and manage loan application details here.</p>
    </div>
    )
}
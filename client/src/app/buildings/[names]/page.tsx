

export default async function BuildingPage({
  params
}: {
  params: Promise<{ names: string }>;
}) 
{
  const { names }  =  await params;
  return (
    <div>
      <header className="navbar">
        <div className="navLeft">
          <h1>{names.replace("-", " ")}</h1>
        </div>
      </header>

      <main>
        <h2>Welcome to {names}</h2>
        <p>Building information will go here.</p>
      </main>
    </div>
  );
}
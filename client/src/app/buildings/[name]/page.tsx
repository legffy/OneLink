export default async function BuildingPage({
  params,
}: {
  params: Promise<{ name: string }>;
}) {
  const { name } = await params;

  const buildingData: Record<string, string> = {
    "darrin-communications-center": "Darrin Communications Center",
    "low-center": "Low Center",
    "russell-sage-laboratory": "Russell Sage Laboratory",
    "pittsburgh-building": "Pittsburgh Building",
    "folsom-library": "Folsom Library",
  };

  const formattedName = buildingData[name];

  if (!formattedName) {
    return <div>Invalid building name</div>;
  }

  return (
    <div>
      <h1>{formattedName}</h1>
      <h2>Welcome to {formattedName}</h2>
    </div>
  );
}
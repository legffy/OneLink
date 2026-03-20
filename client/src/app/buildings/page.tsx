import BuildingCard from "../components/buildingCard";

export default function Campus() {
  return (
    <div>
      <h1>RPI Campus Buildings</h1>

      <BuildingCard
        name="Darrin Communications Center"
        abbreviation="DCC"
        description="Main lecture building at RPI."
        seats={550}
        slug="darrin-communications-center"
        image="bot.png"
      />

      <BuildingCard
        name="Folsom Library"
        abbreviation="FOLSOM"
        description="Primary library on campus."
        seats={900}
        slug="folsom-library"
        image="bot.png"
      />
    </div>
  );
}
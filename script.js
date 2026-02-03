const buildings = [
    { id: 1, name: "Folsom Library", status: "Open" },
    { id: 2, name: "Armory", status: "Closed" },
    { id: 3, name: "Sage Labs", status: "Open" }
];

function renderBuildings() {
    const list = document.getElementById("buildingList");
    list.innerHTML = "";

    buildings.forEach(b => {
        const card = document.createElement("div");
        card.className = "buildingCard";
        card.innerHTML = `
      <h3>${b.name}</h3>
      <p>Status: <strong>${b.status}</strong></p>
    `;
        list.appendChild(card);
    });
}
function showView(name) {
    document.querySelectorAll(".view").forEach(v => v.classList.add("hidden"));
    document.getElementById(`${name}-view`).classList.remove("hidden");
}

document.getElementById("buildingLink").addEventListener("click", () => showView("buildings"));
document.getElementById("mapLink").addEventListener("click", () => showView("map"));
document.getElementById("announcementsLink").addEventListener("click", () => showView("announcements"));

document.addEventListener("DOMContentLoaded", renderBuildings);

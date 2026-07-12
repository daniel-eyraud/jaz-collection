const sheetID = "1uHY6r27bw8AJ-YRA1S9F7Ri_moliZ5SmT1NqnHZ3oR8";
const apiURL = `https://docs.google.com/spreadsheets/d/${sheetID}/gviz/tq?tqx=out:json`;

const collectionContainer = document.getElementById("collection-container");

const cardColor = [
  { background: "var(--color-blue)", color: "var(--color-raisinBlack)" },
  { background: "var(--color-orange)", color: "var(--color-raisinBlack)" },
  { background: "var(--color-brown)", color: "var(--color-bg)" },
  { background: "var(--color-green)", color: "var(--color-bg)" },
  { background: "var(--color-raisinBlack)", color: "var(--color-bg)" },
];

async function populateCollection() {
  // Fetch Google sheet raw data
  const response = await fetch(apiURL);
  const text = await response.text();
  const json = JSON.parse(text.substring(47).slice(0, -2));

  // Get the sheet headers in a string format -> ['nom', 'annee', 'etat', 'commentaire', 'photo'...]
  const headers = json.table.cols.map((col) => col.label.toLowerCase()); // const headers = ["nom", "collection", "annee", "etat",....];

  // Get data for each row in an object format -> {nom: 'TEST', annee: 1900, etat: 'Excellent ', ...}
  const rows = json.table.rows;
  rows.forEach((row, index) => {
    const data = {};
    headers.forEach((header, i) => {
      data[header] = row.c[i]?.v; // -> // data["nom"] = "Réveil Bayard";
    });

    // Cycle through the cardColor array to assign colors to the cards
    const colorIndex = index % cardColor.length;
    // Use a default image if the photo URL is missing so data is either undefined or null
    let photoURL = data["photo principale"] ?? "images/no-photo.webp";
    // Create a card for each row of the data object and populate with values
    const productCard = document.createElement("div");
    productCard.classList.add("product-card", "col-12", "col-md-6", "col-lg-4");
    productCard.innerHTML = `
        <a href = "detail.html?id=${index}">
          <div class="card-body" style="background: ${cardColor[colorIndex].background}; color: ${cardColor[colorIndex].color};">
            <div class="card-image"> 
              <img src="${photoURL}" alt="${data["nom"]}">
            </div>
              <h5 class="card-title">${data["nom"].toUpperCase()}</h5>
          </div>
        </a>  
    `;
    collectionContainer.appendChild(productCard);
  });
}

populateCollection();

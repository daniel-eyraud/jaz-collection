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
  const response = await fetch(apiURL);
  const text = await response.text();
  const json = JSON.parse(text.substring(47).slice(0, -2));
  const rows = json.table.rows;

  rows.forEach((row, index) => {
    const nom = row.c[0].v;
    const collection = row.c[1].v;
    const annee = row.c[2].v;
    const commentaire = row.c[3].v;
    const photo = row.c[4].v;
    const productCard = document.createElement("div");
    const colorIndex = index % cardColor.length;

    let photoURL = photo !== null ? photo : "images/no-photo.webp";

    productCard.classList.add("col-12", "col-md-6", "col-lg-3", "product-card");
    productCard.innerHTML = `
        <div class="card" style="background: ${cardColor[colorIndex].background}; color: ${cardColor[colorIndex].color};">
          <div class="card-image"> 
            <img src="${photoURL}" alt="${nom}">
          </div>
            <div class="card-body">
                <h5 class="card-title">${nom} - ${annee}</h5>
                <h6 class="card-subtitle mb-2">Collection: ${collection}</h6>
                <p class="card-text">${commentaire}</p>
            </div>
        </div>
    `;
    collectionContainer.appendChild(productCard);
  });
}

populateCollection();

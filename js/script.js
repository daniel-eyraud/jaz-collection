const sheetID = "1uHY6r27bw8AJ-YRA1S9F7Ri_moliZ5SmT1NqnHZ3oR8";
const apiURL = `https://docs.google.com/spreadsheets/d/${sheetID}/gviz/tq?tqx=out:json`;

const collectionContainer = document.getElementById("collection-container");

async function populateCollection() {
  const response = await fetch(apiURL);
  const text = await response.text();
  const json = JSON.parse(text.substring(47).slice(0, -2));
  const rows = json.table.rows;

  rows.forEach((row) => {
    const nom = row.c[0].v;
    const collection = row.c[1].v;
    const annee = row.c[2].v;
    const commentaire = row.c[3].v;
    const photo = row.c[4].v;
    const productCard = document.createElement("div");
    productCard.classList.add("product-card");
    productCard.innerHTML = `
    <h2>${nom}</h2>
    <img src="${photo}" alt="${nom}">
    <p class="collection">Collection: ${collection}</p>
    <p class="annee">Année: ${annee}</p>
    <p class="commentaire">Commentaire: ${commentaire}</p>
    `;
    collectionContainer.appendChild(productCard);
  });
}

populateCollection();

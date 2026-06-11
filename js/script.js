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
  const headers = json.table.cols.map((col) => col.label.toLowerCase()); // const headers = ["nom", "collection", "annee", "etat",....];

  rows.forEach((row, index) => {
    const data = {}; // Create an object to hold the data of the table for each row, headers are the keys and the corresponding cell values are the values of the object
    headers.forEach((header, i) => {
      data[header] = row.c[i]?.v;
    });

    const productCard = document.createElement("div");

    const colorIndex = index % cardColor.length; // Cycle through the cardColor array to assign colors to the cards on a rotating basis

    let photoURL =
      data["photo"] !== undefined && data["photo"] !== null
        ? data["photo"]
        : "images/no-photo.webp"; // Use a default image if the photo URL is missing so data is either undefined or null

    productCard.classList.add("col-12", "col-md-6", "col-lg-3", "product-card");
    productCard.innerHTML = `
        <a href = "detail.html?id=${index}">
          <div class="card" style="background: ${cardColor[colorIndex].background}; color: ${cardColor[colorIndex].color};">
            <div class="card-image"> 
              <img src="${photoURL}" alt="${data["nom"]}">
            </div>
              <div class="card-body">
                  <h5 class="card-title">${data["nom"]}</h5>
                  <p class="card-subtitle">${data["annee"] ?? ""}</p>
              </div>
          </div>
        </a>  
    `;
    collectionContainer.appendChild(productCard);
  });
}

populateCollection();

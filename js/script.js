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
    const data = {}; // Create an empty object to hold the data of each row
    // populate the object with the headers as keys and the corresponding cell values as values from each row
    headers.forEach((header, i) => {
      data[header] = row.c[i]?.v;
    });

    const productCard = document.createElement("div");

    const colorIndex = index % cardColor.length; // Cycle through the cardColor array to assign colors to the cards on a rotating basis

    // Use a default image if the photo URL is missing so data is either undefined or null
    let photoURL = data["photo"] ?? "images/no-photo.webp"; // ?? returns the right-hand side operand when the left-hand side operand is null or undefined, otherwise it returns the left-hand side operand

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

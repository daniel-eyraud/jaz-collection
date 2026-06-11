const sheetID = "1uHY6r27bw8AJ-YRA1S9F7Ri_moliZ5SmT1NqnHZ3oR8";
const apiURL = `https://docs.google.com/spreadsheets/d/${sheetID}/gviz/tq?tqx=out:json`;

const params = new URLSearchParams(window.location.search);
const id = params.get("id");

const detailContainer = document.getElementById("detail-container");

async function populateDetail() {
  const response = await fetch(apiURL);
  const text = await response.text();
  const json = JSON.parse(text.substring(47).slice(0, -2));
  const rows = json.table.rows;

  const selectedRow = rows[id]; // get the raw value of the corresponding row (id is the index of the row in the table)

  const headers = json.table.cols.map((col) => col.label.toLowerCase()); // get the headers of the sheet

  const data = {}; // create an empty object to hold the data of the selected row

  // populate the object with the headers as keys and the corresponding cell values as values from selectedRow
  headers.forEach((header, i) => {
    data[header] = selectedRow.c[i]?.v;
  });

  // Get all photo URLs from the data object
  const photos = headers
    .filter((h) => h.includes("photo")) // filter the headers to get only those that include "photo"
    .map((h) => data[h]) //
    .filter((url) => url); // filter out any undefined or null values from the array of photo URLs

  const detailProductCard = document.createElement("div");

  detailProductCard.classList.add("col-12", "detail-product-card");
  detailProductCard.innerHTML = `
    <div class="card">
        <div class="detail-card-image"> 
            ${photos.map((url) => `<img src="${url}" alt="${data["nom"]}">`).join("")}
        </div>
        <div class="detail-card-body">
            <h5 class="detail-card-title">${data["nom"]}</h5>
            <p class="detail-card-text">${`Année: ${data["annee"] ?? ""}`}</p>
            <p class="detail-card-text">${`Collection: ${data["collection"] ?? ""}`}</p>
            <p class="detail-card-text">${`Quelques info: ${data["commentaire"] ?? ""}`}</p>
            <p class="detail-card-text">${`État: ${data["etat"] ?? ""}`}</p>
        </div>
    </div>
    `;
  detailContainer.appendChild(detailProductCard);
}

populateDetail();

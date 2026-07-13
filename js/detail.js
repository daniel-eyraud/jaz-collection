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
    .filter((h) => h.includes("photo")) // keep only header names related to photos → ["photo principale", "photo1", ...]
    .map((h) => data[h]) // replace each header name with its corresponding value (URL) from data → ["url1.jpg", undefined, "url3.jpg", ...]
    .filter((url) => url); // remove empty/undefined values → ["url1.jpg", "url3.jpg", ...]

  const detailProductCard = document.createElement("div");

  detailProductCard.classList.add("col-12", "mb-4");
  detailProductCard.innerHTML = `
    <div class="detail-product-card">
      <div class="row pb-5">
        <div class="detail-card-image col-12 col-md-6">
          <div class="detail-card-image-principale pb-3"><img src="${photos[0]}" alt="${data["nom"]}"></div>
          <div class="detail-card-image-secondaires d-flex gap-3">
            ${photos
              .slice(1)
              .map((url) => `<img src="${url}" alt="${data["nom"]}">`)
              .join("")}
          </div>
        </div>
        <div class="detail-card-info col-12 col-md-6 text-start pt-4">
            <h5 class="detail-card-title">${data["nom"]}</h5>
            <p class="detail-card-text pt-5">${`Année: ${data["annee"] ?? ""}`}</p>
            <p class="detail-card-text pt-3">${`Quelques info: ${data["commentaire"] ?? ""}`}</p>
            <p class="detail-card-text pt-3">${`État: ${data["etat"] ?? ""}`}</p>
            <a href="index.html" class="back pt-5" aria-label="Retour page d'accueil">&lt; Retour</a>
        </div>
      </div>
    </div>
  `;
  detailContainer.appendChild(detailProductCard);
}

populateDetail();

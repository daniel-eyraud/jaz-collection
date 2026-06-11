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
  const selectedRow = rows[id];
  const headers = json.table.cols.map((col) => col.label.toLowerCase()); // const headers = ["nom", "collection", "annee", "etat",....];
  const data = {};

  headers.forEach((header, i) => {
    data[header] = selectedRow.c[i]?.v;
  });

  const productCard = document.createElement("div");

  let photoURL =
    data["photo"] !== undefined && data["photo"] !== null
      ? data["photo"]
      : "images/no-photo.webp"; // Use a default image if the photo URL is missing so data is either undefined or null

  productCard.classList.add("col-6", "product-card");
  productCard.innerHTML = `
    <div class="card">
        <div class="card-image"> 
            <img src="${photoURL}" alt="${data["nom"]}">
            </div>
              <div class="card-body">
                <h5 class="card-title">${data["nom"]}</h5>
                <p class="card-text">${data["annee"] ?? ""}</p>
                <p class="card-text">${data["collection" ?? ""]}</p>
                <p class="card-text">${data["commentaire"] ?? ""}</p>
                <p class="card-text">${data["etat"] ?? ""}</p>
              </div>
        </div>
    `;
  detailContainer.appendChild(productCard);
}

populateDetail();

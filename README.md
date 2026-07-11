# Daniel Collection Réveil JAZ

This project is a static website showcasing a vintage JAZ alarm clock collection. Content is dynamically rendered using vanilla JavaScript, fetching data from a Google Sheets spreadsheet via its API — allowing the collector to manage his collection independently without touching the code.

## Live Demo

[Link if deployed]

## Tech Stack

- Frontend: HTML, CSS, JavaScript (vanilla)
- Backend: None (static site)
- Data Source: Google Sheets (via Google Visualization API)

## Development Process

### Phase 1 — Setup: Identify and store key elements

Before writing any logic, identify what the code needs to access and store these as constants.

**Generic:**

```javascript
const containerElement = document.getElementById("container-id");
```

**Project-specific (Google Sheets):**

```javascript
const sheetID = "your-google-sheet-id";
const apiURL = `https://docs.google.com/spreadsheets/d/${sheetID}/gviz/tq?tqx=out:json`;
```

---

### Phase 2 — Fetch: Retrieve data from the API

The goal is to retrieve data from an external source. Since network requests take time, JavaScript needs to wait for the response before continuing — this is handled with `async/await`.

**Generic pattern:**

```javascript
async function populateList() {
  const response = await fetch(url); // sends the request and waits for the response
  const text = await response.text(); // opens the response as a readable string
  const json = JSON.parse(text); // converts the string into a usable JS object
}
populateList();
```

**Google Sheets specific:** the API returns a string with 47 parasitic characters at the start and 2 at the end that must be removed before parsing:

```javascript
const json = JSON.parse(text.substring(47).slice(0, -2));
```

The parsed object looks like this:

```javascript
{ status: "ok", table: { cols: [...], rows: [...] } }
```

The data lives inside `table` — `cols` contains the headers, `rows` contains the data.

---

### Phase 3 — Structure: Extract and organise data from the API response

The API response contains raw data that needs to be restructured into usable objects before generating any HTML.

#### 3.1 — Extract rows and headers

**Generic:**

```javascript
const rows = json.table.rows;
const headers = json.table.cols.map((col) => col.label.toLowerCase());
// headers = ["nom", "collection", "annee", "etat", "commentaire", "photo"...]
```

> **Why `.toLowerCase()`?** Normalising header names avoids case-sensitivity bugs — `data["Nom"]` and `data["nom"]` are two different keys in JavaScript.

> **Why dynamic headers instead of hardcoded indexes?** Using `row.c[0]`, `row.c[1]`... breaks silently if columns are added, removed or reordered in the sheet. Dynamic mapping makes the code resilient to sheet structure changes.

---

#### 3.2 — Build a `data` object for each row

For each row, we create an empty object and populate it by looping through the headers. This gives us named access to each cell value instead of positional access.

**Generic:**

```javascript
rows.forEach((row) => {
  const data = {}; // reset for each row

  headers.forEach((header, i) => {
    data[header] = row.c[i]?.v; // e.g. data["nom"] = "Réveil Bayard"
  });

  // data is now: { nom: "Réveil Bayard", annee: 1955, etat: "Excellent", ... }
  console.log(data); // test before moving to Phase 4
});
```

> **Why `?.v`?** Empty cells in Google Sheets return `null` instead of `{ v: null }`. The optional chaining operator `?.` prevents a crash when trying to read `.v` on a `null` value — it returns `undefined` instead.

> **Why `const data = {}` inside the loop?** Each row needs its own fresh object. Declaring it inside the `forEach` resets it at every iteration.

---

### Phase 4 — Generate HTML: Create and inject elements into the DOM

At this point `data` is a structured object for each row. The goal is to create an HTML element, populate it with the data, and append it to the container.

#### 4.1 — Create the HTML element

**Generic:**

```javascript
const product = document.createElement("div");
```

> This creates an empty `<div>` in memory — it is not yet visible in the page.

---

#### 4.2 — Populate the element with data

**Generic:**

```javascript
product.innerHTML = `${data["nom"]} - ${data["annee"]}`;
```

> `innerHTML` injects HTML directly into the element. Template literals (`\`...\``) allow embedding JavaScript expressions with `${}`.

> `data["nom"]` uses bracket notation to access a value by key — equivalent to `data.nom` but necessary when the key is a variable or contains special characters.

---

#### 4.3 — Append the element to the container

**Generic:**

```javascript
collectionContainer.appendChild(product);
```

> `appendChild` adds the element to the DOM inside the target container. Until this line, the element exists only in memory.

---

> **Full pattern for Phase 4:**

```javascript
rows.forEach((row) => {
  // ... Phase 3 data building ...

  const product = document.createElement("div");
  product.innerHTML = `${data["nom"]} - ${data["annee"]}`;
  collectionContainer.appendChild(product);
});
```

---

## Areas for Improvement

- Style Detail Page / refine Main page (text + add one more set of colour?)
  - Add Carroussel option for images
- Add a button to go back to main page from the detail page
- Add a About me page?
- Add a dynamic header with Menu
- Refine style for different screen sizes

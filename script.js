const form = document.getElementById("form");
const searchBar = document.getElementsByClassName("search-bar");

form.addEventListener("submit", (event) => {
  event.preventDefault();
  getZipCodeDetails(event);
});

async function getZipCodeDetails(event) {
  removeLastResults();

  const formData = new FormData(event.target);
  const zipCode = formData.get("zip-code");

  if (zipCode === "") {
    displayResults({ errorMsg: "Please enter a valid US Zip Code" });
    return;
  }

  const zipCodeDetails = await retriveZipCodeDetails(zipCode);

  const paramsToDisplay = zipCodeDetails
    ? { zipCodeDetails }
    : { errorMsg: "Please enter a valid US ZIP Code" };
  displayResults(paramsToDisplay);
}

async function retriveZipCodeDetails(zipCode) {
  const baseUrl = "http://api.zippopotam.us/us";
  try {
    const result = await fetch(`${baseUrl}/${zipCode}`);
    const data = await result.json();
    return Object.keys(data).length > 0 ? data : null;
  } catch (error) {
    console.error("Error fetching ZIP code details:", error);
    return null;
  }
}

function removeLastResults() {
  const resultContainer = document.getElementById("result-container");
  if (resultContainer) resultContainer.remove();
  searchBar[0].classList.remove("error-color");
}

function displayResults({ errorMsg, zipCodeDetails }) {
  const appContainer = document.getElementById("app-container");
  const resultContainer = createElement({
    type: "div",
    className: "result-container",
    id: "result-container",
  });
  let resultChild;

  if (errorMsg) {
    resultChild = createElement({
      type: "p",
      className: "error-color error-msg",
      textContent: errorMsg,
    });
    searchBar[0].classList.add("error-color");
  }

  if (zipCodeDetails) {
    console.log(zipCodeDetails);
    resultChild = createElement({
      type: "div",
      className: "cards-detail-container",
    });
    createDetailsCard({ parent: resultChild, zipCodeDetails });
    createDetailsCard({ parent: resultChild, zipCodeDetails });
    createDetailsCard({ parent: resultChild, zipCodeDetails });
    createDetailsCard({ parent: resultChild, zipCodeDetails });
  }

  if (resultChild) {
    resultContainer.appendChild(resultChild);
    appContainer.appendChild(resultContainer);
  }
}

function createDetailsCard({ parent, zipCodeDetails }) {
  const {
    places,
    "post code": postCode,
    country,
    "country abbreviation": countryAb,
  } = zipCodeDetails;

  places.forEach(
    ({
      "place name": placeName,
      longitude,
      latitude,
      state,
      "state abbreviation": stateAb,
    }) => {
      const detailCard = createElement({
        type: "div",
        className: "detail-card",
      });

      const placeTitle = createElement({
        type: "p",
        className: "place-title",
        textContent: `${postCode} - ${placeName}, ${state} (${stateAb})`,
      });

      const stateImg = createElement({
        type: "img",
        src: `./states/${stateAb}.svg`,
        alt: `${postCode} map`,
        className: "state-img",
      });

      const detailsContainer = createElement({
        type: "div",
        className: "details-container",
      });

      detailsContainer.append(
        createDetailRow("Country", `${country} (${countryAb})`),
        createDetailRow("Latitude", latitude),
        createDetailRow("Longitude", longitude)
      );

      detailCard.appendChild(placeTitle);
      detailCard.appendChild(stateImg);
      detailCard.appendChild(detailsContainer);
      parent.appendChild(detailCard);
    }
  );
}

function createDetailRow(label, value) {
  const row = createElement({ type: "div", className: "detail-row" });
  const labelEl = createElement({
    type: "p",
    textContent: label,
    className: "detail-label",
  });
  const valueEl = createElement({ type: "p", textContent: value });
  row.append(labelEl, valueEl);
  return row;
}

function createElement({ type, ...attributes }) {
  const element = document.createElement(type);
  Object.entries(attributes).forEach(([key, value]) => {
    if (value) element[key] = value;
  });
  return element;
}

const form = document.getElementById("form");
const searchBar = document.getElementsByClassName("search-bar");
const spinner = document.getElementById("spinner");
const zipcodeInput = document.getElementById("zip-code-input");

form.addEventListener("submit", getZipCodeDetails);

async function getZipCodeDetails(event) {
  event.preventDefault();
  removeLastResults();

  const formData = new FormData(event.target);
  const zipCode = formData.get("zip-code");

  if (zipCode === "") {
    displayResults({ errorMsg: "Please enter US Zip Code" });
    return;
  }

  spinner.classList.add("show-element");
  const zipCodeDetails = await retriveZipCodeDetails(zipCode);
  spinner.classList.remove("show-element");

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
  let resultChild;

  if (errorMsg) {
    resultChild = `<p class="error-color error-msg">${errorMsg}</p>`;
    searchBar[0].classList.add("error-color");
  }

  if (zipCodeDetails) {
    resultChild = createDetailsCard({ zipCodeDetails });

    zipcodeInput.value = "";
  }

  if (resultChild) {
    appContainer.innerHTML += `
      <div class="result-container" id="result-container">
        ${resultChild}
      </div>
    `;
  }
}

function createDetailsCard({ zipCodeDetails }) {
  const {
    places,
    "post code": postCode,
    country,
    "country abbreviation": countryAb,
  } = zipCodeDetails;

  const detailsCards = places.map(
    ({
      "place name": placeName,
      longitude,
      latitude,
      state,
      "state abbreviation": stateAb,
    }) => {
      return `
        <div class="detail-card">
          <p class="place-title">${postCode} - ${placeName}, ${state} (${stateAb})</p>
          <img src="./states/${stateAb}.svg" alt="${postCode} map" class="state-img">
          <div class="details-container">
            <div class="detail-row">
              <p class="detail-label">Country</p>
              <p>${country} (${countryAb})</p>
            </div>
            <div class="detail-row">
              <p class="detail-label">Latitude</p>
              <p>${latitude}</p>
            </div>
            <div class="detail-row">
              <p class="detail-label">Longitude</p>
              <p>${longitude}</p>
            </div>
          </div>
        </div>
      `;
    }
  );
  return `
    <div class="cards-detail-container">
     ${detailsCards.join("")}
    </div>
  `;
}

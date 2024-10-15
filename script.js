const form = document.getElementById("form");
const searchBar = document.getElementsByClassName("search-bar");

form.addEventListener("submit", (event) => {
  event.preventDefault();
  getZipCodeDetails(event);
});

async function getZipCodeDetails(event) {
  const formData = new FormData(event.target);
  const zipCode = formData.get("zip-code");

  if (zipCode === "") {
    return;
  }

  const zipCodeDetails = await retriveZipCodeDetails(zipCode);

  console.log("Zip Code Details", zipCodeDetails);
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

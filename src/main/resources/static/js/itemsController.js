class Controller {
  constructor(currentId = 0, data = []) {
    this.products = data !== null && data;
    this.currentId = currentId;
    this.storeDataToLocalStorage(data);
  }

  storeDataToLocalStorage(data) {
    if (!localStorage.getItem("productList")) {
      const sampleItems = [];
      if (data.length > 0) {
        for (let index = 0; index < this.currentId; index++) {
          sampleItems.push({
            id: index + 1, // increment the id
            name: data[index].name,
            ageYear: data[index].ageYear,
            ageMonths: data[index].ageMonths,
            type: data[index].type,
            breed: data[index].breed.name,
            imagePath: data[index].imagePath,
            gender: data[index].gender,
            color: data[index].color,
            licensed: data[index].isLicensed,
            hdbApproved: data[index].isApproved,
            spaying: data[index].isNeutered,
            training: data[index].training,
            temperament: data[index].temperament,
          });
        }
      }
      localStorage.setItem("productList", JSON.stringify(sampleItems));
    }
  }

  loadDataFromLocalStorage() {
    const storageItems = localStorage.getItem("productList");
    if (storageItems) {
      const products = JSON.parse(storageItems);
      this.displayCart(products);
      this.setupFilterListeneers();
    } else {
      this.fetchAndDisplayAllPets();
    }
  }

  async fetchAndDisplayAllPets() {
    try {
      let response = await fetch("/pets/all");
      let data = await response.json();
      this.products = data;
      this.displayCart(data);
      this.setupFilterListeneers();
    } catch (error) {
      console.error("Error fetching data from API: ", error);
    }
  }

  displayCart(data) {
    const unorderedList = document.querySelector(".album-container");
    unorderedList.innerHTML = "";
    if (!unorderedList) {
      return;
    }

    // (A)
    if (!data.length) {
      unorderedList.style.gridTemplateColumns = "none";
      let listItem = document.createElement("li");
      listItem.innerHTML = `<span class=\"no-products\">No listing available.</span>`;
      unorderedList.appendChild(listItem);
      return;
    }

    // (B)
    for (let index = 0; index < data.length; index++) {
      let ageInfo = "";
      if (data[index].ageYear > 0) {
        ageInfo += `${data[index].ageYear} ${
          data[index].ageYear === 1 ? "year" : "years"
        }`;
      }

      if (data[index].ageMonths > 0) {
        if (ageInfo.length > 0) {
          ageInfo += " ";
        }
        ageInfo += `${data[index].ageMonths} ${
          data[index].ageMonths === 1 ? "month" : "months"
        }`;
      }

      let listItem = document.createElement("div");
      listItem.className = `col pet-item`;
      listItem.innerHTML = `
            <div class="card shadow-sm adoption-card filterDiv ${
              data[index].type
            }" 
            data-type="${data[index].type}" 
            data-gender="${data[index].gender}" 
            data-hdbapproved="${data[index].isApproved}">
            <img class="bd-placeholder-img card-img-top album-card-img" width="100%" height="225" 
            src="/public/uploads/${data[index].imagePath}"/>
                    <div class="card-body album-card-body">
                        <h2>${data[index].name}</h2>
                        <p>${ageInfo} old // ${data[index].gender}</p>
                        <div class="d-flex justify-content-between align-items-center">
                            <button type="button" class="btn btn-primary album-card-button" data-bs-toggle="modal" data-bs-target="#exampleModal${
                              data[index].id
                            }" onclick="showModal(${data[index].id})">
                            Find Out More</button>
                            <div class="modal fade" id="exampleModal${
                              data[index].id
                            }" tabindex="-1" aria-labelledby="exampleModalLabel${
        data[index].id
      }" aria-hidden="true">
                            <div class="modal-dialog">
                              <div class="modal-content">
                                <div class="modal-header">
                                  <h1 class="modal-title fs-7" id="staticBackdropLabel${
                                    data[index].id
                                  }">Meet ${data[index].name}!</h1>
                                  <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                </div>
                                <div class="modal-body">
                                  <div class="modal-body-image text-center">
                                    <img src="/public/uploads/${
                                      data[index].imagePath
                                    }" class="img-thumbnail mx-auto d-block modal-list-img" alt="">
                                  </div>
                                  <ul class="modal-list">
                                  <p class="modal-list-bio"><i>"${
                                    data[index].temperament
                                  }"</i></p>  
                                  <li class="modal-list-items"><strong>Name: </strong>${
                                    data[index].name
                                  }</li>
                                    <li class="modal-list-items"><strong>Age: </strong>${ageInfo} old</li>
                                    <li class="modal-list-items"><strong>Gender: </strong>${
                                      data[index].gender
                                    }</li>
                                    <li class="modal-list-items"><strong>Breed: </strong>${
                                      data[index].breed.name
                                    }</li>
                                    <li class="modal-list-items"><strong>Color: </strong>${
                                      data[index].color
                                    }</li>
                                    <li class="modal-list-items"><strong>NParks Animal & Veterinary Service Licensed: </strong>${
                                      data[index].isLicensed ? "Yes" : "No"
                                    }</li>
                                    <li class="modal-list-items"><strong>HDB-Approved: </strong>${
                                      data[index].isApproved ? "Yes" : "No"
                                    }</li>
                                    <li class="modal-list-items"><strong>Spaying/Neutering: </strong>${
                                      data[index].isNeutered ? "Yes" : "No"
                                    }</li>
                                    <li class="modal-list-items"><strong>Training: </strong>${
                                      data[index].training
                                    }</li>
                                  </ul>
                                  <button type="button" class="btn btn-primary album-card-button" data-bs-toggle="modal" data-bs-target="#staticBackdrop">
                                    <a href="appointment.html" class="modal-button-appointment" target="_blank">Book Your Appointment Now!</a>
                                  </button>
                                </div>
                                <div class="modal-footer">
                                  <button type="button" class="btn btn-secondary modal-button" data-bs-dismiss="modal">Close</button>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                    </div>
                </div>
            `;
      unorderedList.appendChild(listItem);
    }
  }

  addProduct(
    name,
    ageYear,
    ageMonths,
    type,
    breed,
    imagePath,
    gender,
    color,
    isLicensed,
    isApproved,
    isNeutered,
    training,
    temperament
  ) {
    const storageItems = localStorage.getItem("productList");

    // (A)
    if (storageItems) {
      const products = JSON.parse(storageItems);
      const product = {
        id: products.length + 1,
        name: name,
        ageYear: ageYear,
        ageMonths: ageMonths,
        type: type,
        breed: breed.name,
        imagePath: imagePath,
        gender: gender,
        color: color,
        isLicensed: isLicensed,
        isApproved: isApproved,
        isNeutered: isNeutered,
        training: training,
        temperament: temperament,
      };
      products.push(product);
      localStorage.setItem("productList", JSON.stringify(products));
      return;
    }

    // (B)
    const setId = !storageItems ? 1 : storageItems.length++;

    const product = {
      id: setId, // this.currentId++,
      name: name,
      ageYear: ageYear,
      ageMonths: ageMonths,
      type: type,
      breed: breed.name,
      imagePath: imagePath,
      gender: gender,
      color: color,
      isLicensed: isLicensed,
      isApproved: isApproved,
      isNeutered: isNeutered,
      training: training,
      temperament: temperament,
    };
    this.products.push(product);
    localStorage.setItem("productList", JSON.stringify(this.products));
  }

  setupFilterListeneers() {
    const typeFilter = document.getElementById("pawtnerTypeFilter");
    const genderFilter = document.getElementById("pawtnerGenderFilter");
    const hdbApprovedFilter = document.getElementById(
      "pawtnerHDBApprovedFilter"
    );
    const clearFilterButton = document.querySelector(".clear-filter-button");

    clearFilterButton.addEventListener("click", function () {
      productsController.fetchAndDisplayAllPets();
      typeFilter.value = "All";
      genderFilter.value = "All";
      hdbApprovedFilter.value = "All";
    });

    const callApi = () => {
      const filters = [
        { name: "type", value: typeFilter.value },
        { name: "gender", value: genderFilter.value },
        {
          name: "isApproved",
          value:
            hdbApprovedFilter.value === "Yes"
              ? true
              : hdbApprovedFilter.value === "No"
              ? false
              : null,
        },
      ];

      const validFilters = filters.filter(
        (filter) => filter.value !== "All" && filter.value !== null
      );

      const apiUrl =
        "/pets/filter?" +
        validFilters
          .map((filter) => `${filter.name}=${filter.value}`)
          .join("&");

      fetch(apiUrl)
        .then((response) => response.json())
        .then((data) => {
          this.displayCart(data);
        })
        .catch((error) => {
          console.error("Error fetching data:", error);
        });
    };

    typeFilter.addEventListener("change", callApi);
    genderFilter.addEventListener("change", callApi);
    hdbApprovedFilter.addEventListener("change", callApi);
  }
}

document.addEventListener("DOMContentLoaded", function () {
  function showModal(productId) {
    // Use the product ID to open the correct modal
    const modalId = `#exampleModal${productId}`;
    $(modalId).modal("show");
  }

  var data = [];

  productsController = new Controller(data.length, data);
  productsController.fetchAndDisplayAllPets();
});

var data = [];

// Function to fetch pet ID by name
// function getPetIdByName(petName) {
//   return petsApiService.getPetIdByName(petName);
// }

/*Storing and Updating Data: The Controller class is responsible for handling the data, which includes products or pets. 
This data is passed as an array to the constructor and is stored in the this.products property of the class. 
This setup allows the Controller to manage and manipulate this data throughout its lifecycle.*/
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
            id: index + 1,
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

  displayCart(data) {
    const unorderedList = document.querySelector(".album-container");
    if (!data.length) {
      unorderedList.style.gridTemplateColumns = "none";
      let listItem = document.createElement("li");
      listItem.innerHTML = `<span class=\"no-products\">No listing available.</span>`;
      unorderedList.appendChild(listItem);
      return;
    }

    for (let index = 0; index < data.length; index++) {
      const petName = data[index].name;

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
            <div class="card shadow-sm adoption-card filterDiv ${data[index].type}" 
              data-type="${data[index].type}" 
              data-gender="${data[index].gender}" 
              data-hdbapproved="${data[index].isApproved}">
              <img class="bd-placeholder-img card-img-top album-card-img" width="100%" height="225" 
              src="/uploads/${data[index].imagePath}"/>
              <div class="card-body album-card-body">
                <h2>${data[index].name}</h2>
                <p>${ageInfo} old // ${data[index].gender}</p>
                <div class="d-flex justify-content-between align-items-center">
                  <button type="button" class="btn btn-primary update-button" data-petid="${data[index].id}">
                    Update
                  </button>
                  <button type="button" class="btn btn-danger" onClick="handleDeleteButtonClick('${petName}')">
                    Delete
                  </button>
                </div>
              </div>
            </div>`;
      unorderedList.appendChild(listItem);
    }
    handleUpdateButtonClick();
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
    licensed,
    hdbApproved,
    spaying,
    training,
    temperament
  ) {
    const storageItems = localStorage.getItem("productList");
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
        isLicensed: licensed,
        isApproved: hdbApproved,
        isNeutered: spaying,
        training: training,
        temperament: temperament,
      };
      products.push(product);
      localStorage.setItem("productList", JSON.stringify(products));
      return;
    }
    const setId = !storageItems ? 1 : storageItems.length++;
    const product = {
      id: setId,
      name: name,
      ageYear: ageYear,
      ageMonths: ageMonths,
      type: type,
      breed: breed.name,
      imagePath: imagePath,
      gender: gender,
      color: color,
      isLicensed: licensed,
      isApproved: hdbApproved,
      isNeutered: spaying,
      training: training,
      temperament: temperament,
    };
    this.products.push(product);
    localStorage.setItem("productList", JSON.stringify(this.products));
  }
}

const productsController = new Controller(data.length, data);

async function fetchData() {
  const data = await petsApiService.getAllPets();
  productsController.displayCart(data);
}

function handleDeleteButtonClick(petName) {
  petsApiService.getPetIdByName(petName)
    .then((petId) => {
      if (!petId) {
        alert("Pet not found.");
        return;
      }

      const deleteModal = new bootstrap.Modal(
        document.getElementById("deleteModal")
      );
      deleteModal.show();

      const confirmDeleteBtn = document.getElementById("confirmDeleteBtn");
      confirmDeleteBtn.addEventListener("click", () => {
        deleteModal.hide();
        petsApiService.deletePet(petId);
      });

      const cancelDeleteBtn = document.getElementById("cancelDeleteBtn");
      cancelDeleteBtn.addEventListener("click", () => {
        deleteModal.hide();
      });
    })
    .catch((error) => {
      console.error("Error: ", error);
      alert("An error occurred while fetching the pet. Please try again.");
    });
}

// Close the modal if the user clicks outside of it
window.addEventListener("click", (event) => {
  const deleteModal = document.getElementById("deleteModal");
  if (event.target === deleteModal) {
    deleteModal.style.display = "none";
  }
});

function handleUpdateButtonClick() {
  const updateButtons = document.querySelectorAll(".update-button");
  updateButtons.forEach((button) => {
    button.addEventListener("click", function () {
      const petId = this.getAttribute("data-petid");
      const url = `create-update-pet-form.html?id=${petId}`;
      window.open(url, "_blank");
    });
  });
}

document.addEventListener("DOMContentLoaded", function () {
  fetchData();
});

// Function to fetch pet details and populate form fields
async function fetchPetDetails(petId) {
  let petDetails = await petsApiService.getPetDetails(petId);
  populateFormFields(petDetails);

  const pageTitle = document.getElementById("pageTitle");
  const formHeader = document.getElementById("formHeader");
  if (petId) {
    pageTitle.innerText = "Update Pet";
    formHeader.innerText = `Update Details of ${pet.name}`;
  }
}

// Function to populate form fields with fetched pet details
function populateFormFields(pet) {
  document.getElementById("pawtnerName").value = pet.name || "";
  document.getElementById("pawtnerAgeYear").value = pet.ageYear || "";
  document.getElementById("pawtnerAgeMonths").value = pet.ageMonths || "";
  document.getElementById("pawtnerColour").value = pet.color || "";
  document.getElementById("pawtnerTraining").value = pet.training || "";
  document.getElementById("pawtnerTemperament").value = pet.temperament || "";

  if (pet.gender) {
    document.querySelector(
      `input[name="pawtnerGender"][value="${pet.gender}"]`
    ).checked = true;
  }

  const pawtnerTypeDropdown = document.getElementById("pawtnerType");
  pawtnerTypeDropdown.value = pet.type || "";
  if (pet.type && pet.breed) {
    fetchBreeds(pet.type, pet.breed.id);
  }

  setBooleanField("pawtnerAVSLicensed", pet.isLicensed);
  setBooleanField("pawtnerHDBApproved", pet.isApproved);
  setBooleanField("pawtnerSpayNeuter", pet.isNeutered);

  const imagePreview = document.getElementById("imagePreview");
  if (imagePreview) {
    if (pet.imagePath) {
      const imagePath = `/public/uploads/${encodeURIComponent(pet.imagePath)}`;
      imagePreview.src = imagePath;
    } else {
      imagePreview.src = "/images/create-pet-image-placeholder.png";
    }
  }
}

// Function to set radio button values
function setBooleanField(fieldName, value) {
  const fieldToSet = document.querySelector(
    `input[name="${fieldName}"][value="${value ? "Yes" : "No"}"]`
  );
  if (fieldToSet) {
    fieldToSet.checked = true;
  }
}

// Function to fetch and populate breeds
async function fetchBreeds(petType, selectedBreedId) {
  const breeds = await petsApiService.getBreeds(petType);
  breeds.sort((a, b) => a.name.localeCompare(b.name));
  populateBreedDropdown(breeds, selectedBreedId);
}

// Function to populate the breed dropdown
function populateBreedDropdown(breeds, selectedBreedId) {
  const pawtnerBreedDropdown = document.getElementById("pawtnerBreed");
  pawtnerBreedDropdown.innerHTML = "<option selected>Choose...</option>";
  breeds.forEach(function (breed) {
    const option = document.createElement("option");
    option.value = breed.id;
    option.text = breed.name;
    option.selected = breed.id === selectedBreedId;
    pawtnerBreedDropdown.appendChild(option);
  });
}

document.addEventListener("DOMContentLoaded", function () {
  var pawtnerTypeDropdown = document.getElementById("pawtnerType");
  var pawtnerBreedDropdown = document.getElementById("pawtnerBreed");

  if (pawtnerTypeDropdown && pawtnerBreedDropdown) {
    pawtnerTypeDropdown.addEventListener("change", function () {
      var selectedOption =
        pawtnerTypeDropdown.options[pawtnerTypeDropdown.selectedIndex].value;
      pawtnerBreedDropdown.disabled = !(
        selectedOption === "Cats" || selectedOption === "Dogs"
      );
      if (!pawtnerBreedDropdown.disabled) {
        fetchBreeds(selectedOption);
      }
    });
  }

  populateAgeDropdowns();
  setupTextInputValidation();
  loadPetIdFromUrl();
});

function populateAgeDropdowns() {
  populateDropdown("pawtnerAgeYear", 1, 10);
  populateDropdown("pawtnerAgeMonths", 1, 11);
}

function populateDropdown(elementId, start, end) {
  const dropdown = document.getElementById(elementId);
  for (let i = start; i <= end; i++) {
    const option = document.createElement("option");
    option.textContent = i;
    dropdown.appendChild(option);
  }
}

function setupTextInputValidation() {
  const fieldsToValidate = [
    "pawtnerName",
    "pawtnerColour",
    "pawtnerTemperament",
    "pawtnerTraining",
  ];
  fieldsToValidate.forEach(function (fieldId) {
    const inputField = document.getElementById(fieldId);
    inputField.addEventListener("input", function () {
      this.value = this.value.replace(/[^A-Za-z\s\'!.-;]/g, "");
    });
  });
}

function loadPetIdFromUrl() {
  const urlParams = new URLSearchParams(window.location.search);
  const petId = urlParams.get("id");
  if (petId) {
    document.getElementById("petId").value = petId;
    fetchPetDetails(petId);
  }
}

function previewImage() {
  var fileInput = document.getElementById("pawtnerImage");
  var preview = document.getElementById("imagePreview");
  if (fileInput.files && fileInput.files[0]) {
    var file = fileInput.files[0];
    var validExtensions = ["jpg", "jpeg", "png"];
    var fileExtension = file.name.split(".").pop().toLowerCase();
    var isValidExtension = validExtensions.includes(fileExtension);
    var isValidSize = file.size <= 5 * 1024 * 1024; // 5MB
    if (isValidExtension && isValidSize) {
      var reader = new FileReader();
      reader.onloadend = function () {
        preview.src = reader.result;
        preview.style.display = "block";
      };
      reader.readAsDataURL(file);
    } else {
      handleInvalidFile(fileInput, preview);
    }
  } else {
    resetPreviewImage(preview);
  }
}

function handleInvalidFile(fileInput, preview) {
  alert(
    "Invalid file. Please upload a valid image file (JPG, JPEG, or PNG) with a size less than 5MB."
  );
  fileInput.value = "";
  resetPreviewImage(preview);
}

function resetPreviewImage(preview) {
  preview.src = "images/create-pet-image-placeholder.png";
  preview.style.display = "block";
}

const newProductForm = document.querySelector("#createPetForm");
newProductForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  window.scrollTo(0, 0);

  // Create FormData from the form
  const formData = new FormData(event.target);

  // Append the image file to formData if available
  const fileInput = document.querySelector("#pawtnerImage");
  if (fileInput.files.length > 0) {
    const file = fileInput.files[0];
    formData.append("pawtnerImage", file);
  }

  // Check if petId exists and append it to formData if it does
  const petId = document.getElementById("petId").value;
  if (petId) {
    formData.append("petId", petId);
  }

  // Prepare URL and method for the request
  const method = petId ? "PUT" : "POST";
  const url = petId
    ? `http://localhost:8080/pets/update/${petId}`
    : "http://localhost:8080/pets/";

  // customise message based on request method
  const toastBody = document.querySelector(".create-pet-toast-header");
  if (method === "PUT") {
    toastBody.innerHTML = "Pet updated successfully!";
  } else if (method === "POST") {
    toastBody.innerHTML = "Pet added successfully!";
  }

  // Perform the fetch request
  try {
    const response = await fetch(url, { method: method, body: formData });
    if (response.ok) {
      handleSuccessfulSubmission(petId, event.target);
    } else {
      console.error("Failed to process pet. Response:", response);
    }
  } catch (error) {
    console.error("Error during fetch:", error);
  }
});

function handleSuccessfulSubmission(petId, form) {
  form.reset();
  resetPreviewImage(document.getElementById("imagePreview"));
  displayToast();
}

function displayToast() {
  var toastEl = document.querySelector(".toast");
  var toast = new bootstrap.Toast(toastEl);
  toast.show();
}

// var productAddedToast = document.querySelector(".toast");
// productAddedToast.addEventListener("hidden.bs.toast", function () {
//   window.open("adoption.html", "_self");
// });

function setRequiredForImage() {
  const petId = document.getElementById("petId").value;
  const imageInput = document.getElementById("pawtnerImage");

  // If petId exists, it's an update, so image is not required.
  // Otherwise, it's a new pet creation, so image is required.
  if (petId) {
    imageInput.removeAttribute("required");
  } else {
    imageInput.setAttribute("required", "");
  }
}

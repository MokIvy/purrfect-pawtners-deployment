// Animation for volunteer page on the data points
document.addEventListener("DOMContentLoaded", function () {});
// Set the maximum value for each rectangle
const maxValues = {
  rectangle1: 57,
  rectangle2: 34,
  rectangle3: 98,
};

// Function to populate the number in a single rectangle
function populateRectangleNumber(rectangleId) {
  const rectangle = document.getElementById(rectangleId);
  const numberElement = rectangle.querySelector(".number");
  let count = 0;
  const maxX = maxValues[rectangleId];
  const interval = maxX / 500; // Adjust the interval for a smoother animation

  const animation = setInterval(() => {
    if (count <= maxX) {
      numberElement.textContent = count.toFixed(0);
      count += 1;
    } else {
      clearInterval(animation);
    }
  }, 80);
}

// Call the populateRectangleNumber function for each rectangle
window.addEventListener("load", () => {
  populateRectangleNumber("rectangle1");
  populateRectangleNumber("rectangle2");
  populateRectangleNumber("rectangle3");
});

// setTimeout for newsletter subscription message
const errorResponse = document.querySelector("#mce-error-response");
const successResponse = document.querySelector("#mce-success-response");
const emailInput = document.querySelector("#mce-EMAIL");

function hideResponseMessage() {
  if (errorResponse) {
    errorResponse.style.display = "none";
  }
  if (successResponse) {
    successResponse.style.display = "none";
  }
}

if (emailInput) {
  emailInput.addEventListener("input", () => {
    hideResponseMessage();
    clearTimeout(timeoutID);
    timeoutID = setTimeout(hideResponseMessage, 5000);
  });

  let timeoutID;
}

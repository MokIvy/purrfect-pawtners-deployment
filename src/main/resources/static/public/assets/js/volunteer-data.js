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

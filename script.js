/* eslint-disable no-alert */

/**************
 *   SLICE 1
 **************/

function updateCoffeeView(coffeeQty) {
  const coffeeCounter = document.querySelector("#coffee_counter");
  coffeeCounter.innerText = coffeeQty;

  return coffeeCounter;
}

function clickCoffee(data) {
  //adding 1 for every click and then add to DOM using above func
  data.coffee += 1;
  updateCoffeeView(data.coffee);
  renderProducers(data);
}

/**************
 *   SLICE 2
 **************/

function unlockProducers(producers, coffeeCount) {
  producers.forEach((producer) => {
    if (coffeeCount >= producer.price / 2) {
      producer.unlocked = true;
    }
  });
}

function getUnlockedProducers(data) {
  //we are now filtering out only producers that are currently unlocked to save for later.
  const filtered = data.producers.filter(
    (producer) => producer.unlocked === true
  );
  return filtered;
}

function makeDisplayNameFromId(id) {
  //we are massaging the id values, removing the _ and capitalizing the first char of each word.
  return id
    .split("_")
    .map((word) => word[0].toUpperCase() + word.slice(1))
    .join(" ");
  //after we turn into array, we need to rejoin with a space.
}

// You shouldn't need to edit this function-- its tests should pass once you've written makeDisplayNameFromId
function makeProducerDiv(producer) {
  const containerDiv = document.createElement("div");
  containerDiv.className = "producer";
  const displayName = makeDisplayNameFromId(producer.id);
  const currentCost = producer.price;
  const html = `
  <div class="producer-column">
    <div class="producer-title">${displayName}</div>
    <button type="button" id="buy_${producer.id}">Buy</button>
  </div>
  <div class="producer-column">
    <div>Quantity: ${producer.qty}</div>
    <div>Coffee/second: ${producer.cps}</div>
    <div>Cost: ${currentCost} coffee</div>
  </div>
  `;
  containerDiv.innerHTML = html;
  return containerDiv;
}

function deleteAllChildNodes(parent) {
  //while there is a child exisiting in the DOM from parent...remove it(reset)
  while (parent.firstChild) {
    parent.removeChild(parent.firstChild);
  }
}

function renderProducers(data) {
  //we are running function unlocking any producers that have enough coffee clicks to buy a producer
  unlockProducers(data.producers, data.coffee);
  //pulling id to get access to container
  const producerContainer = document.getElementById("producer_container");
  //run func to remove any children nodes
  deleteAllChildNodes(producerContainer);
  //we are looping over => telling DOM to run any unlocked producers with new html from our makeProducerDiv function
  getUnlockedProducers(data).forEach((prod) =>
    producerContainer.append(makeProducerDiv(prod))
  );
}

/**************
 *
 *   SLICE 3
 **************/

function getProducerById(data, producerId) {
  //Looking for any Id thats match what we're comparing
  return data.producers.find((producer) => producer.id === producerId);
}

function canAffordProducer(data, producerId) {
  return getProducerById(data, producerId).price <= data.coffee;
  // your code here
}

function updateCPSView(cps) {
  // your code here
  const cpsIndicator = document.querySelector("#cps");
  cpsIndicator.innerText = cps;
}

function updatePrice(oldPrice) {
  // your code here
  return Math.floor(oldPrice * 1.25);
}

function attemptToBuyProducer(data, producerId) {
  // your code here
  if (canAffordProducer(data, producerId)) {
    let prod = getProducerById(data, producerId);
    prod.qty += 1;
    data.coffee -= prod.price;
    prod.price = updatePrice(prod.price);
    data.totalCPS += prod.cps;
    return true;
  } else {
    return false;
  }
}

function buyButtonClick(event, data) {
  if (event.target.tagName === "BUTTON") {
    const producerId = event.target.id.slice(4);
    let finalResult = attemptToBuyProducer(data, producerId);
    // (attemptToBuyProducer(data, producerId))
    renderProducers(data);
    updateCoffeeView(data.coffee);
    updateCPSView(data.totalCPS);
    if (!finalResult) {
      window.alert("Not enough coffee!");
    }
  }
}

function tick(data) {
  data.coffee += data.totalCPS;
  updateCoffeeView(data.coffee);
  renderProducers(data);
}

/*************************
 *  Start your engines!
 *************************/

// You don't need to edit any of the code below
// But it is worth reading so you know what it does!

// So far we've just defined some functions; we haven't actually
// called any of them. Now it's time to get things moving.

// We'll begin with a check to see if we're in a web browser; if we're just running this code in node for purposes of testing, we don't want to 'start the engines'.

// How does this check work? Node gives us access to a global variable /// called `process`, but this variable is undefined in the browser. So,
// we can see if we're in node by checking to see if `process` exists.
if (typeof process === "undefined") {
  // Get starting data from the window object
  // (This comes from data.js)
  const data = window.data;

  // Add an event listener to the giant coffee emoji
  const bigCoffee = document.getElementById("big_coffee");
  bigCoffee.addEventListener("click", () => clickCoffee(data));

  // Add an event listener to the container that holds all of the producers
  // Pass in the browser event and our data object to the event listener
  const producerContainer = document.getElementById("producer_container");
  producerContainer.addEventListener("click", (event) => {
    buyButtonClick(event, data);
  });

  // Call the tick function passing in the data object once per second
  setInterval(() => tick(data), 1000);
}
// Meanwhile, if we aren't in a browser and are instead in node
// we'll need to exports the code written here so we can import and
// Don't worry if it's not clear exactly what's going on here;
// We just need this to run the tests in Mocha.
else if (process) {
  module.exports = {
    updateCoffeeView,
    clickCoffee,
    unlockProducers,
    getUnlockedProducers,
    makeDisplayNameFromId,
    makeProducerDiv,
    deleteAllChildNodes,
    renderProducers,
    updateCPSView,
    getProducerById,
    canAffordProducer,
    updatePrice,
    attemptToBuyProducer,
    buyButtonClick,
    tick,
  };
}

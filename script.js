// If there's nothing in the activity id, it put a
// message saying that the page is loading.
function showLoadingMessageIfIsNotLoaded() {
    if (document.getElementById("activity").innerHTML == "") {
        document.getElementById("type-of-activity").innerHTML = "Loading...";
        document.getElementById("activity").innerHTML = "If it is take longer, refresh the page.";
    }
}

// Change the gradient given two colors in format "#FFFFFF".
// The gradient is dependent to the two css variables
// bellow, so if it changes the gradient changes too.
function changeBackgroundColor(c1, c2) {
    document.documentElement.style.setProperty('--first-color-to-gradient', c1);
    document.documentElement.style.setProperty('--second-color-to-gradient', c2);
}

// Catch two colors in the uigradients api and change
// the background gradient using them.
function setGradientRandomly() {
    fetch("https://uigradients.com/gradients.json")
        .then(res => res.json())
        .then(gradientsList => {
            const colors = gradientsList[Math.floor(Math.random() * gradientsList.length)].colors;
            var c1 = colors[0];
            var c2 = colors[1];

            changeBackgroundColor(c1, c2);
        })
        .catch(err => {
            console.log(err);
            changeBackgroundColor("#009FFF", "#ec2F4B");
        });
}

allSuggestionKeys = [];
index = 0;

// Return a promise with a random activity key. 
async function getRandomActivityKey() {
    return await fetch("https://www.boredapi.com/api/activity")
                    .then(res => res.json())
                    .then(activity => activity.key);
}

// Return a promise with the next activity, if
// there's no more items, the function fetch a 
// new one, so it can return a promise with this.
async function nextSuggestion() {
    index = index + 1;

    if (index > 0) {
        // If has a previous value, the `previous` button appears.
        document.getElementById("previous").style.display = "block";

        // And the main button is moved to the right.
        if (document.getElementById("generate-centered") !== null) {
            document.getElementById("generate-centered").id = "generate";
        }
    }

    if (index >= allSuggestionKeys.length) {
        await getRandomActivityKey()
                .then(key => allSuggestionKeys.push(key));
    }
    
    return allSuggestionKeys[index];
}

// Return the value itself of the previous activity key.
// If there's no previous, it return the own actual key.
function previousSuggestion() {
    if (index !== 0) {
        index = index - 1;
    }
    if (index === 0) {
        // If there's no more previous the main buttons goes to the
        // center and the `previous` button disappears. 
        document.getElementById("previous").style.display = "none";
        document.getElementById("generate").id = "generate-centered";
    }
    return allSuggestionKeys[index];
}

// Fetch a random activity, put the key in the `allSuggestionKeys`
// and put it values in the screen.
async function initialPopulation() {
    await getRandomActivityKey()
        .then(key => allSuggestionKeys.push(key));
    populateWithAKeySuggestion(allSuggestionKeys[0]);
}

// Fetch the next activity and put it values in the screen.
function populateWithTheNextSuggestion() {
    nextSuggestion()
        .then(key => populateWithAKeySuggestion(key));
}

// Fetch the previous activity and put it values in the screen.
function populateWithThePreviousSuggestion() {
    populateWithAKeySuggestion(previousSuggestion());
}

// Given a activity key, put it values in the screen.
function populateWithAKeySuggestion(key) {
    fetch("https://www.boredapi.com/api/activity?key=" + key)
        .then(res => res.json())
        .then(activity => {
            console.log("All my response:");
            console.log(activity);

            document.getElementById("side-link-place").style.display = "none";
            document.getElementById("type-of-activity").innerHTML = activity.type;
            document.getElementById("activity").innerHTML = activity.activity;

            if (activity.link != "") {
                document.getElementById("side-link").href = activity.link;
                document.getElementById("side-link-place").style.display = "block";
            }
        });
}
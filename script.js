function showLoadingMessageIfIsNotLoaded() {
    if (document.getElementById("activity").innerHTML == "") {
        document.getElementById("type-of-activity").innerHTML = "Loading...";
        document.getElementById("activity").innerHTML = "If it is take longer, refresh the page.";
    }
}

function changeBackgroundColor(c1, c2) {
    document.documentElement.style.setProperty('--first-color-to-gradient', c1);
    document.documentElement.style.setProperty('--second-color-to-gradient', c2);
}

function setGradientRandomly() {
    fetch("https://uigradients.com/gradients.json")
        .then(res => res.json())
        .then(gradientsList => {
            const colors = gradientsList[Math.floor(Math.random() * gradientsList.length)].colors;
            var c1 = colors[0];
            var c2 = colors[1];

            changeBackgroundColor(c1, c2);
        })
        .catch(err => console.log(err));
}

allSuggestionKeys = [];
index = 0;

async function getRandomActivityKey() {
    return await fetch("https://www.boredapi.com/api/activity")
                    .then(res => res.json())
                    .then(activity => activity.key);
}

function putANewKeyToTheList() {
    getRandomActivityKey()
        .then(key => allSuggestionKeys.push(key));
}

async function nextSuggestion() {
    index = index + 1;

    if (index > 0) {
        document.getElementById("previous").style.display = "block";

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

function previousSuggestion() {
    if (index !== 0) {
        index = index - 1;
    }
    if (index === 0) {
        document.getElementById("previous").style.display = "none";
        document.getElementById("generate").id = "generate-centered";
    }
    return allSuggestionKeys[index];
}

async function initialPopulation() {
    await getRandomActivityKey()
        .then(key => allSuggestionKeys.push(key));
    populateWithAKeySuggestion(allSuggestionKeys[0]);
}

function populateWithTheNextSuggestion() {
    nextSuggestion()
        .then(key => populateWithAKeySuggestion(key));
}

function populateWithThePreviousSuggestion() {
    populateWithAKeySuggestion(previousSuggestion());
}

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
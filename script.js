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

function populateWithANewSuggestion() {
    fetch("https://www.boredapi.com/api/activity")
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
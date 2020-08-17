var arrowNoteInDark;

// If there's nothing in the activity id, it put a
// message saying that the page is loading.
function showLoadingMessageIfIsNotLoaded() {
    if (document.getElementById("activity").innerHTML == "") {
        document.getElementById("type-of-activity").innerHTML = "Loading...";
        document.getElementById("activity").innerHTML = "If this take longer, refresh the page or check your internet connection.";
    }
}

// Change the gradient given two colors in format "#FFFFFF".
// The gradient is dependent to the two css variables
// bellow, so if it changes the gradient changes too.
function changeBackgroundColor(c1, c2) {
    document.documentElement.style.setProperty('--first-color-to-gradient', c1);
    document.documentElement.style.setProperty('--second-color-to-gradient', c2);

    let mixOfC1andC2 = mix(c1.substr(1, c1.length -1), c2.substr(1, c2.length - 1));
    arrowNoteInDark = (lightOrDark(mixOfC1andC2) === 'light');

    if (arrowNoteInDark) {
        document.getElementById("arrows-note").src = "./assets/arrows_note_dark.svg"
    } else {
        document.getElementById("arrows-note").src = "./assets/arrows_note_light.svg"
    }
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

            if (index === 0) {
                // If there's no more previous the main buttons goes to the
                // center and the `previous` button disappears. 
                document.getElementById("previous").style.display = "none";
                document.getElementById("generate").id = "generate-centered";
            } else if (index > 0) {
                // If has a previous value, the `previous` button appears.
                document.getElementById("previous").style.display = "block";
        
                // And the main button is moved to the right.
                if (document.getElementById("generate-centered") !== null) {
                    document.getElementById("generate-centered").id = "generate";
                }
            }


        });
}

function checkKeyCode(e) {
    // If is right arrow or space, goes to the next.
    if (e.keyCode === 39 || e.keyCode === 32) {
        populateWithTheNextSuggestion();

        // If the user has already used the keyboard, remove the note.
        if (document.getElementById("arrows-note") !== null) {
            document.getElementById("arrows-note").id = "arrow-note-fade-out";
            setTimeout(() => document.getElementById("arrow-note-fade-out").style.display = "none", 4000);
        }
    // If is left arrow, goes to the previous.
    } else if (e.keyCode === 37) {
        populateWithThePreviousSuggestion();
    }
}

document.onkeyup = checkKeyCode;

// This function was taken from https://awik.io/determine-color-bright-dark-using-javascript/
function lightOrDark(color) {

    // Variables for red, green, blue values
    var r, g, b, hsp;
    
    // Check the format of the color, HEX or RGB?
    if (color.match(/^rgb/)) {

        // If RGB --> store the red, green, blue values in separate variables
        color = color.match(/^rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*(\d+(?:\.\d+)?))?\)$/);
        
        r = color[1];
        g = color[2];
        b = color[3];
    } 
    else {
        
        // If hex --> Convert it to RGB: http://gist.github.com/983661
        color = +("0x" + color.slice(1).replace( 
        color.length < 5 && /./g, '$&$&'));

        r = color >> 16;
        g = color >> 8 & 255;
        b = color & 255;
    }
    
    // HSP (Highly Sensitive Poo) equation from http://alienryderflex.com/hsp.html
    hsp = Math.sqrt(
    0.299 * (r * r) +
    0.587 * (g * g) +
    0.114 * (b * b)
    );

    // Using the HSP value, determine whether the color is light or dark
    if (hsp>127.5) {

        return 'light';
    } 
    else {

        return 'dark';
    }
}

// Color blend function taken from https://gist.github.com/jedfoster/7939513
var mix = function(color_1, color_2, weight) {
    function d2h(d) { return d.toString(16); }  // convert a decimal value to hex
    function h2d(h) { return parseInt(h, 16); } // convert a hex value to decimal 
  
    weight = (typeof(weight) !== 'undefined') ? weight : 50; // set the weight to 50%, if that argument is omitted
  
    var color = "#";
  
    for(var i = 0; i <= 5; i += 2) { // loop through each of the 3 hex pairs—red, green, and blue
      var v1 = h2d(color_1.substr(i, 2)), // extract the current pairs
          v2 = h2d(color_2.substr(i, 2)),
          
          // combine the current pairs from each source color, according to the specified weight
          val = d2h(Math.floor(v2 + (v1 - v2) * (weight / 100.0))); 
  
      while(val.length < 2) { val = '0' + val; } // prepend a '0' if val results in a single digit
      
      color += val; // concatenate val to our new color string
    }
      
    return color; // PROFIT!
  };

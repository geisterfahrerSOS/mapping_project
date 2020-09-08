readTextFile();

function readTextFile() {
    var rawFile = new XMLHttpRequest();
    rawFile.open("GET", "words.txt", true);
    rawFile.onreadystatechange = function() {
        if (rawFile.readyState === 4) {
            var allText = rawFile.responseText.split('\n');
            work(allText);
        }
    }
    rawFile.send();
}

function work(allText) {
    let dispose = /[gkmqvwxz]/;
    let longArray = [];
    let arrayLength = 0;
    for (let count of allText) {
        if (count.length < arrayLength) {
            continue;
        }
        if (count.match(dispose)) {
            continue;
        }
        if (count.length === arrayLength) {
            longArray.push(count);
            arrayLength++;
        }
        if (count.length > arrayLength) {
            longArray = [];
            arrayLength = 0;
            longArray.push();
            arrayLength++;
        }

    }
    console.log(longArray);
}
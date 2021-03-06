class Node {
    constructor(posX, posY, type, show, id) {
        this.posX = posX;
        this.posY = posY;
        this.type = type;
        this.show = show;
        this.id = id;
        this.lN = [];
        this.costs = Infinity;
    }

}
class Button {
    constructor(display, x, y, w, h, task, color = [150, 150, 150], text = "", form = 0) {
        this.s = display;
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
        this.c = color;
        this.t = text;
        this.f = form;
        this.task = task;
    }
    show() {
        if (this.s) {
            rectMode(CENTER);
            fill(this.c);
            switch (this.f) {
                case 0:
                    rect(this.x, this.y, this.w, this.h);
                    break;
                case 1:
                    ellipse(this.x, this.y, this.w, this.h);
                    break;
                default:
                    rect(this.x, this.y, this.w, this.h);
                    break;
            }
            fill(0);
            text(this.t, this.x - 0.5 * this.w + 5, this.y + 5);
        }
    }
    clickChecker() {
        if (mouseX > this.x - 0.5 * this.w && mouseX < this.x + 0.5 * this.w && mouseY > this.y - 0.5 * this.h && mouseY < this.y + 0.5 * this.h) {

            this.task();
        }
    }
}
class Way {
    constructor(name, display, type) {
        this.s = display;
        this.n = name;
        this.t = type;
        this.idList = [];
        this.color = color(random(100, 255), random(100, 255), random(100, 255));
    }
    addNode(nodeObj, end) {
        if (nodeObj.type === "point") {
            if (end) {
                this.idList.push(nodeObj.id);
            } else {
                this.idList.splice(0, 0, nodeObj.id);
            }

        } else {
            console.log("The Node type " + nodeObj.type + " cannot be used in a way");
        }
    }
    removeNode() {

    }
    showWay() {
        for (let i = 0; i < this.idList.length - 1; i++) {
            push();
            stroke(this.color);
            strokeWeight(3)
            let id = nodes.findIndex(item => item.id === this.idList[i]);
            let nextId = nodes.findIndex(item => item.id === this.idList[i + 1]);
            line(nodes[id].posX, nodes[id].posY, nodes[nextId].posX, nodes[nextId].posY);
            pop();
        }
    }
}
class Pathfinder {
    constructor(name, start) {
        this.name = name;
        this.start = start;
        this.stop = 0;
        this.visited = [start];
        this.unvisited = nodes.map(item => item.id);
        this.currentNode = start;
        nodes.find(item => item.id === start).costs = 0;
    }
    addStop(sp) {
        this.stop = sp;
    }
    findPath() {
        nodes.find(item => item.id === this.currentNode).lN.forEach()
    }
}
let img;
let nodes = [];
let loseIds = [];
let idIncrement = 0;
let nodeTypes = [{ name: "point", color: [0, 0, 255], }, { name: "tree", color: [255, 0, 0], }, { name: "station", color: [255, 100, 100], }, { name: "busstop", color: [255, 0, 255], }, { name: "highlight", color: [0, 255, 0], }, { name: "fountain", color: [255, 255, 0], }];
let showMenu = false;
let nodeTypeValue = 0;
let selectedNode = null;
let buttons = [];
let ways = [];
let placeHolder;
let input;
let button;
let path;

buttons.push(new Button(false, 230, 20, 60, 20, closeMenu, [200, 200, 200], "Close"));
buttons.push(new Button(false, 230, 60, 70, 20, deleteNode, [200, 200, 200], "Delete"));
buttons.push(new Button(false, 60, 260, 60, 20, deleteWay, [200, 200, 200], "Delete"));


function preload() {
    img = loadImage('Paris_City_Map_2.jpg');
}

function setup() {
    createCanvas(3709, 1333);
}

function draw() {
    image(img, 0, 0);
    push();
    fill(nodeTypes[nodeTypeValue].color);
    textSize(30);
    text(nodeTypes[nodeTypeValue].name, 0, 20);
    pop();
    textSize(17);
    nodes.forEach((value, index) => {
        if (value.show) {
            nodeTypes.forEach(item => {
                if (item.name === value.type) {
                    fill(item.color);
                }
            })
        }
        if (index === selectedNode && showMenu) {
            rectMode(CENTER);
            rect(value.posX, value.posY, 12, 12);
            nodes.forEach(item => {
                if (value.lN.find((item2) => item2 === item.id) != null) {
                    push();
                    noFill();
                    strokeWeight(2);
                    stroke(255, 0, 0);
                    rect(item.posX, item.posY, 12, 12);
                    pop();
                }
            })

        }
        ellipse(value.posX, value.posY, 10);
        text("#" + value.id, value.posX - 15, value.posY + 15);
    })
    buttons.forEach(item => item.show());
    ways.forEach((value, index) => {
        value.showWay();
        if (value.idList.length === 1) {
            ways.splice(index, 1);
        }
    });
    if (showMenu) {
        showMenuFunc();
    } else {
        buttons[0].s = false;
        buttons[1].s = false;
    }
}

function closeMenu() {
    showMenu = false;
}

function showMenuFunc() {
    buttons[0].s = true;
    buttons[1].s = true;
    rectMode(LEFT);
    fill(255, 255, 255, 50);
    rect(0, 0, 600, 2 * height);
    fill(0);
    textSize(25);
    text("#:  " + nodes[selectedNode].id, 20, 60);
    text("type:  " + nodes[selectedNode].type, 20, 100);
    text("X:  " + nodes[selectedNode].posX, 20, 140);
    text("Y:  " + nodes[selectedNode].posY, 120, 140);
    let wayMatched = [];
    for (let e = 0; e < ways.length; e++) {
        if (ways[e].idList.find(item => item === nodes[selectedNode].id) != null) {
            wayMatched.push(e);
        }
    }
    if (wayMatched[0] != null) {
        buttons[2].s = true;
        rect()
        wayMatched.forEach((value, index) => {
            text("Name:  " + ways[value].n, 20, 180 + index * 80);
            text("Typ:  " + ways[value].t, 20, 220 + index * 80);
        });
    } else {
        buttons[2].s = false;
    }
}

function clipping(posX, posY, node2, value) {
    if (posX > node2.posX - value && posX < node2.posX + value && posY > node2.posY - value && posY < node2.posY + value) {
        return true;
    } else {
        return false;
    }
}

function deleteNode() {
    console.log("node being deleted");
    showMenu = false;
    for (let count of ways) {
        let idInWay = count.idList.findIndex(item => item === nodes[selectedNode].id);
        console.log("id delete:  " + idInWay);
        if (idInWay >= 0) {
            count.idList.splice(idInWay, 1); //removes node reference in ways object
        }
    }
    loseIds.push(nodes[selectedNode].id); //adds removed id to loseId Array for future use
    nodes.splice(selectedNode, 1);
}

function deleteWay() {
    let wayMatched = [];
    for (let e = 0; e < ways.length; e++) {
        if (ways[e].idList.find(item => item === nodes[selectedNode].id) != null) {
            wayMatched.push(e);
        }
    }
    for (let count of wayMatched) {
        ways.splice(count, 1);
    }
}

function mouseClicked() {
    console.log(ways);
    let ok = false; //has node been clicked?
    for (let i = 0; i < nodes.length; i++) {
        if (clipping(mouseX, mouseY, nodes[i], 12)) { //entering node menu
            if (keyIsPressed && keyCode === 16 && selectedNode !== null && selectedNode !== i) { //entering ways menu
                let wayMatched = null;
                for (let e = 0; e < ways.length; e++) {
                    if (ways[e].idList.find(item => item === nodes[selectedNode].id) != null) {
                        wayMatched = e;
                        break;
                    }
                }
                if (wayMatched != null) {
                    console.log("adding node");
                    //node connecting
                    let wayMatched2 = null;
                    for (let e = 0; e < ways.length; e++) {
                        if (ways[e].idList.find(item => item === nodes[i].id) != null) {
                            wayMatched2 = e;
                            break;
                        }
                    }
                    if (ways[wayMatched].idList.findIndex(item => item === nodes[selectedNode].id) === 0) {
                        console.log("adding node at start");
                        ways[wayMatched].addNode(nodes[i], false);
                    } else if (ways[wayMatched].idList.findIndex(item => item === nodes[selectedNode].id) === ways[wayMatched].idList.length - 1) {
                        console.log("adding node at end");
                        ways[wayMatched].addNode(nodes[i], true);
                    } else {
                        // alert("pleade add nodes from the ends of a way");
                        console.log("pleade add nodes from the ends of a way");
                    }
                    // }

                } else {
                    console.log("creating ways obj");
                    input = createInput();
                    input.position(200, 50);
                    button = createButton("submit");
                    button.position(340, 50);
                    button.mousePressed(wayErstellen);
                    placeHolder = i;
                }
                ok = true;
            } else if (keyIsPressed && keyCode === 17 && selectedNode !== null) {
                console.log("creating ways obj new");
                input = createInput();
                input.position(200, 50);
                button = createButton("submit");
                button.position(340, 50);
                button.mousePressed(wayErstellen);
                placeHolder = i;
                ok = true;
            } else {
                showMenu = true;
                if (selectedNode === i) {
                    showMenu = false;
                    selectedNode = null;
                } else {
                    selectedNode = i;
                }
                ok = true;
            }
            updateLN();
        }
    }
    if (!ok) { //new node created
        let id;
        if (showMenu) {
            if (mouseX > 300) {
                if (loseIds.length > 0) {
                    id = loseIds.pop();
                } else {
                    id = idIncrement;
                    idIncrement++;
                }
                nodes.push(new Node(parseInt(mouseX), parseInt(mouseY), nodeTypes[nodeTypeValue].name, true, id, false));
            }
        } else {
            if (loseIds.length > 0) {
                id = loseIds.pop();
            } else {
                id = idIncrement;
                idIncrement++;
            }
            nodes.push(new Node(parseInt(mouseX), parseInt(mouseY), nodeTypes[nodeTypeValue].name, true, id, false));

        }

    }
    if (showMenu) {
        buttons[0].clickChecker();
        buttons[1].clickChecker();
        buttons[2].clickChecker();
    }
}

function wayErstellen() {
    ways.push(new Way(input.value(), true, "street"));
    ways[ways.length - 1].addNode(nodes[selectedNode], true);
    ways[ways.length - 1].addNode(nodes[placeHolder], true);
    input.remove();
    button.remove();
    updateLN();
}

function keyPressed() {
    if (keyCode > 48 && keyCode < 59) {
        nodeTypeValue = (keyCode - 49) % nodeTypes.length;
    }
    if (keyCode === 13) {
        let table = new p5.Table();
        table.addColumn("id");
        table.addColumn("type");
        table.addColumn("show");
        table.addColumn("posX");
        table.addColumn("posY");
        let rows = [];
        for (let i = 0; i < nodes.length; i++) {
            rows.push(table.addRow());
            rows[rows.length - 1].setString("type", nodes[i].type);
            rows[rows.length - 1].setString("show", nodes[i].show);
            rows[rows.length - 1].setNum("posX", nodes[i].posX);
            rows[rows.length - 1].setNum("posY", nodes[i].posY);
        }

        let table2 = new p5.Table();
        for (let i = 0; i < 100; i++) {
            table2.addColumn("Node #" + i);
        }
        let rows2 = [];
        for (let count of ways) {
            rows2.push(table2.addRow());
            for (let i = 0; i < 100; i++) {
                rows2[rows2.length - 1].setNum("Node #" + i, -1);
            }
            count.idList.forEach((value, index) => {
                rows2[rows2.length - 1].setNum("Node #" + index, value);
            })
        }

        saveTable(table, "table", "csv"); //html doesn't work why? String converson error
        saveTable(table2, "table2", "csv");
    }
    if (showMenu && keyCode === 46) {
        deleteNode();
    }
    if (showMenu && keyCode === 83) {
        path = new Pathfinder("navi", nodes[selectedNode].id);
    }
    if (showMenu && keyCode === 83 && path != null) {
        path.addStop(nodes[selectedNode].id);
    }
    if (showMenu && keyCode === 67 && path != null && path.stop != null) {

    }
    // console.log(keyCode);
}

function updateLN() {
    nodes.forEach(item => {
        item.lN = [];
        let wayMatched = [];
        for (let e = 0; e < ways.length; e++) {
            if (ways[e].idList.find(value => value === item.id) != null) {
                wayMatched.push(e);
            }
        }
        for (let count of wayMatched) {
            let itemPos = ways[count].idList.findIndex(value => value === item.id);
            // console.log(itemPos + ":" + item.id + ":" + wayMatched);
            if (itemPos === 0) {
                console.log(itemPos + ":" + item.id + ":" + wayMatched);
                item.lN.push(ways[count].idList[itemPos + 1]);
            } else if (itemPos > 0 && itemPos < ways[count].idList.length - 1) {
                console.log(itemPos + ":" + item.id + ":" + wayMatched);
                item.lN.push(ways[count].idList[itemPos - 1]);
                item.lN.push(ways[count].idList[itemPos + 1]);
            } else if (itemPos === ways[count].idList.length - 1) {
                console.log(itemPos + ":" + item.id + ":" + wayMatched);
                item.lN.push(ways[count].idList[itemPos - 1]);
            }
        }
    })
    console.log(nodes);
}
class Node {
    constructor(posX, posY, type, show, id, wayPoint) {
        this.posX = posX;
        this.posY = posY;
        this.type = type;
        this.show = show;
        this.id = id;
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

buttons.push(new Button(false, 230, 20, 60, 20, closeMenu, [200, 200, 200], "Close"));
buttons.push(new Button(false, 230, 60, 70, 20, deleteNode, [200, 200, 200], "Delete"));


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
    let i = 0;
    for (let count of nodes) {
        if (count.show) {
            switch (count.type) {
                case "point":
                    fill(nodeTypes[0].color);
                    break;
                case "tree":
                    fill(nodeTypes[1].color);
                    break;
                case "station":
                    fill(nodeTypes[2].color);
                    break;
                case "busstop":
                    fill(nodeTypes[3].color);
                    break;
                case "highlight":
                    fill(nodeTypes[4].color);
                    break;
                case "fountain":
                    fill(nodeTypes[5].color);
                    break;
                default:
                    break;
            }

        }
        if (i === selectedNode && showMenu) {
            rectMode(CENTER);
            rect(count.posX, count.posY, 12, 12);
        }
        ellipse(count.posX, count.posY, 10);
        text("#" + count.id, count.posX - 15, count.posY + 15);
        i++;
    }
    for (let count of buttons) {
        count.show();
    }
    for (let count of ways) {
        count.showWay();
    }
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
    let wayMatched = null;
    for (let e = 0; e < ways.length; e++) {
        if (ways[e].idList.find(item => item === nodes[selectedNode].id) != null) {
            wayMatched = e;
            break;
        }
    }
    if (wayMatched != null) {
        text("Name:  " + ways[wayMatched].n, 20, 180);
        text("Typ:  " + ways[wayMatched].t, 20, 220);
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
    console.log(ways);
    loseIds.push(nodes[selectedNode].id); //adds removed id to loseId Array for future use
    nodes.splice(selectedNode, 1);


}

function mouseClicked() {
    let ok = false; //has node been clicked?
    for (let i = 0; i < nodes.length; i++) {
        if (clipping(mouseX, mouseY, nodes[i], 12)) { //entering node menu
            if (keyIsPressed && keyCode === 16 && selectedNode !== null) { //entering ways menu
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
                    if (wayMatched2 != null) { //joining two ways together
                        if (ways[wayMatched2].idList.findIndex(item => item === nodes[i].id) === ways[wayMatched2].idList.length - 1) {
                            ways[wayMatched].idList = ways[wayMatched].idList.concat(ways[wayMatched2].idList.reverse());
                        } else {
                            ways[wayMatched].idList = ways[wayMatched].idList.concat(ways[wayMatched2].idList);
                        }
                        ways.splice(wayMatched2, 1);
                    } else {
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
                    }

                } else {
                    console.log("creating ways obj");
                    input = createInput();
                    input.position(100, 100);
                    button = createButton("submit");
                    button.position(240, 100);
                    button.mousePressed(wayErstellen);
                    placeHolder = i;
                }
                ok = true;
                console.log(ways);
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
    }
}

function wayErstellen() {
    ways.push(new Way(input.value(), true, "street"));
    ways[ways.length - 1].addNode(nodes[selectedNode], true);
    ways[ways.length - 1].addNode(nodes[placeHolder], true);
    input = null;
}

function keyPressed() {
    if (keyCode > 48) {
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
            rows[rows.length - 1].setNum("id", nodes[i].id);
            rows[rows.length - 1].setString("type", nodes[i].type);
            rows[rows.length - 1].setString("show", nodes[i].show);
            rows[rows.length - 1].setNum("posX", nodes[i].posX);
            rows[rows.length - 1].setNum("posY", nodes[i].posY);
        }
        saveTable(table, "table", "html"); //make better file for saving node data
    }
    console.log(keyCode);
    if (showMenu && keyCode === 46) {
        deleteNode();
    }
}
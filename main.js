class Node {
    constructor(posX, posY, type, show, id, wayPoint) {
        this.posX = posX;
        this.posY = posY;
        this.type = type;
        this.show = show;
        this.id = id;
        this.wP = wayPoint;
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
    constructor(display, type, startNode) {
        this.s = display;
        this.t = type;
        this.sN = startNode;
        this.nodeList = [];
        this.nodeList.push(startNode);
        this.color = color(parseInt(random(0, 255)), parseInt(random(0, 255)), parseInt(random(0, 255)));
    }
    addNode(nodeObj) {
        if (nodeObj.type === "point") {
            this.nodeList.push(nodeObj);
        } else {
            alert("The Node type " + nodeObj.type + " cannot be used in a way");
        }
    }
    removeNode() {

    }
    showWay() {
        for (let i = 0; i < this.nodeList.length - 1; i++) {
            fill(this.color);
            line(this.nodeList[i].posX, this.nodeList[i].posY, this.nodeList[i + 1].posX, this.nodeList[i + 1].posY)
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
    text("way point:  " + nodes[selectedNode].wP, 20, 180);
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
        let idInWay = count.nodeList.findIndex(item => item.id === nodes[selectedNode].id);
        console.log("id delete" + idInWay);
        if (idInWay >= 0) {
            count.nodeList.splice(idInWay, 1);
        }
    }
    console.log(ways);
    loseIds.push(nodes[selectedNode].id); //only if removed
    nodes.splice(selectedNode, 1);


}

function mouseClicked() {
    let ok = false; //has node been clicked?
    for (let i = 0; i < nodes.length; i++) {
        if (clipping(mouseX, mouseY, nodes[i], 12)) { //entering node menu
            console.log(keyCode);
            if (keyIsPressed && keyCode === 16) {
                if (nodes[selectedNode].wP) {
                    console.log("adding node");
                    if (nodes[i].wP) {
                        alert("The node is already being used in another way");
                    } else {
                        ways[ways.length - 1].addNode(nodes[i]);
                        nodes[i].wP = true;
                    }

                } else {
                    console.log("creating ways obj");
                    ways.push(new Way(true, "street", nodes[selectedNode]));
                    nodes[selectedNode].wP = true;
                    ways[ways.length - 1].addNode(nodes[i]);
                    nodes[i].wP = true;
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
    if (showMenu) {
        deleteNode();
    }
}
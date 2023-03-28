function position(x, y) {
    this.x = x;
    this.y = y;
}

const c = document.getElementById("main");
const button = document.querySelector("#main");
button.addEventListener("click", mouseClick, false);
const painter = c.getContext("2d", { alpha: false });

//var rendererOffset = 8;
//painter.translate(rendererOffset, rendererOffset);
painter.imageSmoothingEnabled = true;

const width = c.width;
const height = c.height;
const centerX = width / 2;
const centerY = height / 2;

var pointerX = 0;
var pointerY = 0;

var fps = 1;

var equations = [];
var polygons = [];

function setup() {
    // for (var i = centerX * -1; i < centerX; i++) {
    //     console.log(evalFunction(equation, i));
    // }
}

function newPolynomial() {
    var element = document.createElement("p");
    element.className = "fluff";
    element.innerText = "y=";
    element.id = `eq${equations.length}`;
    equations[equations.length] = "";
    element.contentEditable = true;

    var div = document.getElementById("editables");
    div.appendChild(element);
    document.body.appendChild(div);
}

function newPolygon() {
    var element = document.createElement("p");
    element.className = "fluff";
    element.innerText = "p=";
    element.id = `po${polygons.length}`;
    polygons[polygons.length] = "";
    element.contentEditable = true;

    var div = document.getElementById("editables");
    div.appendChild(element);
    document.body.appendChild(div);
}

function evalPolygon(string) {
    if (string[0] == "p" && string[1] == "=") {
        string = string.replace("p=", "  ");
        var list = string.split("),(");
        for (var i = 0; i < list.length; i++) {
            list[i] = list[i].replace("(", " ");
            list[i] = list[i].replace(")", " ");
            list[i] = list[i].trim();
        }

        for (var i = 0; i < list.length; i++) {
            var points1 = list[i].split(",");
            var points2;
            if (i == list.length - 1) {
                points2 = list[0].split(",");
            } else {
                points2 = list[i + 1].split(",");
            }
            drawLine(parseInt(points1[0]) + centerX, parseInt(points1[1]) * -1 + centerY, parseInt(points2[0]) + centerX, parseInt(points2[1]) * -1 + centerY, 255, 255, 255);
        }
    }
}

function evalFunction(equation, x) {
    if (equation[equation.length - 1] == "x" || !isNaN(equation[equation.length - 1])) {
        if (equation[0] == "y" && equation[1] == "=") {
            for (var i = 0; i < equation.length; i++) {
                if (equation[i] == "x") {
                    if (equation[i - 1] != "(") {
                        equation = equation.replace("x", "*" + x.toString());
                    } else {
                        equation = equation.replace("x", x.toString());
                    }
                }
            }
            equation = equation.replace("y=", "  ");
            equation = equation.trimStart();

            // equation = equation.replace("-", "-");
            equation = equation.replace("^", "**");

            var containsBracket;
            for (var i = 0; i < equation.length; i++) {
                var firstBracket;
                var secondBracket;

                if (equation[i] == "(") {
                    firstBracket = i;
                    containsBracket = true;
                }
                if (equation[i] == ")") {
                    secondBracket = i;
                    containsBracket = true;
                }
            }

            if (containsBracket) {
                let part = equation.substring(firstBracket + 1, secondBracket);

                equation = equation.replace(part, eval(part));
                equation = equation.replace("(", "*(");
            }

            var containsNegative;
            var containsPow;
            for (var i = 0; i < equation.length; i++) {
                if (equation[i] == "-") {
                    containsNegative = true;
                }
                if (equation[i] == "*" && equation[i + 1] == "*") {
                    containsPow = true;
                }
            }

            if (containsNegative) {
                equation = equation.replace("-", "(-");
                if (containsPow) {
                    equation = equation.replace("**", ")**");
                } else {
                    equation = equation + ")";
                }
            }

            return eval(equation);
        }
    }
}

function update() {
    clearScreen();
    drawLine(0, centerY, width, centerY, 128, 128, 128);
    drawLine(centerX, 0, centerX, height, 128, 128, 128);
    for (var x = centerX * -1; x < centerX; x += 0.1) {
        // Horizontal Steps
        if (Math.round(x) % 10 == 0) {
            drawLine(x + centerX, centerY - 3, x + centerX, centerY + 3, 128, 128, 128);
        }
        // Points of graph
        for (var i = 0; i < equations.length; i++) {
            equations[i] = document.getElementById(`eq${i}`).innerText;
            drawPoint(x + centerX, evalFunction(equations[i], x) * -1 + centerY, 255, 255, 255);
        }
        for (var i = 0; i < polygons.length; i++) {
            polygons[i] = document.getElementById(`po${i}`).innerText;
            evalPolygon(polygons[i]);
        }
    }

    // Vertical Steps
    for (var y = 0; y < height; y += 10) {
        drawLine(centerX - 3, y, centerX + 3, y, 128, 128, 128);
    }
}

function quadratic(a, b, c, x) {
    return a * Math.pow(x, 2) + b * x + c;
}

function linear_system(x, m, b) {
    return a * x + b;
}

function mouseClick() {}

function input(key) {}

// Zushi Package

function getArrayAverage(array) {
    var sum;
    for (var i = 0; i < array.length; i++) {
        sum += array[i];
    }
    return sum / array.length;
}

function rand(min, max) {
    return Math.floor(Math.random() * (max + 1 - min) + min);
}

function randomInArray(array) {
    const random = Math.floor(Math.random() * array.length);
    return array[random];
}

function paintImage(image, x, y, angle) {
    painter.save();
    painter.translate(x, y);
    painter.rotate(toRadian(180 + angle));
    painter.drawImage(image, -1 * (spriteSize / 2), -1 * (spriteSize / 2));
    painter.restore();
}

function screenshot() {
    let canvasUrl = c.toDataURL();
    const createEl = document.createElement("a");
    createEl.href = canvasUrl;
    var todayDate = new Date().toISOString().slice(0, 10);
    createEl.download = `Screenshot_${todayDate}`;
    createEl.click();
    createEl.remove();
}

function saveVariableToFile(variable, saveName) {
    var thingToSave = JSON.stringify(variable);
    var hiddenElement = document.createElement("a");
    hiddenElement.href = "data:attachment/text," + encodeURI(thingToSave);
    hiddenElement.target = "_blank";
    hiddenElement.download = `${saveName}.json`;
    hiddenElement.click();
}

function distanceBetweenPoints(x1, y1, x2, y2) {
    return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
}

function paintImage(image, x, y, angle) {
    painter.save();
    painter.translate(x, y);
    painter.rotate(toRadian(180 + angle));
    painter.drawImage(image, -1 * (spriteSize / 2), -1 * (spriteSize / 2));
    painter.restore();
}

function toRadian(angle) {
    return (180 + angle) * (Math.PI / 180);
}

function clearScreen() {
    painter.clearRect(0, 0, width, height);
}

function findSlope(y2, y1, x2, x1) {
    return ((y2 - y1) / (x2 - x1)) * -1;
}

function drawPoint(x1, y1, r, g, b) {
    painter.beginPath();
    painter.strokeStyle = "rgb(" + r + "," + g + "," + b + ")";
    painter.moveTo(x1, y1);
    painter.lineTo(x1 + 1, y1 + 1);
    painter.closePath();
    painter.stroke();
}

function drawRect(x1, y1, x2, y2, r, g, b) {
    painter.strokeStyle = "rgb(" + r + "," + g + "," + b + ")";
    painter.beginPath();
    painter.fillRect(x1, y1, x2, y2);
    painter.closePath();
}

function roundedRect(x, y, width, height, radius, r, g, b) {
    painter.beginPath();
    painter.strokeStyle = "rgb(" + r + "," + g + "," + b + ")";
    painter.moveTo(x, y + radius);
    painter.arcTo(x, y + height, x + radius, y + height, radius);
    painter.arcTo(x + width, y + height, x + width, y + height - radius, radius);
    painter.arcTo(x + width, y, x + width - radius, y, radius);
    painter.arcTo(x, y, x, y + radius, radius);
    painter.stroke();
    painter.fillStyle = "rgb(" + r + "," + g + "," + b + ")";
    painter.fill();
    painter.closePath();
}

function drawText(text, x, y, r, g, b) {
    painter.beginPath();
    painter.font = "15px Arial";
    painter.fillStyle = "rgb(" + r + "," + g + "," + b + ")";
    painter.fillText(text, x, y + 1);
    painter.closePath();
}

function drawCircle(sX, sY, hStretch, vStretch, rotation, r, g, b) {
    painter.beginPath();
    painter.strokeStyle = "rgb(" + r + "," + g + "," + b + ")";
    painter.fillStyle = "rgb(" + r + "," + g + "," + b + ")";
    painter.ellipse(sX, sY, hStretch, vStretch, rotation, 0, 360);
    painter.stroke();
    painter.fill();
    painter.closePath();
}

function drawLine(sX, sY, eX, eY, r, g, b) {
    painter.beginPath();
    painter.strokeStyle = `rgb(${r},${g},${b})`;
    painter.moveTo(sX, sY);
    painter.lineTo(eX, eY);
    painter.closePath();
    painter.stroke();
}

// Zushi Package End

document.addEventListener(
    "keydown",
    (event) => {
        var name = event.key;
        input(name);
    },
    false
);

document.onmousemove = function (event) {
    const target = event.target;
    const rect = target.getBoundingClientRect();
    var wRatio = (rect.right - rect.left) / width;
    var hRatio = (rect.bottom - rect.top) / height;
    pointerX = (event.pageX - window.scrollX - rect.left) / wRatio;
    pointerY = (event.pageY - window.scrollY - rect.top) / hRatio;
};

setup();
setInterval(update, 1000 / fps);

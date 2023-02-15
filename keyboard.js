
let state = {};

function stringIntAdd(s, i) {
    return (parseInt(s) + i).toString();
}

function initKeyboardSides() {
    let elements = document.querySelectorAll("[data-side-b]");
    for (let element of elements) {
        element.dataset.sideA = element.textContent;
        element.dataset.flipIndex = "0";
    }
}

function updateKeyboardUI(data) {
    if (data.type != "Keyboard") return;
    if (data.pressed) {
        if (state[data.button]) return;
        state[data.button] = true;
        let element = document.getElementById(data.button);
        if (!element) return;

        element.classList.remove('released');
        element.classList.add('pressed');
        if (element.dataset.sideB) {
            element.classList.add("flipped");
            if (!element.classList.contains("kps")) {
                element.firstChild.nodeValue = element.dataset.sideB;
            }
            element.dataset.flipIndex = stringIntAdd(element.dataset.flipIndex, 1);
        }

        let kpsMin = element.dataset.kpsMin;
        if (kpsMin) {
            kpsMin = parseInt(kpsMin);
            let kpsCurrent = element.dataset.kpsCurrent;
            kpsCurrent = kpsCurrent ? parseInt(kpsCurrent) + 1 : 1;
            element.dataset.kpsCurrent = kpsCurrent.toString();
            if (kpsCurrent >= kpsMin) {
                element.firstChild.nodeValue = "×" + kpsCurrent.toString();
                element.classList.add("kps");
            }
            setTimeout(() => {
                let kpsCurrent = element.dataset.kpsCurrent;
                kpsCurrent = kpsCurrent ? parseInt(kpsCurrent) - 1 : 0;
                if (kpsCurrent <= 0) {
                    delete element.dataset.kpsCurrent;
                    element.classList.remove("kps");
                    if (element.classList.contains("flipped")) {
                        element.firstChild.nodeValue = element.dataset.sideB;
                    } else {
                        element.firstChild.nodeValue = element.dataset.sideA;
                    }
                } else {
                    element.dataset.kpsCurrent = kpsCurrent.toString();
                }
            }, 1000);
        }
    } else {
        if (!state[data.button]) return;
        delete state[data.button];
        let element = document.getElementById(data.button);
        if (!element) return;
        element.classList.remove('pressed');
        element.classList.add('released');
        if (!element.dataset.sideA) return;
        let localIndex = element.dataset.flipIndex;
        setTimeout(()=>{
            if (localIndex != element.dataset.flipIndex) return;
            element.classList.remove("flipped");
            if (!element.classList.contains("kps")) {
                element.firstChild.nodeValue = element.dataset.sideA;
            }
            element.dataset.flipIndex = "0";
        }, 250);
    }
};

function flickityInitialize(selector) {
    const flickity = document.querySelector(selector);

    if (flickity) {

        const flickityViewport = flickity.querySelector(".flickity-viewport");
        const flickityPageDots = flickity.querySelector(".flickity-page-dots");
        const prevBtn = flickity.querySelector(".flickity-prev-next-button.previous");
        const nextBtn = flickity.querySelector(".flickity-prev-next-button.next");
        let flickitySlider = flickityViewport && flickityViewport.querySelector(".flickity-slider");
        let flickityItemWidth = calculateItemWidth(flickityViewport, flickitySlider);
        const leftPositions = {};
        const sliderTranslate = {};
        let selectIndex = 0;
        let newSelectIndex = 0;
        let dragging = false;
        let dragOriginalValue = {
            x: 0,
            translate: 0,
        };
        let handlerInteval;

        calculatePositionValue(flickitySlider, leftPositions, sliderTranslate);
        initalizeItemPosittionValue(flickitySlider.children);
        sellectFlickityItem(flickitySlider, flickityPageDots, selectIndex, leftPositions, sliderTranslate, false);

        window.addEventListener("resize", () => {
            const crrFlickityItemWidth = calculateItemWidth(flickityViewport, flickitySlider);
            if (crrFlickityItemWidth != flickityItemWidth) {
                flickityItemWidth = crrFlickityItemWidth;
                calculatePositionValue(flickitySlider, leftPositions, sliderTranslate);
                initalizeItemPosittionValue(flickitySlider.children);
                sellectFlickityItem(flickitySlider, flickityPageDots, selectIndex, leftPositions, sliderTranslate, false);
            }
        });

        if (flickityPageDots) {
            const flickityPageDotItems = flickityPageDots.children;

            for (let i = 0; i < flickityPageDotItems.length; i++) {
                flickityPageDotItems[i].onclick = () => {
                    selectIndex = i;
                    sellectFlickityItem(flickitySlider, flickityPageDots, selectIndex, leftPositions, sliderTranslate);
                }
            }
        }

        if (prevBtn) {
            prevBtn.onclick = () => {
                selectIndex--;
                const numItems = flickitySlider.children.length

                if (selectIndex == -1) {
                    selectIndex = numItems;
                    sellectFlickityItem(flickitySlider, flickityPageDots, selectIndex, leftPositions, sliderTranslate, false)
                        .then(() => {
                            selectIndex = numItems - 1;
                            sellectFlickityItem(flickitySlider, flickityPageDots, selectIndex, leftPositions, sliderTranslate, true);
                        })  
                }
                else {
                    sellectFlickityItem(flickitySlider, flickityPageDots, selectIndex, leftPositions, sliderTranslate, true);
                }
            }
        }

        if (nextBtn) {
            nextBtn.onclick = () => {
                selectIndex++;
                const numItems = flickitySlider.children.length

                if (selectIndex == numItems) {
                    selectIndex = -1;
                    sellectFlickityItem(flickitySlider, flickityPageDots, selectIndex, leftPositions, sliderTranslate, false)
                        .then(() => {
                            selectIndex = 0;
                            sellectFlickityItem(flickitySlider, flickityPageDots, selectIndex, leftPositions, sliderTranslate, true);
                        })  
                }
                else {
                    sellectFlickityItem(flickitySlider, flickityPageDots, selectIndex, leftPositions, sliderTranslate, true);
                }
            }
        }

        flickitySlider.addEventListener("pointerdown", (e) => {
            flickityViewport.classList.add("is-pointer-down");
            
            dragOriginalValue.x = e.clientX;
            dragOriginalValue.translate = Number.parseFloat(flickitySlider.style.getPropertyValue("transform").replace("translateX(", "").replace("%)", "")) || 0;

            newSelectIndex = selectIndex;

            dragging = true;
        })

        document.documentElement.addEventListener('pointermove', (e) => {
            if (!dragging) {
                return;
            }

            const flickityItems = flickitySlider.children;
            const numElement = flickityItems.length;

            handlerInteval && clearInterval(handlerInteval);
            const newX = e.clientX;
            let newTranslate = dragOriginalValue.translate + (newX - dragOriginalValue.x) / flickityViewport.clientWidth * 100;

            flickitySlider.style.transform = "translateX(" + newTranslate + "%)";
            
            if (newTranslate >= 0) {
                flickityItems[numElement - 1].style.left = leftPositions[-1] + "%";
            }

            if (newTranslate >= leftPositions[-1] * -1) {
                flickityItems[numElement - 2].style.left = leftPositions[-2] + "%";
            }

            if (newTranslate <= leftPositions[numElement] * -1 + 100) {
                flickityItems[0].style.left = leftPositions[numElement] + "%";
            }

            if (newTranslate <= leftPositions[numElement + 1] * -1 + 100) {
                flickityItems[1].style.left = leftPositions[numElement + 1] + "%";
            }

            if (newTranslate <= leftPositions[numElement - 1] * -1 + 100 || newTranslate <= 0) {
                flickityItems[numElement - 1].style.left = leftPositions[numElement - 1] + "%";
            }

            if (newTranslate < leftPositions[-1] * -1) {
                flickityItems[numElement - 2].style.left = leftPositions[numElement - 2] + "%";
            }

            if (newTranslate > leftPositions[numElement] * -1 + 100) {
                flickityItems[0].style.left = leftPositions[0] + "%";
            }

            if (newTranslate > leftPositions[numElement + 1] * -1 + 100) {
                flickityItems[1].style.left = leftPositions[1] + "%";
            }


            // Xử lý lựa chọn item khi drag
            if (newSelectIndex >= selectIndex) {
                if (newTranslate < sliderTranslate[newSelectIndex] && sliderTranslate[newSelectIndex] - newTranslate > (sliderTranslate[newSelectIndex] - leftPositions[newSelectIndex] * -1) / 2) {
                    newSelectIndex++;
                    if (newSelectIndex > selectIndex + 1) {
                        selectIndex++;
                    }
                }

                if (sliderTranslate[selectIndex] - newTranslate < (sliderTranslate[selectIndex] - leftPositions[selectIndex] * -1) / 2 && selectIndex < newSelectIndex) {
                    newSelectIndex--;
                }
            }

            if (newSelectIndex <= selectIndex) {
                if (newTranslate > sliderTranslate[newSelectIndex] && newTranslate - sliderTranslate[newSelectIndex] > (sliderTranslate[newSelectIndex] - leftPositions[newSelectIndex] * -1) / 2) {
                    newSelectIndex--;
                    if (newSelectIndex < selectIndex - 1) {
                        selectIndex--;
                    }
                }

                if (newTranslate - sliderTranslate[selectIndex] < (sliderTranslate[selectIndex] - leftPositions[selectIndex] * -1) / 2 && selectIndex > newSelectIndex) {
                    newSelectIndex++;
                }
            }

            // Lặp lại slider khi item lựa chọn nằm ngoài range
            if (newSelectIndex < 0) {
                newSelectIndex = numElement + newSelectIndex;
                selectIndex = numElement + selectIndex;

                newTranslate = -1 * leftPositions[numElement - 1] + (newTranslate + leftPositions[-1]); 
                flickitySlider.style.transform = "translateX(" + newTranslate + "%)";

                flickityItems[0].style.left = leftPositions[numElement] + "%";
                flickityItems[1].style.left = leftPositions[numElement + 1] + "%";
                flickitySlider.children[numElement - 1].style.left = leftPositions[numElement - 1] + "%";
                flickitySlider.children[numElement - 2].style.left = leftPositions[numElement - 2] + "%";

                dragOriginalValue.translate = newTranslate;
                dragOriginalValue.x = e.clientX;
            }
            
            if (newSelectIndex > numElement - 1) {
                newSelectIndex = newSelectIndex - numElement;
                selectIndex = selectIndex - numElement;

                newTranslate = leftPositions[numElement - 1] + newTranslate - leftPositions[-1];
                flickitySlider.style.transform = "translateX(" + newTranslate + "%)";

                flickityItems[0].style.left = leftPositions[0] + "%";
                flickityItems[1].style.left = leftPositions[1] + "%";
                flickitySlider.children[numElement - 1].style.left = leftPositions[-1] + "%";
                flickitySlider.children[numElement - 2].style.left = leftPositions[-2] + "%";

                dragOriginalValue.translate = newTranslate;
                dragOriginalValue.x = e.clientX;
            }
        });

        document.documentElement.addEventListener("pointerup", () => {
            if (dragging) {
                dragging = false;
                flickityViewport.classList.remove("is-pointer-down");

                const numItems = flickitySlider.children.length;
                selectIndex = newSelectIndex;
                if (selectIndex == numItems) {
                    selectIndex = -1;
                    sellectFlickityItem(flickitySlider, flickityPageDots, selectIndex, leftPositions, sliderTranslate, false)
                        .then(() => {
                            selectIndex = 0;
                            sellectFlickityItem(flickitySlider, flickityPageDots, selectIndex, leftPositions, sliderTranslate, true);
                        })  
                }
                else if (selectIndex == -1) {
                    selectIndex = numItems;
                    sellectFlickityItem(flickitySlider, flickityPageDots, selectIndex, leftPositions, sliderTranslate, false)
                        .then(() => {
                            selectIndex = numItems - 1;
                            sellectFlickityItem(flickitySlider, flickityPageDots, selectIndex, leftPositions, sliderTranslate, true);
                        })  
                }
                else {
                    sellectFlickityItem(flickitySlider, flickityPageDots, selectIndex, leftPositions, sliderTranslate);
                }
            }
        })

        function calculatePositionValue(flickitySlider, leftPositions, sliderTranslate) {
            if (flickitySlider) {

                const flickityItems = flickitySlider.children;
                const numItems = flickityItems.length;
                let leftPosition = 0;
                const margin = 2;
        
                for (let i = 0; i < numItems; i++) {
                    const flickityItemWidth = flickityItems[i].clientWidth;
                    leftPositions[i] = leftPosition / flickityViewport.clientWidth * 100;
                    leftPosition += flickityItemWidth + margin;
                }
                leftPositions[-1] = (flickityItems[numItems - 1].clientWidth + margin) * -1 / flickityViewport.clientWidth * 100;
                leftPositions[-2] = leftPositions[-1] + (flickityItems[numItems - 2].clientWidth + margin) * -1 / flickityViewport.clientWidth * 100;
                leftPositions[numItems] = leftPositions[numItems - 1] + (flickityItems[0].clientWidth + margin) / flickityViewport.clientWidth * 100;
                leftPositions[numItems + 1] = leftPositions[numItems] + (flickityItems[1].clientWidth + margin) / flickityViewport.clientWidth * 100;
        
                for (let i = -1; i <= numItems; i++) {
                    sliderTranslate[i] = (leftPositions[i] + (leftPositions[i + 1] - leftPositions[i]) / 2 - 50) * -1;
                }
            }
        }

        function initalizeItemPosittionValue(flickityItems) {
            const numItems = flickityItems.length;

            for (let i = 0; i < numItems; i++) {
                flickityItems[i].style.position = "absolute";
                flickityItems[i].style.left = leftPositions[i] + "%";
            }
        }

        function calculateItemWidth(flickityViewport, flickitySlider) {
            if (flickityViewport && flickitySlider) {
                const itemWidth = window.getComputedStyle(flickitySlider.children[0]).width.replace("px", "");
                const viewportWidth = window.getComputedStyle(flickityViewport).width.replace("px", "");

                return Math.round(itemWidth / viewportWidth * 100);
            }

            return -1;
        }

        function sellectFlickityItem(flickitySlider, flickityPageDots, index = 0, leftPositions, sliderTranslate, transition = true,  select = true) { 
            return new Promise((resolve, reject) => {
                const flickityItems = flickitySlider.children;
                const numElement = flickityItems.length;

                if (numElement == 0) {
                    return;
                }

                const currentTranslate = Number.parseFloat(flickitySlider.style.getPropertyValue("transform").replace("translateX(", "").replace("%)", "")) || 0;
                const args = {
                    t: 0,
                    b: currentTranslate,
                    c: sliderTranslate[index],
                    d: 0.8,
                    fps: 60
                }

                if (!transition) {
                    args.d = 0;
                }

                handlerInteval && clearInterval(handlerInteval);

                handlerInteval = setInterval(() => {
                    const pos = move(handlerInteval, args, resolve);
                    flickitySlider.style.transform = "translateX(" + pos + "%)";

                    if (pos >= 0) {
                        flickityItems[numElement - 1].style.left = leftPositions[-1] + "%";
                    }

                    if (pos >= leftPositions[-1] * -1) {
                        flickityItems[numElement - 2].style.left = leftPositions[-2] + "%";
                    }

                    if (pos <= leftPositions[numElement] * -1 + 100) {
                        flickityItems[0].style.left = leftPositions[numElement] + "%";
                    }

                    if (pos <= leftPositions[numElement + 1] * -1 + 100) {
                        flickityItems[1].style.left = leftPositions[numElement + 1] + "%";
                    }

                    if (pos <= leftPositions[numElement - 1] * -1 + 100 || pos <= 0) {
                        flickityItems[numElement - 1].style.left = leftPositions[numElement - 1] + "%";
                    }

                    if (pos < leftPositions[-1] * -1) {
                        flickityItems[numElement - 2].style.left = leftPositions[numElement - 2] + "%";
                    }

                    if (pos > leftPositions[numElement] * -1 + 100) {
                        flickityItems[0].style.left = leftPositions[0] + "%";
                    }

                    if (pos > leftPositions[numElement + 1] * -1 + 100) {
                        flickityItems[1].style.left = leftPositions[1] + "%";
                    }
                }
                , args.d * 1000 / args.fps);

                if (select) {
                    const selectedItem = flickitySlider.querySelector(".is-selected");
                    selectedItem && selectedItem.classList.remove("is-selected");
                    flickityItems?.[index] && flickityItems[index].classList.add("is-selected");
            
                    const selectedDot = flickityPageDots.querySelector(".is-selected");
                    selectedDot && selectedDot.classList.remove("is-selected");
                    flickityPageDots.children?.[index] && flickityPageDots.children[index].classList.add("is-selected");
                }
            })
        } 
    }

    function move(handler, args) {
        const x = args.d != 0 ? args.t / args.d : 1;
        const result = easeOutQuart(x) * (args.c - args.b) + args.b;
        args.t += 1 / args.fps;

        if (args.t > args.d) {
            clearInterval(handler);
            if (arguments.length > 2) {
                if (typeof(arguments[2]) == "function") {
                    arguments[2]();
                }
            }
        }
        return result;
    }

    function easeOutQuart(x) {
        return 1 - Math.pow(1 - x, 4);
    }
}

export default flickityInitialize;






var Jigsaw = (function () {

    var Jigsaw = function (query) {
        this.container = document.querySelector(query);
    };

    var reverseMoving = true;

    var imageWidth = 600,
        imageHeight = 600;

    var JigsawSizeX = 0,
        JigsawSizeY = 0,
        JigsawWidth = 0,
        JigsawHeight = 0;

    var blockWidth = 0,
        blockHeight = 0,
        blocksLength = 0,
        blocksArray = [];

    var imageURL = '/images/capture.png';

    Jigsaw.prototype.play = function () {
        var root = this.container;

        initialize(root);

        bindEvent(root);
    };

    var createBlocks = function () {

        JigsawWidth = imageWidth;
        JigsawHeight = imageHeight;

        blockWidth = JigsawWidth / JigsawSizeX;
        blockHeight = JigsawHeight / JigsawSizeY;
        blocksLength = JigsawSizeX * JigsawSizeY;


        var classNameSet = {
            list: 'block-list',
            item: 'block-item'
        };


        var list = document.createElement('div');
        list.classList.add(classNameSet.list);

        list.style.width = JigsawWidth + 'px';
        list.style.height = JigsawHeight + 'px';


        var randomOrder = Array.apply(null, {
            length: blocksLength
        }).map(Number.call, Number).sort(() => 0.5 - Math.random());

        // randomOrder = [2, 3, 4, 5, 6, 7, 8, 1, 0];

        for (var i = 0; i < blocksLength; i++) {
            var item = document.createElement('div');
            item.classList.add(classNameSet.item);
            var orderIndex = randomOrder[i];
            var leftIndex = i;

            var locTopCurrent = Math.floor(orderIndex / JigsawSizeX) * blockHeight,
                locLeftCurrent = orderIndex % JigsawSizeX * blockWidth,
                locTopActually = Math.floor(leftIndex / JigsawSizeX) * blockHeight,
                locLeftActually = leftIndex % JigsawSizeX * blockWidth,

                offsetX = -leftIndex % JigsawSizeX * blockWidth,
                offsetY = -(Math.floor(leftIndex / JigsawSizeX) * blockHeight),
                backgroundImage = 'url(' + imageURL + ') ' + offsetX + 'px ' + offsetY + 'px ' + 'no-repeat';

            var blockStyle = {
                width: Math.ceil(blockWidth) + 'px',
                height: Math.ceil(blockHeight) + 'px',
                background: backgroundImage,
                top: locTopActually + 'px',
                left: locLeftActually + 'px',
                zIndex: leftIndex
            };

            item.setAttribute('orderIndex', orderIndex);

            for (var j in blockStyle) {
                item.style[j] = blockStyle[j];
            }

            list.appendChild(item);
            blocksArray.push({
                'element': item,
                'locCurrent': {
                    'left': locLeftCurrent,
                    'top': locTopCurrent
                },
                'locActually': {
                    'left': locLeftActually,
                    'top': locTopActually
                }
            });

        }

        return list;
    };


    var animate = function () {

        var MovingThing = (function () {
            var MovingThing = function (from, to) {
                if (reverseMoving) {
                    this.from = from;
                    this.to = to;
                } else {
                    this.from = to;
                    this.to = from;
                }
            };
            MovingThing.prototype.threshold = 0;

            MovingThing.prototype.crease = function (increase, decrease) {
                if (this.to - this.from > this.threshold) {
                    this.from = increase(this.from);
                } else if (this.to - this.from < this.threshold) {
                    this.from = decrease(this.from);
                }
            };
            MovingThing.prototype.isFinished = function () {
                return Math.abs(this.to - this.from) <= this.threshold;
            };

            MovingThing.prototype.current = function () {
                return this.from;
            };

            return MovingThing;
        })();

        var creaseFunction = {
            'increase': i => i + 2,
            'decrease': i => i - 2
        };

        var moveOneBlock = function (item) {
            var movingX = new MovingThing(item.locActually.left, item.locCurrent.left);
            var movingY = new MovingThing(item.locActually.top, item.locCurrent.top);
            var interval = setInterval(frame, 1);

            function frame() {
                if (movingX.isFinished() && movingY.isFinished()) {
                    clearInterval(interval);
                } else {
                    movingX.crease(creaseFunction.increase, creaseFunction.decrease);
                    movingY.crease(creaseFunction.increase, creaseFunction.decrease);
                    item.element.style.left = movingX.from + 'px';
                    item.element.style.top = movingY.from + 'px';
                }
            }
        };

        // console.log(blocksArray);

        blocksArray.forEach(block => {
            moveOneBlock(block);
        });
    };

    var initialize = function (root) {
        var messing = root.querySelector('#messing'),
            solving = root.querySelector('#solving');

        var play = root.querySelector('.play-panel');


        messing.addEventListener('click', () => {

            play.innerHTML = '';

            var row = root.querySelector('#row'),
                col = root.querySelector('#column');

            JigsawSizeX = row.value || 3;
            JigsawSizeY = col.value || 3;


            var _jigsaw = createBlocks();

            play.appendChild(_jigsaw);
            reverseMoving = true;
            animate();
        });

        solving.addEventListener('click', () => {
            reverseMoving = false;
            animate();
        });
    };

    var bindEvent = function (root) {
        var _jigsaw = root.querySelector('.play-panel');
        //     _jigsaw.addEventListener('mouseover', mouseOverHandler);
        //     _jigsaw.addEventListener('mouseout', mouseOutHandler);
        _jigsaw.addEventListener('mousedown', mouseDownHandler);
        document.addEventListener('mouseup', mouseUpHandler);


        var selectedItem = null;
        var offsetX = null,
            offsetY = null;

        function mouseDownHandler(event) {
            var target = event.target;
            selectedItem = target;
            document.addEventListener('mousemove', mouseMoveHandler);
            offsetX = event.offsetX;
            offsetY = event.offsetY;
        }


        function mouseUpHandler(event) {
            if (selectedItem) {
                document.removeEventListener('mousemove', mouseMoveHandler);
            }
        }

        function mouseMoveHandler(event) {

            var mouseX = event.clientX,
                mouseY = event.clientY;

            event.preventDefault();

            var panel = root.querySelector('.play-panel');

            selectedItem.style.left = (mouseX - panel.getBoundingClientRect().left - offsetX - 20) + 'px';
            selectedItem.style.top = (mouseY - panel.getBoundingClientRect().top - offsetY - 20) + 'px';

            // blocksArray.forEach(block => {
            //     if(block.element == selectedItem){
            //         block.locActually.left = selectedItem.style.left;
            //         block.locActually.top = selectedItem.style.top;
            //     }
            // });
        }
    };

    return Jigsaw;
})();

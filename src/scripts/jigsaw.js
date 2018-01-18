var Jigsaw = (function () {

    var Jigsaw = function (query, sizeX, sizeY) {
        this.container = document.querySelector(query);
        this.sizeX = sizeX || 3;
        this.sizeY = sizeY || 3;

    };

    var imageWidth = 300,
        imageHeight = 300;

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
        var play = root.querySelector('.play-panel');

        var _jigsaw = initialize(this.sizeX, this.sizeY);
        play.appendChild(_jigsaw);

        animate();

        bindEvent(_jigsaw);
    };

    var initialize = function (sizeX, sizeY) {

        JigsawSizeX = sizeX;
        JigsawSizeY = sizeY;

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

            var s = {
                width: Math.ceil(blockWidth) + 'px',
                height: Math.ceil(blockHeight) + 'px',
                background: backgroundImage,
                left: locTopCurrent + 'px',
                top: locLeftCurrent + 'px',
                zIndex: leftIndex
            };
            item.setAttribute('orderIndex', orderIndex);

            for (var j in s) {
                item.style[j] = s[j];
            }

            list.appendChild(item);
            blocksArray.push({
                'element': item,
                'locCurrent': {
                    'locLeft': locLeftCurrent,
                    'locTop': locTopCurrent
                },
                'locActually': {
                    'locLeft': locLeftActually,
                    'locTop': locTopActually
                }
            });

        }

        return list;
    };

    function quad(timeFraction) {
        if (timeFraction == 0) timeFraction = 2;
        return Math.pow(timeFraction, 2);
    }

    var animate = function () {
        var item = blocksArray[0];
        var left = item.locActually.locLeft;
        var top = item.locActually.locTop;
        var id = setInterval(frame, 10);

        function frame() {
            if (left == item.locCurrent.locLeft || top == item.locCurrent.locTop) {
                clearInterval(id);
                console.log('object');
            } else {
                left = quad(left);
                top = quad(top);
                item.element.style.top = top + 'px';
                item.element.style.left = left + 'px';
            }
            console.log([item.locActually.locLeft, item.locCurrent.locLeft, left]);
            console.log([item.locActually.locTop, item.locCurrent.locTop, top]);
        }
    };

    var bindEvent = function (_jigsaw) {
        _jigsaw.addEventListener('mouseover', mouseOverHandler);
        _jigsaw.addEventListener('mouseout', mouseOutHandler);
        _jigsaw.addEventListener('mousedown', mouseDownHandler);
        _jigsaw.addEventListener('mouseup', mouseUpHandler);

        function mouseOverHandler(event) {
            var target = event.target;
            console.log('mouseOverHandler', target);
        }


        function mouseOutHandler(event) {
            var target = event.target;
            console.log(target);

        }

        function mouseDownHandler(event) {
            var target = event.target;
            console.log(target);

        }


        function mouseUpHandler(event) {
            var target = event.target;
            console.log(target);
        }
    };


    return Jigsaw;
})();

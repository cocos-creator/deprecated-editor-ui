Polymer({
    publish: {
        vertical: { value: false, reflect: true },
        hide: { value: false, reflect: true },
    },

    ready: function () {
        if ( Fire.isWin32 ) {
            this.classList.add('platform-win');
        }
    },

    // NOTE: previousElementSibling & nextElementSibling must be resizable mixins
    domReady: function () {
        if ( this.previousElementSibling && this.nextElementSibling ) {
            this.finalizeStyle();
            this.reflow();
        }
    },

    finalizeStyle: function () {
        var elements = [this.previousElementSibling, this.nextElementSibling];
        var i, el, size;
        var hasAutoLayout = false;

        for ( i = 0; i < elements.length; ++i ) {
            el = elements[i];

            if ( this.vertical ) {
                size = el.computedWidth;
            }
            else {
                size = el.computedHeight;
            }

            if ( size === 'auto' ) {
                hasAutoLayout = true;
                el.style.flex = "1 1 auto";
            }
            else {
                // if this is last el and we don't have auto-layout elements, give rest size to last el
                if ( i === (elements.length-1) && !hasAutoLayout ) {
                    el.style.flex = "1 1 auto";
                }
                else {
                    el.style.flex = "0 0 " + size + "px";
                }
            }
        }

        this.previousElementSibling._notifyResize();
        this.nextElementSibling._notifyResize();
    },

    reflow: function () {
        var elements = [this.previousElementSibling, this, this.nextElementSibling];
        var i, rect, el;
        var sizeList = [];
        var totalSize = 0;

        for ( i = 0; i < elements.length; ++i ) {
            el = elements[i];

            rect = el.getBoundingClientRect();
            var size = Math.floor(this.vertical ? rect.width : rect.height);
            sizeList.push(size);
            totalSize += size;
        }

        for ( i = 0; i < elements.length; ++i ) {
            el = elements[i];
            if ( el === this )
                continue;

            var ratio = sizeList[i]/totalSize;
            el.style.flex = ratio + " " + ratio + " " + sizeList[i] + "px";
        }
    },

    mousedownAction: function (event) {
        var pressX = event.clientX;
        var pressY = event.clientY;

        if ( Fire.isWin32 ) {
            EditorUI.addDragGhost( this.vertical ? 'ew-resize' : 'ns-resize' );
        }
        else {
            EditorUI.addDragGhost( this.vertical ? 'col-resize' : 'row-resize' );
        }

        var prevRect = this.previousElementSibling.getBoundingClientRect();
        var nextRect = this.nextElementSibling.getBoundingClientRect();
        var parentRect = null;
        if ( this.parentElement ) {
            parentRect = this.parentElement.getBoundingClientRect();
        }
        else if ( this.parentNode.host ) {
            parentRect = this.parentNode.host.getBoundingClientRect();
        }
        var totalSize = this.vertical ? parentRect.width : parentRect.height;
        totalSize -= 3; // remove splitter space

        var mousemoveHandle = function (event) {
            var offsetX = event.clientX - pressX;
            var offsetY = event.clientY - pressY;
            var size;
            var minPrevSize = this.vertical ?
                this.previousElementSibling.computedMinWidth :
                this.previousElementSibling.computedMinHeight
                ;
            var minNextSize = this.vertical ?
                this.nextElementSibling.computedMinWidth :
                this.nextElementSibling.computedMinHeight
                ;

            // prev
            if ( this.vertical ) {
                size = prevRect.width + offsetX;
            }
            else {
                size = prevRect.height + offsetY;
            }
            if ( size < minPrevSize ) {
                size = minPrevSize;
            }
            if ( totalSize - size < minNextSize ) {
                size = totalSize - minNextSize;
            }
            this.previousElementSibling.style.flex = "0 0 " + size + "px";

            // next
            if ( this.vertical ) {
                size = nextRect.width - offsetX;
            }
            else {
                size = nextRect.height - offsetY;
            }
            if ( size < minNextSize ) {
                size = minNextSize;
            }
            if ( totalSize - size < minPrevSize ) {
                size = totalSize - minPrevSize;
            }
            this.nextElementSibling.style.flex = "0 0 " + size + "px";

            //
            this.previousElementSibling.dispatchEvent( new CustomEvent('resize') );
            this.nextElementSibling.dispatchEvent( new CustomEvent('resize') );
        }.bind(this);

        var mouseupHandle = function (event) {
            document.removeEventListener('mousemove', mousemoveHandle);
            document.removeEventListener('mouseup', mouseupHandle);
            EditorUI.removeDragGhost();

            prevRect = this.previousElementSibling.getBoundingClientRect();
            nextRect = this.nextElementSibling.getBoundingClientRect();
            var ratio = 1;
            if ( this.vertical ) {
                ratio = nextRect.width / prevRect.width;
                this.previousElementSibling.style.flex = "1 1 " + prevRect.width + "px";
                this.nextElementSibling.style.flex = ratio + " " + ratio + " " + nextRect.width + "px";
            }
            else {
                ratio = nextRect.height / prevRect.height;
                this.previousElementSibling.style.flex = "1 1 " + prevRect.height + "px";
                this.nextElementSibling.style.flex = ratio + " " + ratio + " " + nextRect.height + "px";
            }

        }.bind(this);

        document.addEventListener ( 'mousemove', mousemoveHandle );
        document.addEventListener ( 'mouseup', mouseupHandle );
    },
});

Polymer({
    publish: {
        vertical: {
            value: false,
            reflect: true
        },
    },

    ready: function () {
        if ( Fire.isWin32 ) {
            this.classList.add('platform-win');
        }
    },

    domReady: function () {
        this._reflow();
    },

    _reflow: function () {
        if ( this.previousElementSibling && this.nextElementSibling ) {
            var elements = [this.previousElementSibling, this.nextElementSibling];
            var i, element, size, hasAutoLayout = false;
            for ( i = 0; i < elements.length; ++i ) {
                element = elements[i];
                element._autoLayout = false;
                if ( this.vertical ) {
                    size = element.computedWidth;
                }
                else {
                    size = element.computedHeight;
                }

                if ( size !== -1 && !element['auto-layout'] ) {
                    // if this is last element and we don't have auto-layout elements, give rest size to last element
                    if ( i === (elements.length-1) && !hasAutoLayout ) {
                        element.style.flex = "auto";
                        element._autoLayout = true;
                    }
                    else {
                        element.style.flex = "0 0 " + size + "px";
                    }
                }
                else {
                    element.style.flex = "auto";
                    element._autoLayout = true;
                    hasAutoLayout = true;
                }
            }

            this.previousElementSibling.fire('resize');
            this.nextElementSibling.fire('resize');
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
        var parentRect = this.parentElement.getBoundingClientRect();
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

            if ( !this.previousElementSibling._autoLayout ) {
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
            }

            if ( !this.nextElementSibling._autoLayout ) {
                if ( this.vertical ) {
                    size = nextRect.width - offsetX;
                    minSize = this.nextElementSibling.computedMinWidth;
                }
                else {
                    size = nextRect.height - offsetY;
                    minSize = this.nextElementSibling.computedMinHeight;
                }
                if ( size < minNextSize ) {
                    size = minNextSize;
                }
                if ( totalSize - size < minPrevSize ) {
                    size = totalSize - minPrevSize;
                }
                this.nextElementSibling.style.flex = "0 0 " + size + "px";
            }
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

function _resize ( elementList, sizeList,
                   prevTotalSize, prevMinSize, prevMaxSize,
                   nextTotalSize, nextMinSize, nextMaxSize,
                   vertical, resizerIndex, offset ) {
    var expectSize, newPrevSize, newNextSize;
    var prevOffset, nextOffset;
    var prevIndex, nextIndex;
    var dir = Math.sign(offset);

    if ( dir > 0 ) {
        prevIndex = resizerIndex - 1;
        nextIndex = resizerIndex + 1;
    }
    else {
        prevIndex = resizerIndex + 1;
        nextIndex = resizerIndex - 1;
    }

    prevOffset = offset;

    // prev
    var prevEL = elementList[prevIndex];
    var prevSize = sizeList[prevIndex];
    if ( !prevEL._autoLayout ) {
        expectSize = prevSize + prevOffset * dir;
        if ( vertical )
            newPrevSize = prevEL.calcWidth(expectSize);
        else
            newPrevSize = prevEL.calcHeight(expectSize);

        prevOffset = (newPrevSize - prevSize) * dir;
    }

    // next
    var nextEL = elementList[nextIndex];
    var nextSize = sizeList[nextIndex];

    while (1) {
        if ( !nextEL._autoLayout ) {
            expectSize = nextSize - prevOffset * dir;
            if ( vertical )
                newNextSize = nextEL.calcWidth(expectSize);
            else
                newNextSize = nextEL.calcHeight(expectSize);

            nextOffset = (newNextSize - nextSize) * dir;

            // // DEBUG:
            // console.log("nextEL = " + nextEL.name +
            //             ", newNextSize = " + newNextSize +
            //             ", nextSize = " + nextSize +
            //             ", prevOffset = " + prevOffset +
            //             ", nextOffset = " + nextOffset
            //            );
            nextEL.style.flex = "0 0 " + newNextSize + "px";

            if ( newNextSize - expectSize === 0 ) {
                break;
            }

            //
            prevOffset += nextOffset;
        }

        //
        if ( dir > 0 ) {
            nextIndex += 2;
            if ( nextIndex >= elementList.length ) {
                break;
            }
        }
        else {
            nextIndex -= 2;
            if ( nextIndex < 0 ) {
                break;
            }
        }

        nextEL = elementList[nextIndex];
        nextSize = sizeList[nextIndex];
    }

    // re-calculate newPrevSize
    if ( dir > 0 ) {
        if ( nextTotalSize - offset * dir <= nextMinSize ) {
            prevOffset = (nextTotalSize - nextMinSize) * dir;
            newPrevSize = prevSize + prevOffset * dir;
        }
    }
    else {
        if ( prevTotalSize - offset * dir <= prevMinSize ) {
            prevOffset = (prevTotalSize - prevMinSize) * dir;
            newPrevSize = prevSize + prevOffset * dir;
        }
    }

    //
    if ( !prevEL._autoLayout ) {
        prevEL.style.flex = "0 0 " + newPrevSize + "px";
    }

    for ( var i = 0; i < elementList.length; ++i ) {
        var el = elementList[i];
        if ( el instanceof FireDockResizer )
            continue;

        el._notifyResize();
    }
}

Polymer({
    publish: {
        vertical: {
            value: false,
            reflect: true
        },
        space: 3,
        active: {
            value: false,
            reflect: true
        },
    },

    ready: function () {
        if ( Fire.isWin32 ) {
            this.classList.add('platform-win');
        }
    },

    mousedownAction: function ( event ) {
        this.active = true;
        var pressx = event.clientX;
        var pressy = event.clientY;
        var parentEL = this.parentElement;
        var i, resizerIndex = -1;
        var rect;
        var totalSize = -1;
        var sizeList = [];

        // get parent size
        if ( parentEL.$.content ) {
            rect = parentEL.$.content.getBoundingClientRect();
        }
        else {
            rect = parentEL.getBoundingClientRect();
        }
        totalSize = this.vertical ? rect.width : rect.height;

        // get element size
        for ( i = 0; i < parentEL.children.length; ++i ) {
            var el = parentEL.children[i];
            if ( el === this ) {
                resizerIndex = i;
            }

            rect = el.getBoundingClientRect();
            sizeList.push( this.vertical ? rect.width : rect.height );
        }

        //
        var prevTotalSize = 0;
        var prevMinSize = 0;
        var prevMaxSize = 0;
        var nextTotalSize = 0;
        var nextMinSize = 0;
        var nextMaxSize = 0;

        for ( i = 0; i < resizerIndex; i += 2 ) {
            prevTotalSize += sizeList[i];
            prevMinSize +=
                this.vertical ?
                parentEL.children[i].computedMinWidth :
                parentEL.children[i].computedMinHeight;

            prevMaxSize +=
                this.vertical ?
                parentEL.children[i].computedMaxWidth :
                parentEL.children[i].computedMaxHeight;
        }

        for ( i = resizerIndex+1; i < parentEL.children.length; i += 2 ) {
            nextTotalSize += sizeList[i];
            nextMinSize +=
                this.vertical ?
                parentEL.children[i].computedMinWidth :
                parentEL.children[i].computedMinHeight;

            nextMaxSize +=
                this.vertical ?
                parentEL.children[i].computedMaxWidth :
                parentEL.children[i].computedMaxHeight;
        }

        // mousemove
        var mousemoveHandle = function (event) {
            var expectSize, newPrevSize, newNextSize;
            var offset, prevOffset, nextOffset;

            // get offset
            if ( this.vertical ) {
                offset = event.clientX - pressx;
            }
            else {
                offset = event.clientY - pressy;
            }

            //
            if ( offset !== 0 ) {
                _resize( parentEL.children, sizeList,
                        prevTotalSize, prevMinSize, prevMaxSize,
                        nextTotalSize, nextMinSize, nextMaxSize,
                        this.vertical, resizerIndex, offset );
            }

            //
            event.stopPropagation();
        }.bind(this);

        // mouseup
        var mouseupHandle = function(event) {
            document.removeEventListener('mousemove', mousemoveHandle);
            document.removeEventListener('mouseup', mouseupHandle);
            EditorUI.removeDragGhost();


            this.active = false;
            event.stopPropagation();
        }.bind(this);

        // add drag-ghost
        if ( Fire.isWin32 ) {
            EditorUI.addDragGhost( this.vertical ? 'ew-resize' : 'ns-resize' );
        }
        else {
            EditorUI.addDragGhost( this.vertical ? 'col-resize' : 'row-resize' );
        }
        document.addEventListener ( 'mousemove', mousemoveHandle );
        document.addEventListener ( 'mouseup', mouseupHandle );

        //
        event.stopPropagation();
    },
});

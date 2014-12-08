(function () {
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
                var dir, offset, prevOffset, nextOffset;

                // get offset
                if ( this.vertical ) {
                    offset = event.clientX - pressx;
                    dir = event.movementX;
                }
                else {
                    offset = event.clientY - pressy;
                    dir = event.movementY;
                }

                // positive move
                if ( dir > 0 ) {
                    // prev
                    var prevEL = parentEL.children[resizerIndex-1];
                    var prevSize = sizeList[resizerIndex-1];
                    if ( !prevEL._autoLayout ) {
                        expectSize = prevSize + offset;
                        if ( this.vertical )
                            newPrevSize = prevEL.calcWidth(expectSize);
                        else
                            newPrevSize = prevEL.calcHeight(expectSize);

                        prevOffset = newPrevSize - prevSize;
                    }

                    // next
                    var nextIndex = resizerIndex+1;
                    var nextEL = parentEL.children[nextIndex];
                    var nextSize = sizeList[nextIndex];

                    while (1) {
                        if ( !nextEL._autoLayout ) {
                            expectSize = nextSize - prevOffset;
                            if ( this.vertical )
                                newNextSize = nextEL.calcWidth(expectSize);
                            else
                                newNextSize = nextEL.calcHeight(expectSize);

                            nextOffset = newNextSize - nextSize;

                            // // DEBUG:
                            // console.log("nextEL = " + nextEL.name + 
                            //             ", newNextSize = " + newNextSize +
                            //             ", nextSize = " + nextSize +
                            //             ", prevOffset = " + prevOffset +
                            //             ", nextOffset = " + nextOffset
                            //            );
                            nextEL.style.flex = "0 0 " + newNextSize + "px";
                            // TODO: compare and nextEL.fire( "resized", { target: this.target } );

                            if ( newNextSize - expectSize === 0 ) {
                                break;
                            }

                            //
                            prevOffset += nextOffset;
                        }

                        // 
                        nextIndex += 2;
                        if ( nextIndex >= parentEL.children.length ) {
                            break;
                        }

                        nextEL = parentEL.children[nextIndex];
                        nextSize = sizeList[nextIndex];
                    }
                    
                    // re-calculate newPrevSize
                    if ( nextTotalSize - offset <= nextMinSize ) {
                        offset = nextTotalSize - nextMinSize;
                        newPrevSize = prevSize + offset;
                    }

                    //
                    if ( !prevEL._autoLayout ) {
                        prevEL.style.flex = "0 0 " + newPrevSize + "px";
                        // TODO: compare and prevEL.fire( "resized", { target: this.target } );
                    }
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
            EditorUI.addDragGhost( this.vertical ? 'col-resize' : 'row-resize' );
            document.addEventListener ( 'mousemove', mousemoveHandle );
            document.addEventListener ( 'mouseup', mouseupHandle );

            //
            event.stopPropagation();
        },
    });
})();

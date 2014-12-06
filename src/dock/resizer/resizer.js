(function () {
    Polymer({
        publish: {
            vertical: {
                value: false,
                reflect: true
            },
            space: 3,
        },

        mousedownAction: function ( event ) {
            var prevEL = this.previousElementSibling;
            var nextEL = this.nextElementSibling;
            var pressx = event.clientX;
            var pressy = event.clientY;
            var rect, prevSize, nextSize;

            // get prevSize
            rect = prevEL.getBoundingClientRect();
            prevSize = this.vertical ? rect.width : rect.height;

            // get nextSize
            rect = nextEL.getBoundingClientRect();
            nextSize = this.vertical ? rect.width : rect.height;

            // mousemove
            var mousemoveHandle = function (event) {
                var offset;
                if ( this.vertical ) {
                    offset = event.clientX - pressx;
                }
                else {
                    offset = event.clientY - pressy;
                }

                //
                var size = -1;
                if ( !prevEL._autoLayout ) {
                    size = prevSize + offset;
                    console.log( "prevSize = " + prevSize + " new = " + size);
                    if ( this.vertical )
                        size = prevEL.calcWidth(size);
                    else
                        size = prevEL.calcHeight(size);

                    prevEL.style.flex = "0 0 " + size + "px";
                    // TODO: prevEL.fire( "resized", { target: this.target } );
                }

                //
                if ( !nextEL._autoLayout ) {
                    size = nextSize - offset;
                    console.log( "nextSize = " + nextSize + " new = " + size);
                    if ( this.vertical )
                        size = nextEL.calcWidth(size);
                    else
                        size = nextEL.calcHeight(size);

                    nextEL.style.flex = "0 0 " + size + "px";
                    // TODO: nextEL.fire( "resized", { target: this.target } );
                }

                //
                event.stopPropagation();
            }.bind(this);

            // mouseup
            var mouseupHandle = function(event) {
                document.removeEventListener('mousemove', mousemoveHandle);
                document.removeEventListener('mouseup', mouseupHandle);
                EditorUI.removeDragGhost();

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

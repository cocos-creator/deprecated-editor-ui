(function () {
    Polymer('fire-ui-resizer', {
        publish: {
            inverse: {
                value: false,
                reflect: true
            },
            vertical: {
                value: false,
                reflect: true
            }
        },

        created: function () {
            this.target = null;
        },

        ready: function () {
            if ( this.vertical ) {
                this.classList.toggle('vertical', true);
                this.classList.toggle('horizontal', false);
            }
            else {
                this.classList.toggle('vertical', false);
                this.classList.toggle('horizontal', true);
            }
        },

        mousedownAction: function ( event ) {
            if ( this.target ) {
                // add drag-ghost
                FIRE.addDragGhost( this.vertical ? 'col-resize' : 'row-resize' );

                var targetRect = this.target.getBoundingClientRect();
                var mouseDownX = event.clientX;
                var mouseDownY = event.clientY;

                var updateMouseMove = function (event) {
                    var offset = -1; 
                    if ( this.vertical ) {
                        offset = event.clientX - mouseDownX;
                        offset = this.inverse ? -offset : offset;
                        this.target.style.width = (targetRect.width + offset) + "px";
                    }
                    else {
                        offset = event.clientY - mouseDownY;
                        offset = this.inverse ? -offset : offset;
                        this.target.style.height = (targetRect.height + offset) + "px";
                    }

                    this.fire( "resized", { target: this.target } );

                    //
                    event.stopPropagation();
                };
                updateMouseMove.call(this,event);

                var mouseMoveHandle = updateMouseMove.bind(this);
                var mouseUpHandle = (function(event) {
                    document.removeEventListener('mousemove', mouseMoveHandle);
                    document.removeEventListener('mouseup', mouseUpHandle);

                    FIRE.removeDragGhost();
                    event.stopPropagation();
                }).bind(this);
                document.addEventListener ( 'mousemove', mouseMoveHandle );
                document.addEventListener ( 'mouseup', mouseUpHandle );
            }

            event.stopPropagation();
        },
    });
})();

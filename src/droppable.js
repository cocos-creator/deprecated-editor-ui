EditorUI.droppable = (function () {
    var droppable = {
        publish: {
            droppable: {
                value: "file",
                reflect: true
            },
            "single-drop": {
                value: false,
                reflect: true
            },
        },

        _initDroppable: function ( dropAreaElement ) {
            this._dragenterCnt = 0;

            dropAreaElement.addEventListener( "dragenter", function (event) {
                event.stopPropagation();
                ++this._dragenterCnt;
                if ( this._dragenterCnt === 1 ) {
                    this.checkIfDroppable( event.dataTransfer, function ( dragType, dragItems ) {
                        this.fire('drop-area-enter', {
                            dragType: dragType,
                            dragItems: dragItems,
                            dataTransfer: event.dataTransfer
                        });
                    });
                }
            }.bind(this));

            dropAreaElement.addEventListener( "dragleave", function (event) {
                event.stopPropagation();
                --this._dragenterCnt;
                if ( this._dragenterCnt === 0 ) {
                    this.checkIfDroppable( event.dataTransfer, function ( dragType, dragItems ) {
                        this.fire('drop-area-leave', {
                            dragType: dragType,
                            dragItems: dragItems,
                            dataTransfer: event.dataTransfer
                        });
                    });
                }
            }.bind(this));

            dropAreaElement.addEventListener( "drop", function (event) {
                event.stopPropagation();
                this._dragenterCnt = 0;

                this.checkIfDroppable( event.dataTransfer, function ( dragType, dragItems ) {
                    event.preventDefault();
                    event.stopPropagation();

                    EditorUI.DragDrop.end();

                    this.fire('drop-area-accept', {
                        dragType: dragType,
                        dragItems: dragItems,
                        dataTransfer: event.dataTransfer
                    });
                });
            }.bind(this));
        },

        checkIfDroppable: function ( dataTransfer, fn ) {
            var droppableList = this.droppable.split(',');
            var dragType = EditorUI.DragDrop.type(dataTransfer);

            var found = false;
            for ( var i = 0; i < droppableList.length; ++i ) {
                if ( dragType === droppableList[i] ) {
                    found = true;
                    break;
                }
            }

            if ( !found )
                return;

            var dragItems = EditorUI.DragDrop.items(dataTransfer);
            if ( this['single-drop'] && dragItems.length > 1 )
                return;

            fn.call( this, dragType, dragItems );
        },
    };

    return droppable;
})();

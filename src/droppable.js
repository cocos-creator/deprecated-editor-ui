var EditorUI;
(function (EditorUI) {
    EditorUI.droppable = {
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
            }.bind(this), true);

            dropAreaElement.addEventListener( "dragleave", function (event) {
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
            }.bind(this), true);

            dropAreaElement.addEventListener( "drop", function (event) {
                this._dragenterCnt = 0;
            }.bind(this), true);

            dropAreaElement.addEventListener( "drop", function (event) {
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
})(EditorUI || (EditorUI = {}));

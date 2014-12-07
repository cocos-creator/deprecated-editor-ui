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
                    this.fire('drag-area-enter', { dataTransfer: event.dataTransfer } );
                }
            }.bind(this), true);

            dropAreaElement.addEventListener( "dragleave", function (event) {
                --this._dragenterCnt;
                if ( this._dragenterCnt === 0 ) {
                    this.fire('drag-area-leave', { dataTransfer: event.dataTransfer });
                }
            }.bind(this), true);

            dropAreaElement.addEventListener( "drop", function (event) {
                this._dragenterCnt = 0;
            }.bind(this), true);
        },
    };
})(EditorUI || (EditorUI = {}));

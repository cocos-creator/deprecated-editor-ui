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
                    this.fire('drag-area-enter');
                }
            }.bind(this), true);

            dropAreaElement.addEventListener( "dragleave", function (event) {
                --this._dragenterCnt;
                if ( this._dragenterCnt === 0 ) {
                    this.fire('drag-area-leave');
                }
            }.bind(this), true);
        },
    };
})(EditorUI || (EditorUI = {}));

(function () {
    Polymer(EditorUI.mixin({
        publish: {
            value: null,
            type: "Fire.FObject",
            highlighted: {
                value: false,
                reflect: true,
            },
            invalid: {
                value: false,
                reflect: true,
            },
        },

        ready: function () {
            this._curDragObject = null;
            this._initFocusable(this.$.focus);
            this._initDroppable(this.$.dropArea);
        },

        typeToName: function (val) {
            var name = val;
            if ( name.substr(0,5) === "Fire." ) {
                return name.substr(5);
            }
            return name;
        },

        blurAction: function (event) {
            if ( this.focused === false )
                return;

            if ( EditorUI.find( this.shadowRoot, event.relatedTarget ) )
                return;

            this._blurAction();
        },

        borderClickAction: function (event) {
            event.stopPropagation();

            if ( Fire.hintObject ) {
                Fire.hintObject(this.value);
            }
        },

        browseClickAction: function (event) {
            event.stopPropagation();

            if ( Fire.browseObject ) {
                Fire.browseObject( Fire.getClassByName(this.type) );
            }
        },

        resetDragState: function () {
            this._curDragObject = null;
            this.highlighted = false;
            this.invalid = false;
        },

        dragAreaEnterAction: function (event) {
            var dragItems = EditorUI.DragDrop.items(event.detail.dataTransfer);
            var dragType = EditorUI.DragDrop.type(event.detail.dataTransfer);

            if ( dragItems.length === 1 && dragType === "asset" ) {
                Fire.AssetLibrary.loadAssetByUuid( dragItems[0], function (asset) {
                    var classDef = Fire.getClassByName(this.type);
                    if ( asset instanceof classDef ) {
                        this._curDragObject = asset;
                        this.highlighted = true;
                        this.invalid = false;
                    }
                    else {
                        this.highlighted = true;
                        this.invalid = true;
                    }
                }.bind(this) );
            }
            else {
                this.highlighted = true;
                this.invalid = true;
            }
        },

        dragAreaLeaveAction: function (event) {
            this.resetDragState();
        },

        dropAction: function (event) {
            if ( !this.invalid )
                this.value = this._curDragObject;

            this.resetDragState();
        },

    }, EditorUI.focusable, EditorUI.droppable));
})();

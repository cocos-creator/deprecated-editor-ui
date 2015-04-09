Polymer(EditorUI.mixin({
    publish: {
        value: null,
        highlighted: {
            value: false,
            reflect: true,
        },
        invalid: {
            value: false,
            reflect: true,
        },

        // droppable
        droppable: 'asset',
        "single-drop": true,
    },

    ready: function () {
        this._curDragUuid = null;
        this._inDropArea = false;

        this._initFocusable(this.$.focus);
        this._initDroppable(this.$.dropArea);
    },

    toClassName: function ( val ) {
        if ( !val )
            return "None";

        var classID = Editor.compressUuid(val);
        var classDef = Fire.JS._getClassById(classID);
        var className = Fire.JS.getClassName(classDef);
        return className;
    },

    setUuid: function ( uuid ) {
        this.value = uuid;
        EditorUI.fireChanged(this);
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

        if ( Editor.hintObjectById ) {
            Editor.hintObjectById( Fire.ScriptAsset, this.value );
        }
    },

    browseClickAction: function (event) {
        event.stopPropagation();

        if ( Editor.browseObject ) {
            Editor.browseObject( Fire.JS.getClassByName(this.ScriptAsset), this );
        }
    },

    resetDragState: function () {
        this._curDragUuid = null;
        this._inDropArea = false;
        this.highlighted = false;
        this.invalid = false;
    },

    dropAreaEnterAction: function (event) {
        event.stopPropagation();

        this.invalid = true;
        this._inDropArea = true;

        var dragItems = event.detail.dragItems;

        var entity, value;

        //
        Fire.AssetLibrary.loadAssetInEditor( dragItems[0], function (err, asset) {
            if ( asset instanceof Fire.ScriptAsset ) {
                if ( !this._inDropArea ) {
                    return;
                }

                this._curDragUuid = asset._uuid;
                this.highlighted = true;
                this.invalid = false;
            }
            else {
                this.highlighted = true;
                this.invalid = true;
            }
        }.bind(this) );
    },

    dropAreaLeaveAction: function (event) {
        event.stopPropagation();

        this.resetDragState();
    },

    dropAreaAcceptAction: function (event) {
        event.stopPropagation();

        if ( !this.invalid ) {
            this.value = this._curDragUuid;
            EditorUI.fireChanged(this);
        }

        this.resetDragState();
    },

    // DISABLE:
    // dropAreaDragoverAction: function (event) {
    //     event.stopPropagation();

    //     if ( !this.invalid ) {
    //         EditorUI.DragDrop.allowDrop( event.detail.dataTransfer, true );
    //         EditorUI.DragDrop.updateDropEffect(event.detail.dataTransfer, "copy");
    //     }
    //     else {
    //         EditorUI.DragDrop.allowDrop( event.detail.dataTransfer, false );
    //     }
    // },

}, EditorUI.focusable, EditorUI.droppable));

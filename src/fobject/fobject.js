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

        // droppable
        droppable: 'asset,entity',
        "single-drop": true,
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
            Fire.browseObject( Fire.getClassById(this.type) );
        }
    },

    resetDragState: function () {
        this._curDragObject = null;
        this.highlighted = false;
        this.invalid = false;
    },

    dropAreaEnterAction: function (event) {
        event.stopPropagation();

        this.invalid = true;

        var dragItems = event.detail.dragItems;
        var dragType = event.detail.dragType;

        //
        var classDef = Fire.getClassById(this.type);
        if ( dragType === "asset" && Fire.isChildClassOf( classDef, Fire.Asset ) ) {
            Fire.AssetLibrary.loadAsset( dragItems[0], function (asset) {
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
        else if ( dragType === "entity" && Fire.isChildClassOf( classDef, Fire.Entity ) ) {
            // TODO
            this.highlighted = true;
            this.invalid = true;
        }
        else if ( dragType === "entity" && Fire.isChildClassOf( classDef, Fire.Component ) ) {
            // TODO
            this.highlighted = true;
            this.invalid = true;
        }
        else {
            this.highlighted = true;
            this.invalid = true;
        }
    },

    dropAreaLeaveAction: function (event) {
        event.stopPropagation();

        this.resetDragState();
    },

    dropAreaAcceptAction: function (event) {
        event.stopPropagation();

        if ( !this.invalid )
            this.value = this._curDragObject;

        this.resetDragState();
    },

}, EditorUI.focusable, EditorUI.droppable));

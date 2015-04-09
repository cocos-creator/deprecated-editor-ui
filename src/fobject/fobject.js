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
        this._inDropArea = false;

        this._initFocusable(this.$.focus);
        this._initDroppable(this.$.dropArea);
    },

    typeToName: function (val) {
        var name = val;
        if ( name.substr(0,5) === "Fire." ) {
            name = name.substr(5);
        }

        var classDef = Fire.JS.getClassByName(this.type);
        if ( Fire.isChildClassOf( classDef, Fire.Asset ) ) {
            name = 'Asset/' + name;
        }
        else if ( Fire.isChildClassOf( classDef, Fire.Component ) ) {
            name = 'Component/' + name;
        }

        return name;
    },

    toFObjectName: function ( val ) {
        var classDef = Fire.JS.getClassByName(this.type);
        if ( Fire.isChildClassOf( classDef, Fire.Asset ) ) {
            return val ? val.name : "None";
        }
        else if ( Fire.isChildClassOf( classDef, Fire.Entity ) ) {
            return val ? val.name : "None";
        }
        else if ( Fire.isChildClassOf( classDef, Fire.Component ) ) {
            return val ? val.entity.name : "None";
        }

        return val ? val.name : "None";
    },

    setAsset: function ( uuid ) {
        if ( !uuid ) {
            this.value = null;
            EditorUI.fireChanged(this);
        }
        else {
            Fire.AssetLibrary.loadAssetInEditor( uuid, function (err, asset) {
                this.value = asset;
                EditorUI.fireChanged(this);
            }.bind(this) );
        }
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

        if ( Editor.hintObject ) {
            Editor.hintObject(this.value);
        }
    },

    browseClickAction: function (event) {
        event.stopPropagation();

        if ( Editor.browseObject ) {
            Editor.browseObject( Fire.JS.getClassByName(this.type), this );
        }
    },

    resetDragState: function () {
        this._curDragObject = null;
        this._inDropArea = false;
        this.highlighted = false;
        this.invalid = false;
    },

    dropAreaEnterAction: function (event) {
        event.stopPropagation();

        this.invalid = true;
        this._inDropArea = true;

        var dragItems = event.detail.dragItems;
        var dragType = event.detail.dragType;

        var entity, value;

        //
        var classDef = Fire.JS.getClassByName(this.type);
        if ( dragType === "asset" && Fire.isChildClassOf( classDef, Fire.Asset ) ) {
            Fire.AssetLibrary.loadAssetInEditor( dragItems[0], function (err, asset) {
                if ( !this._inDropArea ) {
                    return;
                }

                if ( asset instanceof classDef ) {
                    this._curDragObject = asset;
                    this.highlighted = true;
                    this.invalid = false;
                }
                else {
                    // check sub-asset
                    var metaJson = Editor.AssetDB.loadMetaJson(dragItems[0]);
                    Fire.AssetLibrary.loadMeta(metaJson, function ( err, meta ) {
                        if ( !this._inDropArea ) {
                            return;
                        }

                        if ( meta.subRawData && meta.subRawData.length > 0 ) {
                            var subInfo = meta.subRawData[0];
                            if ( subInfo.asset instanceof classDef ) {
                                this._curDragObject = subInfo.asset;
                                this.highlighted = true;
                                this.invalid = false;

                                return;
                            }
                        }

                        this.highlighted = true;
                        this.invalid = true;
                    }.bind(this));
                }
            }.bind(this) );
        }
        else if ( dragType === "entity" && Fire.isChildClassOf( classDef, Fire.Entity ) ) {
            value = Editor.getInstanceById(dragItems[0]);
            if (value) {
                this._curDragObject = value;
            }
            this.highlighted = true;
            this.invalid = !value;
        }
        else if ( dragType === "entity" && Fire.isChildClassOf( classDef, Fire.Component ) ) {
            entity = Editor.getInstanceById(dragItems[0]);
            value = entity && entity.getComponent(classDef);
            if (value) {
                this._curDragObject = value;
            }
            this.highlighted = true;
            this.invalid = !value;
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

        if ( !this.invalid ) {
            this.value = this._curDragObject;
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

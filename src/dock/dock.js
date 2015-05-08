var resizerSpace = 3;

Polymer(EditorUI.mixin({
    publish: {
        row: { value: false, reflect: true },
        'no-collapse': { value: false, reflect: true },
    },

    ready: function () {
        this._initResizable();
        this._initResizers();

        // this will make sure all dock children is ready
        window.requestAnimationFrame( function () {
            if ( !EditorUI.DockUtils.root ) {
                var isRootDock = this.noCollapse && !this.parentElement['ui-dockable'];
                if ( isRootDock ) {
                    EditorUI.DockUtils.root = this;
                    this._finalizeSizeRecursively();
                    this._finalizeMinMaxRecursively();
                    this._finalizeStyleRecursively();
                    this._notifyResize();
                }
            }
        }.bind(this));
    },

    _initResizers: function () {
        if ( this.children.length > 1 ) {
            for ( var i = 0; i < this.children.length; ++i ) {
                if ( i != this.children.length-1 ) {
                    var el = this.children[i];
                    var nextEL = this.children[i+1];

                    var resizer = new FireDockResizer();
                    resizer.vertical = this.row;

                    this.insertBefore( resizer, nextEL );
                    i += 1;
                }
            }
        }
    },

    _collapseRecursively: function () {
        var elements = [];

        //
        for ( var i = 0; i < this.children.length; i += 2 ) {
            var el = this.children[i];
            if ( el['ui-dockable'] ) {
                el._collapseRecursively();
            }
        }

        this.collapse();
    },

    // depth first calculate the width and height
    _finalizeSizeRecursively: function () {
        var elements = [];

        //
        for ( var i = 0; i < this.children.length; i += 2 ) {
            var el = this.children[i];
            if ( el['ui-dockable'] ) {
                el._finalizeSizeRecursively();
                elements.push(el);
            }
        }

        //
        this.finalizeSize(elements);
    },

    // depth first calculate the min max width and height
    _finalizeMinMaxRecursively: function () {
        var elements = [];

        //
        for ( var i = 0; i < this.children.length; i += 2 ) {
            var el = this.children[i];
            if ( el['ui-dockable'] ) {
                el._finalizeMinMaxRecursively();
                elements.push(el);
            }
        }

        //
        this.finalizeMinMax(elements, this.row);
    },

    _finalizeStyleRecursively: function () {
        var elements = [];

        //
        for ( var i = 0; i < this.children.length; i += 2 ) {
            var el = this.children[i];
            if ( el['ui-dockable'] ) {
                el._finalizeStyleRecursively();
            }
        }

        //
        this.finalizeStyle();
        this.reflow();
    },

    _reflowRecursively: function () {

        for ( var i = 0; i < this.children.length; i += 2 ) {
            var el = this.children[i];
            if ( el['ui-dockable'] ) {
                el._reflowRecursively();
            }
        }
        this.reflow();
    },

    finalizeStyle: function () {
        // var resizerCnt = (this.children.length - 1)/2;
        // var resizerSize = resizerCnt * resizerSpace;

        var i, el, size;
        var hasAutoLayout = false;

        if ( this.children.length === 1 ) {
            el = this.children[0];

            el.style.flex = "1 1 auto";
            hasAutoLayout = true;
        }
        else {
            for ( i = 0; i < this.children.length; i += 2 ) {
                el = this.children[i];

                if ( this.row ) {
                    size = el.curWidth;
                }
                else {
                    size = el.curHeight;
                }

                if ( size === 'auto' ) {
                    hasAutoLayout = true;
                    el.style.flex = "1 1 auto";
                }
                else {
                    // if this is last el and we don't have auto-layout elements, give rest size to last el
                    if ( i === (this.children.length-1) && !hasAutoLayout ) {
                        el.style.flex = "1 1 auto";
                    }
                    else {
                        el.style.flex = "0 0 " + size + "px";
                    }
                }
            }
        }
    },

    reflow: function () {
        var i, rect, el;
        var parentRect;
        var sizeList = [];
        var totalSize = 0;

        parentRect = this.getBoundingClientRect();

        for ( i = 0; i < this.children.length; ++i ) {
            el = this.children[i];

            rect = el.getBoundingClientRect();
            var size = Math.floor(this.row ? rect.width : rect.height);
            sizeList.push(size);
            totalSize += size;
        }

        for ( i = 0; i < this.children.length; ++i ) {
            el = this.children[i];
            if ( el instanceof FireDockResizer )
                continue;

            var ratio = sizeList[i]/totalSize;
            el.style.flex = ratio + " " + ratio + " " + sizeList[i] + "px";

            if ( this.row ) {
                el.curWidth = sizeList[i];
                el.curHeight = parentRect.height;
            }
            else {
                el.curWidth = parentRect.width;
                el.curHeight = sizeList[i];
            }
        }
    },

}, EditorUI.resizable, EditorUI.dockable));

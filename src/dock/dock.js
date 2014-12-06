(function () {
    var resizerSpace = 3;

    Polymer(EditorUI.mixin({
        publish: {
            row: {
                value: false,
                reflect: true
            },
        },

        ready: function () {
            this._initResizable();

            if ( this.children.length > 1 ) {
                for ( var i = 0; i < this.children.length; ++i ) {
                    if ( i != this.children.length-1 ) {
                        var el = this.children[i];

                        var resizer = new FireResizer();
                        resizer.vertical = this.row;

                        this.insertBefore( resizer, el.nextElementSibling );
                        i += 1;
                    }
                }
            }
        },

        domReady: function () {
            this._reflow();
        },

        _reflow: function () {
            var resizerCnt = (this.children.length - 1)/2; 
            var resizerSize = resizerCnt * resizerSpace;

            var autoLayoutElements = [];
            var i, element, size;

            for ( i = 0; i < this.children.length; i += 2 ) {
                element = this.children[i];
                element._autoLayout = false;
                if ( this.row ) {
                    size = element.computedWidth;
                }
                else {
                    size = element.computedHeight;
                }

                if ( size !== -1 ) {
                    // if this is last element and we don't have auto-layout elements, give rest size to last element
                    if ( i === (this.children.length-1) && autoLayoutElements.length === 0 ) {
                        element.style.flex = "auto";
                        element._autoLayout = true;
                    }
                    else {
                        element.style.flex = "0 0 " + size + "px";
                    }
                }
                else {
                    element.style.flex = "auto";
                    element._autoLayout = true;
                    autoLayoutElements.push(element);
                }
            }
        },

        addDock: function ( position, element ) {
            if ( element instanceof FireDock === false ) {
                Fire.warn('Dock element must be instanceof FireDock');
                return;
            }

            // check if need to create new Dock element
            var isrow = this.isRow();
            var needNewDock = false;
            if ( position === 'left' || position === 'right' ) {
                if ( isrow === false ) {
                    needNewDock = true;
                }
            }
            else {
                if ( isrow ) {
                    needNewDock = true;
                }
            }
            var newResizer = null;

            // process dock
            if ( needNewDock ) {
                // new FireDock
                var newDock = new FireDock();
                DockUtils.copyAttributes( this, newDock );

                if ( position === 'left' ||
                     position === 'right' )
                {
                    newDock.setAttribute('flex-row', '');
                    newDock.style.height = "";
                }
                else {
                    newDock.setAttribute('flex-col', '');
                    newDock.style.width = "";
                }
                newDock.setAttribute('flex-stretch', '');

                // new resizer
                newResizer = new FireResizer();
                newResizer.vertical = newDock.isRow();
                newResizer.ready();

                // 
                this.parentElement.insertBefore(newDock, this);
                if ( position === 'left' || position === 'top' ) {
                    newDock.appendChild(element);
                    newDock.appendChild(newResizer);
                    newDock.appendChild(this);
                }
                else {
                    newDock.appendChild(this);
                    newDock.appendChild(newResizer);
                    newDock.appendChild(element);
                }
            }
            else {
                if ( position === 'left' || position === 'top' ) {
                    element.style.height = "";
                    this.insertBefore(element, this.firstElementChild);
                }
                else {
                    element.style.width = "";
                    this.appendChild(element);
                }
            }
        },

        dragEnterAction: function ( event ) {
            // this.style.outline = "1px solid white";
        },

        dragOverAction: function ( event ) {
            event.preventDefault();
            event.dataTransfer.dropEffect = 'move';
            DockUtils.dockHint( event.currentTarget );
            // this.style.outline = "1px solid white";
        },

        dragLeaveAction: function ( event ) {
            // this.style.outline = "";
        },

        get elementCount () {
            return this.children.length;
        },
    }, EditorUI.resizable));
})();

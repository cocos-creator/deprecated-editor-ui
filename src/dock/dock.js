(function () {
    var resizerSpace = 3;

    Polymer(EditorUI.mixin({
        publish: {
            'width': 200,
            'height': 200,
            'min-width': 200,
            'min-height': 200,

            row: {
                value: false,
                reflect: true
            },

            'auto-layout': {
                value: false,
                reflect: true
            },

            'no-collapse': {
                value: false,
                reflect: true
            },
        },

        ready: function () {
            this._initFocusable(this.$.content);
            this._initResizable();

            if ( this.children.length > 1 ) {
                for ( var i = 0; i < this.children.length; ++i ) {
                    if ( i != this.children.length-1 ) {
                        var el = this.children[i];

                        var resizer = new FireDockResizer();
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

            if ( this.children.length === 1 ) {
                element = this.children[0];

                element.style.flex = "auto";
                element._autoLayout = true;
                autoLayoutElements.push(element);
                element._notifyResize();
            }
            else {
                for ( i = 0; i < this.children.length; i += 2 ) {
                    element = this.children[i];
                    element._autoLayout = false;
                    if ( this.row ) {
                        size = element.computedWidth;
                    }
                    else {
                        size = element.computedHeight;
                    }

                    if ( size !== -1 && !element['auto-layout'] ) {
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

                    element._notifyResize();
                }
            }
        },

        // position: left, right, top, bottom
        addDock: function ( position, element ) {
            if ( element instanceof FireDock === false ) {
                Fire.warn('Dock element must be instanceof FireDock');
                return;
            }

            var needNewDock = false;
            var parentEL = this.parentElement;

            // check if need to create new Dock element
            if ( position === 'left' || position === 'right' ) {
                if ( !parentEL.row ) {
                    needNewDock = true;
                }
            }
            else {
                if ( parentEL.row ) {
                    needNewDock = true;
                }
            }

            // process dock
            if ( needNewDock ) {
                // new FireDock
                var newDock = new FireDock();
                newDock.copyResizable(this);

                if ( position === 'left' ||
                     position === 'right' )
                {
                    newDock.row = true;
                }
                else {
                    newDock.row = false;
                }

                //
                parentEL.insertBefore(newDock, this);

                //
                if ( position === 'left' || position === 'top' ) {
                    newDock.appendChild(element);
                    newDock.appendChild(this);
                }
                else {
                    newDock.appendChild(this);
                    newDock.appendChild(element);
                }
                newDock.ready();
                newDock._reflow();

                //
                parentEL._reflow();
            }
            else {
                // new resizer
                var newResizer = null;
                newResizer = new FireDockResizer();
                newResizer.vertical = parentEL.row;

                //
                if ( position === 'left' || position === 'top' ) {
                    parentEL.insertBefore(element, this);
                    parentEL.insertBefore(newResizer, this);
                }
                else {
                    // insert after
                    var nextEL = this.nextElementSibling;
                    if ( nextEL === null ) {
                        parentEL.appendChild(newResizer);
                        parentEL.appendChild(element);
                    }
                    else {
                        parentEL.insertBefore(newResizer, nextEL);
                        parentEL.insertBefore(element, nextEL);
                    }
                }

                parentEL._reflow();
            }
        },

        removeDock: function ( childEL ) {
            if ( !this.contains(childEL) )
                return;

            if ( this.firstChild === childEL ) {
                if ( childEL.nextElementSibling && 
                     childEL.nextElementSibling instanceof FireDockResizer )
                {
                    childEL.nextElementSibling.remove();
                }
            }
            else {
                if ( childEL.previousElementSibling && 
                     childEL.previousElementSibling instanceof FireDockResizer )
                {
                    childEL.previousElementSibling.remove();
                }
            }
            childEL.remove();

            // if dock can be collapsed
            if ( !this['no-collapse'] ) {
                var parentEL = this.parentElement;

                if ( this.children.length === 0 ) {
                    if ( parentEL instanceof FireDock ) {
                        parentEL.removeDock(this);
                    }
                    else {
                        this.remove();
                    }

                    return;
                }


                if ( this.children.length === 1 ) {
                    if ( parentEL instanceof FireDock ) {
                        parentEL.insertBefore( this.children[0], this );
                        this.remove();
                        parentEL._reflow();
                    }
                    else {
                        parentEL.insertBefore( this.children[0], this );
                        this.remove();
                    }

                    return;
                }
            }

            this._reflow();
        },

        dragoverAction: function ( event ) {
            event.preventDefault();

            event.dataTransfer.dropEffect = 'move';
            DockUtils.dragover( event.currentTarget );
        },

    }, EditorUI.resizable, EditorUI.focusable));
})();

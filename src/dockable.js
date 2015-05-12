EditorUI.dockable = (function () {
    var _resizerSpace = 3; // 3 is resizer size

    var dockable = {
        'ui-dockable': true,

        eventDelegates: {
            'dragover': '_onDragOver',
        },

        _onDragOver: function ( event ) {
            event.preventDefault();

            EditorUI.DockUtils.dragoverDock( event.currentTarget );
        },

        // position: left, right, top, bottom
        addDock: function ( position, element ) {
            if ( element['ui-dockable'] === false ) {
                Editor.warn('Dock element must be dockable');
                return;
            }

            var needNewDock = false;
            var parentEL = this.parentElement;
            var elements = [];
            var newDock, newResizer, nextEL;
            var newWidth, newHeight;
            var rect = this.getBoundingClientRect();

            if ( parentEL['ui-dockable'] ) {
                // check if need to create new Dock element
                if ( position === 'left' || position === 'right' ) {
                    if ( !parentEL.row ) {
                        needNewDock = true;
                    }
                    newWidth = Math.max( 0, rect.width-element.curWidth-_resizerSpace );
                }
                else {
                    if ( parentEL.row ) {
                        needNewDock = true;
                    }
                    newHeight = Math.max( 0, rect.height-element.curHeight-_resizerSpace );
                }

                // process dock
                if ( needNewDock ) {
                    // new FireDock
                    newDock = new FireDock();

                    if ( position === 'left' || position === 'right' ) {
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
                        elements = [element,this];
                    }
                    else {
                        newDock.appendChild(this);
                        newDock.appendChild(element);
                        elements = [this,element];
                    }

                    //
                    newDock.style.flex = this.style.flex;
                    newDock._initResizers();
                    newDock.finalizeSize(elements,true);
                    newDock.curWidth = this.curWidth;
                    newDock.curHeight = this.curHeight;
                }
                else {
                    // new resizer
                    newResizer = null;
                    newResizer = new FireDockResizer();
                    newResizer.vertical = parentEL.row;

                    //
                    if ( position === 'left' || position === 'top' ) {
                        parentEL.insertBefore(element, this);
                        parentEL.insertBefore(newResizer, this);
                    }
                    else {
                        // insert after
                        nextEL = this.nextElementSibling;
                        if ( nextEL === null ) {
                            parentEL.appendChild(newResizer);
                            parentEL.appendChild(element);
                        }
                        else {
                            parentEL.insertBefore(newResizer, nextEL);
                            parentEL.insertBefore(element, nextEL);
                        }
                    }
                }

                // reset old panel's computed width, height
                this.style.flex = '';
                if ( this._applyFrameSize ) {
                    this._applyFrameSize(false);
                }

                if ( position === 'left' || position === 'right' ) {
                    if ( this.computedWidth !== 'auto' )
                        this.curWidth = newWidth;
                }
                else {
                    if ( this.computedHeight !== 'auto' )
                        this.curHeight = newHeight;
                }
            }
            // if this is root panel
            else {
                if ( position === 'left' || position === 'right' ) {
                    if ( !this.row ) {
                        needNewDock = true;
                    }
                    newWidth = Math.max( 0, rect.width-element.curWidth-_resizerSpace );
                }
                else {
                    if ( this.row ) {
                        needNewDock = true;
                    }
                    newHeight = Math.max( 0, rect.height-element.curHeight-_resizerSpace );
                }

                // process dock
                if ( needNewDock ) {
                    // new FireDock
                    newDock = new FireDock();

                    newDock.row = this.row;
                    if ( position === 'left' || position === 'right' ) {
                        this.row = true;
                    }
                    else {
                        this.row = false;
                    }

                    while ( this.children.length > 0 ) {
                        var childEL = this.children[0];
                        elements.push(childEL);
                        newDock.appendChild(childEL);
                    }

                    newDock.style.flex = this.style.flex;
                    newDock.finalizeSize(elements,true);
                    newDock.curWidth = this.curWidth;
                    newDock.curHeight = this.curHeight;

                    // reset old panel's computed width, height
                    this.style.flex = '';
                    if ( this._applyFrameSize ) {
                        this._applyFrameSize(false);
                    }

                    if ( position === 'left' || position === 'right' ) {
                        if ( this.computedWidth !== 'auto' )
                            this.curWidth = newWidth;
                    }
                    else {
                        if ( this.computedHeight !== 'auto' )
                            this.curHeight = newHeight;
                    }

                    //
                    if ( position === 'left' || position === 'top' ) {
                        this.appendChild(element);
                        this.appendChild(newDock);
                    }
                    else {
                        this.appendChild(newDock);
                        this.appendChild(element);
                    }

                    //
                    this.ready();
                }
                else {
                    // new resizer
                    newResizer = null;
                    newResizer = new FireDockResizer();
                    newResizer.vertical = this.row;

                    //
                    if ( position === 'left' || position === 'top' ) {
                        this.insertBefore(element, this.firstElementChild);
                        this.insertBefore(newResizer, this.firstElementChild);
                    }
                    else {
                        // insert after
                        nextEL = this.nextElementSibling;
                        if ( nextEL === null ) {
                            this.appendChild(newResizer);
                            this.appendChild(element);
                        }
                        else {
                            this.insertBefore(newResizer, nextEL);
                            this.insertBefore(element, nextEL);
                        }
                    }
                }
            }
        },

        removeDock: function ( childEL ) {
            var contains = false;
            for ( var i = 0; i < this.children.length; ++i ) {
                if ( this.children[i] === childEL ) {
                    contains = true;
                    break;
                }
            }
            if ( !contains )
                return false;

            if ( this.children[0] === childEL ) {
                if ( childEL.nextElementSibling &&
                     childEL.nextElementSibling instanceof FireDockResizer )
                {
                    this.removeChild(childEL.nextElementSibling);
                }
            }
            else {
                if ( childEL.previousElementSibling &&
                     childEL.previousElementSibling instanceof FireDockResizer )
                {
                    this.removeChild(childEL.previousElementSibling);
                }
            }
            this.removeChild(childEL);

            // return if dock can be collapsed
            return this.collapse();
        },

        collapse: function () {
            if ( this['no-collapse'] )
                return false;

            var parentEL = this.parentNode;

            // if we don't have any element in this panel
            if ( this.children.length === 0 ) {
                if ( parentEL['ui-dockable'] ) {
                    parentEL.removeDock(this);
                }
                else {
                    parentEL.removeChild(this);
                }

                return true;
            }


            // if we only have one element in this panel
            if ( this.children.length === 1 ) {
                var childEL = this.children[0];

                // assign current style to it, also reset its computedSize
                childEL.style.flex = this.style.flex;
                if ( parentEL.row ) {
                    childEL.curWidth = this.curWidth;
                    childEL.curHeight = childEL.computedHeight === 'auto' ? 'auto' : this.curHeight;
                }
                else {
                    childEL.curWidth = childEL.computedWidth === 'auto' ? 'auto' : this.curWidth;
                    childEL.curHeight = this.curHeight;
                }

                parentEL.insertBefore( childEL, this );
                parentEL.removeChild(this);

                if ( childEL['ui-dockable'] ) {
                    childEL.collapse();
                }

                return true;
            }

            // if the parent dock direction is same as this panel
            if ( parentEL['ui-dockable'] && parentEL.row === this.row ) {
                while ( this.children.length > 0 ) {
                    parentEL.insertBefore( this.children[0], this );
                }
                parentEL.removeChild(this);

                return true;
            }

            return false;
        },
    };
    return dockable;
})();

(function () {
    Polymer({
        created: function () {
        },

        ready: function () {
            var isrow = this.isRow();

            for ( var i = 0; i < this.children.length; ++i ) {
                if ( i != this.children.length-1 ) {
                    var dockEL = this.children[i];
                    if ( dockEL instanceof FireDock ) {
                        var resizer = new FireResizer();
                        resizer.vertical = isrow;
                        resizer.ready(); // HACK: ready again, manual contructor cannot send attribute in 

                        this.insertBefore( resizer, dockEL.nextElementSibling );
                        i += 1;
                    }
                }
            }
        },

        domReady: function () {
            for ( var i = 0; i < this.children.length; ++i ) {
                var resizer = this.children[i];
                if ( resizer instanceof FireResizer ) {
                    resizer.update();
                }
            }
        },

        isRow: function () {
            var result = this.getAttribute('flex-row');
            if ( result === null )
                return false;
            return true;
        },

        addDock: function ( position, element ) {
            if ( element instanceof FireDock === false ) {
                console.warn('Dock element must be instanceof FireDock');
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
    });
})();

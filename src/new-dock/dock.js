(function () {
    Polymer({
        publish: {
            ElementCount: 0,
            Childrens: null,
            vertical: {
                value: false,
                reflect: true
            },
            horizontal: {
                value: false,
                reflect: true
            }

        },

        created: function () {


        },

        ready: function () {
            this.ElementCount=this.children.length;
            this.Childrens=this.children;
            var isrow = this.isRow();
            for ( var i = 0; i < this.children.length; ++i ) {
                if ( i != this.children.length-1 ) {
                    var dockEL = this.children[i];
                    if ( true ) {
                        var resizer = new FireNewResizer();
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

            if (this.isRow()) {
                this.style.display = "flex";
            }

            for (var i = 0; i < this.Childrens.length; i+=2) {
                //下面的公式 是因为如果直接除以他子节点的总数，resizer在拖动的时候，有时候会变得很细直至看不见，加了这个公式，就没这个问题了
                this.Childrens[i].style.width = (this.getBoundingClientRect().width/this.ElementCount-(15*(this.Childrens.length/2))/(this.ElementCount*5)) + "px";

            }
        },

        isRow: function () {
        //    var result = this.getAttribute('flex-row');
            if ( this.vertical) {
                return true;
            }
            else if (this.horizontal) {
                return false;
            }
            return false;

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
                var newDock = new FireNewDock();
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
                newResizer = new FireNewResizer();
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

(function () {
    Polymer('fire-ui-button-group', {
        publish: {
            toggable: {
                value: false,
                reflect: true
            },
        },

        created: function () {
            this.activeItem = null;
        },

        ready: function () {
            if ( this.toggable === false && this.children.length > 0 ) {
                this.select(this.children[0]);
            }
        },

        clickAction: function ( event ) {
            var biEL = EditorUI.getSelfOrAncient(event.target, FireButtonItem);
            if ( biEL ) {
                this.select(biEL);
            }
            event.stopPropagation();
        },

        // add: function ( name ) {
        //     var tabEL = new FireTab();
        //     tabEL.innerHTML = name;

        //     this.appendChild(tabEL);

        //     return tabEL;
        // },

        // remove: function ( tab ) {
        //     var tabEL = null;
        //     if ( typeof tab === "number" ) {
        //         if ( tab < this.children.length ) {
        //             tabEL = this.children[tab];
        //         }
        //     }
        //     else if ( tab instanceof FireTab ) {
        //         tabEL = tab;
        //     }

        //     //
        //     if ( tabEL !== null ) {
        //         if ( this.activeItem === tabEL ) {
        //             this.activeItem = null;

        //             if ( tabEL.nextElementSibling ) {
        //                 this.activeItem = tabEL.nextElementSibling;
        //             }
        //             else if ( tabEL.previousElementSibling ) {
        //                 this.activeItem = tabEL.previousElementSibling;
        //             }

        //             if ( this.activeItem )
        //                 this.activeItem.classList.add('active');
        //         }

        //         this.removeChild(tabEL);
        //     }
        // },

        select: function ( param ) {
            var biEL = null;

            if ( typeof param === "number" ) {
                if ( param < this.children.length ) {
                    biEL = this.children[param];
                }
            }
            else if ( param instanceof FireButtonItem ) {
                biEL = param;
            }

            //
            if ( biEL !== null ) {
                if ( biEL !== this.activeItem ) {
                    this.fire( 'changed', { old: this.activeItem, new: biEL  } );

                    if ( this.activeItem !== null ) {
                        this.activeItem.classList.remove('active');
                    }
                    this.activeItem = biEL;
                    this.activeItem.classList.add('active');
                }
                else {
                    if ( this.toggable ) {
                        this.activeItem.classList.remove('active');
                        this.activeItem = null;
                    }
                }
            }
        },

        get buttonCount () {
            return this.children.length;
        },
    });
})();

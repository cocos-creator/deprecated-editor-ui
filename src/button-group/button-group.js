(function () {
    Polymer(EditorUI.mixin({
        publish: {
            multiple: {
                value: false,
                reflect: true
            },
        },

        created: function () {
            this.activeItem = null;
        },

        ready: function () {
            this._init();
        },

        clickAction: function ( event ) {
            var biEL = EditorUI.getSelfOrAncient(event.target, FireButtonItem);
            if ( biEL ) {
                this.select(biEL);
            }
            event.stopPropagation();
        },

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
                if ( this.multiple ) {
                    this.fire( 'changed', { old: biEL, new: biEL  } );
                    biEL.active = !biEL.active;
                }
                else {
                    if ( biEL !== this.activeItem ) {
                        this.fire( 'changed', { old: this.activeItem, new: biEL  } );

                        if ( this.activeItem !== null ) {
                            this.activeItem.active = false;
                        }
                        this.activeItem = biEL;
                        this.activeItem.active = true;
                    }
                }
            }
        },

        get buttonCount () {
            return this.children.length;
        },
    }, EditorUI.focusable));
})();

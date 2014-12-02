(function () {
    Polymer(EditorUI.mixin({
        publish: {
            active: {
                value: false,
                reflect: true
            },

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
                    biEL.active = !biEL.active;
                    biEL.fire('changed');
                }
                else {
                    if ( biEL !== this.activeItem ) {
                        if ( this.activeItem !== null ) {
                            this.activeItem.active = false;
                            this.activeItem.fire('deactive');
                        }

                        this.activeItem = biEL;
                        this.activeItem.active = true;
                        this.activeItem.fire('active');
                    }
                }
            }
        },

        get buttonCount () {
            return this.children.length;
        },
    }, EditorUI.focusable));
})();

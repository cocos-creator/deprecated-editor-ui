(function () {
    Polymer({
        publish: {
            folded: false,
            foldable: {
                value: false,
                reflect: true
            },
        },

        created: function () {
            this.name = '';
            this.id = '';

            this.renaming = false;
        },
        
        get expanded() {
            // assume that it is foldable only if has child
            return this.foldable && !this.folded;
        },

        domReady: function () {
            // HACK: to make this.$.rename.select() works
            this.$.rename.value = this.name;
        },

        setIcon: function ( icon ) {
            if (icon) {
                if ( icon instanceof Image ) {
                    this.$.typeIcon.appendChild(icon);
                }
                else {
                    this.$.typeIcon.className = "type-icon fa " + icon;
                }
                this.$.typeIcon.style.display = '';
            }
            else {
                this.$.typeIcon.style.display = 'none';
            }
        },

        rename: function () {
            this.$.rename.style.display = '';
            this.$.rename.value = this.name;
            this.$.rename.focus();
            this.$.rename.select();

            this.renaming = true;
        },

        mousedownAction: function ( event ) {
            if ( this.renaming ) {
                event.stopPropagation();
            }
        },

        mouseupAction: function ( event ) {
            if ( this.renaming ) {
                event.stopPropagation();
            }
        },

        mouseenterAction: function ( event ) {
            event.stopPropagation();
        },

        mouseleaveAction: function ( event ) {
            event.stopPropagation();
        },

        dblclickAction: function ( event ) {
            this.fire('open');
            event.stopPropagation();
        },

        foldMousedownAction: function ( event ) {
            this.folded = !this.folded;
            event.stopPropagation();
        },

        renameConfirmAction: function ( event ) {
            this.$.rename.style.display = 'none';
            this.renaming = false;

            if ( this.$.rename.value !== this.name ) {
                this.fire('namechanged', { name: this.$.rename.value } );
            }
            event.stopPropagation();
        },

        // overridable for children
        addChild: function (child) {
            this.appendChild(child);
            this.foldable = true;
        }
    });
})();

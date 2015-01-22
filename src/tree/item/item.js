Polymer({
    publish: {
        noName: false,
        folded: {
            value: false,
            reflect: true
        },
        foldable: {
            value: false,
            reflect: true
        },
        selected: {
            value: false,
            reflect: true
        },
    },

    created: function () {
        this.name = '';
        this.userId = '';

        this._renaming = false;
    },

    domReady: function () {
        // HACK: to make this.$.rename.select() works
        // this.$.rename.value = this.name;
    },

    get expanded() {
        // assume that it is foldable only if has child
        return this.foldable && !this.folded;
    },

    setIcon: function ( icon ) {
        if (icon) {
            if ( icon instanceof Image ) {
                icon.setAttribute('draggable','false'); // this will prevent item dragging
                this.$.typeIcon.appendChild(icon);
            }
            else {
                this.$.typeIcon.className = "type-icon " + icon;
            }
            this.$.typeIcon.removeAttribute('hidden');
            this.$.rename.setAttribute('icon','');
        }
        else {
            this.$.typeIcon.setAttribute('hidden', '');
            this.$.rename.removeAttribute('icon');
        }
    },

    rename: function () {
        this.$.rename.style.display = '';
        this.$.rename.value = this.name;
        this.$.rename.focus();
        this.$.rename.select();

        this._renaming = true;
    },

    // overridable for children
    addChild: function (child) {
        this.appendChild(child);
        this.foldable = true;
    },

    hint: function () {
        var computedStyle = window.getComputedStyle(this.$.bar);
        this.$.bar.animate([
            { background: "white", transform: "scale(1.2)" },
            { background: computedStyle.backgroundColor, transform: "scale(1)" }
        ], {
            duration: 1000
        });
    },

    mousedownAction: function ( event ) {
        // if this is not the mouse-left-button
        if ( event.which !== 1 )
            return;

        event.stopPropagation();

        if ( this._renaming || event.target === this.$.foldIcon ) {
            return;
        }

        var shift = false;
        var toggle = false;

        if ( event.shiftKey ) {
            shift = true;
        }
        else if ( event.metaKey || event.ctrlKey ) {
            toggle = true;
        }

        this.fire('selecting', {
            toggle: toggle,
            shift: shift,
            x: event.x,
            y: event.y,
        } );
    },

    mouseupAction: function ( event ) {
        // if this is not the mouse-left-button
        if ( event.which !== 1 )
            return;

        if ( this._renaming || event.target === this.$.foldIcon ) {
            return;
        }

        event.stopPropagation();

        var shift = false;
        var toggle = false;

        if ( event.shiftKey ) {
            shift = true;
        }
        else if ( event.metaKey || event.ctrlKey ) {
            toggle = true;
        }

        this.fire('select', {
            toggle: toggle,
            shift: shift,
        } );

        event.stopPropagation();

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

    foldAction: function ( event ) {
        this.folded = !this.folded;
        event.stopPropagation();
    },

    renameConfirmAction: function ( event ) {
        this.$.rename.style.display = 'none';
        this._renaming = false;

        if ( this.$.rename.value !== this.name ) {
            this.fire('namechanged', { name: this.$.rename.value } );
        }
        event.stopPropagation();
    },
});

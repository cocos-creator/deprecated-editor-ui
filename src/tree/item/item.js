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
        this.hasIcon = false;

        this._renaming = false;
    },

    get expanded() {
        // assume that it is foldable only if has child
        return this.foldable && !this.folded;
    },

    setIcon: function ( icon ) {
        if (icon) {
            this.hasIcon = true;

            if ( icon instanceof Image ) {
                icon.setAttribute('draggable','false'); // this will prevent item dragging
                this.$.typeIcon.appendChild(icon);
            }
            else {
                this.$.typeIcon.className = "type-icon " + icon;
            }
            this.$.typeIcon.removeAttribute('hidden');
        }
        else {
            this.hasIcon = false;

            this.$.typeIcon.setAttribute('hidden', '');
        }
    },

    rename: function () {
        this.$.nameInput.style.display = '';
        this.$.nameInput.value = this.name;
        this.$.nameInput.focus();
        this.$.nameInput.select();

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

        this.fire('select', {
            toggle: toggle,
            shift: shift,
        } );
    },

    dblclickAction: function ( event ) {
        this.fire('open');
        event.stopPropagation();
    },

    foldAction: function ( event ) {
        this.folded = !this.folded;
        event.stopPropagation();
    },
});

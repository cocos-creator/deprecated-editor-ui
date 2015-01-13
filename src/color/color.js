Polymer(EditorUI.mixin({
    publish: {
        value: null,
    },

    observe: {
        'value.r value.g value.b': '_updateColor',
        'value.a': '_updateAlpha',
    },

    created: function () {
        this.value = new Fire.Color( 1.0, 1.0, 1.0, 1.0 );
        this._showPicker = false;
        this.colorPicker = null;
    },

    ready: function() {
        this._initFocusable( this.$.focus );
        this._updateColor();
        this._updateAlpha();
    },

    setColor: function ( r, g, b, a ) {
        this.value = new Fire.Color( r, g, b, a );
        this.fire("changed");
    },

    _updateColor: function () {
        if ( this.value ) {
            this.$.previewRGB.style.backgroundColor = this.value.toCSS('rgb');
        }
    },

    _updateAlpha: function () {
        if ( this.value ) {
            this.$.previewA.style.width = Math.floor(this.value.a * 100)+'%';
        }
    },

    showColorPicker: function ( show ) {
        this._showColorPicker = show;

        if ( show ) {
            if ( !this.colorPicker ) {
                this.colorPicker = new FireColorPicker();
                this.colorPicker.owner = this;
            }

            document.body.appendChild(this.colorPicker);
            this.colorPicker.style.display = "";
            this.colorPicker.value = this.value.clone(); // NOTE: one-way binding
            EditorUI.addHitGhost('cursor', '998', function () {
                this.showColorPicker(false);
                this.focus();
            }.bind(this));
            this.updateColorPicker();
        }
        else {
            if ( this.colorPicker ) {
                this.colorPicker.style.display = "none";
                this.appendChild(this.colorPicker);

                EditorUI.removeHitGhost();
            }
        }
    },

    updateColorPicker: function () {
        window.requestAnimationFrame ( function () {
            if ( !this.colorPicker || !this._showColorPicker )
                return;

            var bodyRect = document.body.getBoundingClientRect();
            var elRect = this.getBoundingClientRect();
            var menuRect = this.colorPicker.getBoundingClientRect();

            var style = this.colorPicker.style;
            style.position = "absolute";
            style.right = (bodyRect.right - elRect.right) + "px";
            style.zIndex = 999;

            if ( document.body.clientHeight - elRect.bottom <= menuRect.height + 10 ) {
                style.top = (elRect.top - bodyRect.top - menuRect.height - 5) + "px";
            }
            else {
                style.top = (elRect.bottom - bodyRect.top + 5) + "px";
            }

            this.updateColorPicker();
        }.bind(this) );
    },

    clickAction: function (event) {
        this.showColorPicker( !this._showColorPicker );
        event.stopPropagation();
    },

    blurAction: function (event) {
        if ( this.focused === false ) {
            return;
        }

        if ( this.colorPicker && this.colorPicker === event.relatedTarget ) {
            return;
        }

        this._blurAction();
        this.showColorPicker(false);
    },

    keydownAction: function (event) {
        switch ( event.which ) {
            // esc
            case 27:
                this.showColorPicker(false);
                event.stopPropagation();
            break;
        }
    },
}, EditorUI.focusable));

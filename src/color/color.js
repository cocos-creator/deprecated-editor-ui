(function () {
    Polymer('fire-ui-color', {
        publish: {
            value: new FIRE.Color( 1.0, 1.0, 1.0, 1.0 ),
        },

        observe: {
            'value.r value.g value.b': '_updateColor',
            'value.a': '_updateAlpha',
        },

        created: function () {
            this.showPicker = false;
            this.focused = false;
        },

        ready: function() {
            this.$.focus.tabIndex = FIRE.getParentTabIndex(this)+1;
            this._updateColor();
        },

        _updateColor: function () {
            if ( this.value !== null )
                this.$.previewRGB.style.backgroundColor = this.value.toCSS('rgb');
        },

        _updateAlpha: function () {
            if ( this.value !== null )
                this.$.previewA.style.width = Math.floor(this.value.a * 100)+'%';
        },

        clickAction: function (event) {
            if ( event.target === this.$.previewRGB || 
                 event.target === this.$.previewA ||
                 event.target === this.$.iconDown ||
                 event.target === this ) {
                if ( this.showPicker ) {
                    this._hideColorPicker();
                }
                else {
                    this._showColorPicker();
                }
            }
        },

        focusAction: function (event) {
            this.focused = true;
            this.classList.toggle('focused', this.focused);
        },

        focusoutAction: function (event) {
            if ( this.focused === false )
                return;

            if ( event.relatedTarget === null &&
                 event.target === this._colorPicker ) 
            {
                this.$.focus.focus();

                event.stopPropagation();
                return;
            }

            if ( FIRE.find( this.shadowRoot, event.relatedTarget ) ) {
                return;
            }

            this.focused = false;
            this.classList.toggle('focused', this.focused);
            this._hideColorPicker();
        },

        keyDownAction: function (event) {
            switch ( event.which ) {
                // esc
                case 27:
                    this.$.focus.blur(); 
                    event.stopPropagation();
                break;
            }
        },

        _timeoutID: null,
        _colorPicker: null,
        _showColorPicker: function () {
            if ( this.showPicker )
                return;

            this.showPicker = true;

            if ( this._timeoutID !== null ) {
                window.clearTimeout(_timeoutID);
                this._timeoutID = null;
            }

            if ( this._colorPicker === null ) {
                this._colorPicker = new FireColorPicker();
                this._colorPicker.value = this.value;
                this.$.border.appendChild(this._colorPicker);
            }
        },

        _hideColorPicker: function () {
            if ( this.showPicker === false )
                return;

            this.showPicker = false;

            if ( this._colorPicker !== null ) {
                // TODO: we need to add border.disable(); which will prevent event during fadeout 
                var timeoutHandle = (function () {
                    if ( this._colorPicker.parentNode ) {
                        this._colorPicker.parentNode.removeChild(this._colorPicker);
                        this._colorPicker = null;
                        this._timeoutID = null;
                    }
                }).bind(this);
                this._timeoutID = window.setTimeout( timeoutHandle, 300 );
            }
        },
    });
})();


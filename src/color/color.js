(function () {
    Polymer('fire-ui-color', {
        focused: false,
        color: new FIRE.Color( 1.0, 1.0, 1.0, 1.0 ),

        ready: function() {
            this.$.color.tabIndex = FIRE.getParentTabIndex(this)+1;
            this._updateColor();
        },

        observe: {
            'color.r': '_updateColor',
            'color.g': '_updateColor',
            'color.b': '_updateColor',
            'color.a': '_updateColor',
        },

        _updateColor: function () {
            this.$.previewRGB.style.backgroundColor = this.color.toCSS('rgba');
            this.$.previewA.style.width = Math.floor(this.color.a * 100)+'%';
        },

        onClick: function () {
            console.log("todo");
        },

        onFocusIn: function () {
            this.focused = true;
        },

        onFocusOut: function () {
            if ( this.focused ) {
                // TODO
                // if ( event.relatedTarget === null &&
                //      element.find('.fire-ui-unit-input').find(event.target).length > 0 )
                // {
                //     element.focus();
                //     return false;
                // }

                // if ( element.is(event.relatedTarget) === false &&
                //      element.find( event.relatedTarget ).length === 0 ) 
                // {
                //     this.focused = false;
                //     scope.hideColorPicker();
                // }
            }
        },
    });
})();


(function () {
    Polymer('fire-ui-color', {
        ready: function() {
            this.focused = false;
            this.color = (this.color!==undefined) ? this.color : new FIRE.Color( 1.0, 1.0, 1.0, 1.0 );
            this._updateColor();
        },

        _updateColor: function () {
            this.$.previewRGB.style.backgroundColor = this.color.toCSS('rgba');
            this.$.previewA.style.width = Math.floor(this.color.a * 100)+'%';
        },

        observe: {
            'color.r': '_updateColor',
            'color.g': '_updateColor',
            'color.b': '_updateColor',
            'color.a': '_updateColor',
        },

        onClick: function () {
            console.log("todo");
        },

        onFocusIn: function () {
            this.focused = true;
        },

        onFocusOut: function () {
            this.focused = false;
        },
    });
})();


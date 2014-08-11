(function () {
    Polymer('fire-ui-vec2', {
        publish: {
            value: null,
        },

        created: function () {
            this.value = new FIRE.Vec2(0,0);
        },

        changedAction: function ( event ) {
            // this.value = new FIRE.Vec2(this.$.x.value, this.$.y.value);
            event.stopPropagation();

            this.fire("changed");
        },
    });
})();

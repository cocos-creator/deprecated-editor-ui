(function () {
    Polymer({
        publish: {
            value: null,
        },

        created: function () {
            this.value = new Fire.Vec2(0,0);
        },

        changedAction: function ( event ) {
            // this.value = new Fire.Vec2(this.$.x.value, this.$.y.value);
            event.stopPropagation();

            this.fire("changed");
        },
    });
})();

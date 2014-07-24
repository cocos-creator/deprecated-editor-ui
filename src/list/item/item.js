(function () {
    Polymer('fire-ui-item', {
        delClickAction: function ( event ) {
            this.fire("delete");
            event.stopPropagation();
        },
    });
})();

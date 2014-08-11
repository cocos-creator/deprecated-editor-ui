(function () {
    Polymer('fire-ui-dock', {
        created: function () {
        },

        ready: function () {
            var isrow = this.isRow();

            for ( var i = 0; i < this.children.length; ++i ) {
                var dockEL = this.children[i];
                // contentEL.style.display = "none";
                // this.children.splice(i, 0, resizer);
            }
        },

        isRow: function () {
            var result = this.getAttribute('flex-row');
            if ( result === null )
                return false;
            return true;
        },
    });
})();

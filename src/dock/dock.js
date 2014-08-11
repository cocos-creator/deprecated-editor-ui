(function () {
    Polymer('fire-ui-dock', {
        created: function () {
        },

        ready: function () {
            var isrow = this.isRow();

            for ( var i = 0; i < this.children.length; ++i ) {
                if ( i != this.children.length-1 ) {
                    var dockEL = this.children[i];
                    var resizer = new FireResizer();
                    resizer.vertical = isrow;
                    resizer.target = dockEL;
                    resizer.ready(); // HACK: ready again, manual contructor cannot send attribute in 

                    this.insertBefore( resizer, dockEL.nextSibling );
                    i += 1;
                }
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

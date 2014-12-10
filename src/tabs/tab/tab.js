(function () {
    Polymer({
        ready: function () {
            this.setIcon(null);
        },

        setIcon: function ( img ) {
            if ( img ) {
                this.$.icon.style.display = "inline";
                if ( this.$.icon.childElementCount > 0 ) {
                    this.$.icon.removeChild(this.$.icon.firstChild);
                }
                this.$.icon.appendChild(img);
            }
            else {
                this.$.icon.style.display = "none";
                if ( this.$.icon.childElementCount > 0 ) {
                    this.$.icon.removeChild(this.$.icon.firstChild);
                }
            }
        },

        dragstartAction: function ( event ) {
            event.stopPropagation();

            DockUtils.setDraggingTab(this);
        },
    });
})();

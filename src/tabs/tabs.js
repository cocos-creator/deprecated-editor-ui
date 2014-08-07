(function () {
    Polymer('fire-ui-tabs', {
        created: function () {
            this.currentTab = null;
        },

        ready: function () {
            for ( var i = 0; i < this.children.length; ++i ) {
                var el = this.children[i]; 
                if ( el instanceof FireTab ) {
                    if ( this.currentTab === null )
                        this.currentTab = el;
                    el.classList.remove('active');
                }
            }

            if ( this.currentTab !== null ) {
                this.currentTab.classList.add('active');
            }
        },

        clickAction: function ( event ) {
            if ( event.target instanceof FireTab ) {
                if ( this.currentTab !== null ) {
                    this.currentTab.classList.remove('active');
                }
                this.currentTab = event.target;
                this.currentTab.classList.add('active');
            }
        },
    });
})();

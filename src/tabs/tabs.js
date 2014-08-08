(function () {
    Polymer('fire-ui-tabs', {
        created: function () {
            this.activeTab = null;
        },

        ready: function () {
            if ( this.children.length > 0 ) {
                this.select(this.children[0]);
            }
        },

        clickAction: function ( event ) {
            this.select(event.target);
            event.stopPropagation();
        },

        add: function ( name ) {
            var tab = new FireTab();
            tab.innerHTML = name;

            this.appendChild(tab);

            return tab;
        },

        // TODO:
        // remove: function ( name ) {
        // },

        select: function ( tab ) {
            var tabEL = null;

            if ( typeof tab === "number" ) {
                if ( tab < this.children.length ) {
                    tabEL = this.children[tab];
                }
            }
            else if ( tab instanceof FireTab ) {
                tabEL = tab;
            }

            //
            if ( tabEL !== null ) {
                if ( tabEL !== this.activeTab ) {
                    this.fire( 'changed', { old: this.activeTab, new: tabEL  } );

                    if ( this.activeTab !== null ) {
                        this.activeTab.classList.remove('active');
                    }
                    this.activeTab = tabEL;
                    this.activeTab.classList.add('active');
                }
            }
        }
    });
})();

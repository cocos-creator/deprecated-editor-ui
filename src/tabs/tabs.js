(function () {
    Polymer({
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
            var tabEL = new FireTab();
            tabEL.innerHTML = name;

            this.appendChild(tabEL);

            return tabEL;
        },

        remove: function ( tab ) {
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
                if ( this.activeTab === tabEL ) {
                    this.activeTab = null;

                    if ( tabEL.nextElementSibling ) {
                        this.activeTab = tabEL.nextElementSibling;
                    }
                    else if ( tabEL.previousElementSibling ) {
                        this.activeTab = tabEL.previousElementSibling;
                    }

                    if ( this.activeTab )
                        this.activeTab.classList.add('active');
                }

                this.removeChild(tabEL);
            }
        },

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
        },

        get tabCount () {
            return this.children.length;
        },
    });
})();

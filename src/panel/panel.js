(function () {
    Polymer({
        ready: function () {
            this.super();

            var tabs = this.$.tabs;
            for ( var i = 0; i < this.children.length; ++i ) {
                var el = this.children[i];

                if ( el instanceof FireDockResizer )
                    continue;

                var name = el.getAttribute("name");
                var tabEL = tabs.add(name);
                tabEL.setAttribute("draggable", "true");

                el.style.display = "none";
                tabEL.content = el;
                tabEL.panel = this;

                tabEL.setIcon( el.icon ); // TEMP HACK
            }

            tabs.select(0);
        },

        _reflow: function () {
        },

        select: function ( tab ) {
            var tabs = this.$.tabs;
            tabs.select(tab);
        },

        add: function ( contentEL ) {
            var tabs = this.$.tabs;

            var name = contentEL.getAttribute("name");
            var tabEL = tabs.add(name);
            tabEL.setAttribute("draggable", "true");

            contentEL.style.display = "none";
            tabEL.content = contentEL;
            tabEL.panel = this;

            tabEL.setIcon( contentEL.icon ); // TEMP HACK

            this.appendChild(contentEL);
        },

        closeNoCollapse: function ( tabEL ) {
            var tabs = this.$.tabs;

            //
            tabs.remove(tabEL);
            if ( tabEL.content ) {
                tabEL.content.remove();
                tabEL.content = null;
            }
            tabEL.panel = null;

            //
            if ( tabs.children.length > 0 ) {
                tabs.select(0);
            }
        },

        close: function ( tabEL ) {
            this.closeNoCollapse(tabEL);
            this.collapse();
        },

        collapse: function () {
            // remove from dock;
            if ( this.$.tabs.children.length === 0 ) {
                if ( this.parentElement instanceof FireDock ) {
                    this.parentElement.removeDock(this);
                }
            }
        },

        get activeTab () {
            return this.$.tabs.activeTab;
        },

        tabsChangedAction: function ( event ) {
            var detail = event.detail;
            if ( detail.old !== null ) {
                detail.old.content.style.display = "none";
                detail.old.content.fire('hide');
            }
            if ( detail.new !== null ) {
                detail.new.content.style.display = "";
                detail.new.content.fire('show');
            }

            event.stopPropagation();
        },
    });
})();

(function () {
    Polymer('fire-ui-dock-panel', {
        created: function () {
        },

        ready: function () {
            var dragstartAction = function ( event ) {
                DockUtils.setDockSource(this);
                event.stopPropagation();
            };

            var tabs = this.$.tabs;
            for ( var i = 0; i < this.children.length; ++i ) {
                var contentEL = this.children[i];
                var name = contentEL.getAttribute("name");
                var tabEL = tabs.add(name);
                tabEL.setAttribute("draggable", "true");
                tabEL.addEventListener ( "dragstart", dragstartAction.bind(this) );

                contentEL.style.display = "none";
                tabEL.content = contentEL;
            }

            tabs.select(0);
        },

        tabsChangedAction: function ( event ) {
            var detail = event.detail;
            if ( detail.old !== null ) {
                detail.old.content.style.display = "none";
            }
            if ( detail.new !== null ) {
                detail.new.content.style.display = "";
            }

            event.stopPropagation();
        },

        removeTab: function ( tab ) {
            var tabs = this.$.tabs;

            //
            tabs.remove(tab);
            if ( tab.content ) {
                tab.content.parentNode.removeChild(tab.content);
            }

            //
            if ( tabs.tabCount > 0 ) {
                tabs.select(0);
            }
            else {
                // TODO: dock.remove(this);
                // this.parentNode.removeChild(this);
            }
        },
    });
})();

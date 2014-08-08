(function () {
    Polymer('fire-ui-dock-panel', {
        created: function () {
        },

        ready: function () {
            var tabs = this.$.tabs;
            for ( var i = 0; i < this.children.length; ++i ) {
                var contentEL = this.children[i];
                var name = contentEL.getAttribute("name");
                var tabEL = tabs.add(name);

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
                detail.new.content.style.display = "block";
            }

            event.stopPropagation();
        },
    });
})();

(function () {
    Polymer({
        publish: {
            focused: {
                value: false,
                reflect: true
            },
        },

        created: function () {
            this.focused = false;
            this.lastActive = null;
        },

        ready: function () {
            this.tabIndex = EditorUI.getParentTabIndex(this) + 1;
        },

        deleteItem: function (item) {
            var parentItem = item.parentElement;
            item.remove();
            if (parentItem !== this) {
                parentItem.foldable = parentItem.hasChildNodes();
            }

            var self = this;
            function onDeleteItemRecursively (item) {
                self.onDeleteItem(item);
                // children
                var children = item.children;
                for ( var i = 0; i < children.length; ++i ) {
                    deleteRecursively(children[i]);
                }
            }
            onDeleteItemRecursively(item);
        },

        onDeleteItem: function (item) {
        },

        setItemParent: function (item, parent) {
            var oldParent = item.parentElement;
            parent.appendChild(item);
            if (parent !== this) {
                parent.foldable = true;
            }
            if (oldParent !== this) {
                oldParent.foldable = oldParent.hasChildNodes();
            }
        },

        nextItem: function ( curItem, skipChildren ) {
            if ( !skipChildren && curItem.expanded ) {
                return curItem.firstElementChild;
            }

            if ( curItem.nextElementSibling )
                return curItem.nextElementSibling;

            var parentItem = curItem.parentElement;
            if ( parentItem instanceof FireTreeItem === false ) {
                return null;
            }

            return this.nextItem(parentItem, true);
        },

        prevItem: function ( curItem ) {
            var prevSb = curItem.previousElementSibling;
            if ( prevSb ) {
                if ( prevSb.expanded ) {
                    function getLastChildRecursively ( curItem ) {
                        if ( curItem.expanded ) {
                            return getLastChildRecursively (curItem.lastElementChild);
                        }
                        return curItem;
                    }
                    return getLastChildRecursively (prevSb);
                }
                else {
                    return prevSb;
                }
            }

            var parentItem = curItem.parentElement;
            if ( parentItem instanceof FireTreeItem === false ) {
                return null;
            }

            return parentItem;
        },

        focusinAction: function (event) {
            this.focused = true;
        },

        focusoutAction: function (event) {
            if ( this.focused === false )
                return;

            if ( event.relatedTarget === null &&
                 event.target instanceof FireTreeItem ) 
            {
                this.focus();

                event.stopPropagation();
                return;
            }

            if ( EditorUI.find( this.shadowRoot, event.relatedTarget ) )
                return;

            this.focused = false;
        },

        scrollAction: function (event) {
            this.scrollLeft = 0;
        },
        
        keydownAction: function (event) {
            switch ( event.which ) {
                // Enter
                case 13:
                    if (Fire.isDarwin) {
                        if ( this.lastActive ) {
                            this.lastActive.rename();
                        }
                        event.stopPropagation();
                    }
                break;

                // F2
                case 113:
                    if ( this.lastActive ) {
                        this.lastActive.rename();
                    }
                    event.stopPropagation();
                break;
            }
        },

    });
})();

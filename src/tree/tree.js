(function () {

    function _getLastChildRecursively ( curItem ) {
        if ( curItem.expanded ) {
            return _getLastChildRecursively (curItem.lastElementChild);
        }
        return curItem;
    }

    Polymer({
        publish: {
            focused: {
                value: false,
                reflect: true
            },
        },

        created: function () {
            this.focused = false;
            this.idToItem = {};
        },

        ready: function () {
            this.tabIndex = EditorUI.getParentTabIndex(this) + 1;
        },

        initItem: function ( item, name, id, parent ) {
            if (id) {
                this.idToItem[id] = item;
                item.userId = id;
            }
            item.name = name;
            item.foldable = false;
            parent = parent || this;
            parent.addChild(item);
        },

        deleteItem: function (item) {
            var parentItem = item.parentElement;
            item.remove();
            if (parentItem !== this) {
                parentItem.foldable = parentItem.hasChildNodes();
            }

            var self = this;
            function deleteRecursively (item) {
                self.onDeleteItem(item);
                delete self.idToItem[item.userId];
                // children
                var children = item.children;
                for ( var i = 0; i < children.length; ++i ) {
                    deleteRecursively(children[i]);
                }
            }
            deleteRecursively(item);
        },

        deleteItemById: function (id) {
            var item = this.idToItem[id];
            if ( item ) {
                this.deleteItem(item);
            }
        },

        // overridable for children
        addChild: function (child) {
            this.appendChild(child);
        },

        // overridable for children
        onDeleteItem: function (item) {
        },

        setItemParent: function (item, parent) {
            var oldParent = item.parentElement;
            parent.addChild(item);
            if (oldParent !== this) {
                oldParent.foldable = oldParent.hasChildNodes();
            }
        },

        setItemParentById: function (id, parentId) {
            var item = this.idToItem[id];
            if ( !item ) {
                return;
            }
            var parent = parentId ? this.idToItem[parentId] : this;
            if ( !parent ) {
                return;
            }
            this.setItemParent(item, parent);
        },

        renameItemById: function (id, newName) {
            var item = this.idToItem[id];
            if ( !item ) {
                return;
            }
            item.name = newName;
        },

        clear: function () {
            while (this.firstChild) {
                this.removeChild(this.firstChild);
            }
            this.idToItem = {};
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
                    return _getLastChildRecursively (prevSb);
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
        
        lastItem: function () {
            var lastChild = this.lastElementChild;
            if ( lastChild && lastChild.expanded ) {
                return _getLastChildRecursively (lastChild);
            }
            return lastChild;
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
        
        keydownAction: function (event, activeElement) {
            switch ( event.which ) {
                // Enter
                case 13:
                    if ( activeElement instanceof FireTreeItem ) {
                        if ( Fire.isDarwin ) {
                            activeElement.rename();
                            event.stopPropagation();
                        }
                    }
                break;

                // F2
                case 113:
                    if ( activeElement instanceof FireTreeItem ) {
                        activeElement.rename();
                        event.stopPropagation();
                    }
                break;

                // left-arrow
                case 37:
                    if ( activeElement instanceof FireTreeItem ) {
                        if ( activeElement.foldable && !activeElement.folded ) {
                            activeElement.folded = true;
                        }
                        event.stopPropagation();
                    }
                    break;

                // right-arrow
                case 39:
                    if ( activeElement instanceof FireTreeItem ) {
                        if ( activeElement.foldable && activeElement.folded ) {
                            activeElement.folded = false;
                        }
                        event.stopPropagation();
                    }
                    break;
            }
        },

    });
})();

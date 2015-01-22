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
        this.idToItem = {};
        this.curSelection = [];
        this.activeElement = null;
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

    getToplevelElements: function ( ids ) {
        var elements = new Array(ids.length);
        for ( var i = 0; i < ids.length; ++i ) {
            elements[i] = this.idToItem[ids[i]];
        }
        var resultELs = Fire.arrayCmpFilter ( elements, function ( elA, elB ) {
            if ( elA.contains(elB) ) {
                return 1;
            }
            if ( elB.contains(elA) ) {
                return -1;
            }
            return 0;
        } );
        return resultELs;
    },

    select: function ( element ) {
        this.clearSelect();
        this.curSelection.push(element);
        element.selected = true;
    },

    clearSelect: function ( event ) {
        this.curSelection.forEach ( function (item) {
            item.selected = false;
        } );
        this.curSelection = [];
        this.activeElement = null;
    },

    selectingAction: function ( event ) {
        this.focus();

        if ( event.detail.shift ) {
        }
        if ( event.detail.toggle ) {
            var idx = this.curSelection.indexOf( event.target );
            if ( idx === -1 ) {
                this.curSelection.push(event.target);
                event.target.selected = true;
            }
            else {
                this.curSelection.splice( idx, 1 );
                event.target.selected = false;
            }
        }
        else {
            this.select(event.target);
        }
    },

    selectAction: function ( event ) {
        this.activeElement = event.target;
    },

    keydownAction: function (event) {
        switch ( event.which ) {
            // Enter
            case 13:
                if ( Fire.isDarwin && this.activeElement ) {
                    this.activeElement.rename();
                    event.stopPropagation();
                }
            break;

            // F2
            case 113:
                if ( this.activeElement ) {
                    this.activeElement.rename();
                    event.stopPropagation();
                }
            break;

            // left-arrow
            case 37:
                if ( this.activeElement ) {
                    if ( this.activeElement.foldable && !this.activeElement.folded ) {
                        this.activeElement.folded = true;
                    }
                    event.stopPropagation();
                }
                break;

            // right-arrow
            case 39:
                if ( this.activeElement ) {
                    if ( this.activeElement.foldable && this.activeElement.folded ) {
                        this.activeElement.folded = false;
                    }
                    event.stopPropagation();
                }
                break;

            // up-arrow
            case 38:
                if ( this.activeElement ) {
                    var prev = this.prevItem(this.activeElement);
                    if ( prev ) {
                        if (prev !== this.activeElement) {
                            this.select(prev);
                            this.activeElement = prev;

                            if ( prev.offsetTop <= this.scrollTop ) {
                                this.scrollTop = prev.offsetTop;
                            }
                        }
                    }
                }
                event.preventDefault();
                event.stopPropagation();
            break;

            // down-arrow
            case 40:
                if ( this.activeElement ) {
                    var next = this.nextItem(this.activeElement, false);
                    if ( next ) {
                        if ( next !== this.activeElement ) {
                            this.select(next);
                            this.activeElement = next;

                            var headerHeight = next.$.header.offsetHeight + 1;
                            var contentHeight = this.offsetHeight - 2; // 2 for border
                            if ( next.offsetTop + headerHeight >= this.scrollTop + contentHeight ) {
                                this.scrollTop = next.offsetTop + headerHeight - contentHeight;
                            }
                        }
                    }
                }
                event.preventDefault();
                event.stopPropagation();
            break;
        }
    },

    mousedownAction: function ( event ) {
        if (event.which === 1) {
            event.stopPropagation();

            this.clearSelect();
        }
    },

});

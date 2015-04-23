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
        this.shiftStartElement = null;
    },

    ready: function () {
        this.tabIndex = EditorUI.getParentTabIndex(this) + 1;
        this.$.nameInput.addEventListener('confirm', this.renameConfirmAction.bind(this));
    },

    initItem: function ( item, name, id, parent ) {
        if (id) {
            this.idToItem[id] = item;
            item.userId = id;
        }
        item.name = name;
        item.foldable = false;
        item.folded = true;
        parent = parent || this;
        parent.addChild(item);
    },

    deleteItem: function (item) {
        var parentItem = item.parentElement;
        item.remove();
        if (parentItem && parentItem !== this) {
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

    expand: function ( id, expand ) {
        var itemEL = this.idToItem[id];
        var parentEL = itemEL.parentElement;
        while ( parentEL ) {
            if ( parentEL === this )
                break;

            parentEL.folded = !expand;
            parentEL = parentEL.parentElement;
        }
    },

    hintItem: function ( id ) {
        this.expand(id,true);
        var itemEL = this.idToItem[id];
        if (itemEL) {
            this.scrollToItem(itemEL);
            itemEL.hint();
        }
    },

    scrollToItem: function ( el ) {
        window.requestAnimationFrame( function () {
            this.scrollTop = el.offsetTop + 16 - this.offsetHeight/2;
        }.bind(this));
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
        var resultELs = Editor.arrayCmpFilter ( elements, function ( elA, elB ) {
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

    rename: function ( element ) {
        if ( element.hasIcon ) {
            this.$.nameInput.setAttribute('icon','');
        }
        else {
            this.$.nameInput.removeAttribute('icon');
        }

        element._renaming = true;
        element.$.header.appendChild(this.$.nameInput);

        this.$.nameInput.renamingEL = element;
        this.$.nameInput.style.display = '';
        this.$.nameInput.value = element.name;
        this.$.nameInput.focus();
        window.requestAnimationFrame( function () {
            this.$.nameInput.select();
        }.bind(this));
    },

    active: function ( element ) {
        this.activeElement = element;
    },

    select: function ( element ) {
        this.clearSelect();
        this.curSelection.push(element);
        element.selected = true;
    },

    clearSelect: function () {
        this.curSelection.forEach ( function (item) {
            item.selected = false;
        } );
        this.curSelection = [];
        this.activeElement = null;
        this.shiftStartElement = null;
    },

    selectingAction: function ( event ) {
        event.stopPropagation();

        this.focus();

        if ( event.detail.shift ) {
            var shiftStartEL = this.shiftStartElement;

            if ( shiftStartEL === null ) {
                shiftStartEL = this.activeElement;
            }

            var activeEL = this.activeElement;
            this.clearSelect();
            this.shiftStartElement = shiftStartEL;
            this.activeElement = activeEL;

            var el = this.shiftStartElement;

            if ( shiftStartEL !== event.target ) {
                if ( this.shiftStartElement.offsetTop < event.target.offsetTop ) {
                    while ( el !== event.target ) {
                        this.curSelection.push(el);
                        el.selected = true;
                        el = this.nextItem(el);
                    }
                }
                else {
                    while ( el !== event.target ) {
                        this.curSelection.push(el);
                        el.selected = true;
                        el = this.prevItem(el);
                    }
                }
            }
            this.curSelection.push(event.target);
            event.target.selected = true;
        }
        else if ( event.detail.toggle ) {
            this.shiftStartElement = null;

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
            this.shiftStartElement = null;

            this.select(event.target);
        }
    },

    selectAction: function ( event ) {
        event.stopPropagation();

        this.active(event.target);
    },

    renameConfirmAction: function ( event ) {
        event.stopPropagation();

        var renamingEL = this.$.nameInput.renamingEL;

        this.$.nameInput.style.display = 'none';
        this.$.content.appendChild(this.$.nameInput);
        this.$.nameInput.renamingEL = null;

        // NOTE: the rename confirm will invoke focusoutAction
        window.requestAnimationFrame( function () {
            this.focus();
        }.bind(this));

        renamingEL._renaming = false;

        if ( renamingEL.name !== event.target.value ) {
            renamingEL.name = event.target.value;
        }
    },

    keydownAction: function (event) {
        switch ( event.which ) {
            // Enter
            case 13:
                if ( Fire.isDarwin && this.activeElement ) {
                    this.rename(this.activeElement);
                    event.stopPropagation();
                }
            break;

            // F2
            case 113:
                if ( this.activeElement ) {
                    this.rename(this.activeElement);
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
                            this.active(prev);

                            window.requestAnimationFrame( function() {
                                if ( prev.offsetTop <= this.scrollTop ) {
                                    this.scrollTop = prev.offsetTop - 2; // 1 for padding, 1 for border
                                }
                            }.bind(this));
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
                            this.active(next);

                            window.requestAnimationFrame( function() {
                                var headerHeight = next.$.header.offsetHeight;
                                var contentHeight = this.offsetHeight - 3; // 2 for border, 1 for padding
                                if ( next.offsetTop + headerHeight >= this.scrollTop + contentHeight ) {
                                    this.scrollTop = next.offsetTop + headerHeight - contentHeight;
                                }
                            }.bind(this));
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

Polymer(EditorUI.mixin({
    publish: {
        'droppable': 'tab',
        'single-drop': true,
    },

    ready: function () {
        this.activeTab = null;
        this._initDroppable(this);
    },

    domReady: function () {
        if ( this.children.length > 0 ) {
            this.select(this.children[0]);
        }
    },

    findTab: function ( frameEL ) {
        for ( var i = 0; i < this.children.length; ++i ) {
            var tabEL = this.children[i];
            if ( tabEL.frameEL === frameEL )
                return tabEL;
        }

        return null;
    },

    insertTab: function ( tabEL, insertBeforeTabEL ) {
        // do nothing if we insert to ourself
        if ( tabEL === insertBeforeTabEL )
            return tabEL;
        if ( insertBeforeTabEL ) {
            this.insertBefore(tabEL, insertBeforeTabEL);
        }
        else {
            this.appendChild(tabEL);
        }

        return tabEL;
    },

    addTab: function ( name ) {
        var tabEL = new FireTab();
        tabEL.innerHTML = name;

        this.appendChild(tabEL);

        return tabEL;
    },

    removeTab: function ( tab ) {
        var tabEL = null;
        if ( typeof tab === 'number' ) {
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

                var nextTab = tabEL.nextElementSibling;
                if ( !nextTab ) {
                    nextTab = tabEL.previousElementSibling;
                }

                this.select(nextTab);
            }

            this.removeChild(tabEL);
        }
    },

    select: function ( tab ) {
        var tabEL = null;

        if ( typeof tab === 'number' ) {
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
                var oldTabEL = this.activeTab;

                if ( this.activeTab !== null ) {
                    this.activeTab.classList.remove('active');
                }
                this.activeTab = tabEL;
                this.activeTab.classList.add('active');

                if ( window.Editor ) {
                    var panelID = tabEL.frameEL.getAttribute('id');
                    var panelInfo = Editor.Panel.getPanelInfo(panelID);
                    if ( panelInfo ) {
                        this.$.popup.classList.toggle('hide', !panelInfo.popable);
                    }
                }

                this.fire( 'tab-changed', { old: oldTabEL, new: tabEL  } );
            }
        }
    },

    warn: function ( tab ) {
        var tabEL = null;

        if ( typeof tab === 'number' ) {
            if ( tab < this.children.length ) {
                tabEL = this.children[tab];
            }
        }
        else if ( tab instanceof FireTab ) {
            tabEL = tab;
        }

        //
        if ( tabEL !== null ) {
            tabEL.warn = true;
        }
    },

    _onClick: function ( event ) {
        event.stopPropagation();
        this.panelEL.focus();
    },

    _onTabClick: function ( event ) {
        event.stopPropagation();
        this.select(event.target);
        this.panelEL.focus();
    },

    _onDropAreaEnter: function ( event ) {
        event.stopPropagation();
    },

    _onDropAreaLeave: function ( event ) {
        event.stopPropagation();

        this.$.insertLine.style.display = '';
    },

    _onDropAreaAccept: function ( event ) {
        event.stopPropagation();

        EditorUI.DockUtils.dropTab(this, this._curInsertTab);
        this.$.insertLine.style.display = '';
    },

    _onDragOver: function ( event ) {
        // NOTE: in web, there is a problem:
        // http://stackoverflow.com/questions/11974077/datatransfer-setdata-of-dragdrop-doesnt-work-in-chrome
        var type = event.dataTransfer.getData('editor/type');
        if ( type !== 'tab' )
            return;

        EditorUI.DockUtils.dragoverTab( this );

        //
        event.preventDefault();
        event.stopPropagation();
        event.dataTransfer.dropEffect = 'move';

        //
        this._curInsertTab = null;
        var style = this.$.insertLine.style;
        style.display = 'block';
        if ( event.target instanceof FireTab ) {
            style.left = event.target.offsetLeft + 'px';
            this._curInsertTab = event.target;
        }
        else {
            var el = this.lastElementChild;
            style.left = (el.offsetLeft + el.offsetWidth) + 'px';
        }
    },

    _onPopup: function ( event ) {
        if ( this.activeTab ) {
            var panelID = this.activeTab.frameEL.getAttribute('id','');
            Editor.Panel.popup(panelID);
        }
    },

    _onMenuPopup: function ( event ) {
        var rect = this.$.menu.getBoundingClientRect();
        var panelID = '';
        if ( this.activeTab ) {
            panelID = this.activeTab.frameEL.getAttribute('id','');
        }

        if ( window.Editor ) {
            var panelInfo = Editor.Panel.getPanelInfo(panelID);
            var popable = true;
            if ( panelInfo ) {
                popable = panelInfo.popable;
            }

            Editor.Menu.popup( rect.left + 5, rect.bottom + 5, [
                { label: 'Maximize', message: 'panel:maximize', params: [panelID] },
                { label: 'Pop Out', message: 'panel:popup', enabled: popable, params: [panelID] },
                { label: 'Close', command: 'Editor.Panel.close', params: [panelID] },
                { label: 'Add Tab', submenu: [
                    { label: 'TODO' },
                ] },
            ]);
        }
    },
}, EditorUI.droppable));

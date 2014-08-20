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
                tabEL.setAttribute("draggable", "true");
                tabEL.addEventListener ( "dragstart", this._tabDragstartAction.bind(tabEL) );

                contentEL.style.display = "none";
                tabEL.content = contentEL;
                tabEL.panel = this;
            }

            tabs.select(0);
        },

        tabsChangedAction: function ( event ) {
            var detail = event.detail;
            if ( detail.old !== null ) {
                detail.old.content.style.display = "none";
                detail.new.content.dispatchEvent( new CustomEvent('hide') );
            }
            if ( detail.new !== null ) {
                detail.new.content.style.display = "";
                detail.new.content.dispatchEvent( new CustomEvent('show') );
            }

            event.stopPropagation();
        },

        _tabDragstartAction: function ( event ) {
            DockUtils.setDraggingTab(this);
            event.stopPropagation();
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
            tabEL.addEventListener ( "dragstart", this._tabDragstartAction.bind(tabEL) );

            contentEL.style.display = "none";
            tabEL.content = contentEL;
            tabEL.panel = this;

            this.appendChild(contentEL);
        },

        close: function ( tabEL ) {
            var tabs = this.$.tabs;

            //
            tabs.remove(tabEL);
            if ( tabEL.content ) {
                tabEL.content.parentElement.removeChild(tabEL.content);
            }
            tabEL.panel = null;

            //
            if ( tabs.tabCount > 0 ) {
                tabs.select(0);
            }
            else {
                // TODO: dock.remove(this);
                // this.parentElement.removeChild(this);
            }
        },

        addDock: function ( position, element ) {
            if ( element instanceof FireDock === false ) {
                console.warn('Dock element must be instanceof FireDock');
                return;
            }

            // check if need to create new Dock element
            var isrow = this.parentElement.isRow();
            var needNewDock = false;
            if ( position === 'left' || position === 'right' ) {
                if ( isrow === false ) {
                    needNewDock = true;
                }
            }
            else {
                if ( isrow ) {
                    needNewDock = true;
                }
            }
            var newResizer = null;

            // process dock
            if ( needNewDock ) {
                // new FireDock
                var newDock = new FireDock();
                DockUtils.copyAttributes( this, newDock );

                if ( position === 'left' ||
                     position === 'right' )
                {
                    newDock.setAttribute('flex-row', '');
                    newDock.style.height = "";
                }
                else {
                    newDock.setAttribute('flex-col', '');
                    newDock.style.width = "";
                }
                newDock.setAttribute('flex-stretch', '');

                // new resizer
                newResizer = new FireResizer();
                newResizer.vertical = newDock.isRow();
                newResizer.ready();

                //
                DockUtils.copyAttributes( this, newDock );

                // 
                this.parentElement.insertBefore(newDock, this);
                if ( position === 'left' || position === 'top' ) {
                    newDock.appendChild(element);
                    newDock.appendChild(newResizer);
                    newDock.appendChild(this);
                }
                else {
                    newDock.appendChild(this);
                    newDock.appendChild(newResizer);
                    newDock.appendChild(element);
                }
            }
            else {
                if ( position === 'left' || position === 'top' ) {
                    element.style.height = "";
                    this.parentElement.insertBefore(element, this);
                }
                else {
                    element.style.width = "";
                    if ( this.nextElementSibling ) {
                        this.parentElement.insertBefore(element, this.nextElementSibling);
                    }
                    else {
                        this.parentElement.appendChild(element);
                    }
                }
            }
        },
    });
})();

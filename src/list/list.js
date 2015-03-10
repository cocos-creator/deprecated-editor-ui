Polymer(EditorUI.mixin({
    publish: {
        value: null,
        icon: {
            reflect: true,
            value: false,
        }
    },

    ready: function () {
        this._initFocusable(this.$.content);

        this._curSelection = null;
    },

    select: function ( item ) {
        if ( this.value ) {
            for ( var i = 0; i < this.value.length; ++i ) {
                this.value[i].selected = false;
            }
        }

        if ( item ) {
            item.selected = true;
            this.fire('selected', item);
            this._curSelection = item;
        }
    },

    nextItem: function ( curItem ) {
        var idx = this.value.indexOf(curItem);
        if ( idx !== -1 )
            idx += 1;
        if ( idx >= this.value.length )
            idx = this.value.length-1;

        return this.value[idx];
    },

    prevItem: function ( curItem ) {
        var idx = this.value.indexOf(curItem);
        if ( idx !== -1 )
            idx -= 1;
        if ( idx < 0 )
            idx = 0;

        return this.value[idx];
    },

    selectAction: function ( event ) {
        if ( event.which !== 1 )
            return;

        if ( this._curSelection === event.target )
            return;

        this.select(event.target.value);
    },

    keydownAction: function (event) {
        switch ( event.which ) {
            // up-arrow
            case 38:
                if ( this._curSelection ) {
                    var prev = this.prevItem(this._curSelection);
                    if ( prev ) {
                        if ( prev !== this._curSelection ) {
                            this.select(prev);

                            window.requestAnimationFrame( function() {
                                // HACK, +1 because there have hidden element, will fix in polymer-0.8 by using item.dom
                                var idx = this.value.indexOf(prev)+1;
                                var itemEL = this.$.content.children[idx];
                                if ( itemEL.offsetTop <= this.scrollTop ) {
                                    this.scrollTop = itemEL.offsetTop;
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
                if ( this._curSelection ) {
                    var next = this.nextItem(this._curSelection);
                    if ( next ) {
                        if ( next !== this._curSelection ) {
                            this.select(next);

                            window.requestAnimationFrame( function() {
                                // HACK, +1 because there have hidden element, will fix in polymer-0.8 by using item.dom
                                var idx = this.value.indexOf(next)+1;
                                var itemEL = this.$.content.children[idx];
                                var itemHeight = itemEL.offsetHeight;
                                var contentHeight = this.offsetHeight - 2; // 2 for border,
                                if ( itemEL.offsetTop + itemHeight >= this.scrollTop + contentHeight ) {
                                    this.scrollTop = itemEL.offsetTop + itemHeight - contentHeight;
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

}, EditorUI.focusable));

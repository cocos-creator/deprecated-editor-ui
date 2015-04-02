EditorUI.resizable = (function () {
    function _notifyResizeRecursively ( element ) {
        element.dispatchEvent( new CustomEvent('resize') );

        for ( var i = 0; i < element.children.length; ++i ) {
            var childEL = element.children[i];
            if ( childEL instanceof FireDockResizer )
                continue;

            _notifyResizeRecursively(childEL);
        }
    }

    var resizable = {
        publish: {
            'width': -1, // initial width
            'min-width': -1,
            'max-width': -1,

            'height': -1, // initial height
            'min-height': -1,
            'max-height': -1,

            'auto-layout': {
                value: false,
                reflect: true
            },
        },

        calcWidth: function ( width ) {
            if ( this.computedMinWidth >= 0 && width < this.computedMinWidth ) {
                return this.computedMinWidth;
            }

            if ( this.computedMaxWidth >= 0 && width > this.computedMaxWidth ) {
                return this.computedMaxWidth;
            }

            return width;
        },

        calcHeight: function ( height ) {
            if ( this.computedMinHeight >= 0 && height < this.computedMinHeight ) {
                return this.computedMinHeight;
            }

            if ( this.computedMaxHeight >= 0 && height > this.computedMaxHeight ) {
                return this.computedMaxHeight;
            }

            return height;
        },

        initSize: function () {
            // initialize min, max width and height in self level
            var minWidth = this['min-width'];
            var maxWidth = this['max-width'];
            if ( maxWidth >= 0 ) {
                if ( minWidth >= 0 && maxWidth < minWidth ) {
                    this['max-width'] = maxWidth = minWidth;
                }
            }

            var minHeight = this['min-height'];
            var maxHeight = this['max-height'];
            if ( maxHeight >= 0 ) {
                if ( minHeight >= 0 && maxHeight < minHeight ) {
                    this['max-height'] = maxHeight = minHeight;
                }
            }

            // simple init computed width, height
            this.computedWidth = this.width;
            this.computedHeight = this.height;

            // min-width
            this.computedMinWidth = minWidth;
            if ( this.computedMinWidth >= 0 ) {
                this.style.minWidth = this.computedMinWidth + 'px';
            }

            // max-width
            this.computedMaxWidth = maxWidth;
            if ( this.computedMaxWidth >= 0 ) {
                this.style.maxWidth = this.computedMaxWidth + 'px';
            }

            // min-height
            this.computedMinHeight = minHeight;
            if ( this.computedMinHeight >= 0 ) {
                this.style.minHeight = this.computedMinHeight + 'px';
            }

            // max-height
            this.computedMaxHeight = maxHeight;
            if ( this.computedMaxHeight >= 0 ) {
                this.style.maxHeight = this.computedMaxHeight + 'px';
            }
        },

        finalize: function ( elements, row ) {
            var i, el, infWidth = false, infHeight = false;

            this.computedMinWidth = 3 * (elements.length-1); // preserve resizers' width
            this.computedMinHeight = 3 * (elements.length-1); // preserve resizers' height
            this.computedMaxWidth = this['max-width'];
            this.computedMaxHeight = this['max-height'];

            if ( row ) {
                for ( i = 0; i < elements.length; ++i ) {
                    el = elements[i];

                    // min-width
                    if ( el.computedMinWidth >= 0 ) {
                        this.computedMinWidth += el.computedMinWidth;
                    }

                    // min-height
                    if ( el.computedMinHeight >= 0 &&
                         this.computedMinHeight < el.computedMinHeight ) {
                        this.computedMinHeight = el.computedMinHeight;
                    }

                    // max-width
                    if ( infWidth || el.computedMaxWidth < 0 ) {
                        infWidth = true;
                        this.computedMaxWidth = -1;
                    }
                    else {
                        this.computedMaxWidth += el.computedMaxWidth;
                    }

                    // max-height
                    if ( infHeight || el.computedMaxHeight < 0 ) {
                        infHeight = true;
                        this.computedMaxHeight = -1;
                    }
                    else {
                        if ( this.computedMaxHeight < el.computedMaxHeight ) {
                            this.computedMaxHeight = el.computedMaxHeight;
                        }
                    }

                    // width, height
                    if ( el.computedWidth !== -1 && el.computedWidth > this.computedWidth ) {
                        this.computedWidth = el.computedWidth;
                    }

                    if ( el.computedHeight !== -1 && el.computedHeight > this.computedHeight ) {
                        this.computedHeight = el.computedHeight;
                    }
                }
            }
            else {
                for ( i = 0; i < elements.length; ++i ) {
                    el = elements[i];

                    // min-width
                    if ( el.computedMinWidth >= 0 &&
                         this.computedMinWidth < el.computedMinWidth ) {
                        this.computedMinWidth = el.computedMinWidth;
                    }

                    // min-height
                    if ( el.computedMinHeight >= 0 ) {
                        this.computedMinHeight += el.computedMinHeight;
                    }

                    // max-width
                    if ( infWidth || el.computedMaxWidth < 0 ) {
                        infWidth = true;
                        this.computedMaxWidth = -1;
                    }
                    else {
                        if ( this.computedMaxWidth < el.computedMaxWidth ) {
                            this.computedMaxWidth = el.computedMaxWidth;
                        }
                    }

                    // max-height
                    if ( infHeight || el.computedMaxHeight < 0 ) {
                        infHeight = true;
                        this.computedMaxHeight = -1;
                    }
                    else {
                        this.computedMaxHeight += el.computedMaxHeight;
                    }

                    // width, height
                    if ( el.computedWidth !== -1 && el.computedWidth > this.computedWidth ) {
                        this.computedWidth = el.computedWidth;
                    }

                    if ( el.computedHeight !== -1 && el.computedHeight > this.computedHeight ) {
                        this.computedHeight = el.computedHeight;
                    }
                }
            }

            //
            if ( this.computedMinWidth >= 0 ) {
                this.style.minWidth = this.computedMinWidth + 'px';
            }
            else {
                this.style.minWidth = 'auto';
            }

            if ( this.computedMaxWidth >= 0 ) {
                this.style.maxWidth = this.computedMaxWidth + 'px';
            }
            else {
                this.style.maxWidth = 'auto';
            }

            if ( this.computedMinHeight >= 0 ) {
                this.style.minHeight = this.computedMinHeight + 'px';
            }
            else {
                this.style.minHeight = 'auto';
            }

            if ( this.computedMaxHeight >= 0 ) {
                this.style.maxHeight = this.computedMaxHeight + 'px';
            }
            else {
                this.style.maxHeight = 'auto';
            }
        },

        _notifyResize: function () {
            _notifyResizeRecursively(this);
        },

        _initResizable: function () {
            this.initSize();
        },
    };
    return resizable;
})();

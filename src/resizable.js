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
            'width': -1,
            'min-width': -1,
            'max-width': -1,

            'height': -1,
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

        copyResizable: function ( element ) {
            this.width = element.width;
            this['min-width'] = element['min-width'];
            this['max-width'] = element['max-width'];

            this.height = element.height;
            this['min-height'] = element['min-height'];
            this['max-height'] = element['max-height'];

            if ( element.width !== -1 ) this.setAttribute('width', element.width);
            if ( element['min-width'] !== -1 ) this.setAttribute('min-width', element['min-width']);
            if ( element['max-width'] !== -1 ) this.setAttribute('max-width', element['max-width']);

            if ( element.height !== -1 ) this.setAttribute('height', element.height);
            if ( element['min-height'] !== -1 ) this.setAttribute('min-height', element['min-height']);
            if ( element['max-height'] !== -1 ) this.setAttribute('max-height', element['max-height']);
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
            var defaultWidth = this.width;
            if ( defaultWidth > 0 ) {
                if ( minWidth >= 0 && defaultWidth < minWidth ) {
                    this.width = defaultWidth = minWidth;
                }

                if ( maxWidth >= 0 && defaultWidth > maxWidth ) {
                    this.width = defaultWidth = maxWidth;
                }
            }

            var minHeight = this['min-height'];
            var maxHeight = this['max-height'];
            if ( maxHeight >= 0 ) {
                if ( minHeight >= 0 && maxHeight < minHeight ) {
                    this['max-height'] = maxHeight = minHeight;
                }
            }
            var defaultHeight = this.height;
            if ( defaultHeight > 0 ) {
                if ( minHeight >= 0 && defaultHeight < minHeight ) {
                    this.height = defaultHeight = minHeight;
                }

                if ( maxHeight >= 0 && defaultHeight > maxHeight ) {
                    this.height = defaultHeight = maxHeight;
                }
            }

            // simple init computed width, height

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

        _notifyResize: function () {
            _notifyResizeRecursively(this);
        },

        _initResizable: function () {
            this.initSize();
        },
    };
    return resizable;
})();

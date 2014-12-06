var EditorUI;
(function (EditorUI) {
    EditorUI.resizable = {
        publish: {
            'default-width': -1,
            'min-width': -1,
            'max-width': -1,

            'default-height': -1,
            'min-height': -1,
            'max-height': -1,
        },

        getMinWidth: function () {
            var minWidth = this['min-width'];
            if ( minWidth > 0 ) {
                return minWidth;
            }
            return -1;
        },

        getMaxWidth: function () {
            var maxWidth = this['max-width'];
            if ( maxWidth > 0 ) {
                var minWidth = this['min-width'];
                if ( minWidth !== -1 && maxWidth < minWidth )
                    maxWidth = minWidth;

                return maxWidth;
            }
            return -1;
        },

        getMinHeight: function () {
            var minHeight = this['min-height'];
            if ( minHeight > 0 ) {
                return minHeight;
            }
            return -1;
        },

        getMaxHeight: function () {
            var maxHeight = this['max-height'];
            if ( maxHeight > 0 ) {
                var minHeight = this['min-height'];
                if ( minHeight !== -1 && maxHeight < minHeight )
                    maxHeight = minHeight;

                return maxHeight;
            }
            return -1;
        },

        getDefaultWidth: function () {
            var defaultWidth = this['default-width'];
            if ( defaultWidth > 0 ) {
                var minWidth = this.getMinWidth();
                if ( minWidth !== -1 && defaultWidth < minWidth ) {
                    return minWidth;
                }

                var maxWidth = this.getMaxWidth();
                if ( maxWidth !== -1 && defaultWidth > maxWidth ) {
                    return maxWidth;
                }

                return defaultWidth;
            }

            return -1;
        },

        getDefaultHeight: function () {
            var defaultHeight = this['default-height'];
            if ( defaultHeight > 0 ) {
                var minHeight = this.getMinHeight();
                if ( minHeight !== -1 && defaultHeight < minHeight ) {
                    return minHeight;
                }

                var maxHeight = this.getMaxHeight();
                if ( maxHeight !== -1 && defaultHeight > maxHeight ) {
                    return maxHeight;
                }

                return defaultHeight;
            }

            return -1;
        },

        calcWidth: function ( width ) {
            if ( this.computedMinWidth !== -1 && width < this.computedMinWidth ) {
                return this.computedMinWidth;
            }

            if ( this.computedMaxWidth !== -1 && width > this.computedMaxWidth ) {
                return this.computedMaxWidth;
            }

            return width;
        },

        calcHeight: function ( height ) {
            if ( this.computedMinHeight !== -1 && height < this.computedMinHeight ) {
                return this.computedMinHeight;
            }

            if ( this.computedMaxHeight !== -1 && height > this.computedMaxHeight ) {
                return this.computedMaxHeight;
            }

            return height;
        },

        _initResizable: function () {
            // min-width
            this.computedMinWidth = this.getMinWidth();
            if ( this.computedMinWidth !== -1 ) {
                this.style.minWidth = this.computedMinWidth + 'px';
            }

            // max-width
            this.computedMaxWidth = this.getMaxWidth();
            if ( this.computedMaxWidth !== -1 ) {
                this.style.maxWidth = this.computedMaxWidth + 'px';
            }
            // min-height
            this.computedMinHeight = this.getMinHeight();
            if ( this.computedMinHeight !== -1 ) {
                this.style.minHeight = this.computedMinHeight + 'px';
            }

            // max-height
            this.computedMaxHeight = this.getMaxHeight();
            if ( this.computedMaxHeight !== -1 ) {
                this.style.maxHeight = this.computedMaxHeight + 'px';
            }

            // default-width
            this.computedWidth = this.getDefaultWidth();

            // default-height
            this.computedHeight = this.getDefaultHeight();
        },
    };
})(EditorUI || (EditorUI = {}));

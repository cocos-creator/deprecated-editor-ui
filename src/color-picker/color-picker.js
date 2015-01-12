(function () {
    Polymer({
        publish: {
            value: new Fire.Color( 1.0, 1.0, 1.0, 1.0 ),
        },

        observe: {
            'value.r value.g value.b': 'colorChanged',
            'value.a': '_updateColor',
        },

        created: function () {
            this.tabIndex = EditorUI.getParentTabIndex(this) + 1;
            this.value = new Fire.Color( 1.0, 1.0, 1.0, 1.0 );
        },

        ready: function() {
            this.hsv = this.value.toHSV();
            this._editingHSV = false;
            this._updateColor();
        },

        colorChanged: function ( oldValue, newValue ) {
            if ( this._editingHSV === false ) {
                this.hsv = Fire.rgb2hsv(this.value.r, this.value.g, this.value.b);
                this._updateColor();
            }
        },

        toInt: {
            toDOM: function(value) {
                return value * 255 | 0;
            },
            toModel: function(value) {
                return value/255;
            }
        },

        _updateColor: function () {
            var cssRGB = Fire.hsv2rgb( this.hsv.h, 1, 1 );
            cssRGB = "rgb("+ (cssRGB.r*255|0) + "," + (cssRGB.g*255|0) + "," + (cssRGB.b*255|0) + ")";
            this.$.colorCtrl.style.backgroundColor = cssRGB;
            this.$.opacityCtrl.style.backgroundColor = cssRGB;
            this.$.opacityHandle.style.top = (1.0-this.value.a)*100 + "%";
            this.$.hueHandle.style.top = (1.0-this.hsv.h)*100 + "%";
            this.$.colorHandle.style.left = this.hsv.s*100 + "%";
            this.$.colorHandle.style.top = (1.0-this.hsv.v)*100 + "%";

            if ( this.owner && this.owner.setColor ) {
                this.owner.setColor( this.value.r, this.value.g, this.value.b, this.value.a );
            }
        },

        // hue
        hueCtrlMouseDownAction: function ( event ) {
            // add drag-ghost
            EditorUI.addDragGhost("crosshair");
            this._editingHSV = true;

            var rect = this.$.hueCtrl.getBoundingClientRect();
            var mouseDownY = rect.top;

            var updateMouseMove = function (event) {
                var offsetY = (event.clientY - mouseDownY)/this.$.hueCtrl.clientHeight;
                offsetY = Math.max( Math.min( offsetY, 1.0 ), 0.001 );

                this.hsv.h = 1.0-offsetY;
                this._updateColor();
                var h = Math.round( this.hsv.h * 100.0 )/100.0;
                this.value.fromHSV( h, this.hsv.s, this.hsv.v );

                event.stopPropagation();
            };
            updateMouseMove.call(this,event);

            var mouseMoveHandle = updateMouseMove.bind(this);
            var mouseUpHandle = (function(event) {
                document.removeEventListener('mousemove', mouseMoveHandle);
                document.removeEventListener('mouseup', mouseUpHandle);

                EditorUI.removeDragGhost();
                this._editingHSV = false;
                event.stopPropagation();
            }).bind(this);
            document.addEventListener ( 'mousemove', mouseMoveHandle );
            document.addEventListener ( 'mouseup', mouseUpHandle );

            event.stopPropagation();
        },

        // color
        colorCtrlMouseDownAction: function ( event ) {
            // add drag-ghost
            EditorUI.addDragGhost("crosshair");
            this._editingHSV = true;

            var rect = this.$.colorCtrl.getBoundingClientRect();
            var mouseDownX = rect.left;
            var mouseDownY = rect.top;

            var updateMouseMove = function (event) {
                var offsetX = (event.clientX - mouseDownX)/this.$.colorCtrl.clientWidth;
                var offsetY = (event.clientY - mouseDownY)/this.$.colorCtrl.clientHeight;

                offsetX = Math.max( Math.min( offsetX, 1.0 ), 0.0 );
                offsetY = Math.max( Math.min( offsetY, 1.0 ), 0.0 );

                this.hsv.s = offsetX;
                this.hsv.v = 1.0-offsetY;
                this._updateColor();
                var h = Math.round( this.hsv.h * 100.0 )/100.0;
                this.value.fromHSV( h, this.hsv.s, this.hsv.v );
                event.stopPropagation();
            };
            updateMouseMove.call(this,event);

            var mouseMoveHandle = updateMouseMove.bind(this);
            var mouseUpHandle = (function(event) {
                document.removeEventListener('mousemove', mouseMoveHandle);
                document.removeEventListener('mouseup', mouseUpHandle);

                EditorUI.removeDragGhost();
                this._editingHSV = false;
                event.stopPropagation();
            }).bind(this);
            document.addEventListener ( 'mousemove', mouseMoveHandle );
            document.addEventListener ( 'mouseup', mouseUpHandle );

            event.stopPropagation();
        },

        // alpha
        opacityCtrlMouseDownAction: function ( event ) {
            // add drag-ghost
            EditorUI.addDragGhost("crosshair");

            var rect = this.$.opacityCtrl.getBoundingClientRect();
            var mouseDownY = rect.top;

            var updateMouseMove = function (event) {
                var offsetY = (event.clientY - mouseDownY)/this.$.opacityCtrl.clientHeight;
                offsetY = Math.max( Math.min( offsetY, 1.0 ), 0.0 );
                this.value.a = 1.0-offsetY;
                this._updateColor();

                event.stopPropagation();
            };
            updateMouseMove.call(this,event);

            var mouseMoveHandle = updateMouseMove.bind(this);
            var mouseUpHandle = (function(event) {
                document.removeEventListener('mousemove', mouseMoveHandle);
                document.removeEventListener('mouseup', mouseUpHandle);

                EditorUI.removeDragGhost();
                event.stopPropagation();
            }).bind(this);
            document.addEventListener ( 'mousemove', mouseMoveHandle );
            document.addEventListener ( 'mouseup', mouseUpHandle );

            event.stopPropagation();
        },

        focusoutAction: function ( event ) {
            event.stopPropagation();

            if ( event.relatedTarget === null ) {
                this.focus();
                return;
            }
        },

        keydownAction: function ( event ) {
            switch ( event.which ) {
                // esc
                case 27:
                    if ( this.owner && this.owner.showColorPicker ) {
                        this.owner.showColorPicker(false);
                        this.owner.focus();
                    }
                break;
            }
            event.stopPropagation();
        },

    });
})();

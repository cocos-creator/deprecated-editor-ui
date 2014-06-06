(function () {
    Polymer('fire-ui-color-picker', {
        ready: function() {
            this.color = (this.color!==null) ? this.color : new FIRE.Color( 1.0, 1.0, 1.0, 1.0 );
            this.hsv = this.color.toHSV();
            this.rgb = {
                r: this.color.r * 255 | 0 ,
                g: this.color.g * 255 | 0 ,
                b: this.color.b * 255 | 0 ,
            };
            this._editingHSV = false;
            this._updateColor();
        },

        observe: {
            'rgb.r': 'rgbChanged', 
            'rgb.g': 'rgbChanged', 
            'rgb.b': 'rgbChanged', 
            'color.r': 'colorChanged', 
            'color.g': 'colorChanged', 
            'color.b': 'colorChanged', 
            'color.a': '_updateColor', 
        },

        rgbChanged: function ( oldValue, newValue ) {
            this.color.r = this.rgb.r/255;
            this.color.g = this.rgb.g/255;
            this.color.b = this.rgb.b/255;
        },

        colorChanged: function ( oldValue, newValue ) {
            this.rgb = {
                r: this.color.r * 255 | 0,
                g: this.color.g * 255 | 0,
                b: this.color.b * 255 | 0,
            };
            if ( this._editingHSV === false ) {
                this.hsv = FIRE.rgb2hsv(this.color.r, this.color.g, this.color.b);
                this._updateColor();
            }
        },

        _updateColor: function () {
            var cssRGB = FIRE.hsv2rgb( this.hsv.h, 1, 1 );
            cssRGB = "rgb("+ (cssRGB.r*255|0) + "," + (cssRGB.g*255|0) + "," + (cssRGB.b*255|0) + ")";
            this.$.colorCtrl.style.backgroundColor = cssRGB;
            this.$.opacityCtrl.style.backgroundColor = cssRGB;
            this.$.opacityHandle.style.top = (1.0-this.color.a)*100 + "%";
            this.$.hueHandle.style.top = (1.0-this.hsv.h)*100 + "%";
            this.$.colorHandle.style.left = this.hsv.s*100 + "%";
            this.$.colorHandle.style.top = (1.0-this.hsv.v)*100 + "%";
        },

        _addDragGhost: function ( cursor ) {
            // // add drag-ghost
            // var dragGhost = $("<div></div>")
            // .addClass("drag-ghost")
            // .css({
            //     position: "fixed",
            //     "z-index": "999",
            //     left: "0",
            //     top: "0",
            //     width: $(window).width() + "px",
            //     height: $(window).height() + "px",
            //     cursor: cursor,
            // })
            // ;
            // $(document.body).append(dragGhost);
            // return dragGhost;
        },

        _removeDragGhost: function ( dragGhost ) {
            // dragGhost.css('cursor', 'auto');
            // dragGhost.remove();
        },

        // hue
        onHueCtrlMouseDown: function ( event ) {
            // // add drag-ghost
            // var dragGhost = addDragGhost("crosshair");
            // this._editingHSV = true;

            // var mouseDownY = $(this).offset().top;
            // var updateMouseMove = function (event) {
            //     var offsetY = (event.pageY - mouseDownY)/huePanel.height();
            //     offsetY = Math.max( Math.min( offsetY, 1.0 ), 0.001 );

            //     this.hsv.h = 1.0-offsetY;
            //     updateColor();
            //     this.$apply( function () {
            //         var h = Math.round( this.hsv.h * 100.0 )/100.0;
            //         this.color.fromHSV( h, this.hsv.s, this.hsv.v );
            //     });
            // };
            // updateMouseMove(event);

            // $(document).on ( 'mousemove', function ( event ) {
            //     updateMouseMove(event);
            //     return false;
            // });
            // $(document).on ( 'mouseup', function ( event ) {
            //     $(document).off ( 'mousemove' );
            //     $(document).off ( 'mouseup' );
            //     removeDragGhost (dragGhost);
            //     this._editingHSV = false;
            //     return false;
            // });
        },

        // color 
        onColorCtrlMouseDown: function ( event ) {
            // // add drag-ghost
            // var dragGhost = addDragGhost("crosshair");
            // this._editingHSV = true;

            // var mouseDownX = $(this).offset().left;
            // var mouseDownY = $(this).offset().top;

            // var updateMouseMove = function (event) {
            //     var offsetX = (event.pageX - mouseDownX)/colorPanel.width();
            //     var offsetY = (event.pageY - mouseDownY)/colorPanel.height();

            //     offsetX = Math.max( Math.min( offsetX, 1.0 ), 0.0 );
            //     offsetY = Math.max( Math.min( offsetY, 1.0 ), 0.0 );

            //     this.hsv.s = offsetX;
            //     this.hsv.v = 1.0-offsetY;
            //     this._updateColor();
            //     this.$apply( function () {
            //         var h = Math.round( this.hsv.h * 100.0 )/100.0;
            //         this.color.fromHSV( h, this.hsv.s, this.hsv.v );
            //     });
            // };
            // updateMouseMove(event);

            // $(document).on ( 'mousemove', function ( event ) {
            //     updateMouseMove(event);
            // });
            // $(document).on ( 'mouseup', function ( event ) {
            //     $(document).off ( 'mousemove' );
            //     $(document).off ( 'mouseup' );
            //     removeDragGhost (dragGhost);
            //     this._editingHSV = false;
            //     return false;
            // });
        },

        // alpha
        onOpacityCtrlMouseDown: function ( event ) {
            // // add drag-ghost
            // var dragGhost = addDragGhost("crosshair");

            // var mouseDownY = $(this).offset().top;
            // var updateMouseMove = function (event) {
            //     var offsetY = (event.pageY - mouseDownY)/opacityPanel.height();
            //     offsetY = Math.max( Math.min( offsetY, 1.0 ), 0.0 );

            //     this.$apply( function () {
            //         this.color.a = 1.0-offsetY;
            //     });
            // };
            // updateMouseMove(event);

            // $(document).on ( 'mousemove', function ( event ) {
            //     updateMouseMove(event);
            //     return false;
            // });
            // $(document).on ( 'mouseup', function ( event ) {
            //     $(document).off ( 'mousemove' );
            //     $(document).off ( 'mouseup' );
            //     removeDragGhost (dragGhost);
            //     return false;
            // });
        },
    });
})();

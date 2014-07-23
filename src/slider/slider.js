(function () {
    Polymer('fire-ui-slider', {
        _editing: false,

        publish: {
            value: 0.0,
            min: 0.0,
            max: 1.0,
        },

        observe: {
            'value': 'update', 
        },

        created: function () {
            this.focused = false;
        },

        ready: function () {
            this.$.focus.tabIndex = FIRE.getParentTabIndex(this)+1;
        },

        update: function () {
            if ( this._editing )
                return;

            var ratio = this.value/(this.max-this.min);
            this.$.nubbin.style.left = ratio * 100 + "%";
        },

        focusAction: function (event) {
            this.focused = true;
            this.classList.toggle('focused', this.focused);
        },

        blurAction: function (event) {
            if ( this.focused === false )
                return;

            if ( FIRE.find( this.shadowRoot, event.relatedTarget ) )
                return;

            this.focused = false;
            this.classList.toggle('focused', this.focused);
        },

        mousedownAction: function (event) {
            FIRE.addDragGhost("pointer");
            this._editing = true;

            var rect = this.$.track.getBoundingClientRect();
            var mouseDownX = rect.left;

            // 
            var updateMouseMove = function (event) {
                var offsetX = (event.pageX - mouseDownX)/this.$.track.clientWidth;

                offsetX = Math.max( Math.min( offsetX, 1.0 ), 0.0 );
                this.$.nubbin.style.left = offsetX * 100 + "%";
                this.value = this.min + offsetX * (this.max-this.min);

                event.stopPropagation();
            };
            updateMouseMove.call(this,event);


            var mouseMoveHandle = updateMouseMove.bind(this);
            var mouseUpHandle = (function(event) {
                document.removeEventListener('mousemove', mouseMoveHandle);
                document.removeEventListener('mouseup', mouseUpHandle);

                FIRE.removeDragGhost();
                this._editing = false;
                event.stopPropagation();
            }).bind(this);
            document.addEventListener ( 'mousemove', mouseMoveHandle );
            document.addEventListener ( 'mouseup', mouseUpHandle );
        },
    });
})();

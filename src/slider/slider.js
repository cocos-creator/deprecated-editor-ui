(function () {
    Polymer(EditorUI.mixin({
        _editing: false,

        publish: {
            value: 0.0,
            min: 0.0,
            max: 1.0,
        },

        observe: {
            'value': 'update',
        },

        ready: function () {
            this._initFocusable(this.$.focus);
        },

        update: function () {
            if ( this._editing )
                return;

            var ratio = this.value/(this.max-this.min);
            this.$.nubbin.style.left = ratio * 100 + "%";
        },

        mousedownAction: function (event) {
            EditorUI.addDragGhost("pointer");
            this._editing = true;

            var rect = this.$.track.getBoundingClientRect();
            var mouseDownX = rect.left;

            //
            var updateMouseMove = function (event) {
                var offsetX = (event.clientX - mouseDownX)/this.$.track.clientWidth;

                offsetX = Math.max( Math.min( offsetX, 1.0 ), 0.0 );
                this.$.nubbin.style.left = offsetX * 100 + "%";
                this.value = this.min + offsetX * (this.max-this.min);
                this.fire('changed');

                event.stopPropagation();
            };
            updateMouseMove.call(this,event);


            var mouseMoveHandle = updateMouseMove.bind(this);
            var mouseUpHandle = (function(event) {
                document.removeEventListener('mousemove', mouseMoveHandle);
                document.removeEventListener('mouseup', mouseUpHandle);

                EditorUI.removeDragGhost();
                this._editing = false;
                event.stopPropagation();
            }).bind(this);
            document.addEventListener ( 'mousemove', mouseMoveHandle );
            document.addEventListener ( 'mouseup', mouseUpHandle );
        },
    }, EditorUI.focusable));
})();

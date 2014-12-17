Polymer({
    publish: {
        vertical: {
            value: false,
            reflect: true
        },

        hold: {
            value: false,
            reflect: true
        }
    },

    mousedownAction: function (event) {
        var pressy = event.clientY;
        var pressx = event.clientX;
        EditorUI.addDragGhost( this.vertical ? 'ew-resize' : 'ns-resize' );
        var pre = this.previousElementSibling.getBoundingClientRect();
        var next = this.nextElementSibling.getBoundingClientRect();
        this.setAttribute("hold","");
        var mousemoveHandle = function (event) {
            if (this.vertical) {
                this.previousElementSibling.style.width = pre.width + (event.clientX - pressX) + "px";
                this.nextElementSibling.style.width = next.width - (event.clientX - pressX) + "px";
            }
            else {
                this.previousElementSibling.style.height = pre.height + (event.clientY - pressy) + "px";
                this.nextElementSibling.style.height = next.height - (event.clientY - pressy) + "px";
            }
        }.bind(this);

        var mouseupHandle = function (event) {
            document.removeEventListener('mousemove', mousemoveHandle);
            document.removeEventListener('mouseup', mouseupHandle);
            EditorUI.removeDragGhost();
            this.removeAttribute("hold");
        }.bind(this);

        document.addEventListener ( 'mousemove', mousemoveHandle );
        document.addEventListener ( 'mouseup', mouseupHandle );
    },
});

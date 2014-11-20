(function () {
    Polymer({
        publish: {
            BrotherElmentCount: 0,
            inverse: {
                value: false,
                reflect: true
            },
            vertical: {
                value: false,
                reflect: true
            }
        },

        created: function () {
            this.target = null;
            this.previous = null;
            this.next = null;
        },

        ready: function () {
            if ( this.vertical ) {
                this.classList.toggle('vertical', true);
                this.classList.toggle('horizontal', false);
            }
            else {
                this.classList.toggle('vertical', false);
                this.classList.toggle('horizontal', true);
            }
            this.inverse = false;
            this.previous = this.previousElementSibling;
        },

        domReady: function () {
            this.previous = this.previousElementSibling;
            this.next = this.nextElementSibling;;
        },

        // 该方法用于获取当前元素的所有同级元素
        GetBrotherChild: function (elem) {
            var r = [];
            var n = elem.parentNode.firstChild;
            for ( ; n; n = n.nextSibling ) {
            if ( n.nodeType === 1  ) {
                r.push( n );
               }
            }
            return r;
        },

        mousedownAction: function ( event ) {
            console.log(this.GetBrotherChild(this).length);
            if ( this.previous ) {
                // add drag-ghost
                EditorUI.addDragGhost( this.vertical ? 'col-resize' : 'row-resize' );

                //var targetRect = this.previousElementSibling.getBoundingClientRect();
                var lastRect = this.previous.getBoundingClientRect();
                var nextRect = this.next.getBoundingClientRect();
                var lastMinheight = this.previous.minHeight;
                var nextMinheight = this.next.minHeight;
                var lastMinWidth = this.previous.minHeight;
                var nextMinWidth = this.next.minHeight;
                var mouseDownX = event.clientX;
                var mouseDownY = event.clientY;

                var updateMouseMove = function (event) {
                    var offset = -1;
                    if ( this.vertical ) {
                        offset = event.clientX - mouseDownX;
                        offset = this.inverse ? -offset : offset;
                        if ( (lastRect.width + offset) <= (lastMinWidth) || (nextRect.width - offset) <= (nextMinWidth)) {
                            return;
                        }
                        else {
                            this.previous.Width = (lastRect.width + offset) + "px";
                            this.next.Width = (nextRect.width - offset) + "px";
                        }

                        console.log(lastRect.width+",");
                    }
                    else {
                        offset = event.clientY - mouseDownY;
                        offset = this.inverse ? -offset : offset;
                        if ( (lastRect.height + offset) <= (lastMinheight) || (nextRect.height - offset) <= (nextMinheight)) {
                            return;
                        }
                        else {
                            this.previous.Height = (lastRect.height + offset) + "px";
                            this.next.Height = (nextRect.height - offset) + "px";
                        }

                    }

                    // 事件完毕后触发 mouseup触发resized结束事件 mousemove触发resize事件
                    this.fire( "resized", { target: this.previous } );

                    //
                    event.stopPropagation();
                };
                updateMouseMove.call(this,event);

                var mouseMoveHandle = updateMouseMove.bind(this);
                var mouseUpHandle = (function(event) {
                    document.removeEventListener('mousemove', mouseMoveHandle);
                    document.removeEventListener('mouseup', mouseUpHandle);
                    console.log('结束事件');
                    EditorUI.removeDragGhost();
                    event.stopPropagation();
                }).bind(this);
                document.addEventListener ( 'mousemove', mouseMoveHandle );
                document.addEventListener ( 'mouseup', mouseUpHandle );
            }

            event.stopPropagation();
        },
    });
})();

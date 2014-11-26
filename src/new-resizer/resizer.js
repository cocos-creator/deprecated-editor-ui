(function () {
    Polymer({
        publish: {
            BrotherElments: null,
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
            this.dock = new FireNewDock();
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
            this.next = this.nextElementSibling;
        },

        // 该方法用于获取当前元素的所有同级元素 排除掉resizer自身
        GetBrotherChild: function (elem) {
            var r = [];
            var n = elem.parentNode.firstChild;
            for ( ; n; n = n.nextSibling ) {
            if ( n.nodeType === 1) {
                r.push( n );
               }
           }
           var ElmList = [];
           this.BrotherElments = [];
           for (var i = 0; i < r.length; i++ ) {
               if(r[i].tagName != "FIRE-UI-NEWRESIZER") {
                   ElmList.push(r[i]);
               }
           }
           this.BrotherElments = ElmList;
           return ElmList;
        },

        ChangeChild: function (elem) {

        },

        //该函数用于返回当前操作的resizer的前一个元素在BrotherElments中的下标
        GetSubscript: function (elem) {
            this.GetBrotherChild(elem.nextElementSibling);
            for ( var i = 0; i < this.BrotherElments.length; i++) {
                if(this.previous == this.BrotherElments[i]){
                     return i;
                }
            }
        },

        mousedownAction: function ( event ) {
            if ( this.previous ) {
                // add drag-ghost
                EditorUI.addDragGhost( this.vertical ? 'col-resize' : 'row-resize' );
                var lastRect = this.previous.getBoundingClientRect();
                var nextRect = this.next.getBoundingClientRect();
                var lastMinheight = this.previous.minHeight;
                var nextMinheight = this.next.minHeight;
                var lastMinWidth = this.previous.minWidth;
                var nextMinWidth = this.next.minWidth;
/*
                var lastMaxheight = this.previous.maxHeight;
                var nextMaxheight = this.next.maxHeight;
                var lastMaxWidth = this.previous.maxWidth;
                var nextMaxWidth = this.next.maxWidth;
*/
                var mouseDownX = event.clientX;
                var mouseDownY = event.clientY;
                var updateMouseMove = function (event) {
                    var offset = -1;
                    var nowheight = 0;
                    var nowwidth = 0;
                    if ( this.vertical ) {
                        offset = event.clientX - mouseDownX;
                        offset = this.inverse ? -offset : offset;
                        if ( (lastRect.width + offset) <= (lastMinWidth) || (nextRect.width - offset) <= (nextMinWidth) ) {
                            return;
                        }
                        else {
                            this.previous.Width = (lastRect.width + offset) + "px";
                            this.next.Width = (nextRect.width - offset) + "px";
                        }

                        for (var i = 0; i<this.previous.children.length; i++) {
                          this.previous.children[i].resizing = this.previous.getBoundingClientRect().width;
                        }
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
                            nowheight=(nextRect.height - offset);
                        }

                        for (var i = 0; i<this.previous.children.length; i++) {
                            this.previous.children[i].resizing = this.previous.getBoundingClientRect().height;
                        }
                    }
                    // 这里动态调整children的长宽和父节点一样 参考dock里的auto size
                    for (var i = 0; i < this.previous.children.length; i ++) {
                        if (this.previous.children[i].tagName != 'FIRE-UI-NEWRESIZER') {
                            if (this.previous.vertical) {
                              this.previous.children[i].style.height = this.previous.getBoundingClientRect().height +"px";
                            }
                            else {
                              this.previous.children[i].style.width = this.previous.getBoundingClientRect().width +"px";
                            }
                        }
                    }

                    for (var i = 0; i < this.next.children.length; i ++) {
                      if (this.next.children[i].tagName != 'FIRE-UI-NEWRESIZER') {
                        if (!this.vertical) {
                          this.next.children[i].style.height = this.next.getBoundingClientRect().height +"px";
                        }
                        else {
                          this.next.children[i].style.width = this.next.getBoundingClientRect().width +"px";
                        }
                      }

                    }

                  //  console.log(lastRect.width + offset);
                    // 事件完毕后触发 mouseup触发resized结束事件 mousemove触发resize事件
                    this.fire( "resized", { target: this.previous } );

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
            }

            event.stopPropagation();
        },
    });
})();

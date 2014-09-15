var DockUtils;
(function (DockUtils) {

    var _addDockMask = function ( x, y, w, h ) {
        // add dock mask
        var mask = document.createElement('div');
        mask.classList.add('dock-mask');
        mask.style.position = 'fixed';
        mask.style.zIndex = '999';
        mask.style.opacity = '0.5';
        mask.style.background = 'rgba(0,128,255,0.5)';
        mask.style.left = x + 'px';
        mask.style.top = y + 'px';
        mask.style.width = w + 'px';
        mask.style.height = h + 'px';
        mask.style.pointerEvents = 'none';
        mask.oncontextmenu = function() { return false; };

        document.body.appendChild(mask);

        return mask;
    };

    var _updateDockMask = function ( mask, x, y, w, h ) {
        if ( mask !== null ) {
            mask.style.left = x + 'px';
            mask.style.top = y + 'px';
            mask.style.width = w + 'px';
            mask.style.height = h + 'px';
        }
    };

    var _removeDockMask = function ( mask ) {
        if ( mask === null || mask === undefined )
            return;

        if ( mask.parentElement !== null ) {
            mask.parentElement.removeChild(mask);
        }
    };

    var _reset = function () {
        _removeDockMask(_dockMask);
        _curHint = null;
        _dockMask = null;
        _draggingTabEL = null;
    };

    var _dockHints = [];
    var _curHint = null;
    var _dockMask = null;
    var _draggingTabEL = null;

    DockUtils.copyAttributes = function ( src, dest ) {
        dest.style.width = src.style.width;
        dest.style.minWidth = src.style.minWidth;
        dest.style.maxWidth = src.style.maxWidth;
        dest.style.height = src.style.height;
        dest.style.minHeight = src.style.minHeight;
        dest.style.maxHeight = src.style.maxHeight;

        if ( src.getAttribute('flex-1')  !== null ) dest.setAttribute('flex-1','');
        if ( src.getAttribute('flex-2')  !== null ) dest.setAttribute('flex-2','');
        if ( src.getAttribute('flex-3')  !== null ) dest.setAttribute('flex-3','');
        if ( src.getAttribute('flex-4')  !== null ) dest.setAttribute('flex-4','');
        if ( src.getAttribute('flex-5')  !== null ) dest.setAttribute('flex-5','');
        if ( src.getAttribute('flex-6')  !== null ) dest.setAttribute('flex-6','');
        if ( src.getAttribute('flex-7')  !== null ) dest.setAttribute('flex-7','');
        if ( src.getAttribute('flex-8')  !== null ) dest.setAttribute('flex-8','');
        if ( src.getAttribute('flex-9')  !== null ) dest.setAttribute('flex-9','');
        if ( src.getAttribute('flex-10') !== null ) dest.setAttribute('flex-10','');
        if ( src.getAttribute('flex-11') !== null ) dest.setAttribute('flex-11','');
        if ( src.getAttribute('flex-12') !== null ) dest.setAttribute('flex-12','');
    };

    DockUtils.setDraggingTab = function ( tabEL ) {
        _draggingTabEL = tabEL;
    };

    DockUtils.dockHint = function ( dockTarget ) {
        _dockHints.push(dockTarget);
    };

    document.addEventListener("dragover", function ( event ) {
        if ( _draggingTabEL === null )
            return;

        var minDistance = null;
        _curHint = null;

        for ( var i = 0; i < _dockHints.length; ++i ) {
            var hintTarget = _dockHints[i];
            var targetRect = hintTarget.getBoundingClientRect();
            var center_x = targetRect.left + targetRect.width/2;
            var center_y = targetRect.top + targetRect.height/2;
            var pos = null;

            var leftDist = Math.abs(event.x - targetRect.left);
            var rightDist = Math.abs(event.x - targetRect.right);
            var topDist = Math.abs(event.y - targetRect.top);
            var bottomDist = Math.abs(event.y - targetRect.bottom);
            var minEdge = 100;
            var distanceToEdgeCenter = -1;

            if ( leftDist < minEdge ) {
                minEdge = leftDist;
                distanceToEdgeCenter = Math.abs(event.y - center_y);
                pos = 'left';
            }

            if ( rightDist < minEdge ) {
                minEdge = rightDist;
                distanceToEdgeCenter = Math.abs(event.y - center_y);
                pos = 'right';
            }

            if ( topDist < minEdge ) {
                minEdge = topDist;
                distanceToEdgeCenter = Math.abs(event.x - center_x);
                pos = 'top';
            }

            if ( bottomDist < minEdge ) {
                minEdge = bottomDist;
                distanceToEdgeCenter = Math.abs(event.x - center_x);
                pos = 'bottom';
            }

            //
            if ( pos !== null && (minDistance === null || distanceToEdgeCenter < minDistance) ) {
                minDistance = distanceToEdgeCenter;
                _curHint = { target: hintTarget, position: pos };
            }
        }

        if ( _curHint ) {
            var rect = _curHint.target.getBoundingClientRect();
            var maskRect = null;

            if ( _curHint.position === 'top' ) {
                maskRect = { 
                    left: rect.left, 
                    top: rect.top, 
                    width: rect.width, 
                    height: rect.height/4 
                };
            }
            else if ( _curHint.position === 'bottom' ) {
                maskRect = { 
                    left: rect.left, 
                    top: rect.bottom-rect.height/4, 
                    width: rect.width, 
                    height: rect.height/4 
                };
            }
            else if ( _curHint.position === 'left' ) {
                maskRect = { 
                    left: rect.left,
                    top: rect.top,
                    width: rect.width/4, 
                    height: rect.height 
                };
            }
            else if ( _curHint.position === 'right' ) {
                maskRect = { 
                    left: rect.right-rect.width/4, 
                    top: rect.top,
                    width: rect.width/4, 
                    height: rect.height 
                };
            }

            //
            if ( _dockMask ) {
                _updateDockMask ( _dockMask, 
                                  maskRect.left, 
                                  maskRect.top, 
                                  maskRect.width, 
                                  maskRect.height );
            }
            else {
                _dockMask = _addDockMask ( maskRect.left, 
                                           maskRect.top, 
                                           maskRect.width, 
                                           maskRect.height );
            }
        }

        _dockHints = [];
    });
    document.addEventListener("dragend", function ( event ) {
        // reset internal states
        _reset();
    });
    document.addEventListener("drop", function ( event ) {
        var curHint = _curHint;
        var draggingTabEL = _draggingTabEL;

        if ( curHint ) {
            var srcDock = null;
            if ( draggingTabEL.panel.elementCount > 1 ) {
                draggingTabEL.panel.close(draggingTabEL);
                srcDock = new FireDockPanel();
                srcDock.add(draggingTabEL.content);
                srcDock.select(0);
            }
            else {
                srcDock = draggingTabEL.panel;
            }
            curHint.target.addDock( curHint.position, srcDock );

            // reset internal states
            _reset();
        }
    });
})(DockUtils || (DockUtils = {}));


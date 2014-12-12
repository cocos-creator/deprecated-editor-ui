var DockUtils;
(function (DockUtils) {

    var _addDockMask = function ( x, y, w, h ) {
        // add dock mask
        var mask = document.createElement('div');
        mask.style.left = x + 'px';
        mask.style.top = y + 'px';
        mask.style.width = w + 'px';
        mask.style.height = h + 'px';
        mask.style.pointerEvents = 'none';
        mask.style.zIndex = '999';
        mask.style.position = 'fixed';
        mask.style.boxSizing = 'border-box';
        mask.style.background = 'rgba(0,128,255,0.3)';
        mask.style.border = '2px solid rgba(0,128,255,1.0)';
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

        mask.remove();
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

    DockUtils.dragstart = function ( tabEL ) {
        _draggingTabEL = tabEL;
    };

    DockUtils.dragover = function ( dockTarget ) {
        _dockHints.push(dockTarget);
    };

    document.addEventListener("dragover", function ( event ) {

        // TODO: use dock-mask instead

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
        if ( _curHint === null ) {
            return;
        }

        if ( _curHint.target === _draggingTabEL.panel &&
             _curHint.target.activeTab === _draggingTabEL ) 
        {
            return;
        }

        event.stopPropagation(); 
        var contentEL = _draggingTabEL.content;
        var panelEL = _draggingTabEL.panel;

        //
        panelEL.closeNoCollapse(_draggingTabEL);

        //
        var newPanel = new FirePanel();
        newPanel.add(contentEL);
        newPanel.select(0);

        //
        _curHint.target.addDock( _curHint.position, newPanel );

        //
        panelEL.collapse();

        // reset internal states
        _reset();
    }, true);
})(DockUtils || (DockUtils = {}));


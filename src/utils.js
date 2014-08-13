var EditorUI;
(function (EditorUI) {
    // DISABLE: use wrap, unwrap instead
    // EditorUI.getDOM = function ( domWrapper ) {
    //     if ( Platform.flags.shadow )
    //         return domWrapper.impl;
    //     else
    //         return domWrapper;
    // };

    EditorUI.isFlex = function ( element ) {
        if ( element.getAttribute("flex-1") !== null ) return true;
        if ( element.getAttribute("flex-2") !== null ) return true;
        if ( element.getAttribute("flex-3") !== null ) return true;
        if ( element.getAttribute("flex-4") !== null ) return true;
        if ( element.getAttribute("flex-5") !== null ) return true;
        if ( element.getAttribute("flex-6") !== null ) return true;
        if ( element.getAttribute("flex-7") !== null ) return true;
        if ( element.getAttribute("flex-8") !== null ) return true;
        if ( element.getAttribute("flex-9") !== null ) return true;
        if ( element.getAttribute("flex-10") !== null ) return true;
        if ( element.getAttribute("flex-11") !== null ) return true;
        if ( element.getAttribute("flex-12") !== null ) return true;

        return false;
    };

    var _findInChildren = function ( element, elementToFind ) {
        for ( var i = 0; i < element.children.length; ++i ) {
            var childEL = element.children[i];
            if ( childEL === elementToFind )
                return true;

            if ( childEL.children.length > 0 )
                if ( _findInChildren( childEL, elementToFind ) )
                    return true;
        }
        return false;
    };

    //
    EditorUI.find = function ( elements, elementToFind ) {
        if ( Array.isArray(elements) || 
             elements instanceof NodeList ||
             elements instanceof HTMLCollection ) 
        {
            for ( var i = 0; i < elements.length; ++i ) {
                var element = elements[i];
                if ( element === elementToFind )
                    return true;

                if ( _findInChildren ( element, elementToFind ) )
                    return true;
            }
            return false;
        }

        // if this is a single element
        if ( elements === elementToFind )
            return true;

        return _findInChildren( elements, elementToFind );
    };

    //
    EditorUI.getParentTabIndex = function ( element ) {
        var parent = element.parentElement;
        while ( parent ) {
            if ( parent.tabIndex !== null && 
                 parent.tabIndex !== undefined &&
                 parent.tabIndex !== -1 )
                return parent.tabIndex;

            parent = parent.parentElement;
        }
        return 0;
    };

    //
    EditorUI.getFirstFocusableChild = function ( element ) {
        if ( element.tabIndex !== null && 
             element.tabIndex !== undefined &&
             element.tabIndex !== -1 )
        {
            return element;
        }

        var el = null;
        for ( var i = 0; i < element.children.length; ++i ) {
            el = EditorUI.getFirstFocusableChild(element.children[i]);
            if ( el !== null )
                return el;
        }
        if ( element.shadowRoot ) {
            el = EditorUI.getFirstFocusableChild(element.shadowRoot);
            if ( el !== null )
                return el;
        }

        return null;
    };

    //
    var _dragGhost = null; 
    EditorUI.addDragGhost = function ( cursor ) {
        // add drag-ghost
        if ( _dragGhost === null ) {
            _dragGhost = document.createElement('div');
            _dragGhost.classList.add('drag-ghost');
            _dragGhost.style.position = 'fixed';
            _dragGhost.style.zIndex = '999';
            _dragGhost.style.left = '0';
            _dragGhost.style.top = '0';
            _dragGhost.style.width = window.innerWidth + 'px';
            _dragGhost.style.height = window.innerHeight + 'px';
            _dragGhost.oncontextmenu = function() { return false; };
        }
        _dragGhost.style.cursor = cursor;
        document.body.appendChild(_dragGhost);
    };

    EditorUI.removeDragGhost = function () {
        if ( _dragGhost !== null ) {
            _dragGhost.style.cursor = 'auto';
            if ( _dragGhost.parentNode !== null ) {
                _dragGhost.parentNode.removeChild(_dragGhost);
            }
        }
    };

    //
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

        if ( mask.parentNode !== null ) {
            mask.parentNode.removeChild(mask);
        }
    };
    var _slope = function ( x1, y1, x2, y2 ) {
        return (y2 - y1) / (x2 - x1);
    };

    var _dockHints = [];
    var _curHint = null;
    var _dockMask = null;

    EditorUI.dockHint = function ( dockTarget ) {
        _dockHints.push(dockTarget);
    };
    document.addEventListener("dragover", function ( event ) {
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
        _removeDockMask(_dockMask);
        _dockMask = null;
    });
    // document.addEventListener("dragleave", function ( event ) {
    //     console.log(event.target);
    // });

})(EditorUI || (EditorUI = {}));

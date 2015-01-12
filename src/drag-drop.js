var EditorUI;
(function (EditorUI) {
    var Path = null;
    if ( Fire.isApp ) {
        Path = require('fire-path');
    }

    var _allowed = false;

    var DragDrop = {
        start: function ( dataTransfer, effect, type, items ) {
            dataTransfer.effectAllowed = effect;
            dataTransfer.dropEffect = 'none';
            dataTransfer.setData('fire/type', type);
            dataTransfer.setData('fire/items', items.join());
            var img = this.getDropIcon(items);
            dataTransfer.setDragImage(img, -20, 0);
            // TODO: event.dataTransfer.setDragImage( null, 0, 0 );
        },

        drop: function ( dataTransfer ) {
            var results = [];
            if ( _allowed ) {
                results = DragDrop.items(dataTransfer);
            }

            _allowed = false;

            return results;
        },

        end: function () {
            _allowed = false;
        },

        updateDropEffect: function ( dataTransfer, dropEffect ) {
            if ( _allowed ) {
                dataTransfer.dropEffect = dropEffect;
            }
            else {
                dataTransfer.dropEffect = 'none';
            }
        },

        allowDrop: function ( dataTransfer, allowed ) {
            _allowed = allowed;
            if ( !_allowed ) {
                dataTransfer.dropEffect = 'none';
            }
        },

        type: function ( dataTransfer ) {
            var type = dataTransfer.getData('fire/type');

            if ( type === "" && dataTransfer.files.length > 0 )
                return "file";

            return type;
        },

        items: function ( dataTransfer ) {
            var type = DragDrop.type(dataTransfer);
            var items;

            if ( type === "file" ) {
                var files = dataTransfer.files;
                items = [];

                for ( var i = 0; i < files.length; ++i ) {
                    var exists = false;

                    // filter out sub file paths if we have Path module
                    if ( Path ) {
                        for ( var j = 0; j < items.length; ++j ) {
                            if ( Path.contains( items[j], files[i].path ) ) {
                                exists = true;
                                break;
                            }
                        }
                    }

                    if ( !exists ) {
                        items.push( files[i].path );
                    }
                }
            }
            else {
                items = dataTransfer.getData('fire/items');
                if ( items !== "" ) {
                    items = items.split(',');
                }
                else {
                    items = [];
                }
            }

            return items;
        },

        //NOTE: 如果是用canvas来做的话,没法解决字体模糊的问题(retina下)。
        getDropIcon: function (items) {
          var DropIcon = document.createElement("img");
          var DropCanvas = document.createElement('canvas');
          var imgPanel = DropCanvas.getContext('2d');
          imgPanel.font = "normal 12px Arial";
          imgPanel.fillStyle = "white";
          var top = 0;
          for (var i = 0; i < items.length; i++) {
            if (i <=4 ) {
              DropIcon.src = "uuid://" + items[i] + "?thumb";
              imgPanel.drawImage(DropIcon,0,top,16,16); //icon
              imgPanel.fillText(items[i],20,top + 15); //text
              top += 15;
            }
            else {
              imgPanel.fillStyle = "red";
              imgPanel.fillText("[more.....]",20,top + 15);
              break;
            }

          }

          DropIcon.src = DropCanvas.toDataURL();
          return DropIcon;
        },
    };

    Object.defineProperty( DragDrop, 'allowed', {
        get: function () { return _allowed; }
    });

    EditorUI.DragDrop = DragDrop;
})(EditorUI || (EditorUI = {}));

(function () {
    Polymer({
        publish: {
            ElementCount: 0,
            Childrens: null,
            Width: 0,
            Height: 0,
            minHeight: 0,
            maxHeight: 0,
            minWidth: 0,
            maxWidth: 0,
            resizing: 0,
            vertical: {
                value: false,
                reflect: true
            },
            horizontal: {
                value: false,
                reflect: true
            }
        },

        observe: {
            Height: 'HeightValueChanged',
            Width: 'WidthValueChanged',
            minHeight: 'minHeightChanged',
            maxHeight: 'maxHeightChanged',
            minWidth: 'minWidthChanged',
            maxWidth: 'maxWidthChaged',
            resizing: 'Resizing',

        },

        Resizing: function () {
            //this.autoDock();
            if (this.isRow()){
              for (var i = 0; i< this.children.length;i++){
                  if (this.children[i].tagName !="FIRE-UI-NEWRESIZER") {
                    this.children[i].style.width = this.getBoundingClientRect().width/this.getChildrenCount() +"px";
                  }
              }
            }
            else {
              for (var i = 0; i< this.children.length;i++){
                if (this.children[i].tagName !="FIRE-UI-NEWRESIZER") {
                  this.children[i].style.height = this.getBoundingClientRect().height/this.getChildrenCount() +"px";
                }
              }
            }
        },

        HeightValueChanged: function () {
            this.style.height = this.Height;
            this.autoDock();
            //console.log(this);
        },

        /*value Change Event*/
        WidthValueChanged: function () {
            this.style.width = this.Width;
            this.autoDock();
            //console.log(this);
        },

        minHeightChanged: function ()　{
            this.style.minHeight = this.minHeight + "px";
        },

        maxHeightChanged: function () {
            this.style.maxHeight = this.maxHeight + "px";
        },

        minWidthChanged: function () {
            this.style.minWidth = this.minWidth + "px";
        },

        maxWidthChaged: function () {
            this.style.maxWidth = this.maxWidth + "px";
        },

        ready: function () {
            /*自动添加resizer*/
            this.ElementCount = this.children.length;
            this.Childrens = this.children;
            var isrow = this.isRow();
            if (this.children.length <= 1)
                return;

            for ( var i = 0; i < this.children.length; ++i ) {
                if (true ) {
                    var dockEL = this.children[i];
                    if ( true ) {
                        var resizer = new FireNewResizer();
                        resizer.vertical = isrow;
                        resizer.ready(); // HACK: ready again, manual contructor cannot send attribute in
                        this.insertBefore( resizer, dockEL.nextElementSibling );
                        i += 1;
                    }
                }
            }
        },

        // 获取子节点数目
        getChildrenCount: function () {
            var j=0;
            for (var i = 0; i< this.children.length; i++ ) {
                    if (this.children[i].tagName!='FIRE-UI-NEWRESIZER') {
                        j++;
                    }
                }
            return j;
        },

        autoDock: function () {
          // 这里自动分配节点长宽
          // 取最大长宽 进行自动调整

          for (var i = 0; i< this.children.length; i++ ) {
            if ( this.children[i].tagName != 'FIRE-UI-NEWRESIZER' ) {
              if ( this.isRow() ) {
                if (this.maxWidth != 0 && this.Width > this.maxWidth) {
                  console.log('max width');
                  this.Width = this.maxWidth;
                }

                this.children[i].style.width = this.Width / (this.getChildrenCount()) + "px" ;
                this.children[i].Width= this.Width / (this.getChildrenCount());
                this.children[i].style.height = this.getBoundingClientRect().height + "px";
                this.children[i].Height = this.getBoundingClientRect().height ;
                //console.log("height:"+this.children[i].Height);
              }

              else {
                if (this.maxHeight != 0 && this.Height > this.maxHeight ) {
                  this.Height = this.maxHeight;
                  console.log('max height');
                }

                this.children[i].style.width = this.getBoundingClientRect().width + "px";
                this.children[i].Width = this.getBoundingClientRect.width;
                //console.log("width:"+this.children[i].Width);
                this.children[i].style.height = this.Height / (this.getChildrenCount()) + "px";

              }
            //  console.log(this.children);
            }
          }
        },

        domReady: function () {
            for ( var i = 0; i < this.children.length; ++i ) {
                var resizer = this.children[i];
                if ( resizer instanceof FireResizer ) {
                    resizer.update();
                }
            }

            if (this.isRow()) {
                this.style.display = "flex";
            }

            if (this.isRow()) {
                for (var i = 0; i < this.Childrens.length; i+=2) {
                    //下面的公式 是因为如果直接除以他子节点的总数，resizer在拖动的时候，有时候会变得很细直至看不见，加了这个公式，就没这个问题了
                   this.Childrens[i].style.width = (this.getBoundingClientRect().width/this.ElementCount-(15*(this.Childrens.length/2))/(this.ElementCount*5)) + "px";
                }
            }

            this.autoDock();
        },

        isRow: function () {
        //    var result = this.getAttribute('flex-row');
            if ( this.vertical) {
                return true;
            }
            else if (this.horizontal) {
                return false;
            }
            return false;

        },

        addDock: function ( position, element ) {
            if ( element instanceof FireDock === false ) {
                Fire.warn('Dock element must be instanceof FireDock');
                return;
            }

            // check if need to create new Dock element
            var isrow = this.isRow();
            var needNewDock = false;
            if ( position === 'left' || position === 'right' ) {
                if ( isrow === false ) {
                    needNewDock = true;
                }
            }
            else {
                if ( isrow ) {
                    needNewDock = true;
                }
            }
            var newResizer = null;

            // process dock
            if ( needNewDock ) {
                // new FireDock
                var newDock = new FireNewDock();
                DockUtils.copyAttributes( this, newDock );

                if ( position === 'left' ||
                     position === 'right' )
                {
                    newDock.setAttribute('flex-row', '');
                    newDock.style.height = "";
                }
                else {
                    newDock.setAttribute('flex-col', '');
                    newDock.style.width = "";
                }
                newDock.setAttribute('flex-stretch', '');

                // new resizer
                newResizer = new FireNewResizer();
                newResizer.vertical = newDock.isRow();
                newResizer.ready();

                //
                this.parentElement.insertBefore(newDock, this);
                if ( position === 'left' || position === 'top' ) {
                    newDock.appendChild(element);
                    newDock.appendChild(newResizer);
                    newDock.appendChild(this);
                }
                else {
                    newDock.appendChild(this);
                    newDock.appendChild(newResizer);
                    newDock.appendChild(element);
                }
            }
            else {
                if ( position === 'left' || position === 'top' ) {
                    element.style.height = "";
                    this.insertBefore(element, this.firstElementChild);
                }
                else {
                    element.style.width = "";
                    this.appendChild(element);
                }
            }
        },

        dragEnterAction: function ( event ) {
            // this.style.outline = "1px solid white";
        },

        dragOverAction: function ( event ) {
            event.preventDefault();
            event.dataTransfer.dropEffect = 'move';
            DockUtils.dockHint( event.currentTarget );
            // this.style.outline = "1px solid white";
        },

        dragLeaveAction: function ( event ) {
            // this.style.outline = "";
        },

        get elementCount () {
            return this.children.length;
        },
    });
})();

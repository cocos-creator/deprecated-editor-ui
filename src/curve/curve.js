Polymer(EditorUI.mixin({
    publish: {
        scale: 1,
        drawScale: 1,
    },
    testScale: 1,
    curvePanel: null,
    cubeCount: 10,
    retina: false,
    circles: [],
    svg: null,
    
    bezier: {M: [200, 300], C: [[350, 0], [300, 200], [800, 0]]},


    domReady: function () {
        this.curvePanel = this.$.curvepanel;
        this.svg = this.$.svg;
        this.rect = this.curvePanel.getBoundingClientRect();
        this.context = this.curvePanel.getContext("2d");
        this.context.strokeStyle ='white';
        this.drawPanel();
        this.drawBezier();
    },

    drawPanel: function () {
        this.context.clearRect(0, 0, this.rect.width * 2, this.rect.height * 2);
        var panelWidth = this.rect.width * 2;
        var panelHeight = this.rect.height * 2;

        var size = panelWidth > panelHeight ?  panelWidth % 50 === 0 ? panelWidth / 50 : parseInt(panelWidth / 50) + 1 : panelHeight % 50 === 0 ? panelHeight / 50 : parseInt(panelHeight / 50) + 1;

        for (var i=0; i <= size;i++) {
            if (i === 0) {
                this.context.globalAlpha = 1;
            }
            else {
                // TODO: 优化渐显示
                if (this.drawScale >= 1 && this.drawScale <= 5) {
                    this.context.globalAlpha = this.drawScale / 10 * 2;
                }
            }

            this.context.lineWidth = 1;
            this.context.beginPath();

            var increment = panelWidth / this.cubeCount / 2 * this.drawScale * i;

            this.context.moveTo(panelWidth / 2 + increment,0);
            this.context.lineTo(panelWidth / 2 + increment,panelHeight);

            this.context.moveTo(panelWidth / 2 - increment,0);
            this.context.lineTo(panelWidth / 2 - increment,panelHeight);

            this.context.moveTo(0,panelHeight / 2 + increment);
            this.context.lineTo(panelWidth,panelHeight / 2 + increment);

            this.context.moveTo(0,panelHeight / 2 - increment);
            this.context.lineTo(panelWidth,panelHeight / 2 - increment);

            this.context.stroke();
            this.context.closePath();
        }

        var num = 0;

        for (var i=0; i <= size;i++) {
            this.context.strokeStyle='white';
            this.context.globalAlpha = 1;
            this.context.lineWidth = 1;
            this.context.beginPath();

            var increment = panelWidth / this.cubeCount * this.drawScale * i;

            this.context.font = "24px Courier New";
            this.context.fillStyle = "white";

            num += 100;

            this.context.fillText(num  , 10, panelHeight /2 - increment);
            this.context.fillText(num , 10, panelHeight /2 + increment);

            this.context.fillText(num, panelWidth /2 - increment,panelHeight - 10);
            this.context.fillText(num, panelWidth /2 + increment,panelHeight - 10);

            this.context.stroke();
            this.context.closePath();
        }
        this.drawCircle();
    },

    mousewheelAction: function (event) {
        var originScale = this.scale;

        originScale = Math.pow( 2, event.wheelDelta * 0.002) * originScale;
        originScale = Math.max( 0.01, Math.min( originScale, 1000 ) );
        this.scale = originScale;

        if (this.scale > 1) {
            var num = 0;
            if (this.scale / 10 > 1) {
                num = parseInt(this.scale / 10).toString().length+1;
            }else {
                num = 1;
            }
            this.drawScale = this.scale / (Math.pow(10,num)/10);
        }
        else {
            num = parseInt(1 / this.scale).toString().length;
            this.drawScale = this.scale * (Math.pow(10,num));
        }

        if (this.scale >= 1000 || this.scale <= 0.01) {
            this.drawScale = 1;
        }

        this.drawPanel();

        event.stopPropagation();
    },

    doubleClick: function (event) {
        var targetRect = event.target.getBoundingClientRect();
        var cx = (event.clientX - targetRect.left - 2);
        var cy = (event.clientY - targetRect.top - 2);
        this.circles.push({x:cx, y:cy});

        this.drawCircle();
        console.log(cx);
        for (var i=0; i < this.bezier.C.length; i++) {
            // controlPoint += this.bezier.C[i];
            // controlPoint += (i >= (this.bezier.C.length-1) ? " ": ",");

            if (i !== this.bezier.C.length-1) {
                if (cx > this.bezier.C[i][1] && cx < this.bezier.C[i+1][1]) {
                    console.log(this.bezier.C[i]);
                }
            }
        }
        // for
    },

    drawCircle: function () {
        var cricles = this.circles;
        var panelWidth = this.rect.width * 2;
        var panelHeight = this.rect.height * 2;
        var increment = panelWidth / this.cubeCount * (this.scale - 1);

        for (var i = 0; i < cricles.length; i ++) {
            this.context.fillStyle="#FFFFFF";
            this.context.beginPath();
            this.context.arc( (cricles[i].x * 2) ,(cricles[i].y * 2) ,8,0,Math.PI*2,true);
            this.context.closePath();
            this.context.fill();
        }
    },

    drawBezier: function () {
        var svgns = "http://www.w3.org/2000/svg";
        var path =document.createElementNS(svgns,"path");

        var dstart = "M";
        var controlPoint = "C";
        for (var i=0;i < this.bezier.M.length; i ++) {
            dstart += this.bezier.M[i];
            this.circles.push({x:this.bezier.M[i][0], y:this.bezier.M[i][1]});
            this.drawCircle();
            dstart += (i >= (this.bezier.M.length-1) ? " ": ",");
        }

        for (var i=0; i < this.bezier.C.length; i++) {
            controlPoint += this.bezier.C[i];
            this.circles.push({x:this.bezier.C[i][0], y:this.bezier.C[i][1]});
            this.drawCircle();
            controlPoint += (i >= (this.bezier.C.length-1) ? " ": ",");
        }

        var d = dstart + controlPoint;

        path.setAttribute("d", d);
        path.setAttribute("fill", "none");
        path.setAttribute("stroke", "#e2e2e2");

        this.svg.appendChild(path);
    },
}, EditorUI.focusable));

Polymer(EditorUI.mixin({
    publish: {
        scale: 1,
        drawScale: 1,
    },
    testScale: 1,
    curvePanel: null,
    cubeCount: 20,
    retina: false,
    svg: null,

    move: false,

    // M(起始点)只允许存在一个, C(控制点) 只有3个参数 2个控制点 一个end 点
    bezier: {M: [0, 500], C: [[125, 500], [375, 0],[500,0]]},


    domReady: function () {
        this.curvePanel = this.$.curvepanel;
        this.svg = this.$.svg;
        this.rect = this.curvePanel.getBoundingClientRect();
        this.context = this.curvePanel.getContext("2d");
        this.context.strokeStyle ='white';
        this.context.lineWidth = 1;
        this.drawPanel();
        this.drawBezier();
    },

    drawPanel: function () {
        this.context.clearRect(0, 0, this.rect.width * 3, this.rect.height * 3);
        var panelWidth = this.rect.width * 2;
        var panelHeight = this.rect.height * 2;

        var size = panelWidth > panelHeight ?  panelWidth % 50 === 0 ? panelWidth / 50 : parseInt(panelWidth / 50) + 1 : panelHeight % 50 === 0 ? panelHeight / 50 : parseInt(panelHeight / 50) + 1;
        var widthCount = Math.round((panelWidth/2/this.cubeCount/2).toFixed(1) + 1);
        var heightCount = Math.round((panelHeight/2/this.cubeCount/2).toFixed(1) + 1);
        var markNumber = 0;

        for (var i=0; i <= size;i++) {
            if (i === 0) {
                this.context.globalAlpha = 1;
            }
            else {
                // TODO: 优化渐显示
                if (this.drawScale >= 1 && this.drawScale <= 10) {
                    this.context.globalAlpha = this.drawScale / 10 ;
                }
                else{
                    this.context.globalAlpha = 1;
                }

            }

            this.context.beginPath();

            if (markNumber % 2 !== 0) {
                this.context.strokeStyle='#6e6e6e';
            }else {
                this.context.strokeStyle ='white';
            }

            var increment = panelWidth / this.cubeCount / 2 * this.drawScale * i;

            this.context.moveTo(panelWidth / 2 + increment,0);
            this.context.lineTo(panelWidth / 2 + increment,panelHeight);

            this.context.moveTo(panelWidth / 2 - increment,0);
            this.context.lineTo(panelWidth / 2 - increment,panelHeight);
            // LEFT ++ ROW

            this.context.moveTo(0,panelHeight / 2 + increment);
            this.context.lineTo(panelWidth,panelHeight / 2 + increment);

            this.context.moveTo(0,panelHeight / 2 - increment);
            this.context.lineTo(panelWidth,panelHeight / 2 - increment);

            this.context.stroke();
            this.context.closePath();
            markNumber ++;
        }

        var num = 0;
        this.context.globalAlpha = 1;
        this.context.strokeStyle='white';
        for (var i=0; i <= size;i++) {
            this.context.beginPath();

            var increment = panelWidth / this.cubeCount * this.drawScale * i;

            this.context.font = "24px Courier New";
            this.context.fillStyle = "white";

            num = 0.1;

            // this.context.fillText((num * (parseInt(heightCount/4)+1)/2 + num * i).toFixed(1), 10, panelHeight /2 - increment);
            // // RIGHT ++ ROW
            // this.context.fillText((num * (parseInt(heightCount/4)+1)/2 - num * i).toFixed(1), 10, panelHeight /2 + increment);
            //
            // this.context.fillText((num * (parseInt(widthCount/4)+1)/2 - num * i).toFixed(1), panelWidth /2 - increment+10,panelHeight - 20);
            // this.context.fillText((num * (parseInt(widthCount/4)+1)/2 + num * i).toFixed(1), panelWidth /2 + increment+10,panelHeight - 20);

            this.context.stroke();
            this.context.closePath();
        }
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


    drawBezier: function () {
        var svgns = "http://www.w3.org/2000/svg";
        var path = document.createElementNS(svgns,"path");

        var spoint = this.drawPoint(this.bezier.M[0],this.bezier.M[1]);
        var epoint = this.drawPoint(this.bezier.C[2][0],this.bezier.C[2][1]);

        var c1point = this.drawPoint(this.bezier.C[0][0],this.bezier.C[0][1]);

        var c2point = this.drawPoint(this.bezier.C[1][0],this.bezier.C[1][1]);

        var line1 = this.drawLine(this.bezier.M[0],this.bezier.M[1],this.bezier.C[0][0],this.bezier.C[0][1]);
        var line2 = this.drawLine(this.bezier.C[1][0],this.bezier.C[1][1],this.bezier.C[2][0],this.bezier.C[2][1]);


        c1point.onmousedown = function () {
            c1point.setAttribute("fill","green");
            this.move = true;
            this.onmousemove = function (event) {
                if (this.move) {
                    c1point.setAttribute("cx",event.offsetX);
                    c1point.setAttribute("cy",event.offsetY);
                    line1.setAttribute('x2',event.offsetX);
                    line1.setAttribute('y2',event.offsetY);
                    this.bezier.C[0][0] = event.offsetX;
                    this.bezier.C[0][1] = event.offsetY;
                    path.setAttribute("d", this.getPath(this.bezier.M,this.bezier.C));
                }
            };
            this.onmouseup = function () {
                this.move = false;
            };
        }.bind(this);

        c2point.onmousedown = function () {
            c2point.setAttribute("fill","green");
            this.move = true;
            this.onmousemove = function (event) {
                if (this.move) {
                    c2point.setAttribute("cx",event.offsetX);
                    c2point.setAttribute("cy",event.offsetY);
                    line2.setAttribute('x1',event.offsetX);
                    line2.setAttribute('y1',event.offsetY);
                    this.bezier.C[1][0] = event.offsetX;
                    this.bezier.C[1][1] = event.offsetY;
                    path.setAttribute("d", this.getPath(this.bezier.M,this.bezier.C));
                }
            };
            this.onmouseup = function () {
                this.move = false;
            };
        }.bind(this);

        var d = this.getPath(this.bezier.M,this.bezier.C);

        path.setAttribute("d", d);
        path.setAttribute("fill", "none");
        path.setAttribute("stroke", "#e2e2e2");

        this.svg.appendChild(path);
    },

    getPath: function (M,C)　{
        var dstart = "M";
        var controlPoint = "C";
        for (var i=0;i < M.length; i ++) {
            dstart += M[i];
            dstart += (i >= (M.length-1) ? " ": ",");
        }

        for (var i=0; i < C.length; i++) {
            controlPoint += C[i];
            controlPoint += (i >= (C.length-1) ? " ": ",");
        }

        var p = dstart + controlPoint;
        return p;
    },

    drawPoint: function (cx,cy) {
        var svgns = "http://www.w3.org/2000/svg";
        var point = document.createElementNS(svgns,"circle");
        point.setAttribute("cx",cx);
        point.setAttribute("cy",cy);
        point.setAttribute("r","6");
        point.setAttribute("fill","white");
        point.setAttribute("class","point");
        this.svg.appendChild(point);
        return point;
    },

    drawLine: function (x1,y1,x2,y2)　{
        var svgns = "http://www.w3.org/2000/svg";
        var line = document.createElementNS(svgns,"line");
        line.setAttribute("x1",x1);
        line.setAttribute("x2",x2);
        line.setAttribute("y1",y1);
        line.setAttribute("y2",y2);
        line.setAttribute("stroke","orange");
        line.setAttribute("fill","transparent");
        line.setAttribute("stroke-width","1");
        this.svg.appendChild(line);
        return line;
    },
}, EditorUI.focusable));

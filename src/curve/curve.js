Polymer(EditorUI.mixin({
    publish: {
        scale: 1,
        drawScale: 1,
    },
    testScale: 1,
    curvePanel: null,
    cubeCount: 20,
    retina: false,
    circles: [],
    svg: null,

    move: false,

    // M(起始点)只允许存在一个, C(控制点) 只有3个参数 2个控制点 一个end 点,S(动态)
    bezier: {M: [0, 500], C: [[125, 500], [125, 250],[250,250]],S:[[500,250],[500,0],[500,0]]},
    // bezier: {M: [0, 250], C: [[125, 0], [125, 500], [375, 0]]},


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
        this.drawCircle();
    },

    mousewheelAction: function (event) {
        return;
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

        // for (var i=0; i < this.bezier.C.length; i++) {
        //     if (i !== this.bezier.C.length-1) {
        //         if (cx > this.bezier.C[i][1] && cx < this.bezier.C[i+1][1]) {
        //             console.log(this.bezier.C[i]);
        //         }
        //     }
        // }
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
        var path = document.createElementNS(svgns,"path");

        var dstart = "M";
        var controlPoint = "C";
        var sPoint = "Q";
        for (var i=0;i < this.bezier.M.length; i ++) {
            dstart += this.bezier.M[i];
            dstart += (i >= (this.bezier.M.length-1) ? " ": ",");
        }

        for (var i=0; i < this.bezier.C.length; i++) {
            controlPoint += this.bezier.C[i];
            controlPoint += (i >= (this.bezier.C.length-1) ? " ": ",");
            this.drawPoint(this.bezier.C[i][0],this.bezier.C[i][1],this.bezier);
        }

        for (var i=0; i < this.bezier.S.length; i++) {
            sPoint += this.bezier.S[i] + " ";
            // sPoint += (i <= (this.bezier.S.length-1) ? " ": " ");
        }

        var d = dstart + controlPoint + sPoint;

        path.setAttribute("d", d);
        path.setAttribute("fill", "none");
        path.setAttribute("stroke", "#e2e2e2");

        this.svg.appendChild(path);
    },

    drawPoint: function (cx,cy,parent) {
        var svgns = "http://www.w3.org/2000/svg";
        var point = document.createElementNS(svgns,"circle");
        point.setAttribute("cx",cx);
        point.setAttribute("cy",cy);
        point.setAttribute("r","6");
        point.setAttribute("fill","white");
        point.setAttribute("class","point");


        // var startLinePoint = {
        //     x1 : parent.M[0],
        //     y1 : parent.M[1],
        //     x2 : parent.C[0][0],
        //     y2 : parent.C[0][1],
        // };
        //
        // var endLinePoint = {
        //     x1 : parent.C[2][0],
        //     y1 : parent.C[2][1],
        //     x2 : parent.C[1][0],
        //     y2 : parent.C[1][1],
        // };
        //
        // var startLine = document.createElementNS(svgns,"line");
        // startLine.setAttribute("x1",startLinePoint.x1);
        // startLine.setAttribute("x2",startLinePoint.x2);
        // startLine.setAttribute("y1",startLinePoint.y1);
        // startLine.setAttribute("y2",startLinePoint.y2);
        // startLine.setAttribute("stroke","orange");
        // startLine.setAttribute("fill","transparent");
        // startLine.setAttribute("stroke-width","1");
        //
        // var endLine = document.createElementNS(svgns,"line");
        // endLine.setAttribute("x1",endLinePoint.x1);
        // endLine.setAttribute("x2",endLinePoint.x2);
        // endLine.setAttribute("y1",endLinePoint.y1);
        // endLine.setAttribute("y2",endLinePoint.y2);
        // endLine.setAttribute("stroke","orange");
        // endLine.setAttribute("fill","transparent");
        // endLine.setAttribute("stroke-width","1");

        point.onmouseover = function () {
            point.setAttribute("fill","red");
        };

        point.onmousedown = function () {
            point.setAttribute("fill","green");
            this.move = true
            this.onmousemove = function (event) {
                if (this.move) {
                    point.setAttribute("cx",event.offsetX);
                    point.setAttribute("cy",event.offsetY);
                    startLine.setAttribute("x1",parent.M[0]);
                    startLine.setAttribute("y1",parent.M[1]);
                    startLine.setAttribute("x2",event.offsetX);
                    startLine.setAttribute("y2",event.offsetY);
                }
            };
            this.onmouseup = function () {
                this.move = false;
            };
        }.bind(this);

        // this.svg.appendChild(startLine);
        // this.svg.appendChild(endLine);
        this.svg.appendChild(point);
    },
}, EditorUI.focusable));

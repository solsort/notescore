(function() {
    //var canvas = document.getElementById("canvas");
    //var ctx = canvas.getContext("2d");
    var width, height;
    var startpos, notedwidth
    var notecount = 6;
    var notes;
    var noteid;
    var noteheight;
    var clef = Math.random() > .5 ? "f" : "g";

    function clearImage() {
        //ctx.fillRect(0,0,1000,1000);
        $('body').html('');
    }
    function drawImg(url, x, y, w, h) {
        /*
        var img = new Image();
        img.onload = function() {
            ctx.drawImage(img, x, y, w, h);
        }
        img.src = url;
        */
        var img = $("<img>")
                .attr('src', url)
                .css('position', 'absolute')
                .css('left', Math.round(x)+'px')
                .css('top', Math.round(y)+'px')
                .css('width', Math.round(w)+'px')
                .css('height', Math.round(h)+'px');
        $('body').append(img);
    }

    function drawNote(position, value, img) {
        var x = startpos + position*(width-startpos)/notecount;
        var y = (17-value)*noteheight/24;
        var w = (width-startpos) *.7 / notecount;
        var h = 0|noteheight / 11;

        for(var i = 0; i >= value; i-=2) {
            drawImg("blackbox.png", x - w*.15, 0|((18-i)*noteheight/24), w*1.3, 2);
        }

        for(var i = 2; i <= value; i+=2) {
            drawImg("blackbox.png", x - w*.15, 0|((18-i)*noteheight/24), w*1.3, 2);
        }

        drawImg(img, x, y, w, h);
    }

    function draw() {
        clearImage();
        width = window.innerWidth;
        height = window.innerHeight;
        if(width > height) {
            width = 0|(height);
        }
        //canvas.height = height;
        //canvas.width = width;
        noteheight = 0 | (0.381966011 * height)
        startpos = width/4;
        notewidth = width/12;
    
        var imgheight = height - noteheight;

        drawImg("keys.jpg", 0, noteheight, width, imgheight);
        drawImg(clef + "clef.png", 0, 0, width/6, noteheight);
        for(var i = 4; i < 9; ++i) {
            drawImg("blackbox.png", 0, 0|(i*noteheight/12), width, 2);
        }
        for(var i=0;i<notecount;++i) {
            drawNote(i, notes[i], "note.png");
        }
    }

    function genNotes() {
        noteid = 0;
        if(clef === "f") {
            clef = "g";
        } else {
            clef = "f";
        }
        notes = [];
        for(var i=0; i < notecount; ++i) {
            notes[i] = (Math.random() *23 -5) | 0;
        }
    }

    document.addEventListener("deviceready", main);
    function main() {
        genNotes();
        draw();
        if ('ontouchstart' in document.documentElement) {
            $('body').bind('touchstart', handleEvent);
        } else {
            $('body').bind('mousedown', handleEvent);
        }
    }

    function handleEvent(e) {
        var clientY, clientx;
        if (e.originalEvent.touches) {
                clientY = e.originalEvent.touches[0].clientY;
                clientX = e.originalEvent.touches[0].clientX;
        } else {
            clientY = e.clientY;
            clientX = e.clientX;
        }
        if((!clientY) || !(clientX)) {
            str = "";
            for(var x in e) {
                str += ", " + x + ": " + e[x];
            }
            alert(e + " Arrgghh!" + str);
        }

        if(clientY < noteheight) {
            if(clientY < noteheight/4) {
                genNotes();
                draw();
            }
            return;
        }
        var pos = 0|(clientX/width*8) 
        pos += 8*(0| 4*(clientY-noteheight)/(height-noteheight))
        var noteMap = [
            6, 7, 7, 9, 9,11,11,12,
            6, 6, 8, 8,10,10,12,12,
           12, 0, 1, 1, 3, 3, 4, 6, 
           12, 0, 0, 2, 2, 4, 4, 6];

        var names = "cdefgab";
        console.log(names.charAt(noteMap[pos]>>1) + ((noteMap[pos]&1)? "#" : ""));
        var note = noteMap[pos]>>1;
        if(clef === "f") {
            note = (note + 5) % 7;
        }
        var curnote = notes[noteid]
        if(note === (7+curnote)%7) {
            drawNote(noteid,curnote, "note-green.png");
            ++noteid;
        } else {
            if(note >= 2) {
                note -= 7;
            }
            if(curnote > 0) {
                while(note <= 10 && Math.abs(note-curnote) > 4) {
                    note += 7;
                }
            }
            drawNote(noteid,note, "red-splat.png");
            
        }
        console.log(noteid, notecount);
        if(noteid >= notecount) {
            genNotes();
            setTimeout(draw, 100);
        }
    };
    main();
})();

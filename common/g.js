var autoRun = null;
var time = 0;
var numAll = 0;

function changeText() {
    clearText();
    var a = getObj('txtInput').value;
    a = a.replace(/\r\n/g, '\n');
    var b = getObj('divText').innerHTML;
    b = b.replace(/  /g, ' ');
    b = b.replace(/   /g, ' ');
    b = b.replace(/\r/g, '');
    b = b.replace(/\n/g, '');
    b = b.replace(/&nbsp;/g, ' ');
    b = b.replace(/<BR>/g, '\n');
    b = b.replace(/<br>/g, '\n');
    var c = 18;
    var d = 0;
    var e = 0;
    var f = 0;
    var g = null;
    for (var i = 0; i < b.length; i++) {
        if (i >= a.length + f) {
            break
        }
        var h = '#CCC';
        console.log(a.charAt(i - f), b.charAt(i))
        if (a.charAt(i - f) != b.charAt(i)) {
            e++;
            h = 'red'
        }
        if (g && g.color != h) {
            addSpan(g);
            g = null
        }
        if (b.charAt(i) == '\n' || b.charAt(i) == '\r') {
            if (b.charAt(i) == '\n') {
                c += 60;
                d = 0;
                addSpan(g);
                g = null
            }
            continue
        }
        var j = b.charCodeAt(i) > 255 ? 24 : 13.1;
        if (!g) {
            g = new Object();
            g.top = c;
            g.left = d;
            g.color = h;
            g.height = 24;
            g.width = j
        } else {
            g.width += j
        }
        d += j;
        if (d > getObj('divText').scrollWidth - j) {
            c += 60;
            d = 0;
            addSpan(g);
            g = null;
            if (b.charAt(i + 1) == ' ' || b.charAt(i + 1) == '\n') {
                i++;
                f++
            }
        }
    }
    if (g) {
        addSpan(g);
        g = null
    }
    getObj('spanRate').innerHTML = Math.round(100 - (e / a.length) * 100) + '%';
    getObj('spanSpeed').innerHTML = Math.round(a.length / time * 60) + '字/分'
}

function addSpan(a) {
    if (!a) {
        return
    }
    var b = document.createElement('span');
    b.style.position = 'absolute';
    b.style.width = a.width + 'px';
    b.style.height = a.height + 'px';
    b.style.top = a.top + 'px';
    b.style.left = a.left + 'px';
    b.style.zIndex = 1;
    b.style.backgroundColor = a.color;
    getObj('divMain').appendChild(b)
}

function selectText() {
    var a = getObj('selText');
    if (a.value.toLowerCase().indexOf("http://") != -1) {
        window.open(a.value, '_blank', '')
    } else {
        var b = getObj(a.value).value;
        b = b.replace(/\r/g, '');
        b = b.replace(/–/g, '-');
        b = b.replace(/\n/g, '<br>');
        var c = getObj('divText');
        b = b.replace(/  /g, ' ');
        b = b.replace(/   /g, ' ');
        c.innerHTML = b;
        numAll = b.length;
        getObj('btnStart').value = '开始打字练习';
        clearText();
        getObj('spanTime').innerHTML = '0秒';
        getObj('spanRate').innerHTML = '100%';
        getObj('spanSpeed').innerHTML = '字/分';
        getObj('txtInput').value = '';
        getObj('txtInput').disabled = true;
        if (autoRun) {
            window.clearInterval(autoRun)
        }
    }
}

function clearText() {
    var a = getObj('divMain');
    var b = a.getElementsByTagName('span');
    while (b.length > 0) {
        a.removeChild(b[0])
    }
}

function btnStartClick() {
    if (autoRun) {
        window.clearInterval(autoRun)
    }
    var a = getObj('btnStart');
    var b = getObj('txtInput');
    var c = getObj('divText');
    if (a.value == '开始打字练习') {
        clearText();
        b.style.height = Math.max(500, c.offsetHeight) + 'px';
        b.value = '';
        b.disabled = false;
        b.focus();
        getObj('spanTime').innerHTML = '0秒';
        getObj('spanRate').innerHTML = '100%';
        getObj('spanSpeed').innerHTML = '字/分';
        numAll = 0;
        numError = 0;
        numInput = 0;
        a.value = '结 束';
        time = 0;
        autoRun = window.setInterval(timer, 1000)
    } else {
        alert('您的成绩为：' + getObj('spanSpeed').innerHTML);
        a.value = '开始打字练习'
    }
}

function timer() {
    time++;
    var a = '';
    var b = Math.floor(time / 60);
    if (b > 0) {
        a += b + '分'
    }
    getObj('spanTime').innerHTML = a + (time - b * 60) + '秒';
    var c = getObj('txtInput').value;
    c = c.replace(/\r\n/g, '\n');
    getObj('spanSpeed').innerHTML = Math.round(c.length / time * 60) + '字/分'
}

function getObj(a) {
    return document.getElementById(a)
}

function add_text() {
	$.cookie.json = true;
	$('body').dialogbox({type:"text", title:"自定义内容",message:"请输入自定义内容..."}, function($btn, $ans) {
        if($btn == "close") {
        	console.log('close')
        }
        else if($btn == "ok") {
        	var current_text = $.cookie("type_text");
        	if (current_text == null || current_text == 'undefined') {
        		current_text = [];
        	}
        	current_text.push($ans);
        	$.cookie("type_text", current_text);
        	location.reload();
        }
    });
}

Array.prototype.baoremove = function(dx) { 
    if(isNaN(dx)||dx>this.length){return false;} 
    this.splice(dx,1); 
} 

function cons_custom() {
	$.cookie.json = true;
	var current_text = $.cookie("type_text");
	if (current_text == null || current_text == 'undefined') {
		current_text = [];
	}
	for (var i = 0; i < current_text.length; i++) {
		var name = "custom_" + i;
		$('#custom_text').append('<option value="'+name+'">'+name+'</option>');
		$('#texts_all').append('<textarea id="'+name+'">'+current_text[i]+'</textarea>');
	};
}

function del_text() {
	$.cookie.json = true;
	var sel = $('#selText').val();

	sel = sel.split('_');
	if (sel && sel.length == 2 && sel[0] == 'custom') {
		var current_text = $.cookie("type_text");
		if (current_text == null || current_text == 'undefined') {
			current_text = [];
		}

		current_text.baoremove(sel[1]);
		$.cookie("type_text", current_text);
        location.reload();
	}
	else {
		alert('请选择自己天际的删除！');
	}
}
const { ipcRenderer , ipcMain } = require('electron');
const ipc = ipcRenderer
document.querySelectorAll('img').forEach(function (a) {
    a.onmousedown = function (e) {
        e.preventDefault();
    };
});

function LoginSuccessfull() {
    setTimeout(() => {
        if (document.querySelector('#function-page').style.display == 'none') {
            document.querySelector('#function-page').style.display = 'block'
            document.querySelector('#function-page').className = "animate__animated animate__backInUp"
        }
    }, 1000)
    document.getElementById('login-page').addEventListener('animationend', tend = () => {
        document.getElementById('login-page').style.display = 'none'
        document.getElementById('login-page').removeEventListener('animationend', tend)
    })
    document.getElementById('login-page').className = 'nimate__animated animate__backOutRight'
    document.querySelector('#shock').style.transition = 'all 1s'
    document.querySelector('#shock').style.transform = 'translate(-50%, -50%) scale(.5)'
    document.querySelector('#shock').style.top = '-29px'
}
function LoginFailed(EoL) {
    document.getElementById('but').removeEventListener('click', Clogin)
    document.removeEventListener('keydown', Clogin)
    let err = document.querySelector('#login h6')
    if (EoL == 'lading') {
        document.querySelector("#loading").className = "animate__animated animate__fadeInUp"
    }
    if (EoL == 'email') {
        if (!err.classList.contains('animate__animated')) {
            err.innerHTML = '目前仅支持qq邮箱🥲'
            err.className = 'animate__animated animate__bounceIn'
        } else {
            err.innerHTML = '目前仅支持qq邮箱🥲'
            err.className = ''
            setTimeout(() => {
                err.className = 'animate__animated animate__heartBeat'
            }, 1)
        }
        document.getElementById('user').classList.add('animate__animated', "animate__headShake")
    }
    if (EoL == 'pwd') {
        document.getElementById('pwd').classList.add('animate__animated', "animate__headShake")
        if (!err.classList.contains('animate__animated')) {
            err.innerHTML = '请输入密码,我亲爱的小丑王🤡'
            err.className = 'animate__animated animate__bounceIn'
        } else {
            err.innerHTML = '请输入密码,我亲爱的小丑王🤡'
            err.className = ''
            setTimeout(() => {
                err.className = 'animate__animated animate__jello'
            }, 1)
        }
    }
    if (EoL == 'e&p') {
        if (!err.classList.contains('animate__animated')) {
            err.innerHTML = '真的是有病两个那么大的输入框没看见？🤬🤬🤬'
            err.className = 'animate__animated animate__bounceIn'
        } else {
            err.innerHTML = '真的是有病两个那么大的输入框没看见？🤬🤬🤬'
            err.className = ''
            setTimeout(() => {
                err.className = 'animate__animated animate__wobble'
            }, 1)
        }
        document.getElementById('pwd').classList.add('animate__animated', "animate__headShake")
        document.getElementById('user').classList.add('animate__animated', "animate__headShake")
    }
    if (EoL == 'uop') {
        document.querySelector("#loading").className = "animate__animated animate__fadeOutDown"
        if (!err.classList.contains('animate__animated')) {
            err.innerHTML = '账号或者密码错误🙄'
            err.className = 'animate__animated animate__bounceIn'
        } else {
            err.innerHTML = '账号或者密码错误🙄'
            err.className = ''
            setTimeout(() => {
                err.className = 'animate__animated animate__swing'
            }, 1)
        }
    }
    let timer = setTimeout(() => {
        if (EoL == 'email') {
            document.getElementById('user').classList.remove('animate__animated', "animate__headShake");
        }
        if (EoL == 'pwd') {
            document.getElementById('pwd').classList.remove('animate__animated', "animate__headShake")
        }
        document.addEventListener('keydown', Clogin)
        document.getElementById('but').addEventListener('click', Clogin)
        clearTimeout(timer)
    }, 500);
}
function windowClose() {
    ipc.send('window-close');
}
function windowHidden() {
    ipc.send('window-hidden')
}
function logIn({ email = 0, user = 0, password = 0, tof = false }) {
    ipc.send('client-login', [email, user, password, tof])
}
ipc.invoke('check-login').then((result) => {
    if (result == false) {
        logIn({ tof: true })
        document.querySelector('#shock').style.transform = 'translate(-50%, -50%) scale(.5)'
        document.querySelector('#shock').style.top = '-29px'
        document.querySelector('#function-page').style.display = 'block'
    } else {
        document.querySelector('#login-page').style.display = 'block'
    }
    ipc.send('page-ready')
})
function addCmd(instruction = 0, cmd = 0, tof = true) {
    ipc.invoke('add-cmd', [instruction, cmd, tof]).then((result) => {
    })
}

ipc.on('login-error', () => {
    LoginFailed('uop')
    //登录失败函数
})
ipc.on('login-success', () => {
    LoginSuccessfull()
    // 登录成功函数
})
ipc.on('loginOpenEnable', () => {
    ipc.send('loginOpenEnable')
})
ipc.on('loginOpenDisable', () => {
    ipc.send('loginOpenDisable')
})
function removeCmd(instruction) {
    ipc.invoke('remove-cmd', instruction).then((result) => {
    })
}
// bigbian分割线

// 缩小窗口
document.getElementById('subtract').addEventListener('click', () => {
    windowHidden()
})
// 关闭窗口
document.getElementById('close').addEventListener('click', () => {
    windowClose()
})
// 登录输入框函数
function Clogin(e) {
    if (document.querySelector('#login-page').style.display != 'none') {
        if (e.code == 'Enter' || e.pointerType == 'mouse') {
            let user = document.getElementById('user').value
            let pwd = document.getElementById('pwd').value
            let reg = /^[0-9a-zA-Z_.-]+[@][0-9a-zA-Z_.-]+([.][a-zA-Z]+){1,2}$/;
            let supprotEmail = ['qq']
            if (pwd == '' && user == '') {
                LoginFailed('e&p')
                return
            }
            if (reg.test(user) && supprotEmail.indexOf(/(?<=@).*?(?=.com)/g.exec(user)[0]) != -1) {
                var email = /(?<=@).*?(?=.com)/g.exec(user)[0]
                //邮箱格式验证通过就执行登录函数
            } else {
                //邮箱验证不通过的函数
                LoginFailed('email')
                return
            }
            if (pwd == '' && user != '') {
                LoginFailed('pwd')
                return
            }
            if ((reg.test(user) && supprotEmail.indexOf(/(?<=@).*?(?=.com)/g.exec(user)[0]) != -1) && pwd != '') {
                LoginFailed('lading')
                logIn({ email: email, user: user, password: pwd })
            }
        }
    }
}
// 登录页长按特效
document.getElementById('but').addEventListener('mousedown', () => {
    document.getElementById('but').innerHTML = '到底要不要登录啊！DLLM！'
    document.getElementById('but').style.background = '#ff2a99'
})
document.addEventListener('mouseup', () => {
    document.getElementById('but').innerHTML = '登录'
    document.getElementById('but').style.background = '#4a77d4'
})
document.getElementById('but').addEventListener('click', Clogin)
document.addEventListener('keydown', Clogin)

// 隐藏添加命令页
function HideAddCommandPage() {
    $('#cmd_name').val('')
    $('#cmd_txt').val('')
    $('#save_btn').css('background', '#d8d8d8');
    $('#save_btn').css('pointer-events', 'none');
    $('.add_cmd').fadeOut(300);
    $('.bg').animate({ height: '0px' }, 300);
    $('.cmd_window').fadeOut(300);
    document.querySelector('#scalefunc').style.transform = 'scale(1)'
    document.querySelector('#scalefunc').style.filter = 'blur(0px)'
}

document.querySelector('.bg').addEventListener('click', function () {
    HideAddCommandPage()
})
document.getElementById('cancle_btn').addEventListener('click', function () {
    HideAddCommandPage()
})



// 创建命令的时候判断输入框是否留空（代码）
// 判断保存按钮是否可用函数
var cmd_name_val = '',
    cmd_txt_val = '';
function SaveStyle() {
    if (cmd_name_val != '' && cmd_txt_val != '') {
        $('#save_btn').css('background', '#4D9F51')
        $('#save_btn').css('pointer-events', 'auto')
    } else {
        $('#save_btn').css('background', '#d8d8d8')
        $('#save_btn').css('pointer-events', 'none')
    }
}
function setblockstate(Listener) {
    ipc.invoke('set-block-state', Listener).then((result) => {
    })
}
$('#cmd_name').on('input', function () {
    cmd_name_val = $('#cmd_name').val()
    SaveStyle()
})
$('#cmd_txt').on('input', function () {
    cmd_txt_val = $('#cmd_txt').val()
    SaveStyle()
})

let cmd = document.getElementById('scalefunc');
// 点击弹出创建命令框
document.getElementById('add').addEventListener('click', () => {
    $('#cmd_name').val('')
    $('#cmd_name').val('')
    $('#save_btn').css('background', '#d8d8d8')
    $('#save_btn').css('pointer-events', 'none')
    cmd_name_val = document.getElementById('cmd_name').value = '';
    cmd_txt_val = document.getElementById('cmd_txt').value = '';
    document.querySelector('#scalefunc').style.transform = 'scale(.75)'
    document.querySelector('#scalefunc').style.filter = 'blur(2.5px)'
    $('.cmd_window').fadeIn(300);
    $('.bg').animate({ height: '370px' }, 300, function () {
        $('.add_cmd').fadeIn(300);
    })
    return cmd_name_val, cmd_txt_val
})

// 保存命令并创建、修改命令块功能
var CreateBlock = {
    CreateCommandBlock: function (cmd_name, cmd_txt, CmdStatus) {
        addCmd(cmd_name, cmd_txt)
        cmd_txt = cmd_txt.replace(/ +/g, ' ');
        // // 创建命令块代码
        var cmd_name = document.createTextNode(cmd_name),
            cmd_txt = document.createTextNode(cmd_txt),
            box1 = document.createElement('div'),
            str = document.createElement('div'),
            h3 = document.createElement('h3'),
            p = document.createElement('p'),
            btn = document.createElement('div'),
            btn_box1 = document.createElement('div'),
            btn_box2 = document.createElement('div'),
            btn_box3 = document.createElement('div');
        box1.className = "box1 animate__animated";
        str.className = 'str';
        btn.className = 'btn';
        btn_box1.className = 'btn_box1';
        btn_box2.className = 'btn_box2';
        btn_box3.className = 'btn_box3';
        cmd.append(box1);
        box1.append(str);
        str.append(h3, p);
        box1.append(btn);
        btn.append(btn_box1, btn_box2, btn_box3);
        start = document.createTextNode('启用');
        stop = document.createTextNode('禁用');
        del = document.createTextNode('删除');
        h3.appendChild(cmd_name);
        p.appendChild(cmd_txt);
        if (!CmdStatus) {
            btn_box1.appendChild(start);
            btn_box1.style.background = 'rgb(98 204 98)';
            btn_box3.style.background = 'rgb(199 199 199)';
            btn_box2.appendChild(del);
            btn_box3.appendChild(stop);
        } else {
            btn_box1.appendChild(stop);
            btn_box2.appendChild(del);
            btn_box3.appendChild(start);
        }
        this.CommandBlockBtn(btn_box1, btn_box2, btn_box3, box1, CmdStatus);
        this.ModifyCommandBlock(box1, btn);
        if (document.querySelectorAll('.box1').length >= 1) {
            document.querySelector('#tips').style.display = 'none'
        } else {
            document.querySelector('#tips').style.display = 'block'
        }
    },
    CommandBlockBtn: function (btn_box1, btn_box2, btn_box3, box1, CmdStatus) {
        btn_box1.addEventListener('click', (e) => {
            setblockstate(box1.querySelector('.str h3').innerHTML)
            var $c = $(e.target).css('background'),
                get_color = $(e.target).siblings('.btn_box3').css('background'),
                $zi = $(e.target).text(),
                get_zi = $(e.target).siblings('.btn_box3').text();
            $(e.target).text(get_zi);
            $(e.target).siblings('.btn_box3').text($zi);
            $(e.target).css('background', get_color);
            $(e.target).siblings('.btn_box3').css('background', $c);
            $(e.target).animate({ width: 'toggle' }, 350);
            $(e.target).siblings('.btn_box2').animate({ width: 'toggle' }, 350);
            if (CmdStatus == true) {
                CmdStatus = false
            } else {
                CmdStatus = true
            }
            e.cancelBubble = true
        })
        btn_box2.addEventListener('click', (e) => {
            box1.classList.add('animate__backOutUp')
            setTimeout(() => {
                box1.style.height = '0px'
                box1.style.margin = '0px'
                setTimeout(() => {
                    $(e.target).parent().parent().remove();
                }, 200)
            }, 500)
            e.cancelBubble = true
            if (document.querySelectorAll('.box1').length <= 1) {
                document.querySelector('#tips').style.display = 'block'
            }
            removeCmd(box1.querySelector('.str h3').innerHTML)
        })
        btn_box3.addEventListener('click', (e) => {
            $(e.target).siblings().stop().animate({ width: 'toggle' }, 350);
            e.cancelBubble = true
        })
    },
    ModifyCommandBlock: function (box1, btn) {
        box1.addEventListener('mouseover', () => {
            btn.style.marginRight = '23px';
        })
        box1.addEventListener('mouseout', () => {
            btn.style.marginRight = '0px';
        })
        box1.addEventListener('click', function (e) {
            $('#save_btn').css('display', 'none')
            $('#save_btn_bak').css('display', 'block')
            document.querySelector('#scalefunc').style.transform = 'scale(.75)'
            document.querySelector('#scalefunc').style.filter = 'blur(2.5px)'
            $('.cmd_window').fadeIn(300);
            $('.bg').animate({ height: '370px' }, 300, function () {
                $('.add_cmd').fadeIn(300);
            })
            e.cancelBubble = true
            var get_cmd_name = this.childNodes[0].childNodes[0],
                get_cmd_txt = this.childNodes[0].childNodes[1];
            $('#cmd_name').val(get_cmd_name.innerHTML);
            $('#cmd_txt').val(get_cmd_txt.innerHTML);

            $('#cmd_name').on('input', function () {
                cmd_name_val = $('#cmd_name').val()
                SaveStyle()
            })
            $('#cmd_txt').on('input', function () {
                cmd_txt_val = $('#cmd_txt').val()
                SaveStyle()
            })

            document.getElementById('save_btn_bak').onclick = function () {
                var new_cmd_name = $('#cmd_name').val(),
                    new_cmd_txt = $('#cmd_txt').val(),
                    get_h3 = document.getElementsByTagName('h3');
                let save_h3_val = []
                for (var i = 0; i < get_h3.length; i++) {
                    save_h3_val.push(get_h3[i].innerHTML.replace(/ +/g, ''))
                }
                let find_list_val = save_h3_val.find(e => e == new_cmd_name.replace(/ +/g, ''));
                if (find_list_val == undefined) {
                    get_cmd_name.innerHTML = new_cmd_name
                    get_cmd_txt.innerHTML = new_cmd_txt
                    $('#save_btn_bak').css('display', 'none')
                    $('#save_btn').css('display', 'block')
                    document.querySelector('#scalefunc').style.transform = 'scale(1)'
                    document.querySelector('#scalefunc').style.filter = 'blur(0px)'
                    $('.add_cmd').fadeOut(300);
                    $('.bg').animate({ height: '0px' }, 300);
                    $('.cmd_window').fadeOut(300);
                } else {
                    ShowError()
                    HideError()
                }
            }
        })
    }
}
ipc.on('init_function_page_list', (event, msg) => {
    for (i in msg) {
        CreateBlock.CreateCommandBlock(msg[i][0], msg[i][1][0],msg[i][1][1])
    }
})
// 弹出隐藏警告框
function ShowError() {
    document.getElementById('error_window').style.transform = 'rotateX(0deg)';
    document.getElementById('error').style.transform = 'scale(1) rotateX(0deg)';
}

function HideError() {
    document.getElementById('cancle_error').addEventListener('click', function () {
        document.getElementById('error_window').style.transform = 'rotateX(90deg)';
        document.getElementById('error').style.transform = 'scale(0) rotateX(90deg)';
    });
}


document.getElementById('save_btn').addEventListener('click', function () {
    var name = $('#cmd_name').val().replace(/ +/g, '')
    document.querySelector('#tips').style.display = 'none';
    document.querySelector('#scalefunc').style.transform = 'scale(1)'
    document.querySelector('#scalefunc').style.filter = 'blur(0px)'
    CmdStatus = true
    var get_h3 = document.getElementsByTagName('h3');
    let save_h3_val = [];

    if (get_h3.length == 0) {
        CreateBlock.CreateCommandBlock($('#cmd_name').val(), $('#cmd_txt').val(), CmdStatus)
        HideAddCommandPage()
    } else {
        for (var i = 0; i < get_h3.length; i++) {
            save_h3_val.push(get_h3[i].innerHTML)
        }
        let find_list_val = save_h3_val.find(e => e == name);
        if (find_list_val == undefined) {
            CreateBlock.CreateCommandBlock($('#cmd_name').val(), $('#cmd_txt').val(), CmdStatus)
            HideAddCommandPage()
        } else {
            ShowError()
            HideError()
        }
    }
})

document.querySelector('#test_btn').addEventListener('click', () => {
    let command = document.querySelector('#cmd_txt').value
    if (command != '') {
        ipc.send('test-cmd', command)
    }
})

function QuitLogin() {
    document.getElementById('function-page').className = 'animate__animated animate__backOutLeft'
    document.getElementById('function-page').addEventListener('animationend', tend = () => {
        document.getElementById('function-page').style.display = 'none'
        document.getElementById('function-page').removeEventListener('animationend', tend)
    })
    document.querySelector('#shock').style.transition = 'all 1s'
    document.querySelector('#shock').style.transform = 'translate(-50%, -50%) scale(1)'
    document.querySelector('#shock').style.top = '20px'
    if (document.querySelector('#login-page').style.display == 'none') {
        document.querySelector('#login-page').style.display = 'block'
        document.querySelector('#login-page').className = "animate__animated animate__backInDown"
    }
}
document.querySelector('#question-mark').addEventListener('click',()=>{
    ipc.send('question')
})
document.getElementById('quit').addEventListener('click', function () {
    QuitLogin()
});
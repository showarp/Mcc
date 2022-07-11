const { app, BrowserWindow, ipcMain, Menu, Tray } = require('electron')
const { Client } = require('yapople');
const Store = require('electron-store');
const cp = require('child_process')
const iconv = require('iconv-lite')
const store = new Store();
const fs=require('fs')
const path = require('path');
console.log('setting path in ' + app.getPath('userData'))
console.log('_____________________________________________________________')
function createWindow() {
    const win = new BrowserWindow({
        width: 600,
        height: 400,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false
        },
        icon: path.join(__dirname, './ico.ico'),
        show: false, //加载完页面在显示窗口（开启软件时不会有白屏）
        frame: false, //隐藏 关闭 最小化 最大化 按钮
        resizable: false //禁止缩放
    })
    win.loadFile(path.join(__dirname, './page/index.html'))
    win.setMenu(null); //隐藏工具栏
    // win.webContents.openDevTools({ mode: 'detach' })
    ipcMain.on('page-ready',()=>{
        win.show();
        win.setSkipTaskbar(false);
    })
    tray = new Tray(path.join(__dirname, './ico.ico'));
    const contextMenu = Menu.buildFromTemplate([
        {
            label: '开机启动项',
            enabled: 0,
        },
        {
            id: 'loginOpenEnable',
            label: '开启✔️',
            type: 'radio',
            click: function () {
                win.webContents.send('loginOpenEnable')
            }
        },
        {
            id: 'loginOpenDisable',
            label: '关闭❌',
            type: 'radio',
            click: function () {
                win.webContents.send('loginOpenDisable')
            }
        },
        { type: 'separator' },
        {
            label: '退出',
            role: 'quit'
        }
    ]);
    if (store.has('global.openNb')) {
        store.set('global.openNb', Number(store.get('global.openNb')) + 1)
    } else {
        store.set('global.openNb', 1)
        app.setLoginItemSettings({
            openAtLogin: true, //开机自启就true
            openAsHidden: false,
            path: process.execPath,
            args: [
                '--processStart', `"${path.basename(process.execPath)}"`,
            ]
        })
    }
    ipcMain.on('loginOpenDisable', () => {
        store.set('global.loginOpen',false)
        app.setLoginItemSettings({
            openAtLogin: false
        })
        console.log('app.getLoginItemSettings().openAtLogin :>> ', app.getLoginItemSettings().openAtLogin);
    })
    ipcMain.on('loginOpenEnable', () => {
        store.set('global.loginOpen',true)
        app.setLoginItemSettings({
            openAtLogin: true
        })
        console.log('app.getLoginItemSettings().openAtLogin :>> ', app.getLoginItemSettings().openAtLogin);
    })
    if (store.has('global.loginOpen')) {
        if (store.get('global.loginOpen')) {
            contextMenu.getMenuItemById('loginOpenEnable').checked = true
        } else {
            contextMenu.getMenuItemById('loginOpenDisable').checked = true
        }
    } else {
        store.set('global.loginOpen', true)
        contextMenu.getMenuItemById('loginOpenEnable').checked = true
    }
tray.setToolTip('对不起，从现在开始我要   起 飞');
tray.setContextMenu(contextMenu);
tray.on('click', () => {
    win.show();
});
ipcMain.on('window-close', () => {
    win.hide();
})
ipcMain.on('window-hidden', () => {
    win.minimize();
})
ipcMain.handle('check-login', (event) => {
    if(store.has('global.latestUser')){
        return false
    }else{
        return true
    }
})
function Runcmd(cmd) {
    //cmd chcp 65001
    cp.exec(cmd, { encoding: 'buffer' }, (err, data, stderr) => {
        if (err) {
            console.log(`${cmd}不是内部或外部命令,也不是可运行的程序或批处理文件。`)
        } else {
            console.log(iconv.decode(data, 'cp936'));
        }
        return
    })
}
ipcMain.on('question',()=>{
    Runcmd('start https://gitee.com/exam6918/Mcc')
})
function testCmd(command) {
    command=`${command}
    pause
    exit`
    fs.writeFileSync('./test.bat',command,{encoding:'utf8'},err=>{
        if(err){console.log(err)}
    })
    cp.exec(`start test.bat`, { encoding: 'buffer' }, (err, data, stderr) => {
        fs.unlinkSync('./test.bat')
    })
}
function EmailFUN(email, user, password) {
    if(/.+(?=\.)/g.test(user)){
        user=/.+(?=\.)/g.exec(user)[0]
    }
    let obj = { qq: ['pop.qq.com', 995] }
    function formatDate(str) {
        let rt = (
            str
                .replace('Feb', '02')
                .replace('Jan', '01')
                .replace('Feb', '02')
                .replace('Mar', '03')
                .replace('Apr', '04')
                .replace('May', '05')
                .replace('Jun', '06')
                .replace('Jul', '07')
                .replace('Aug', '08')
                .replace('Sep', '09')
                .replace('Oct', '10')
                .replace('Nov', '11')
                .replace('Dec', '12')
                .replace(/(^\s*)|(\s*$)/g, "")
        )
        rt = /(?<=, ).*?(?= \+|-)/g.exec(rt)[0].split(' ')
        rt = [rt[2] + '/', rt[1] + '/', rt[0] + ' ', rt[3]].join('')
        let date = new Date(rt)
        date = date.getTime()
        return date
    }

    const client = new Client({
        host: obj[email][0],
        port: obj[email][1],
        tls: true,
        mailparser: true,
        username: `${user}.com`,
        password: password,
    });
    client.connect(function (err) {
        if (err) {
            win.webContents.send('login-error')
        } else {
            win.webContents.send('login-success')
            store.set(`user.${user}.email`,email)
            store.set(`user.${user}.psw`,password)
            store.set('global.latestUser',user)
            let result=[]
            for (i in store.get(`user.${user}.block`)){
                result.push([i,store.get(`user.${user}.block`)[i]])
            }
            win.webContents.send('init_function_page_list',result)
            setInterval(() => {
                    client.count((err, count) => {
                        if (err){return}
                        client.retrieve(count, (err, msg) => {
                            if (err){return}
                            if(msg){
                                if (store.has('global.latest')) {
                                    if ((formatDate(msg.headers.date) > Number(store.get('global.latest'))) && msg.to[0]['address'] == msg.from[0]['address'] && store.get(`user.${user}.block.${msg.subject}`)) {
                                        store.set('global.latest', formatDate(msg.headers.date))
                                        if (store.get(`user.${user}.block.${msg.subject}`)[1]==true){
                                            client.delete(count,()=>{})
                                            Runcmd(store.get(`user.${user}.block.${msg.subject}`)[0])
                                        }
                                    }
                                } else {
                                    store.set('global.latest', formatDate(msg.headers.date))
                                }
                            }
                        })
                    })
            }, 1000)
        }
    })
}
ipcMain.on('test-cmd', (e,msg) => {
    testCmd(msg)
})
ipcMain.on('client-login', (event, msg) => {
    if (msg[3] == true) {
        let latestUser=store.get('global.latestUser')
        EmailFUN(store.get(`user.${latestUser}.email`),latestUser, store.get(`user.${latestUser}.psw`), event)
    } else {
        EmailFUN(msg[0], msg[1], msg[2], event)
    }
})
ipcMain.handle('add-cmd', (event, msg) => {
    if (store.has(`user.${store.get('global.latestUser')}.block.${msg[0]}`)) {
        return false
    } else {
        store.set(`user.${store.get('global.latestUser')}.block.${msg[0]}`, [msg[1],msg[2]])
        return true
    }
})
ipcMain.handle('set-block-state',(event,msg)=>{
    temp=store.get(`user.${store.get('global.latestUser')}.block.${msg}`)
    temp[1]=!temp[1]
    store.set(`user.${store.get('global.latestUser')}.block.${msg}`,temp)
    return true
})
ipcMain.handle('remove-cmd', (event, msg) => {
    if (store.has(`user.${store.get('global.latestUser')}.block.${msg}`)) {
        store.delete(`user.${store.get('global.latestUser')}.block.${msg}`)
        return true
    } else {
        return false
    }
})
}
app.whenReady().then(() => {
    createWindow()
    app.on('window-all-closed', function () {
        if (process.platform !== 'darwin') app.quit()
    })
})
let WebIM = require("../../utils/WebIM")["default"];
let __test_account__, __test_psword__;
let disp = require("../../utils/broadcast");

var X2JS = require('../../sdk/x2j/x2js/we-x2js')
let XML = require('../../sdk/ObjTree');
let id = null
var islogin = false;

const btoa = require('../../sdk/base64.min').btoa
// // 这里是引用
// const {atob} = polyfill;
// // 如果你需要用btoa
// const {btoa} = polyfill;

// let JKL = require('../../sdk/jkl-dumper');

// __test_account__ = "easezy";
// __test_psword__ = "111111";
 let runAnimation = true
Page({
	data: {
		name: "fizz",
		psd: "123456",
		grant_type: "password",
		rtcUrl: ''
  },
  _startSocket: function () {
    var to = "win10-2020bwunu";
    var xmlns = "urn:ietf:params:xml:ns:xmpp-framing";
    var version = "1.0";
    var xmllang = "zh";
    var resource = "appClient";
		var from = null;
		var username = 'fizz'
		var password = '123456'

    let socketTask = wx.connectSocket({
      url: 'ws://win10-2020bwunu:7070/ws/',
      protocols: ['xmpp'],
      success: function (res) {
        console.log('socket success', res)
      }
    })

    //json转xml
    function json2xml(jsonstring) {
      var xotree = new XML.ObjTree();
      var xml = xotree.writeXML(jsonstring);
      //使用jkl-dumper.js中的formatXml方法将xml字符串格式化
      //var xmlText = formatXml(xml);
      return xml;
    }

    //xml转json
    function xml2json(xmlstring) {
			//将xml字符串转为json
			var x2js = new X2JS();
			var json = x2js.xml2js(xmlstring);
			console.log('转换成json', json)
      return json;
    }

    function connwsopen() {
      from = "fizz@" + to;
      var temp = {
        "open": {
          "-to": to,
          "-from": from,
          "-xmlns": xmlns,
          "-xml:lang": xmllang,
          "-version": version
        }
      };
      //转化为xml
      var loginXml = null
      // loginXml = `<?xml version="1.0" encoding="UTF-8" ?>
      //   <open to="win10-2020bwunu" from="fizz@win10-2020bwunu" xmlns="urn:ietf:params:xml:ns:xmpp-framing" xml:lang="zh" version="1.0" />`

      loginXml = json2xml(temp)
      console.log(loginXml)

      socketTask.send({
        data: loginXml,
        success: function (res) {
          console.log('socketTask.send', res)
        }
      });
		}

		//登录验证
		function auth(authentication) {
			console.log('auth(authentication)', authentication)
			//字符串格式是：jid+password，以\0作为分隔符
      var temp = username + "@" + to + "\0" + password;
			//Base64编码
			// var token = temp;
      var token = btoa(temp);
      console.log(token)
      // Zml6eiU0MHdpbjEwLTIwMjBid3VudSUyMCUwMDEyMzQ1Ng == 不可以
      // var token = 'Zml6ekB3aW4xMC0yMDIwYnd1bnUAMTIzNDU2' 可以
      // var token = 'Zml6ekB3aW4xMC0yMDIwYnd1bnUgADEyMzQ1Ng==' 不可以
			// var message = "<auth xmlns='urn:ietf:params:xml:ns:xmpp-sasl' mechanism='PLAIN'>" + token + "</auth>";
			var message = {
				"auth": {
					"-xmlns": "urn:ietf:params:xml:ns:xmpp-sasl",
					"-mechanism": authentication,
					"#text": token
				}
			};
			socketTask.send({
				data: json2xml(message),
				success: function (res) {
					console.log('socketTask.send', res)
				}
			})
		}

		//bind操作
		function bind() {
			console.log('bind')
			var temp = {
				"iq": {
					"-id": id,
					"-type": "set",
					"bind": {
						"-xmlns": "urn:ietf:params:xml:ns:xmpp-bind",
						"resource":resource
					}
				}
			};
			//转化为xml
			var steam = json2xml(temp);
			// websocket.send(steam);
			socketTask.send({
				data: steam,
				success: function (res) {
					console.log('socketTask.send', res)
				}
			})

    }

    //获取session
    function getsession() {
      //<iq xmlns="jabber:client" id="ak014gz6x7" type="set"><session xmlns="urn:ietf:params:xml:ns:xmpp-session"/></iq>
      var temp = {
        "iq": {
          "-xmlns": "jabber:client",
          "-id": id,
          "-type": "set",
          "session": { "-xmlns": "urn:ietf:params:xml:ns:xmpp-session" }
        }
      };
      //转化为xml
      var steam = json2xml(temp);
      socketTask.send({data: steam})
    }

    //上线
    function presence() {
      //<presence id="ak014gz6x7"><status>Online</status><priority>1</priority></presence>
      var temp = {
        "presence": {
          "-id": id,
          "status": "online",
          "priority": "1"
        }
      };
      //转化为xml
      var steam = json2xml(temp);
      socketTask.send({ data: steam })
    }

    //发消息
    function send(number, message) {
      var temp = {
        "message": {
          "-type": "chat",
          "-from": username + "@" + to,
          "-to": number + "@" + to,
          "subject": "标题",
          "body": message
        }
      };
      //转化为xml
      var steam = json2xml(temp);
      websocket.send(steam);
    }


    // 收到消息的处理函数
		function onMessage(event) {
			debugger
			console.warn("接收到的", event.data);
			var jsondata = xml2json(event.data);
			//console.log(jsondata);

			if ( undefined != jsondata.message){
				if( undefined != jsondata.message.body){
					console.log("收到的消息：",jsondata.message.body);
				} else if(undefined != jsondata.message.composing){
					// document.getElementById("isloginsuccess").innerHTML = "对方正在输入";
				} else if(undefined != jsondata.message.gone){
					// document.getElementById("isloginsuccess").innerHTML = "对方已关闭和您的聊天";
				} else if(undefined != jsondata.message.file){
					console.log("收到的文件：",jsondata.message);
				} else {

				}
			} else if (undefined != jsondata.open) {
				//记录id
				id = jsondata.open["_id"];
				console.log(id);
			} else if (undefined != jsondata["features"]) {
				if (undefined != jsondata["features"].mechanisms) {
					//获取登录验证方式
					auth(jsondata["features"].mechanisms.mechanism[0]);
				} else if(undefined != jsondata["features"].bind){
					bind();
				} else {
					//Do-nothing
				}
			} else if (undefined != jsondata.failure) {
				islogin = false;
				// document.getElementById("isloginsuccess").innerHTML = "登录失败，用户名或者密码错误";
				console.log("登录失败，用户名或者密码错误");
			} else if (undefined != jsondata.success) {
				islogin = true;
				// document.getElementById("isloginsuccess").innerHTML = "登录成功";
				console.log("登录成功！");
				//发起新的流
				// newopen();
			} else if (undefined != jsondata.iq) {
				if(undefined != jsondata.iq.bind){
					//获取session会话
					getsession();
				} else {
					presence();
				}
			} else {
				//Do-nothing
			}//if(undefined != jsondata["stream:features"])
		}

    socketTask.onOpen(function (res) {
      console.log('onOpen', res)
      connwsopen()
    })

    socketTask.onMessage(onMessage)
  },

	statechange(e) {
	    console.log('live-player code:', e.detail.code)
	},

	error(e) {
	    console.error('live-player error:', e.detail.errMsg)
	},

	onLoad: function(){
		const me = this;
		const app = getApp();
		new app.ToastPannel.ToastPannel();

		disp.on("em.xmpp.error.passwordErr", function(){
			me.toastFilled('用户名或密码错误');
		});
	},

	bindUsername: function(e){
		this.setData({
			name: e.detail.value
		});
	},

	bindPassword: function(e){
		this.setData({
			psd: e.detail.value
		});
	},
	onFocusPsd: function(){
		this.setData({
			psdFocus: 'psdFocus'
		})
	},
	onBlurPsd: function(){
		this.setData({
			psdFocus: ''
		})
	},
	onFocusName: function(){
		this.setData({
			nameFocus: 'nameFocus'
		})
	},
	onBlurName: function(){
		this.setData({
			nameFocus: ''
		})
	},

	login: function(){
		runAnimation = !runAnimation
		if(!__test_account__ && this.data.name == ""){
			this.toastFilled('请输入用户名！')
			return;
		}
		else if(!__test_account__ && this.data.psd == ""){
			this.toastFilled('请输入密码！')
			return;
		}
		wx.setStorage({
			key: "myUsername",
			data: __test_account__ || this.data.name.toLowerCase()
    });
    this._startSocket()
    // 使用websocket的xmpp链接openfire的



		// getApp().conn.open({
		// 	apiUrl: WebIM.config.apiURL,
		// 	user: __test_account__ || this.data.name.toLowerCase(),
		// 	pwd: __test_psword__ || this.data.psd,
		// 	grant_type: this.data.grant_type,
		// 	appKey: WebIM.config.appkey
		// });
  }

});

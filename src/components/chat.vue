<template>
  <div>
    <!-- <div id="chatPage">{{ stat.messageList }}</div> -->
    <div id="chat">
      <div class="chat">
        <!--header-->
        <header class="header">
          <span class="title">{{stat.currentUserInfo.nickname}}</span>
        </header>
        <!--header-->

        <!--chat-content-->
        <div class="chat-content">
          <div class="message-wrapper">
            <div
              class="message-item"
              v-for="(msg,index) in stat.messageList"
              :key="index"
              :class="[msg.messageDirection == 1 ? 'my-msg' : 'your-msg']"
            >
              <div v-if="msg.messageType == 'TextMessage'" class="message-text">
                <div class="rong-avatar">
                  <img
                    v-if="msg.messageDirection == 1"
                    :src="stat.currentUserInfo.portraitUri"
                    class="rong-avatar-bd"
                  />
                  <img v-else :src="stat.targetUserInfo.portraitUri" class="rong-avatar-bd" />
                </div>
                <div class="message-body">
                  <pre class="user-msg" v-if="msg.content.messageName == 'TextMessage'">{{msg.content.content}}</pre>
                  <img
                    class="image-message"
                    :src="msg.content.imageUri"
                    alt="image"
                    v-if="msg.content.messageName == 'ImageMessage'"
                  />
                </div>
              </div>

              <div v-if="msg.messageType == 'ImageMessage'" class="message-text">
                <div class="rong-avatar">
                  <img
                    v-if="msg.messageDirection == 1"
                    :src="stat.currentUserInfo.portraitUri"
                    class="rong-avatar-bd"
                  />
                  <img v-else :src="stat.targetUserInfo.portraitUri" class="rong-avatar-bd" />
                </div>
                <div class="message-body">
                  <pre class="user-msg" v-if="msg.content.messageName == 'TextMessage'">{{msg.content.content}}</pre>
                  <img
                    class="image-message"
                    :src="msg.content.imageUri"
                    alt="image"
                    v-if="msg.content.messageName == 'ImageMessage'"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <!--chat-content-->
        <div>这是产品页 点击开发按钮 打开新的页面即可</div>
        <button @click="openNewPageBtn">打开--开发的对话框</button>

        <button>表情</button>
        <button>拍摄</button>
        <button @click="sendPictureBtn">图片</button>
        <button @click="sayBtn">语音</button>

        <footer class="dialogue-footer">
          <div class="component-dialogue-bar-person">
            <span
              class="iconfont icon-dialogue-jianpan"
              v-show="!currentChatWay"
              v-on:click="currentChatWay=true"
            ></span>
            <span
              class="iconfont icon-dialogue-voice"
              v-show="currentChatWay"
              v-on:click="currentChatWay=false"
            ></span>
            <div class="chat-way" v-show="!currentChatWay">
              <div class="chat-say" v-press>
                <span class="one">按住 说话</span>
                <span class="two">松开 结束</span>
              </div>
            </div>
            <div class="chat-way" v-show="currentChatWay">
              <input class="chat-txt" type="text" v-on:focus="focusIpt" v-on:blur="blurIpt" />
            </div>
            <span class="expression iconfont icon-dialogue-smile"></span>
            <span class="more iconfont icon-dialogue-jia"></span>
            <div class="recording" style="display: none;" id="recording">
              <div class="recording-voice" style="display: none;" id="recording-voice">
                <div class="voice-inner">
                  <div class="voice-icon"></div>
                  <div class="voice-volume">
                    <span></span>
                    <span></span>
                    <span></span>
                    <span></span>
                    <span></span>
                    <span></span>
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                </div>
                <p>手指上划,取消发送</p>
              </div>
              <div class="recording-cancel" style="display: none;">
                <div class="cancel-inner"></div>
                <p>松开手指,取消发送</p>
              </div>
            </div>
          </div>
        </footer>

        <!--footer-->
        <footer class="footer">
          <div class="message-wrap">
            <textarea
              v-model="stat.sendMsgVal"
              id="message-content"
              placeholder="请输入文字..."
              class="message-content"
            ></textarea>
          </div>
          <span class="send-btn" @click="sendMsg">发送</span>
        </footer>
        <!--footer-->
      </div>
    </div>
  </div>
</template>
<script>
import "@/assets/chat.css";
import init from "@/assets/rongyun/init";
import wx from "../../node_modules/weixin-js-sdk";

export default {
  data() {
    return {
      pageName: this.$route.query.name,
      currentChatWay: false, //ture为键盘打字 false为语音输入
      timer: null,
      // sayActive: false // false 键盘打字 true 语音输入
      instance: "",
      stat: {
        currentView: "chat",
        currentUserInfo: {
          id: "user1",
          nickname: "产品",
          region: "86",
          phone: "13269772701",
          portraitUri:
            "http://himg.bdimg.com/sys/portrait/item/98fbe9b8a3e89d895745491c12.jpg?cdnversion=0741"
        },
        targetUserInfo: {
          id: "user2",
          nickname: "开发",
          region: "86",
          phone: "13269772702",
          portraitUri: "https://www.rongcloud.cn/docs/assets/img/index/logo.png"
        },
        messageList: [],
        sendMsgVal: ""
      }
    };
  },

  mounted() {
    wx.config({
      beta: true, // 必须这么写，否则wx.invoke调用形式的jsapi会有问题
      debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来
      appId: "ww76673d8a0d7cd9d7", // 必填，企业微信的corpID
      timestamp: 1414587466, // 必填，生成签名的时间戳
      nonceStr: "Wm3WZYTPz0wzccnC", // 必填，生成签名的随机串 必填，生成签名的随机串
      signature: "0f9de62fce790f9a083d5c99e95740ceb90c27ed", // 必填，签名
      jsApiList: ["chooseImage"]
    });
    console.log(wx);

    var _this = this;
    var userInfo = {
      appKey: "kj7swf8ok3ug2",
      token:
        "DSiV8qm6f18NMtMkgldghgAzlDlmPiBHC9h8+PtwH5NfQN+zfV5Iej4MJB2RU57EJbumFdOmoBUQSXSkyGScEw=="
    };
    var callbacks = {
      CONNECTED: function(instance) {
        //传入实例参数
        //获取历史消息
        var conversationType = RongIMLib.ConversationType.PRIVATE;
        var targetId = "user2";
        instance.getHistoryMessages(
          conversationType,
          targetId,
          null,
          20,
          {
            onSuccess(list, hasMsg) {
              console.log("user2历史记录", list);
              //渲染会话列表
              _this.stat.messageList = list;
              return (_this.instance = instance);
            }
          },
          null
        );
      },
      Success: function(id) {},
      Received: function(message) {
        console.log("收到消息了啊！", message);
        _this.stat.messageList.push(message);
      }
    };
    init(userInfo, callbacks);

    this.scrollEnd();
  },

  directives: {
    press: {
      inserted(element, binding) {
        var recording = document.querySelector(".recording"),
          recordingVoice = document.querySelector(".recording-voice"),
          recordingCancel = document.querySelector(".recording-cancel"),
          startTx,
          startTy;

        element.addEventListener(
          "touchstart",
          function(e) {
            // 用bind时，vue还没插入到dom,故dom获取为 undefine，用 inserted 代替 bind,也可以开个0秒的定时器
            element.className = "chat-say say-active";

            recording.style.display = recordingVoice.style.display = "block";
            // console.log('start')
            var touches = e.touches[0];
            startTx = touches.clientX;
            startTy = touches.clientY;
            e.preventDefault();
          },
          false
        );

        element.addEventListener(
          "touchend",
          function(e) {
            /*var touches = e.changedTouches[0];
                        var distanceY = startTy - touches.clientY;
                        if (distanceY > 50) {
                            console.log("取消发送信息");
                        }else{
                            console.log("发送信息");
                        }*/

            element.className = "chat-say";
            recordingCancel.style.display = recording.style.display = recordingVoice.style.display =
              "none";
            // console.log('end')
            e.preventDefault();
          },
          false
        );
        element.addEventListener(
          "touchmove",
          function(e) {
            var touches = e.changedTouches[0],
              endTx = touches.clientX,
              endTy = touches.clientY,
              distanceX = startTx - endTx,
              distanceY = startTy - endTy;

            if (distanceY > 50) {
              element.className = "chat-say";
              recordingVoice.style.display = "none";
              recordingCancel.style.display = "block";
            } else {
              element.className = "chat-say say-active";
              recordingVoice.style.display = "block";
              recordingCancel.style.display = "none";
            }
            // 阻断事件冒泡 防止页面被一同向上滑动
            e.preventDefault();
          },
          false
        );
      }
    },
    more: {
      bind(element, binding) {
        var startTx, startTy;
        element.addEventListener(
          "touchstart",
          function(e) {
            var msgMore = document.getElementById("msg-more"),
              touches = e.touches[0];
            startTx = touches.clientX;
            startTy = touches.clientY;

            clearTimeout(this.timer);
            this.timer = setTimeout(() => {
              // 控制菜单的位置
              msgMore.style.left =
                (startTx - 18 > 180 ? 180 : startTx - 18) + "px";
              msgMore.style.top = element.offsetTop - 33 + "px";
              msgMore.style.display = "block";
              element.style.backgroundColor = "#e5e5e5";
            }, 500);
          },
          false
        );
        element.addEventListener(
          "touchmove",
          function(e) {
            var touches = e.changedTouches[0],
              disY = touches.clientY;
            if (Math.abs(disY - startTy) > 10) {
              clearTimeout(this.timer);
            }
          },
          false
        );
        element.addEventListener(
          "touchend",
          function(e) {
            clearTimeout(this.timer);
          },
          false
        );
      }
    }
  },

  methods: {
    focusIpt() {
      this.timer = setInterval(function() {
        document.body.scrollTop = document.body.scrollHeight;
      }, 100);
    },
    blurIpt() {
      clearInterval(this.timer);
    },

    openNewPageBtn() {
      let routeData = this.$router.resolve({
        path: "/2"
      });
      window.open(routeData.href, "_blank");
    },

    sayBtn() {
      // wx.startRecord();
      wx.chooseImage({
        count: 1, // 默认9
        sizeType: ["original", "compressed"], // 可以指定是原图还是压缩图，默认二者都有
        sourceType: ["album", "camera"], // 可以指定来源是相册还是相机，默认二者都有
        success: function(res) {
          var localIds = res.localIds; // 返回选定照片的本地ID列表，localId可以作为img标签的src属性显示图片
          console.log("ddddddddddddddd", localIds);
        }
      });
    },

    sendPictureBtn() {
      var base64Str =
        "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAvMAAABeCAYAAACuGJvOAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyhpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMTM4IDc5LjE1OTgyNCwgMjAxNi8wOS8xNC0wMTowOTowMSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTcgKE1hY2ludG9zaCkiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6RDQ5MUVBRDBBNDhDMTFFODk0RTZDRkQzOTcxMTI1NjciIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6RDQ5MUVBRDFBNDhDMTFFODk0RTZDRkQzOTcxMTI1NjciPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDpENDkxRUFDRUE0OEMxMUU4OTRFNkNGRDM5NzExMjU2NyIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDpENDkxRUFDRkE0OEMxMUU4OTRFNkNGRDM5NzExMjU2NyIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PlrZd0wAABfpSURBVHja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";
      var imageUri = "https://www.rongcloud.cn/docs/assets/img/index/logo.png"; // 上传到自己服务器的 URL。
      var msg = new RongIMLib.ImageMessage({
        content: base64Str,
        imageUri: imageUri
      });
      var conversationType = RongIMLib.ConversationType.PRIVATE; // 单聊, 其他会话选择相应的消息类型即可
      var targetId = "user1"; // 目标 Id

      var that = this;
      that.instance.sendMessage(conversationType, targetId, msg, {
        // 发送消息成功
        onSuccess: function(message) {
          that.stat.sendMsgVal = "";
          that.stat.messageList.push(message);
          that.$nextTick(that.scrollEnd);
        }
      });
    },

    sendMsg() {
      var text = this.stat.sendMsgVal;
      if (!text) {
        return false;
      }
      var msg = new RongIMLib.TextMessage({
        content: text,
        extra: "附加信息"
      });
      var conversationType = RongIMLib.ConversationType.PRIVATE; // 私聊
      var targetId = "user1"; // 目标 Id
      var that = this;
      that.instance.sendMessage(conversationType, targetId, msg, {
        // 发送消息成功
        onSuccess: function(message) {
          console.log("asdsasdasd", message);
          that.stat.sendMsgVal = "";
          that.stat.messageList.push(message);
          that.$nextTick(that.scrollEnd);
        }
      });
    },

    scrollEnd: function() {
      //添加完消息 跳转到最后一条
      var list = document.querySelectorAll(".message-item");
      if (list.length > 1) {
        var last = list[list.length - 1];
        last.scrollIntoView();
      }
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>

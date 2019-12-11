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
                  >
                  <img v-else :src="stat.targetUserInfo.portraitUri" class="rong-avatar-bd">
                </div>
                <div class="message-body">
                  <pre class="user-msg" v-if="msg.content.messageName == 'TextMessage'">{{msg.content.content}}</pre>
                  <img
                    class="image-message"
                    :src="msg.content.imageUri"
                    alt="image"
                    v-if="msg.content.messageName == 'ImageMessage'"
                  >
                </div>
              </div>

              <div v-if="msg.messageType == 'ImageMessage'" class="message-text">
                <div class="rong-avatar">
                  <img
                    v-if="msg.messageDirection == 1"
                    :src="stat.currentUserInfo.portraitUri"
                    class="rong-avatar-bd"
                  >
                  <img v-else :src="stat.targetUserInfo.portraitUri" class="rong-avatar-bd">
                </div>
                <div class="message-body">
                  <pre class="user-msg" v-if="msg.content.messageName == 'TextMessage'">{{msg.content.content}}</pre>
                  <img
                    class="image-message"
                    :src="msg.content.imageUri"
                    alt="image"
                    v-if="msg.content.messageName == 'ImageMessage'"
                  >
                </div>
              </div>
            </div>
          </div>
        </div>
        <!--chat-content-->

        <!--footer-->
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
              <input class="chat-txt" type="text" v-on:focus="focusIpt" v-on:blur="blurIpt">
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
        targetUserInfo: {
          id: "user1",
          nickname: "产品",
          region: "86",
          phone: "13269772701",
          portraitUri:
            "http://himg.bdimg.com/sys/portrait/item/98fbe9b8a3e89d895745491c12.jpg?cdnversion=0741"
        },
        currentUserInfo: {
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
    var _this = this;
    var userInfo = {
      appKey: "kj7swf8ok3ug2",
      token:
        "X/yuhsigGnQyDMcdDaDpZV9PBRCbvg5A/cdCMQ3iKvE+y8ha9fDofEbAP6y38LC9hmt5hDMoP9zVpfemdO7hFg=="
    };
    var callbacks = {
      CONNECTED: function(instance) {
        //传入实例参数
        //获取历史消息
        var conversationType = RongIMLib.ConversationType.PRIVATE;
        var targetId = "user1";
        instance.getHistoryMessages(
          conversationType,
          targetId,
          null,
          20,
          {
            onSuccess(list, hasMsg) {
              console.log("user1历史记录", list);
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
        console.log("来公司加的东西：", message);
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
      var targetId = "user2"; // 目标 Id
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

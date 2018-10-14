(function($) {
  "use strict";

  var count_msg = chat_data.length;
  var current_msg = 0;
  var $msg_area = $(".msg-area");
  var isInputFocus = false;

  $(".startChatBtn").click(function () {
    // $(".slide-1").hide();
    $(".slide-1").animate({height: "hide"}, 300);
    $(".slide-2").slideUp(200, startMessaging()).css("display", "flex");
    $('.msg-area').scrollTop($('.msg-area').height());
  });

  $(".worksBtn").click(function () {
    $("#worksModal").modal('show');
  });

  $(".chat-close").click(function () {
    $(".slide-2").animate({height: "hide"}, 300);
    $(".slide-1").slideUp(200).css("display", "flex");
  });

  function startMessaging() {
    showMessage(chat_data[current_msg]);
  }

  function showMessage(msg) {
    var time = new Date().toLocaleTimeString('en-GB', {
      hour: "numeric",
      minute: "numeric"
    });

    var uLoadingMsg = getLoadingMsg();
    $msg_area.append(uLoadingMsg.html);
    $msg_area.find(".msg.text-left." + uLoadingMsg.uid).show(200);
    $('.msg-area').animate({ scrollTop: $('.msg-area')[0].scrollHeight}, 400);

    setTimeout(function () {
      $msg_area.find(".msg.text-left." + uLoadingMsg.uid).remove();

      var msg_html = `
      <div class="msg text-left">
        <p>${msg.question}</p>
        <span class="time">${time}</span>
      </div>
      <div class="clearfix h10p"></div>
      `;
      $msg_area.append(msg_html);
      $('.msg-area').animate({ scrollTop: $('.msg-area')[0].scrollHeight}, 400);
      checkAnswer(msg);
    }, 1500);
  }

  function sendInputAnswer() {
    var val = $(".input input").val();
    $(".input input").val("");
    var time = new Date().toLocaleTimeString('en-GB', {
      hour: "numeric",
      minute: "numeric"
    });

    var msg_html = `
    <div class="msg text-right">
      <p>${val}</p>
      <span class="time">${time}</span>
    </div>
    <div class="clearfix h10p"></div>
    `;

    $msg_area.append(msg_html);
    $('.msg-area').animate({ scrollTop: $('.msg-area')[0].scrollHeight}, 400);

    goNextMsg();
  }

  function checkAnswer(msg) {
    var html = "";
    switch (msg.answer_type) {
      case "string":
        if ($(".input").attr("data-input") != 1) {
          $(".input").attr("data-input", 1);
          $(".input").attr("data-buttons", 0);
          html = `
          <div class="row align-items-center h100">
            <div class="col-11 col-input">
              <input type="text" class="form-control" placeholder="Ваше сообщение">
            </div>
            <div class="col-1">
              <button type="button" class="send"> <img src="img/ic_send.svg" alt=""> </button>
            </div>
          </div>
          `;
          $(".input").html(html);
        }
        break;
      case "buttons":

        $(".input").attr("data-input", 0);
        $(".input").attr("data-buttons", 1);
        html = `
        <div class="row align-items-center h100">
          <div class="col-12 text-center">`;

        for (var i = 0; i < msg.buttons_arr.length; i++) {
          html += `
          <button type="button" class="btn btn-select">${msg.buttons_arr[i]}</button>
          `;
        }

        html +=`
          </div>
        </div>
        `;
        $(".input").html(html);

        break;
      case "no_answer":
          goNextMsg();
        break;
      default:

    }
  }

  function goNextMsg() {
    current_msg++;
    if (current_msg < count_msg) {
      showMessage(chat_data[current_msg]);
    }else{
      $(".input").attr("data-input", 1);
      $(".input").attr("data-buttons", 0);
      var html = `
      <div class="row align-items-center h100">
        <div class="col-11 col-input">
          <input type="text" class="form-control" disabled placeholder="Ваше сообщение">
        </div>
        <div class="col-1">
          <button type="button" class="send"> <img src="img/ic_send.svg" alt=""> </button>
        </div>
      </div>
      `;
      $(".input").html(html);
    }
  }

  function getLoadingMsg() {
    var uid = '_' + Math.random().toString(36).substr(2, 9);
    return {
      html: `
      <div class="msg text-left ${uid}" style="display: none;">
        <p class="taping"><span></span><span></span><span></span><span></span><span></span><span></span></p>
        <span class="time">${new Date().toLocaleTimeString('en-GB', {
          hour: "numeric",
          minute: "numeric"
        })}</span>
      </div>
      <div class="clearfix h10p"></div>
      `,
      uid: uid
    };
  }

  $(document).keypress(function (e) {
    if (e.which == 13) {
        if (isInputFocus) {
          sendInputAnswer();
        }
    }
  });

  $(".input").on("click", ".btn-select", function () {
    var text = $(this).text();

    var time = new Date().toLocaleTimeString('en-GB', {
      hour: "numeric",
      minute: "numeric"
    });

    var msg_html = `
    <div class="msg text-right">
      <p>${text}</p>
      <span class="time">${time}</span>
    </div>
    <div class="clearfix h10p"></div>
    `;

    $msg_area.append(msg_html);
    $('.msg-area').animate({ scrollTop: $('.msg-area')[0].scrollHeight}, 400);

    goNextMsg();
  });

  $(".input").on("click", ".send", function () {
    sendInputAnswer();
  });

  $(".input").on("focus", "input", function () {
    isInputFocus = true;
  });

  $(".input").on("focusout", "input", function () {
    isInputFocus = false;
  });


})(jQuery);

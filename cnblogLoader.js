(function ($) {
  var cnblogLoader = function (config) {
    if (!config) {
      console.log("缺少必要参数");
      return;
    }
    window._config = config;
    var staticPath = config.staticSrc || 'https://1natsume.pages.dev' + "/";

    var param = {
      css: [
        staticPath + "main.bundle.css",
        staticPath + "app.bundle.css",
      ],
      js: [
        staticPath + "main.bundle.js",
        staticPath + "app.bundle.js",
      ],
      ico: config.staticIco,
    };

    var c_css = param.css;
    var c_js = param.js;
    var c_ico = param.ico;

    function dynamicLoadIco(url, dom) {
      var link = document.createElement('link');
      link.type = 'image/x-icon';
      link.rel = 'shortcut icon';
      link.href = url;
      document.getElementsByTagName('head')[0].appendChild(link);
    }

    function dynamicLoadCss(url, dom) {
      var head = dom || document.getElementsByTagName('head')[0];
      var link = document.createElement('link');
      link.type = 'text/css';
      link.rel = 'stylesheet';
      link.href = url;
      head.appendChild(link);
    }

    function dynamicLoadJs(url, dom, callback) {
      var script = document.createElement("script");
      script.type = "text/javascript";
      if (callback) {
        if (script.readyState) {
          script.onreadystatechange = function () {
            if (script.readyState == "loaded" || script.readyState == "complete") {
              script.onreadystatechange = null;
              callback();
            }
          }
        } else {
          script.onload = function () {
            callback();
          }
        }
      }
      script.src = url;
      var head = dom || document.getElementsByTagName('head')[0];
      head.appendChild(script);
      document.body.removeAttribute
    }

    $(function () {
      var app = $("<div id=root></div>");
      $("link").remove();
      /*删除所有除头页的消息*/
      $("#home").css("display", "none");
      $("body").append(app);
      /*加载图标*/
      dynamicLoadIco(c_ico);
      /*加载所有CSS*/
      while (c_css.length > 0) {
        dynamicLoadCss(c_css.shift(), '');
      }
      /*同步加载JS*/
      (function () {
        if (c_js.length > 0) {
          dynamicLoadJs(c_js.shift(), '', arguments.callee);
        }
      })();

    });
  };
  $.cnblogLoader = cnblogLoader
})($);

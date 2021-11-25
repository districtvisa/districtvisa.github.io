fofx_live.event("break-point")
               .media_query("(max-width: 768px)")
               .listen(function () {
                 fofx_live.dispatch("menu-open", null);
               });
      fofx_live.event("split-lines").listen(function (el) {
        const lines = el.innerHTML.trim().split("\n");
        el.innerHTML = "";
        for (line of lines) {
          const cnt = document.createElement("line-content");
          cnt.innerHTML = line;
          const lne = document.createElement("each-line");
          lne.appendChild(cnt);
          el.appendChild(lne);
        }
      });
      fofx_live.event("show-alert")
               .listen(function (el) {
                 setTimeout(() => fofx_live.toggle("alert-showing"));
               });
      fofx_live.event("preload-alert")
               .listen(function (el) {
                 fofx_live.toggle("alert-preloaded");
               });
      fofx_live.event("close-alert")
               .listen(function (el) {
                 fofx_live.toggle("alert-showing");
               });
      fofx_live.event("unload-alert")
               .listen(function (el) {
                 if (!fofx_live.data("alert-showing")) {
                   fofx_live.toggle("alert-preloaded");
                 }
               });
      fofx_live.event("toggle-menu")
               .listen(function (el) {
                 fofx_live.toggle("menu-open");
               });

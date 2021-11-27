fofx_live
  .media_query("max-width: 768px", function (m) {
    fofx_live.dispatch("break-point", m ? "break-point" : null);
  });

fofx_live
  .on("break-point", function () {
    fofx_live.dispatch("menu-open", null);
  });

fofx_live
  .component("split-lines")
  .on("init", function (el) {
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

fofx_live
  .component("alert-modal")
  .on("init", function () {
    fofx_live.toggle("alert-preloaded");
  })
  .on("load", function () {
    setTimeout(() => fofx_live.toggle("alert-showing"));
  })
  .on("transitionend", function () {
    if (!fofx_live.data("alert-showing")) {
      fofx_live.toggle("alert-preloaded");
    }
  });

fofx_live
  .component("close-modal")
  .on("click", function () {
    fofx_live.toggle("alert-showing");
  });

fofx_live
  .component("toggle-menu")
  .on("click", function () {
    fofx_live.toggle("menu-open");
  });

fofx_live
  .component("company-number")
  .on("init", function (el) {
    let [_, a, b, c] = el.textContent.match(/(\d{3})(\d{3})(\d{4})/);
    el.textContent = `(${a}) ${b}-${c}`;
  });

fofx_live
  .component("carousel-inner")
  .on("load", function (el) {
    const max = el.getElementsByClassName("carousel-image").length;
    let n = 0;
    const t = 4000;
    const progress_markers = el.parentNode.getElementsByClassName("progress-marker");
    let curr_marker = progress_markers[0];
    curr_marker.classList.add("current-marker");
    function scroll_next () {
      n = (n + 1) % max;
      el.style.setProperty("right", `${n*100}vw`);
      curr_marker.classList.remove("current-marker");
      curr_marker = progress_markers[n];
      curr_marker.classList.add("current-marker");
    }
    let int_id = setInterval(scroll_next, t);
    function manual_scroll () {
      clearInterval(int_id);
      scroll_next();
      int_id = setInterval(scroll_next, t);
    }
    function scroll_button (dir) {
      const button = el.parentNode.getElementsByClassName(`go-${dir}`)[0];
      button.addEventListener("click", function () {
        if (dir === "left") n = n === 0 ? max - 2 : n - 2;
        manual_scroll();
      });
    }
    for (let i = 0; i < progress_markers.length; i++) {
      progress_markers[i].addEventListener("click", function () {
        n = i - 1;
        manual_scroll();
      });
    }
    scroll_button("left");
    scroll_button("right");
  });
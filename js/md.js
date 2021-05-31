function getElInfo (line) {
  var re = /[#\.\[]?[^#\.\]]+/,
      m,
      out = {classes: [], attrs: {}};
  while (line.length) {
    m = line.match(re)[0];
    line = line.substring(m.length);
    if (m.startsWith("#")) {
      out.id = m.substring(1);
    } else if (m.startsWith(".")) {
      out.classes.push(m.substring(1));
    } else if (m.startsWith("[")) {
      var split = m.split("=");
      line = line.substring(1);
      out.attributes[split[0]] = split[1];
    } else {
      out.tagName = m;
    }
  }
  return out;
}

function appendElement (container, lines) {
  var elInfo = getElInfo(lines[0]),
      el = document.createElement(elInfo.tagName);
  if (elInfo.id) el.id = elInfo.id;
  elInfo.classes.forEach((cls) => el.classList.add(cls));
  container.appendChild(el);
  lines.splice(0, 1);
  while (lines[0].startsWith("    ")) {
    el.innerText += lines[0].trimStart();
    lines.splice(0, 1);
  }
}

function parse (container, md) {
  var leadingWS = md.match(/^ */)[0],
      lines = md.trim().split("\n" + leadingWS);
  while (lines.length) {
    appendElement(container, lines);
  }
}

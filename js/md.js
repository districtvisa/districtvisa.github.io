function getElInfo (line) {
  var out = {classes: [], attrs: []};
  while (line.length) {
    var m;
    if (line.startsWith("[")) {
      m = line.match(/[^\]]+\]/)[0];
      var split = m.slice(1, -1).split("=");
      out.attrs.push(split);
    } else {
      m = line.match(/[#\.]?[^#\.\[]+/)[0];
      if (m.startsWith("#")) {
        out.id = m.substring(1);
      } else if (m.startsWith(".")) {
        out.classes.push(m.substring(1));
      } else {
        out.tagName = m;
      }
    }
    line = line.substring(m.length);
  }
  return out;
}

function setText (container, lines, leadingWS) {
  var text = lines[0].match(/= *(.+)/)[1];
  container.innerText += text;
  lines.splice(0, 1);
  while (lines.length) {
    var line = lines[0].trimStart();
    if (lines[0].length - line.length > leadingWS) {
      container.innerText += line;
      lines.splice(0, 1);
    } else {
      break;
    }
  }
}

function appendElement (container, lines, leadingWS) {
  while (lines[1] && lines[1].match(/^\s*[\.\[]/)) {
    lines[0] = lines[0].trimEnd() + lines[1].trimStart();
    lines.splice(1, 1);
  }
  var line = lines[0].trimStart(),
      ws = lines[0].length - line.length;
  lines[0] = line;
  if (line.startsWith("=")) {
    setText(container, lines, ws);
  } else {
    var tagSplit = line.match(/(\S+)\s*(\S*)/),
        elInfo = getElInfo(tagSplit[1]),
        el = document.createElement(elInfo.tagName);
    if (elInfo.id) el.id = elInfo.id;
    elInfo.classes.forEach((cls) => el.classList.add(cls));
    elInfo.attrs.forEach((kv) => el.setAttribute(kv[0], kv[1]));
    container.appendChild(el);
    lines.splice(0, 1);
    if (tagSplit[2]) el.innerText += tagSplit[2];
    while (lines.length) {
      ws = lines[0].length - lines[0].trimStart().length;
      if (ws > leadingWS) {
        appendElement(el, lines, ws);
      } else {
        break;
      }
    }
  }
}

function parse (container, md) {
  var leadingWS = md.match(/^\n*( *)/)[1],
      lines = md.trim().split(/\n+/);
  while (lines.length) {
    appendElement(container, lines, leadingWS.length);
  }
}

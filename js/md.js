function getElInfo (line) {
  var re = /[#\.\[]?[^#\.\]\[]+/,
      m,
      out = {classes: [], attrs: []};
  while (line.length) {
    console.log(line);
    m = line.match(re)[0];
    line = line.substring(m.length);
    if (m.startsWith("#")) {
      out.id = m.substring(1);
    } else if (m.startsWith(".")) {
      out.classes.push(m.substring(1));
    } else if (m.startsWith("[")) {
      out.attrs.push[m.split("=")];
      line = line.substring(1);
    } else {
      out.tagName = m;
    }
  }
  return out;
}

function appendElement (container, lines, leadingWS) {
  var tagSplit = lines[0].trim().match(/(\S+)\s*(\S*)/),
      elInfo = getElInfo(tagSplit[1]),
      el = document.createElement(elInfo.tagName);
  if (elInfo.id) el.id = elInfo.id;
  elInfo.classes.forEach((cls) => el.classList.add(cls));
  elInfo.attrs.forEach((kv) => el.setAttribute(kv[0], kv[1]));
  container.appendChild(el);
  lines.splice(0, 1);
  if (tagSplit[2]) lines.splice(0, 0, "    " + tagSplit[2]);
  while (lines.length) {
    var ws = lines[0].length - lines[0].trim().length - leadingWS;
    if (ws == 4) {
      el.innerText += lines[0].trimStart();
      lines.splice(0, 1);
    } else if (ws == 2) {
      appendElement(el, lines, leadingWS + 2);
    } else {
      break;
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

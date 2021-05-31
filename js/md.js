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
  var text = lines[0].substring(1).trimStart();
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
  var line = lines[0];
  lines.splice(0, 1);
  while (lines.length && lines[0].match(/^\s*[\.\[]/)) {
    line = line.trimEnd() + lines[0].trimStart();
    lines.splice(0, 1);
  }
  var tagSplit = line.match(/(\S+)\s*(\S*)/),
      elInfo = getElInfo(tagSplit[1]),
      el = document.createElement(elInfo.tagName);
    if (elInfo.id) el.id = elInfo.id;
    elInfo.classes.forEach((cls) => el.classList.add(cls));
    elInfo.attrs.forEach((kv) => el.setAttribute(kv[0], kv[1]));
    container.appendChild(el);
    if (tagSplit[2]) el.innerText = tagSplit[2];
    while (lines.length) {
      if (!parseElement(el, lines, leadingWS)) break;
    }  
}

function parseElement (container, lines, leadingWS) {
  var line = lines[0].trimStart(),
      ws = lines[0].length - line.length;
  console.log(line, ws, leadingWS);
  if (ws <= leadingWS) return false;
  lines[0] = line;
  if (line.startsWith("=")) {
    setText(container, lines, ws);
  } else if (line.startsWith("#")) {
    
  } else if (line.startsWith("-")) {
    
    // table
    // quick link <url>
  } else {
    appendElement(container, lines, ws);
  }
  return true;
}

function parse (container, md) {
  var leadingWS = md.match(/^\n*( *)/)[1],
      lines = (" " + md).split(/\n+/);
  while (lines.length) {
    parseElement(container, lines, leadingWS.length);
  }
}

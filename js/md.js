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
  var elInfo = getElInfo(lines[0]);
  console.log(elInfo);    
}

function parse (container, md) {
  var leadingWS = md.match(/^ */)[0],
      lines = md.trimStart().split("\n" + leadingWS);
  while (lines.length) {
    lines = appendElement(container, lines);
  }
}

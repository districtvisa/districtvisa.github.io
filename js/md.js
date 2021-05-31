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
  var tagSplit = lines[0].split(/ +/),
      elInfo = getElInfo(tagSplit[0]),
      el = document.createElement(elInfo.tagName);
  if (elInfo.id) el.id = elInfo.id;
  elInfo.classes.forEach((cls) => el.classList.add(cls));
  container.appendChild(el);
  lines.splice(0, 1);
  if (tagSplit[1]) lines.splice(0, 0, "    " + tagSplit[1]);
  while (lines.length && lines[0].startsWith("  ")) {
    if (lines[0].startsWith("    ")) {
      el.innerText += lines[0].trimStart();
      lines.splice(0, 1);
    } else {
      appendElement(el, lines);
    }
  }
}

function parse (container, md) {
  var leadingWS = md.match(/^ */),
      lines = md.trim().split("\n" + leadingWS[0]);
  console.log(md.trim());
  console.log(leadingWS);
  while (lines.length) {
    appendElement(container, lines);
  }
}

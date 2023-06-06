let files = await fetch('/files').then(r => r.json());
let groups = {};
for (let path of files) {  // path = 'path/to/filename.jpg'
  let parts = path.split('/');  // parts = ['path', 'to', 'filename.jpg']
  parts.pop();  // parts = ['path', 'to']
  let group = parts.join('/');  // group = 'path/to'
  if (!groups[group])
    groups[group] = [];
  groups[group].push(path);
}

let button = document.body.appendChild(document.createElement('button'));
button.addEventListener('click', e => {
  if (table.className == 'bycolumns') {
    table.className = 'byrows';
    button.textContent = 'Show columns';
  } else {
    table.className = 'bycolumns';
    button.textContent = 'Show rows';
  }
  displayCollection();
});

let table = document.body.appendChild(document.createElement('table'));

function displayCollection() {
  table.textContent = '';
  let tr;
  if (table.className == 'bycolumns')
    tr = table.appendChild(document.createElement('tr'));
  let mode = 0;
  let selected;
  let entries = Object.entries(groups);
  let foundempty = false;
  for (let [group, images] of entries)
    if (images.length == 0) {
      foundempty = true;
      break;
    }
  if (!foundempty)
    groups[`Group ${entries.length}`] = [];
  entries = Object.entries(groups);
  for (let [group, images] of entries) {
    if (table.className == 'byrows')
      tr = table.appendChild(document.createElement('tr'));
    let td = tr.appendChild(document.createElement('td'));
    td.title = group;
    for (let i = 0; i < 30; i++) {
      if (i >= images.length)
        break;
      let img = td.appendChild(document.createElement('img'));
      img.src = images[i];
      img.addEventListener('click', e => {
        if (mode != 0)
          return;
        mode = 1;
        selected = [group, images[i]];
        e.stopPropagation();
      });
    }
    td.addEventListener('click', e => {
      if (mode != 1)
        return;
      mode = 0;
      let [group, fname] = selected;
      //fetch('...') -- move selected to td.title on server

      let source = groups[group];
      let i = source.indexOf(fname);
      source.splice(i, 1);

      let target = groups[td.title];
      target.unshift(fname);

      displayCollection();
    });
  }
}

button.click();

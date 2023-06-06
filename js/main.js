import {FileManager} from './filemanager.js';


let filemanager = await FileManager.build();

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
  let selected = null;
  let entries = Object.entries(filemanager.groups);
  let foundempty = false;
  for (let [group, images] of entries)
    if (images.length == 0) {
      foundempty = true;
      break;
    }
  if (!foundempty)
    filemanager.groups[`Group ${entries.length}`] = [];
  entries = Object.entries(filemanager.groups);
  for (let [group, images] of entries) {
    if (table.className == 'byrows')
      tr = table.appendChild(document.createElement('tr'));
    let td = tr.appendChild(document.createElement('td'));
    td.title = group;
    for (let i = 0; i < 30; i++) {
      if (i >= images.length)
        break;
      let img = td.appendChild(document.createElement('img'));
      img.src = images[i].path;
      img.addEventListener('click', e => {
        if (selected)
          return;
        selected = [group, images[i]];
        e.stopPropagation();
      });
    }
    td.addEventListener('click', e => {
      if (!selected)
        return;
      let [group, file] = selected;
      selected = null;
      file.move(td.title);

      displayCollection();
    });
  }
}

button.click();

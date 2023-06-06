import {FileManager} from './filemanager.js';


let filemanager = await FileManager.build();

let button = document.body.appendChild(document.createElement('button'));
button.textContent = 'Show rows';
button.addEventListener('click', e => {
  if (table.className == 'bycolumns') {
    table.className = 'byrows';
    e.target.textContent = 'Show columns';
  } else {
    table.className = 'bycolumns';
    e.target.textContent = 'Show rows';
  }
  displayCollection();
});

button = document.body.appendChild(document.createElement('button'));
button.textContent = 'New group';
button.addEventListener('click', e => {
  filemanager.groups[`Group ${Object.entries(filemanager.groups).length}`] = [];
  displayCollection();
});

let table = document.body.appendChild(document.createElement('table'));
table.className = 'bycolumns';

function displayCollection() {
  table.textContent = '';
  let tr;
  if (table.className == 'bycolumns')
    tr = table.appendChild(document.createElement('tr'));
  let selected = null;
  for (let [groupname, images] of Object.entries(filemanager.groups)) {
    if (table.className == 'byrows')
      tr = table.appendChild(document.createElement('tr'));
    let td = tr.appendChild(document.createElement('td'));
    let groupnameinput = td.appendChild(document.createElement('input'));
    groupnameinput.value = groupname;
    groupnameinput.disabled = true;  // TODO: Allow users to rename groups.
    td.appendChild(document.createElement('br'));
    for (let i = 0; i < 30; i++) {
      if (i >= images.length)
        break;
      let img = td.appendChild(document.createElement('img'));
      img.src = images[i].path;
      img.addEventListener('click', e => {
        if (selected)
          return;
        selected = [groupname, images[i]];
        e.stopPropagation();
      });
    }
    td.addEventListener('click', e => {
      if (!selected)
        return;
      let [groupname, file] = selected;
      selected = null;
      file.move(groupnameinput.value);

      displayCollection();
    });
  }
}

displayCollection();

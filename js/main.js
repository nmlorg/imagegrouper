import {FileManager} from './filemanager.js';


let filemanager = await FileManager.build();
let grouplist = Object.keys(filemanager.groups);

let select = document.body.appendChild(document.createElement('select'));
let option = select.appendChild(document.createElement('option'));
option.value = 'bycolumns';
option.textContent = 'Columns';
option = select.appendChild(document.createElement('option'));
option.value = 'byrows';
option.textContent = 'Rows';
select.addEventListener('change', e => {
  table.className = select.value;
  displayCollection();
});

let button = document.body.appendChild(document.createElement('button'));
button.textContent = 'New group';
button.addEventListener('click', e => {
  let groupname = `Group ${Object.entries(filemanager.groups).length}`;
  filemanager.groups[groupname] = [];
  grouplist.unshift(groupname);
  displayCollection();
});

let imagedim = 15;

button = document.body.appendChild(document.createElement('button'));
button.textContent = 'Smaller';
button.addEventListener('click', e => {
  if (imagedim > 1)
    imagedim--;
  else
    imagedim /= 2;
  document.documentElement.style.setProperty('--imagedim', `${imagedim}vw`);
});

button = document.body.appendChild(document.createElement('button'));
button.textContent = 'Reset size';
button.addEventListener('click', e => {
  imagedim = 15;
  document.documentElement.style.setProperty('--imagedim', `${imagedim}vw`);
});

button = document.body.appendChild(document.createElement('button'));
button.textContent = 'Bigger';
button.addEventListener('click', e => {
  if (imagedim < 1)
    imagedim *= 2;
  else
    imagedim++;
  document.documentElement.style.setProperty('--imagedim', `${imagedim}vw`);
});


let table = document.body.appendChild(document.createElement('table'));
table.className = 'bycolumns';

function displayCollection() {
  table.textContent = '';
  let tr;
  if (table.className == 'bycolumns')
    tr = table.appendChild(document.createElement('tr'));
  let selected = null;
  for (let i = 0; i < grouplist.length; i++) {
    let groupname = grouplist[i];
    let files = filemanager.groups[groupname];
    if (table.className == 'byrows')
      tr = table.appendChild(document.createElement('tr'));
    let td = tr.appendChild(document.createElement('td'));

    let button = td.appendChild(document.createElement('button'));
    button.textContent = `Move ${table.className == 'byrows' ? 'up' : 'left'}`;
    if (i == 0)
      button.disabled = true;
    button.addEventListener('click', e => {
      grouplist.splice(i, 1);
      grouplist.splice(i - 1, 0, groupname);
      displayCollection();
    });

    button = td.appendChild(document.createElement('button'));
    button.textContent = `Move ${table.className == 'byrows' ? 'down' : 'right'}`;
    if (i == grouplist.length - 1)
      button.disabled = true;
    button.addEventListener('click', e => {
      grouplist.splice(i, 1);
      grouplist.splice(i + 1, 0, groupname);
      displayCollection();
    });

    let groupnameinput = td.appendChild(document.createElement('input'));
    groupnameinput.value = groupname;
    groupnameinput.disabled = true;  // TODO: Allow users to rename groups.
    td.appendChild(document.createElement('br'));

    for (let i = 0; i < Math.min(files.length, 30); i++) {
      let file = files[i];
      let img = td.appendChild(document.createElement('img'));
      img.src = file.path;
      img.addEventListener('click', e => {
        if (selected)
          return;
        selected = [groupname, file];
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

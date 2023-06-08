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
  container.className = select.value;
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


let container = document.body.appendChild(document.createElement('div'));
container.className = 'bycolumns';

function displayCollection() {
  container.textContent = '';
  let selected = null;
  for (let groupname of grouplist) {
    let files = filemanager.groups[groupname];
    let div = container.appendChild(document.createElement('div'));

    div.upleft = div.appendChild(document.createElement('button'));
    div.upleft.textContent = '\u21d6';  // Up/left double arrow.
    if (!div.previousElementSibling)
      div.upleft.disabled = true;
    div.upleft.addEventListener('click', e => {
      div.parentNode.firstElementChild.upleft.disabled = false;
      div.parentNode.lastElementChild.downright.disabled = false;
      div.parentNode.insertBefore(div, div.previousElementSibling);
      div.parentNode.firstElementChild.upleft.disabled = true;
      div.parentNode.lastElementChild.downright.disabled = true;
    });

    div.downright = div.appendChild(document.createElement('button'));
    div.downright.textContent = '\u21d8';  // Down/right double arrow.
    div.downright.disabled = true;
    if (div.previousElementSibling)
      div.previousElementSibling.downright.disabled = false;
    div.downright.addEventListener('click', e => {
      div.parentNode.firstElementChild.upleft.disabled = false;
      div.parentNode.lastElementChild.downright.disabled = false;
      div.parentNode.insertBefore(div, div.nextElementSibling.nextElementSibling);
      div.parentNode.firstElementChild.upleft.disabled = true;
      div.parentNode.lastElementChild.downright.disabled = true;
    });

    let groupnameinput = div.appendChild(document.createElement('input'));
    groupnameinput.value = groupname;
    groupnameinput.disabled = true;  // TODO: Allow users to rename groups.
    div.appendChild(document.createElement('br'));

    for (let i = 0; i < Math.min(files.length, 30); i++) {
      let file = files[i];
      let img = div.appendChild(document.createElement('img'));
      img.src = file.path;
      img.addEventListener('click', e => {
        if (selected)
          return;
        selected = [groupname, file];
        img.className = 'selected';  // This image instance is destroyed, so we don't need to clear this.
        e.stopPropagation();
      });
    }

    div.addEventListener('click', e => {
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

import {FileManager} from './filemanager.js';


let filemanager = await FileManager.build();

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
  addCollection(groupname);
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

let selected = null;

function addCollection(groupname) {
  let files = filemanager.groups[groupname];
  let div = container.insertBefore(document.createElement('div'), container.firstElementChild);

  div.upleft = div.appendChild(document.createElement('button'));
  div.upleft.textContent = '\u21d6';  // Up/left double arrow.
  div.upleft.disabled = true;
  if (div.nextElementSibling)
    div.nextElementSibling.upleft.disabled = false;
  div.upleft.addEventListener('click', e => {
    div.parentNode.firstElementChild.upleft.disabled = false;
    div.parentNode.lastElementChild.downright.disabled = false;
    div.parentNode.insertBefore(div, div.previousElementSibling);
    div.parentNode.firstElementChild.upleft.disabled = true;
    div.parentNode.lastElementChild.downright.disabled = true;
  });

  div.downright = div.appendChild(document.createElement('button'));
  div.downright.textContent = '\u21d8';  // Down/right double arrow.
  if (!div.nextElementSibling)
    div.downright.disabled = true;
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

  let imagesdiv = div.appendChild(document.createElement('div'));

  for (let i = 0; i < files.length; i++) {
    let file = files[i];
    let img = imagesdiv.appendChild(document.createElement('img'));
    img.src = file.path;
    img.addEventListener('click', e => {
      if (selected)
        return;
      selected = [groupname, file, img];
      img.className = 'selected';
      e.stopPropagation();
    });
  }

  imagesdiv.addEventListener('click', e => {
    if (!selected)
      return;
    let [groupname, file, img] = selected;
    selected = null;
    file.move(groupnameinput.value);
    imagesdiv.insertBefore(img, imagesdiv.firstElementChild);
    img.className = '';
  });
}

for (let groupname of Object.keys(filemanager.groups).reverse())
  addCollection(groupname);

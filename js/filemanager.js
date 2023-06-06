class FileManager {
  static async build() {
    let filelist = await fetch('/files').then(r => r.json());
    return new FileManager(filelist);
  }

  constructor(filelist) {
    this.groups = {};
    for (let path of filelist) {
      let file = new File(this, path);
      if (!this.groups[file.dirname])
        this.groups[file.dirname] = [];
      this.groups[file.dirname].push(file);
    }
  }
}


class File {
  constructor(filemanager, path) {
    this.filemanager = filemanager;
    this.path = path;
    let parts = path.split('/');
    this.fname = parts.pop();
    this.dirname = parts.join('/');
  }

  move(newdirname) {
    let source = this.filemanager.groups[this.dirname];
    let i = source.indexOf(this);
    source.splice(i, 1);

    let target = this.filemanager.groups[newdirname];
    target.unshift(this);

    this.dirname = newdirname;
    // TODO: Actually send an RPC to move the file on disk. For now, this.path has to remain
    // unchanged so we can still render the file.
    //this.path = `${newdirname}/${this.fname}`;
  }
}


export {FileManager};

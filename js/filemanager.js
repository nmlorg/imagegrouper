class FileManager {
  static async build() {
    let filelist = await fetch('/files').then(r => r.json());
    return new FileManager(filelist);
  }

  constructor(filelist) {
    this.groups = {};
    for (let path of filelist) {
      let file = new File(path);
      if (!this.groups[file.dirname])
        this.groups[file.dirname] = [];
      this.groups[file.dirname].push(file);
    }
  }
}


class File {
  constructor(path) {
    this.path = path;
    let parts = path.split('/');
    this.fname = parts.pop();
    this.dirname = parts.join('/');
  }
}


export {FileManager};

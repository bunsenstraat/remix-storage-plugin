import path from "path";
import { isForOfStatement } from "typescript";
import { Utils } from "../../App";
import { fileExplorerNode } from "./types";

export const removeSlash = (s: string) => {
  return s.replace(/^\/+/, "");
};

export const jsonObjectFromFileList = (files: string[]) => {
  const ob: fileExplorerNode[] = [];
  // reindex filelist

  //Utils.log("F", files);

  files.map((f, i) => {
    files[i] = Utils.addSlash(files[i]);
    const dirname = path.dirname(files[i]);
    //Utils.log(dirname, dirname.startsWith("/."));
    if (dirname.startsWith("/.")) return true;
    const basename = path.basename(files[i]);
    const directories = removeSlash(dirname).split("/");
    let node: fileExplorerNode;
    if (
      !ob.find((x) => {
        return x.fullname === dirname;
      })
    ) {
      node = {
        type: "dir",
        dir: true,
        file: false,
        name: directories.pop(),
        fullname: dirname,
        parentDir: path.dirname(dirname),
      };
      ob.push(node);
    }

    //Utils.log(ob);

    let previouspath = "";
    for (let i = 0; i < directories.length; i++) {
      if (i > 0) previouspath = "/" + directories.slice(0, i).join("/");
      const finalPath = previouspath + "/" + directories[i];
      if (
        !ob.find((x) => {
          return x.fullname === finalPath;
        })
      ) {
        node = {
          type: "dir",
          dir: true,
          file: false,
          name: directories[i],
          fullname: finalPath,
          parentDir: path.dirname(finalPath),
        };
        ob.push(node);
      }
    }
    if (
      !ob.find((x) => {
        return x.fullname === files[i];
      })
    ) {
      node = {
        type: "file",
        file: true,
        dir: false,
        name: basename,
        fullname: files[i],
        directory: dirname,
        status: [],
      };
      ob.push(node);
    }
  });
  // asign ids
  ob.map((f, i) => {
    f.id = i;
  });
  // find parents
  ob.map((f, i) => {
    f.parentId = null;
    f.children = null;
    if (f.type === "file") {
      // f.parent

      const parent = ob.find((x) => {
        return x.fullname === f.directory && x.type === "dir";
      });
      f.parentId = parent ? parent.id : null;
    } else {
      ////Utils.log(f)
      const parent = ob.find((x) => {
        return x.fullname === f.parentDir && x.type === "dir";
      });
      f.parentId = parent ? parent.id : null;
      if (f.fullname === "/") f.parentId = null;
    }
  });
  //Utils.log("build tree from", ob.sort(sortbydirectorylevel));
  // first we need it sorted
  //Utils.log("OB", ob);
  //ob.sort(sortbydirectorylevel)

  const nest = (items: any, id: any = null, link = "parentId") =>
    items
      .filter((item: any) => item[link] === id)
      .map((item: any) => ({
        ...item,
        children: nest(items, item.id),
      }));

  //Utils.log("build tree from", ob);

  let t: fileExplorerNode[] = nest(ob);

  let result: fileExplorerNode = {
    children: t,
  };
  //Utils.log("OB", ob);
  return result;
};

const sortbydirectorylevel = (a: any, b: any) => {
  ////Utils.log(a,b);
  if (a.fullname.split("/").length < b.fullname.split("/").length) {
    return -1;
  }
  if (a.fullname.split("/").length > b.fullname.split("/").length) {
    return 1;
  }
  return 0;
};


export const arrayUnique = (array:any)=>{
  var a = array.concat();
  for(var i=0; i<a.length; ++i) {
      for(var j=i+1; j<a.length; ++j) {
          if(a[i] === a[j])
              a.splice(j--, 1);
      }
  }

  return a;
}
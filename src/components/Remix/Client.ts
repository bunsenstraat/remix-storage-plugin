import { PluginClient } from "@remixproject/plugin";
import { createClient } from "@remixproject/plugin-webview";
import { toast } from "react-toastify";
import { BehaviorSubject } from "rxjs";
import { fileservice, ipfservice, Utils } from "../../App";

export class WorkSpacePlugin extends PluginClient {
  clientLoaded = new BehaviorSubject(false);
  callBackEnabled: boolean = true;

  constructor() {
    super();
    createClient(this);
    toast.info("Connecting to REMIX DGIT2");
    this.methods = ['pull']
    this.onload().then(async () => {
      //Utils.log("workspace client loaded", this);
      toast.success("Connected to REMIX");
      try{
        await this.call("manager", "activatePlugin", "dGitProvider")
        this.clientLoaded.next(true);
        await this.setCallBacks();
      }catch(e){
        console.log(e)
        toast.error("Could not activate DECENTRALIZED GIT. Please activate DECENTRALIZED GIT in the plugin list and restart this plugin.", {autoClose:false})
      }


    });


    

  }

  async pull(cid: string){
    try {
      await ipfservice.importFromCID(cid, "", false)
      //Utils.log("yes");
    } catch (e) {
      //Utils.log("no");
    }
  }

  async setCallBacks() {
    this.on(
      "solidity",
      "compilationFinished",
      async (file, source, version, result) => {
        //Utils.log("compilationFinished");
        //Utils.log(file,source,version,result);
        const r = await this.call("solidity", "getCompilationResult");
        //Utils.log("getCompilationResult");
        //Utils.log(r.data?.contracts);
        //Utils.log(r.data?.sources);
        //Utils.log(r.source?.sources)
        //Utils.log(r.source?.target) 
        
        //await this.call("editor","highlight",{start:{column:1,line:1},end:{column:2,line:2}},"2_Owner.sol","#32a852");
        //await this.call("editor","addAnnotation",{row:3, column:1,type:"warning",text:"testing", name:"name",message:"message"})
      }
    );

    this.on("fileManager", "fileSaved", async (e) => {
      // Do something
      if (this.callBackEnabled) {
        //Utils.log("file save",e);
        await fileservice.syncFromBrowser();

      }
    });

    this.on("fileManager", "fileAdded", async (e) => {
      // Do something
      if (this.callBackEnabled) {
        await fileservice.syncFromBrowser();

        //Utils.log(e);
      }
    });

    this.on("fileManager","fileRemoved", async (e) => {
      // Do something
      //Utils.log(e);
      if (this.callBackEnabled) {
        await fileservice.syncFromBrowser();
      }
      // await this.rmFile(e)
    });

    this.on("fileManager", "currentFileChanged", async (e) => {
      // Do something
      //Utils.log("CHANGED",e, this);
      if (this.callBackEnabled) {
        
        await fileservice.syncFromBrowser();
      }
      //await this.rmFile(e)
    });

    this.on("fileManager", "fileRenamed", async (oldfile, newfile) => {
      // Do something
      if (this.callBackEnabled) {
        //Utils.log(oldfile, newfile);
        await fileservice.syncFromBrowser();

      }
    });


    this.on("filePanel", "setWorkspace", async (x:any) => {
      Utils.log("ws set", x);
      await fileservice.syncFromBrowser(x.isLocalhost);
      Utils.log(x);
    });

    this.on("filePanel", "deleteWorkspace", async (x:any) => {
      Utils.log("wS DELETE", x);
      await fileservice.syncFromBrowser(x.isLocalhost);
      Utils.log(x);
    });

    this.on("filePanel", "renameWorkspace", async (x:any) => {
      Utils.log("wS rn", x);
      await fileservice.syncFromBrowser(x.isLocalhost);
      Utils.log(x);
    });


    this.callBackEnabled = true;
  }


  
  async disableCallBacks() {
    this.callBackEnabled = false;
  }
  async enableCallBacks() {
    this.callBackEnabled = true;
  }
}

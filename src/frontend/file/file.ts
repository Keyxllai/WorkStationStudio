namespace Studio{
declare var $;
export class file {
    rooturl:string = 'http://localhost:8083/api';
    init() {
        this.getWorkSpace();
    }

    getWorkSpace(){
        let params = {
            url: "file/getWorkSpaces",
        };
        let options = {
            params: params,
            on_complete: this.updateFolderTree.bind(this)
        }
        //Get workspaces
        this.request(this.rooturl, options);
    }

    updateFolderTree(rsp:any){
        console.log(rsp);
    }

    request(url: string, options: any) {
        var xhr = new XMLHttpRequest();
        xhr.open(options.params ? 'POST' : 'GET', url, true);
        if (options.reponse_type)
            xhr.responseType = options.reponse_type;
        var formdata = null;
        if (options.params) {
            xhr.setRequestHeader("Content-Type", "application/json");
            formdata=JSON.stringify(options.params);
            //formdata = new FormData();
            // for (var i in options.params) {
            //     formdata.append(i, options.params[i]);
            // }
        }
        xhr.onload = function () {
            var response = this.response;
            if (this.status < 200 || this.status > 299) {
                if (options.on_error)
                    options.on_error(this.status);
                return;
            }
            var type = this.getResponseHeader('content-type');
            if (!options.skip_parse && type == "application/json") {
                try {
                    response = JSON.parse(response);
                }
                catch (err) {
                    console.error(err);
                }
            }
            if (options.on_complete)
                options.on_complete(response);
            return;
        };
        xhr.onerror = function (err) {
            console.error(err);
            if (options.on_error)
                options.on_error(err);
        };
        if (options.on_progress)
            xhr.upload.addEventListener("progress", function (e) {
                var progress = 0;
                if (e.lengthComputable)
                    progress = e.loaded / e.total;
                options.on_progress(progress, e, options.params);
            }, false);
        xhr.send(formdata);
        return xhr;
    }
}

$(window).on("load", function () {
    let f = new file();
    f.init();
});

}
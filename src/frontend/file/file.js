var Studio;
(function (Studio) {
    var file = /** @class */ (function () {
        function file() {
            this.rooturl = 'http://localhost:8083/api';
        }
        file.prototype.init = function () {
            this.getWorkSpace();
        };
        file.prototype.getWorkSpace = function () {
            var params = {
                url: "file/getWorkSpaces",
            };
            var options = {
                params: params,
                on_complete: this.updateFolderTree.bind(this)
            };
            //Get workspaces
            this.request(this.rooturl, options);
        };
        file.prototype.updateFolderTree = function (rsp) {
            console.log(rsp);
        };
        file.prototype.request = function (url, options) {
            var xhr = new XMLHttpRequest();
            xhr.open(options.params ? 'POST' : 'GET', url, true);
            if (options.reponse_type)
                xhr.responseType = options.reponse_type;
            var formdata = null;
            if (options.params) {
                xhr.setRequestHeader("Content-Type", "application/json");
                formdata = JSON.stringify(options.params);
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
        };
        return file;
    }());
    Studio.file = file;
    $(window).on("load", function () {
        var f = new file();
        f.init();
    });
})(Studio || (Studio = {}));

//# sourceMappingURL=file.js.map

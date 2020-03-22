namespace Studio {
    declare var $;
    export class file {
        rooturl: string = 'http://localhost:8083/api';
        currrentFolderPath: string = "";
        currentFolderName: string = "";
        treeData: any[] = [];
        files: any[] = [];
        singlePageCount: number = 50;
        init() {
            this.getWorkSpace();
        }

        getWorkSpace() {
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

        updateFolderTree(rsp: any) {
            let that = this;
            console.log(rsp);
            if (rsp.result) {
                this.fillTree(rsp.result);
                $('#treeview').treeview({
                    levels: 2,
                    selectedBackColor: "#03a9f3",
                    icon: "glyphicon glyphicon-stop",
                    onhoverColor: "rgba(0, 0, 0, 0.05)",
                    expandIcon: 'ti-plus',
                    collapseIcon: 'ti-minus',
                    nodeIcon: 'fa fa-folder',
                    data: this.treeData,
                    onNodeSelected: function (event, node) {
                        $(this).treeview('unselectNode', [node.nodeId, { silent: false }]);
                        that.currentFolderName = node.text;
                        that.currrentFolderPath = node.path;
                        that.getFiles(node.path);
                    },
                    onNodeUnselected: function (event, node) {
                        $(this).treeview('selectNode', [node.nodeId, { silent: true }]);
                    }
                });
            }
        }

        async getFiles(path) {
            let params = {
                url: "file/getFiles",
                virtualpath: path
            };
            let options = {
                params: params,
                on_complete: this.updateFolderTable.bind(this)
            }
            this.request(this.rooturl, options);
        }

        updateFolderTable(response) {
            let that = this;
            let currentPage = 0;
            $("#fileTable tr:not(:first):not(:last)").remove();
            if (response.result.length != 0) {
                that.files = response.result.filter(f => f.isDirectory === false);

                that.renderPage(1, this.singlePageCount);
                currentPage = 1;
            }

            $('.pagination').jqPagination("option", {
                max_page: Math.ceil(response.result.length / this.singlePageCount),
                current_page: currentPage,
                trigger: false
            });
        }

        renderPage(startPage: number, singlePageCount: number) {
            let that = this;
            $("#fileTable tr:not(:first):not(:last)").remove();
            let startIndex = (startPage - 1) * singlePageCount;
            let pageData = this.files.slice(startIndex, startIndex + singlePageCount);
            if (pageData.length == 0)
                return
            pageData.forEach(item => {
                let tr = $("<tr></tr>");
                let tdName = $("<td>" + item.name + "</td>");
                let tdSize = $("<td>" + item.size + "</td>");
                let tdpath = $("<td>" + item.realPath + "</td>");
                let tdTime = $("<td>" + item.createTime + "</td>");
                let tdButtons = $("<td><button name='download_btn' type='button' class='btn btn-info btn-outline btn-circle btn-lg m-r-5'><i  class='ti-download'></i></button>" +
                    "<button  name='delete_btn' type='button' class='btn btn-info btn-outline btn-circle btn-lg m-r-5'><i  class='ti-trash'></i></button></td>")
                tr.append(tdName);
                tr.append(tdSize);
                tr.append(tdpath);
                tr.append(tdTime);
                tr.append(tdButtons);
                $("#fileTableBody").append(tr);
            });
            $("button[name=download_btn]").click(function () {
                // TODO
            })
            $("button[name=delete_btn]").click(function () {
                // TODO
            }
            );
        }

        fillTree(data: any) {
            let that = this;
            data.forEach(workspace => {
                let node = {
                    text: workspace.name,
                    path: this.resolvePath(workspace.driveName, workspace.name),
                    state: {
                        expanded: true
                    }
                }

                if (workspace.folders.length > 0) {
                    node["nodes"] = [];
                    this.fillFolders(node, workspace.folders);
                }
                this.treeData.push(node);
            })
        }
        fillFolders(node: any, folders) {
            folders.forEach(folder => {
                let childNode = {
                    text: folder.folderName,
                    path: this.resolvePath(node.path, folder.folderName),
                    state: {
                        expanded: false
                    }
                }
                let subFolders = folder.subFolders;
                if (subFolders && subFolders.length > 0) {
                    childNode["nodes"] = [];
                    this.fillFolders(childNode, subFolders);
                }
                node.nodes.push(childNode);
            })
        }

        resolvePath(path1: string, path2: string) {
            return path1 + '/' + path2;
        }

        request(url: string, options: any) {
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
        }
    }

    $(window).on("load", function () {
        let f = new file();
        f.init();
    });

}
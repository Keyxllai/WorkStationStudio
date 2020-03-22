var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var Studio;
(function (Studio) {
    var file = /** @class */ (function () {
        function file() {
            this.rooturl = 'http://localhost:8083/api';
            this.currrentFolderPath = "";
            this.currentFolderName = "";
            this.treeData = [];
            this.files = [];
            this.singlePageCount = 50;
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
            var that = this;
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
        };
        file.prototype.getFiles = function (path) {
            return __awaiter(this, void 0, void 0, function () {
                var params, options;
                return __generator(this, function (_a) {
                    params = {
                        url: "file/getFiles",
                        virtualpath: path
                    };
                    options = {
                        params: params,
                        on_complete: this.updateFolderTable.bind(this)
                    };
                    this.request(this.rooturl, options);
                    return [2 /*return*/];
                });
            });
        };
        file.prototype.updateFolderTable = function (response) {
            var that = this;
            var currentPage = 0;
            $("#fileTable tr:not(:first):not(:last)").remove();
            if (response.result.length != 0) {
                that.files = response.result.filter(function (f) { return f.isDirectory === false; });
                that.renderPage(1, this.singlePageCount);
                currentPage = 1;
            }
            $('.pagination').jqPagination("option", {
                max_page: Math.ceil(response.result.length / this.singlePageCount),
                current_page: currentPage,
                trigger: false
            });
        };
        file.prototype.renderPage = function (startPage, singlePageCount) {
            var that = this;
            $("#fileTable tr:not(:first):not(:last)").remove();
            var startIndex = (startPage - 1) * singlePageCount;
            var pageData = this.files.slice(startIndex, startIndex + singlePageCount);
            if (pageData.length == 0)
                return;
            pageData.forEach(function (item) {
                var tr = $("<tr></tr>");
                var tdName = $("<td>" + item.name + "</td>");
                var tdSize = $("<td>" + item.size + "</td>");
                var tdpath = $("<td>" + item.realPath + "</td>");
                var tdTime = $("<td>" + item.createTime + "</td>");
                var tdButtons = $("<td><button name='download_btn' type='button' class='btn btn-info btn-outline btn-circle btn-lg m-r-5'><i  class='ti-download'></i></button>" +
                    "<button  name='delete_btn' type='button' class='btn btn-info btn-outline btn-circle btn-lg m-r-5'><i  class='ti-trash'></i></button></td>");
                tr.append(tdName);
                tr.append(tdSize);
                tr.append(tdpath);
                tr.append(tdTime);
                tr.append(tdButtons);
                $("#fileTableBody").append(tr);
            });
            $("button[name=download_btn]").click(function () {
                // TODO
            });
            $("button[name=delete_btn]").click(function () {
                // TODO
            });
        };
        file.prototype.fillTree = function (data) {
            var _this = this;
            var that = this;
            data.forEach(function (workspace) {
                var node = {
                    text: workspace.name,
                    path: _this.resolvePath(workspace.driveName, workspace.name),
                    state: {
                        expanded: true
                    }
                };
                if (workspace.folders.length > 0) {
                    node["nodes"] = [];
                    _this.fillFolders(node, workspace.folders);
                }
                _this.treeData.push(node);
            });
        };
        file.prototype.fillFolders = function (node, folders) {
            var _this = this;
            folders.forEach(function (folder) {
                var childNode = {
                    text: folder.folderName,
                    path: _this.resolvePath(node.path, folder.folderName),
                    state: {
                        expanded: false
                    }
                };
                var subFolders = folder.subFolders;
                if (subFolders && subFolders.length > 0) {
                    childNode["nodes"] = [];
                    _this.fillFolders(childNode, subFolders);
                }
                node.nodes.push(childNode);
            });
        };
        file.prototype.resolvePath = function (path1, path2) {
            return path1 + '/' + path2;
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

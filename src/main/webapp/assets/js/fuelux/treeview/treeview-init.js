//http://getfuelux.com/javascript.html#tree  tree API
var UITree = function () {

    return {
        //main function to initiate the module
        init: function () {

            var DataSourceTree = function (options) {
                //console.log(options.data);
                this._data = options.data;
                this._delay = options.delay;
            };

            DataSourceTree.prototype = {

                data: function (options, callback) {
                    var self = this;
                    console.log(options);
                    console.log(self._data);

                    setTimeout(function () {
                        //var data = $.extend(true, [], self._data);

                        callback({ data: self._data });

                    }, this._delay)
                }
            };

            // INITIALIZING TREE
            var treeDataSource = new DataSourceTree({
                data: [
                    { name: '我的钢铁网', type: 'folder', additionalParameters: { id: 'F1' }, 'icon-class':'blue',data:[
                        { name: '一级频道1', type: 'folder', additionalParameters: { id: 'F2' }, 'icon-class': 'success'},
                        { name: '一级频道2', type: 'item', additionalParameters: { id: 'F3' } },
                        { name: '一级频道3', type: 'item', additionalParameters: { id: 'F4' } }
                    ]}
                ],
                delay: 400
            });
            // INITIALIZING TREE
            var treeDataSource = new DataSourceTree({
                data: [
                    { name: '一级频道1', type: 'folder', 'icon-class':'blue', additionalParameters: { id: 'F1' },  
                      data: [  
                        { name: '二级频道1', type: 'folder', 'icon-class':'blue', additionalParameters: { id: 'FF1' } },  
                        { name: '二级频道1', type: 'folder', 'icon-class':'blue', additionalParameters: { id: 'FF2' } },  
                        { name: '二级频道1', type: 'item', additionalParameters: { id: 'FI2' } }  
                      ]  
                    },  
                    { name: '一级频道2', type: 'folder', additionalParameters: { id: 'F2' } },  
                    { name: '一级频道3', type: 'item', additionalParameters: { id: 'I1' } }
                ],
                delay: 400
            });


            $('#MyTree').tree({
                dataSource: treeDataSource,
                cacheItems: true,
                folderSelect: true,
                multiSelect: false,
                loadingHTML: '<div class="tree-loading"><i class="fa fa-rotate-right fa-spin"></i></div>'
            });

        }

    };

}();
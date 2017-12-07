var hoverImage;
function loadImage (event) {
    var obj = event.target;
    if (obj.width) {
      var rect = hoverImage.getBoundingClientRect();
      if (rect.right <= 328) {
          $('#preview').removeClass('arrow-left').addClass('arrow-right').css({
            top: rect.top,
            left: rect.right - 12
          });
      }
      else {
          $('#preview').removeClass('arrow-right').addClass('arrow-left').css({
            top: rect.top,
            left: rect.left - 26
          });
      }
      // 设置预览区域纵向边界
      var boundRect = {top: 72, bottom: 435};
      var previewBottom = rect.top + $('#preview').height();
      // 计算预览框的纵向坐标范围
      var previewRect = {top: rect.top, bottom: previewBottom};
      var previewTop = rect.top - (previewRect.bottom - boundRect.bottom);
      if(previewRect.bottom > boundRect.bottom) {
          $('#preview').css({
              top: previewTop
          });
      }
      // 设置标识箭头的相对位置
      var caretTop = rect.top-previewTop;
      caretTop = caretTop <= 10 ? 20 : caretTop+20;
      $('#preview').find('.caret').css('top', caretTop);
      $('#preview').show();
    }
}
$(function() {
    function initHeight(show) {
        if (!show) {
            top.$('.edui-for-icDialog').find('.edui-dialog-body').css('height', 210);
            top.$('.edui-for-icDialog').find('.edui-dialog-content').css('height', 146);
        } else {
            top.$('.edui-for-icDialog').find('.edui-dialog-body').css('height', 590);
            top.$('.edui-for-icDialog').find('.edui-dialog-content').css('height', 540);
            var topOffset = (top.innerHeight - 590) / 2;
            top.$('.edui-for-icDialog[id]').css('top', topOffset);
        }
        $('.manual').hide();
        $('.use-manual').hide();
    }
    // 分页函数
    function pager(pager, shownum) {
        var temp = [];
        var k = 0,
            current = pager.page > pager.total_page ? pager.total_page : pager.page,
            next = current + 1,
            pre = current - 1;
        shownum = shownum || 8;

        temp.push('<div class="tui-pagination-container tui-pagination-container-center">');
        temp.push('<div class="tui-pagination-numbers">');
        if (pre >= 1) {
            temp.push('<span class="tui-pagination-item" data-page="'+pre+'"><i class="iconfont tui-pagination-pre"></i></span>');
        }

        for (var i = 1; i <= pager.total_page; i++) {
            if (i >= current - (shownum / 2) && i <= current + (shownum / 2)) {
                k++;
                if (current == i) {
                  temp.push('<span class="tui-pagination-item tui-pagination-item-active">' + i + '</span>');
                }
                else {
                  temp.push('<span class="tui-pagination-item" data-page="'+ i +'">' + i + '</span>');
                }
            }

            if (k > shownum) {
                break;
            }
        }
        temp.push('</div>')
        temp.push('<div class="tui-pagination-jump">')
        temp.push('<div>')
        temp.push('<input type="text" value="'+ current + '" class="tui-pagination-jump-number">/<span>' + pager.total_page+'</span>')
        temp.push('&nbsp;<a class="tui-pagination-jump-btn" href="javascript:void(0);">跳转</a>&nbsp;')
        temp.push('</div>')
        temp.push('</div>')
        if (next < pager.total_page) {
            temp.push('<div class="tui-pagination-numbers" data-page="'+ next +'">')
            temp.push('<span class="tui-pagination-item"><i class="iconfont tui-pagination-next"></i></span>')
            temp.push('</div>')
        }
        temp.push('</div>')
        return temp.join('');
    }

    // 获取列表函数
    function fetchList(page) {
        page = page || 1;
        var key = $('[name=ic]').val();
        if (key.trim() === '') {
            $('[name=ic]').focus();
        } else {
            $.get('/article/get_ic_picture_list/', {
                term: key,
                pagenum: page,
                page_size: 32
            }, function(data) {
                if (data.message !== 'success') {
                    $('.tips').html(data.reason).show();
                    $('.wrapper-picture').hide();
                    $('#footer').hide();
                    initHeight(false);
                } else if (data.data.list && data.data.list.length === 0) {
                    $('.tips').html('<span>没有该类型的图片资源</span></div>').show();
                    $('.wrapper-picture').hide();
                    $('#footer').hide();
                    initHeight(false);
                } else {
                    var temp = [];
                    var len = data.data.list.length;
                    data.data.list.map(function(item, i) {
                        temp.push('<div class="grid" data-id="' + item.id + '"><img data-id="' + item.id + '" data-source="' + item.img + '" alt="' + item.grapher_name + '" src="' + item.small_img + '"/></div>');
                    });
                    $('.grids').html(temp.join(''));
                    $('.wrapper-picture').show();
                    $('#pager').html(pager(data.data.page_info));
                    initHeight(true);
                    $('#manual').hide();
                    $('.tips').hide();
                    $('.seprate').hide();
                    $('#btns').show();
                    $('#footer').show();
                }
            }).error(function(data) {
                $('.tips').html('<span>网络请求错误</span>');
            });
        }
    }

    function preview(src, obj) {
        $('#preview').html('</div><img onload="loadImage(event)" src="' + src + '"/><div class="caret"></div>');
    }

    $('#searchBtn').click(function() {
        fetchList();
    });
    $('[name=ic]').keyup(function(event) {
        if (event.keyCode === 13) {
            fetchList();
        }
    });
    var node, show = false,
        timer1, timer2;

    $('.wrapper-picture').delegate('.grid', 'mouseover', function() {
        var that = this;
        var offset = $(that).offset();
        hoverImage = that;
        if (!show) {
            timer1 = setTimeout(function() {
                var src = $(that).find('img').attr('data-source');
                preview(src, that);
            }, 500);
            show = true;
        }
    }).delegate('.grid', 'mouseout', function() {
        clearTimeout(timer1);
        timer2 = setTimeout(function(){
          $('#preview').hide();
        }, 500);
        show = false;
    }).delegate('.grid', 'click', function() {
        $(this).addClass('checked');
        var that = $(this);
        $('.wrapper-picture').find('.grid').each(function() {
            if (!$(this).is(that)) {
                $(this).removeClass('checked');
            }
        });
    });
    $('#pager').delegate('[data-page]', 'click', function() {
        var page = parseInt($(this).data('page'));
        $('.tui-pagination-jump-number').val(page);
        fetchList(page);
    });
    $('#pager').delegate('.tui-pagination-jump-btn', 'click', function() {
        var page = parseInt($('.tui-pagination-jump-number').val());
        fetchList(page);
    });

    $('#dialog-cancel').click(function() {
        dialog.close();
    });

    dialog.addListener('close', function(event) {
        lock(false);
    });

    $('#dialog-ok').click(function() {
        var ic = $('.wrapper-picture').find('.checked').find('img');
        if (ic.length) {
            $(this).attr('disabled', true);
            var icData = {
                id: ic.eq(0).data('id'),
                term: $('[name=ic]').val(),
                source: ic.eq(0).data('source')
            };
            editor.execCommand('inserticnew', icData);
        }
    });
});

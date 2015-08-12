$(() => {
    //1.ミルクココアインスタンスを作成
    const milkcocoa = new MilkCocoa("{your app id}.mlkcca.com");
    //2."message"データストアを作成
    const ds = milkcocoa.dataStore("message");
    //3."message"データストアからメッセージを取ってくる
    ds.stream().sort("desc").next((err, datas) => {
        datas.forEach((data) => {
            renderMessage(data);
        });
    });
    //4."message"データストアのプッシュイベントを監視
    ds.on("push", (e) => {
        renderMessage(e);
    });

    let last_message = "dummy";

    function renderMessage(message) {
        let message_html = '<p class="post-text">' + escapeHTML(message.value.content) + '</p>';
        let date_html = '';
        if(message.value.date) {
            date_html = '<p class="post-date">'+escapeHTML( new Date(message.value.date).toLocaleString())+'</p>';
        }
        $("#"+last_message).before('<div id="'+message.id+'" class="post">'+message_html + date_html +'</div>');
        last_message = message.id;
    }

    function post() {
        //5."message"データストアにメッセージをプッシュする
        var content = escapeHTML($("#content").val());
        if (content && content !== "") {
            ds.push({
                title: "タイトル",
                content: content,
                date: new Date().getTime()
            }, (e) => {
              $("#content").val("");
            });
        }
    }

    $('#post').click(() => {
        post();
    });

    $('#content').keydown((e) => {
        if (e.which == 13){
            post();
            return false;
        }
    });
});

//インジェクション対策
function escapeHTML(val) {
    return $('<div>').text(val).html();
};

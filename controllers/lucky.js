var EventProxy = require('eventproxy');
var request = require('request');
var cheerio = require('cheerio');

exports.api = function(req, res, next) {

    var API ="http://trend.caipiao.163.com/ssq/?";
    var referer = req.get('referer');
    //console.log(req,res);
    var reqq = req,ress =res;
    var beginPeriod = req.body.beginPeriod;
    var endPeriod = req.body.endPeriod;
    console.log(beginPeriod,endPeriod);
    if(beginPeriod && endPeriod){
        url =API+"beginPeriod="+beginPeriod+"&endPeriod="+endPeriod;
    }else{
        url = API+"periodNumber=30"
    }
    function parseNum(num){
        if(num<10){
            num = "0"+num;
        }
        return num;
    }
    request({url:url,headers:{'User-Agent': 'request'}}, function (error, res, body) {
        if (!error && res.statusCode == 200) {
            var $ = cheerio.load(body);
            var data  = $("#cpdata tr");
            var luck=[];
            data.each(function (index, ele) {
                if($(this).data("period")){
                    var luckItem = {
                        num:$(this).data("period"),
                        data:[]
                    };
                    var td = $(this).find("td");
                    td.each(function(index, ele){
                        if($(this).attr("class") == "ball_red" || $(this).attr("class") == "ball_brown" || $(this).attr("class") == "ball_blue js-fold"){
                            luckItem.data.push($(this).text());
                        }
                    });
                    luck.push(luckItem);
                }
            });
            var len = luck.length;
            function calc(n,i){
                var m =0;
                luck.map(function(item){
                    if(n == item.data[i]){
                        m++;
                    }
                });
                return m;
            }

            var arr=[];
            function check(){
                for(var i =1;i<8;i++){
                    arr[i-1]=[];
                    for(var r =1;r<34;r++){
                        var n = parseNum(r);
                        var nums = calc(n,i-1);
                        if(nums){
                            arr[i-1].push({
                                n:n,
                                c:nums
                            });
                        }
                        //console.log("第"+i+"位数"+n+"出现次数"+nums+"，概率为"+nums/len*100+"%");
                    }
                    arr[i-1].sort(function(a,b){return b.c-a.c});
                    //console.log(arr[i-1])

                }
            }
            check();
            ress.send({success: true, data: luck});
            /*ress.render('index', {
                title:"Lucky",
                data:luck,
                arr:arr
            });*/

        }
    });
};
exports.index = function(req, res, next){
    res.render('index', {
        title:"Lucky"
    });
};
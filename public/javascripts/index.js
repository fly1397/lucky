$(function(){

    var api = "/api";
    $(".submit").on("click",function(){
        $.post(api,{beginPeriod:$("#beginPeriodId").val(),endPeriod:$("#endPeriodId").val()},function(data){
            init(data.data);
        });
    });
    $.getJSON(api,function(data){
        init(data.data);
    });
    var datas = {};
    //初始化
    function init(luck){
        datas = luck;
        var len = luck.length;
        renderHtml(luck);
        //step(luck);
        renderCheck(check(luck),len);
    }
    $("#key").on("change",function(){
        var $this = $(this);
        setTimeout(function(){
            var val = $this.val();
            renderCheck(check(datas),datas.length,val);
        },500)
    });
    //出现次数计算
    function calc(luck,n,i){
        var m =0;
        luck.map(function(item){
            if(n == item.data[i]){
                m++;
            }
        });
        return m;
    }
    //出现概率统计
    function check(luck){
        var len = luck.length;
        var arr=[];
        for(var i =1;i<8;i++){
            arr[i-1]=[];
            for(var r =1;r<34;r++){
                var n = parseNum(r);
                var nums = calc(luck,n,i-1);
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
        return arr;
    }
    //位数转换
    function parseNum(num){
        if(num<10){
            num = "0"+num;
        }
        return num;
    }
    //平均步伐
    function step(luck){
        var len = luck.length;
        for(var n =0;n<7;n++){
            var m =0;
            for(var i =0;i<len-1;i++){
                m += luck[i+1].data[n]-luck[i].data[n]
            }
            console.log(m/len)
        }

    }

    //渲染html
    function renderHtml(data){

        var html="<ul>";
        data.map(function(item){
            html+="<li><strong>"+item.num+"</strong>";
            item.data.map(function(data,index){
                var cls = "mid";
                if(data<12){
                    cls = "min"
                }else if(data>22){
                    cls = "max"
                }
                if(index>6)cls="blue";
                html+="<span class='"+cls+"'>"+data+"</span>"
            });
            html +="</li>";
        });
        html +="</ul>";

        $(".left").html(html)
    }
    //渲染概率
    function renderCheck(data,len,val){
        var html="<div>";
        var result=[];
        //console.log(data);
        data.map(function(items,index){
            var n=[];
            items.map(function(item,indexs){
                var odds = Math.round((item.c/len*100)*100)/100;//百分比
                html+="<div>第"+(index+1)+"位数<span>"+item.n+"</span>出现次数<strong>"+item.c+"</strong>，概率为"+odds+"%</div>";
                if(val){
                    console.log(val);
                    if(odds>=val){
                        n.push(item.n);
                     }else if(indexs == 0){
                        n.push(item.n);
                     }
                }else{
                    console.log("默认");
                    if(item.c>=items[0].c){
                        n.push(item.n);
                    }
                }

            });
            html+="<div>&nbsp;</div>";
            result.push(n);
        });
        html +="</div>";

        $(".right").html(html);
        console.log(result);
        renderResult(result)
    }

    function doExchange(doubleArrays){
        var len=doubleArrays.length;
        if(len>=2){
            var len1=doubleArrays[0].length;
            var len2=doubleArrays[1].length;
            var newlen=len1*len2;
            var temp=new Array(newlen);
            var index=0;
            for(var i=0;i<len1;i++){
                for(var j=0;j<len2;j++){
                    temp[index]=doubleArrays[0][i]+","+
                        doubleArrays[1][j];
                    index++;
                }
            }
            var newArray=new Array(len-1);
            for(var i=2;i<len;i++){
                newArray[i-1]= doubleArrays[i];
            }
            newArray[0]=temp;
            return doExchange(newArray);
        }
        else{
            return doubleArrays[0];
        }
    }

    function renderResult(result){
        var ret = doExchange(result);
        var start = datas[0].num;
        var end = datas[datas.length-1].num;
        var key = $("#key").val();
        var text = function(){
            if(key){
                return "，使用阙值"+key+",优先选择大于"+key+"%的数据。";
            }else{
                return ",使用默认值，取最大百分比。";
            }
        };
        var html ="<p>"+start+"期至"+end+"期，一共有"+datas.length+"组数据,分析出"+ret.length+"组数据" +
            text()
                +
            "</p>";
        ret.map(function(n){
            html+="<p>";
            var number = n.split(",");
            number.map(function(num,index){
                var cls = "mid";
                if(num<12){
                    cls = "min"
                }else if(num>22){
                    cls = "max"
                }
                if(index>5) cls="blue";
                html+="<span class='"+cls+"'>"+num+"</span>"
            });
            html+="</p>";
        });
        $(".result").html(html);
    }

});
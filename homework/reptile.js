const cheerio = require("cheerio");//node版的jQuery；帮助我们从标签中提取数据；
const http = require("http");//搭建服务和访问被爬虫页面；
const url = "http://www.yueta521.com/sales_27526.html";//桌面壁纸页面；
let arr = [];//用来储存爬虫数据；
//爬虫工作；
function reptileWork(url,response){
	//url  爬虫地址     
	//response  服务器响应对象；
	http.get(url,function(res){
		//res  通过http访问爬虫地址得到的响应对象；
		//阶段性捕获页面dom结构；
		res.setEncoding("utf-8");//防止中文乱码；
		let html = "";
		res.on("data",function(data){
			html+=data;
		})
		res.on("end",function(){
//			html;整个爬虫页面的dom；
			let $ = cheerio.load(html);//生成该页面的$;
//			arr.push($(".tit>h2").html());
			//大标题元素
			$(".inner_page_main>ul>li>a>img").each(function(index,item){
				arr.push({
					imgSrc:$(this).attr("src"),
				});
			});
			response.end(JSON.stringify(arr));
		})
	})
}
http.createServer((req,response)=>{
	response.writeHead(200,{
		"content-type":"text/html;charset=utf-8",
		"Access-Control-Allow-Origin":"*"
	})
	if(req.method.toLowerCase() == "get"){
		if(req.url == "/reptile"){
			reptileWork(url,response)
		}
	}
}).listen(8080,()=>{
	console.log("server run");
})

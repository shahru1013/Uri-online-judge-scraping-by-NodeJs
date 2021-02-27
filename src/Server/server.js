const express = require('../solve_counter/node_modules/express');
const request = require('../solve_counter/node_modules/request');
const cheerio = require('../solve_counter/node_modules/cheerio');
const cors = require('../solve_counter/node_modules/cors');
const express_obj = express();
const port = process.env.PORT || 4000;
express_obj.listen(port,console.log(`start at ${port}`));
express_obj.use(express.json());
express_obj.use(cors());
var name='',info='';
/* Get the Profile id and request to the website */
express_obj.get('/station',(req,res)=>{
   var profileId = req.query.id;
   var pageNo = 1;
   var arr = [];
   //fetching html method
   fetch_html(res,arr,pageNo,profileId);
});

var fetch_html = (res,arr,pageNo,profileId) =>{
   request(`https://www.urionlinejudge.com.br/judge/en/profile/${profileId}?page=${pageNo}`,(error,response,html)=>{
      if(!error && response && response.statusCode ===200){
         getSolveId(arr,html);
         if(pageNo < 2){
            getName(html);
         }
         fetch_html(res,arr,pageNo+1,profileId);
      }
      else{
         /* Remove deulicates from arr and send it */
         var finalArr = [...new Set(arr)];
         var obj ={
            data:finalArr,
            uName:name,
            info:info
         }
         res.send(obj);
      }
   });
}
//Received the html and seperate the solved id.
const getSolveId = (arr,html) =>{
    const $ = cheerio.load(html);
    const divName =  $('.main-content');
    var mainIdList =  divName.find('.id').text();
    objToArr(arr,mainIdList);
}

//Collect the User Name

const getName = (html) =>{
   const $ = cheerio.load(html);
   const link = $('p');
   name = link.attr('itemprop','name').children('a').text();
}
/* 
//get Info
const getInfo = (html) =>{
   const $ = cheerio.load(html);
   const link = $('.pb-information');
   info = link.find('li').text();
  // info = par.split(/(\s+)/).filter( function(e) { return e.trim().length > 0; } );
}
*/

//Solve Id Object form to Array Form and Push

const objToArr =(arr,obj) =>{
   var code = obj.split(/(\s+)/).filter( function(e) { return e.trim().length > 0; } );
   code.forEach((value)=>{
      arr.push(value);
   })
}
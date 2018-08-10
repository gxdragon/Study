/**
 * @author gxdragon
 * @date 2018.08.06 
 * Router Setting
 */
module.exports = function(app)
{
     app.get('/',function(req,res){
        res.render('index.html')
     });
     app.get('/race',function(req,res){
         res.render('race.html')
      });
     app.get('/defence',function(req,res){
         res.render('defence.html')
      });
     app.get('/fps',function(req,res){
         res.render('fps.html')
      });
}
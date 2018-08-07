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
}
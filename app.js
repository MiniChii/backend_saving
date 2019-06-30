//Requires
var express = require("express");
const mysql = require('mysql');

const bodyParser = require('body-parser');
const fileUpload = require('express-fileupload');
//para el cors
var cors=require('cors');

//Inicializar variable
var app=express();
app.use(cors());
app.use(bodyParser.json());//para acceder a los paramettros post   
app.use(bodyParser.urlencoded({extended:true})); //para poder adjuntar archivos
app.use(fileUpload());

//CORS Middleware: para que no lance errores de seguridad
app.use(function(req,res,next){
    //enabling cors
    res.header("Access-Control-Allow-Origin","*");
    res.header("Access-Control-Allow-Methods","GET, POST, PUT, DELETE, OPTIONS");
    res.header("Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept, x-client-key, x-client-token, x-client-secret, Authorization");
    next();
});

//conf conexion
const mc = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password:'',
    database: 'saving',
});
//conectar
mc.connect();

/**Obtiene todos los movimientos */
app.get('/movimientos', function(req,res){
    mc.query('SELECT * FROM movimientos', function(error,  results, fields ){
        if(error) throw error;
        return res.send({
            error: false, 
            message:'Listado de movimientos.', 
            data: results})
    })
})

/**Crea un movimiento */
app.post('/movimiento', function(req,res){
    let movimiento = {
        //id
        tipo: parseInt(req.body.tipo),
        monto: parseInt(req.body.monto),
        fecha: req.body.fecha,
        descripcion: req.body.descripcion,
        imagen: req.body.imagen,
        categoria: parseInt(req.body.categoria),
    };

    if(mc){
        mc.query("INSERT INTO movimientos SET ?",movimiento,function (error,result){
            if(error){
                res.status(500).json({"Mensaje":"Error"})
            }
            else{
                res.status(201).json({
                    message:"Insertado",
                    data:result
                })
            }
        });
    }
});

/**Obtiene todos los movimientos */
app.get('/movimiento/:id', function(req,res){
    let id = req.params.id;
    mc.query('SELECT * FROM movimientos WHERE id = ? ', id, function(error,  results, fields ){
        if(error) throw error;
        return res.send({
            error: false, 
            message:'Ver un movimiento', 
            data: results})
    })
})
/**actualizar movimiento */
app.put('/movimiento/:id', function(req,res){
    let id = req.params.id;
    let movimiento= req.body;
    console.log(movimiento);
    
    if(!id || !movimiento){
        return res.status(400).send({error: producto, message:'Debe proveer un id y los datos del movimiento'});
    }
    mc.query("UPDATE movimientos SET ? WHERE id = ?", [movimiento,id], function(error,results,fields){
        if(error){ 
            console.log(error);
            throw error;
        }else{
        
            return res.status(200).json({
                "Mensaje":"Registro con id="+id+" ha sido actualizado",
                "data":results,
                "fields": fields

            })
        }
    })
})

/**borrar movimiento */
app.delete('/movimiento/:id', function(req,res){
    let id = req.params.id;
    if(mc){
        mc.query("DELETE FROM movimientos WHERE id = ?",id,function(error,result){
            if(error){
                console.log(error);
                
                return res.status(500).json({"Mensaje" :"Error"});
            }else{
                return res.status(200).json({"Mensaje":"Registro con id = "+id+" Borrado"});
            }
        });
    }
})
//Escuchar peticiones
app.listen(3001,()=>{
    console.log('Express server - puerto 3001 online');
    
});
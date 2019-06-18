const express = require("express");
const router = express.Router();
const connection = require('../conf');

router.get("/", (req, res) => {
    
   let saladsBase
        

       
   

            connection.query('SELECT * FROM saladsBase', saladsBase, (err, results) => {
                if (err) {
                    
                        res 
                        .status(500)
                        .send(" error 2")
                        console.log('why me')
                        console.log(results)
                        throw err
                        
                    
                } 
          
                
                connection.query('SELECT * FROM saladsSauces', saladsBase, (err, result) => {
                    if (err) { 
                            res 
                            .status(500)
                            .send(" error 2")
                            throw err
    
                    } 
                    
                
                    saladsBase = results.concat(result)
                    res.send(saladsBase)
                } 
                
            )         
        });
});
// router.get("/", (req, res) => {

//     connection.query('SELECT * FROM saladsIngredients', (err, results) => {
  
//       if (err) {
        
//         // If error, warn user
//         res.status(500).send('Erreur lors de la récupération du dessert');
//       } else {
  
//         // If all good, send resul as JSON
//         res.json(results);
//       };
//     });
//   });
// router.get("/", (req, res) => {
//     connection.query('SELECT * FROM saladsSauces', (err, results) => {
//       if (err) {
//         console.log(err)
//         res.status(500).send('Erreur lors de la récupération');
//       } else {
//           console.log('réussi')
//         res.json(results);
//       };
//     });
//   });
//   router.get("/", (req, res) => {

//     connection.query('SELECT * FROM saladsToppings', (err, results) => {
  
//       if (err) {
        
//         // If error, warn user
//         res.status(500).send('Erreur lors de la récupération du dessert');
//       } else {
  
//         // If all good, send resul as JSON
//         res.json(results);
//       };
//     });
//   });

// router.post('/salads', (req, res) => {
//     const formDataBase = req.body.saladsBase;
//     const formDataIngredients = req.body.saladsIngredients;
//     const formDataSauces = req.body.saladsSauces;
//     const formDataToppings = req.body.saladsToppings;
   

//     connection.beginTransaction( function (err) {

//         if(err) { throw err }

//         connection.query('INSERT INTO saladsBase SET ?', formDataBase, (err,results) => {
//             if(err) {
//                 return connection.rollback(_=> {
//                     res
//                     .status(500)
//                     .send("error")
//                     throw err
//                 })
//             } 
//         })
//         connection.query('INSERT INTO saladsIngredients SET ?', formDataIngredients, (err, results) => {
//             if (err) {
//                 return connection.rollback( _=> {
//                     res 
//                     .status(500)
//                     .send(" error 2")
//                     throw err
//                 })
//             }
//         }) 
//             connection.query('INSERT INTO saladsSauces SET ?', formDataSauces, (err, results) => {
//                 if (err) {
//                     return connection.rollback( _=> {
//                         res 
//                         .status(500)
//                         .send(" error 3")
//                         throw err
//                     })
//             }            
//         })
//          connection.query('INSERT INTO saladsToppings SET ?', formDataToppings, (err, results) => {
//             if (err) {
//                 return connection.rollback( _=> {
//                     res 
//                     .status(500)
//                     .send(" error 4")
//                     throw err
//                 });
//             } 
//         });
//         connection.commit((err) => {
//             if (err) {
//                 return connection.rollback( _=> {
//                 res 
//                 .status(500)
//                 .send(" error 3")
//                 throw err
//                 })
//             }
//         })
//         res.status(200).json({results: "send"}) 
//     });
// })
// router.put('/video', (req, res) => {
//     const idSaladsSauces = req.body.idSaladsSauce;
//     const idSaladsToppings = req.body.idSaladsTopping;
//     const idSaladsIngredients = req.body.idSaladsIngredient;
//     const idSaladsBases = req.body.idSaladsBase;
//     const formData = req.body;

//     connection.beginTransaction( function (err) {

//         if(err) { throw err }

//         connection.query('UPDATE saladsSauces SET ? WHERE idSaladsSauces = ? ', [formData, idSaladsSauces], (err, results)  => {
//             if (err) {
//               res.status(500).send('Erreur lors de la mise à jour de la sauce');
//             } else {
//               res.sendStatus(200);
//             }
//         });
//         connection.query('UPDATE saladsSauces SET ? WHERE idSaladsToppings = ? ', [formData, idSaladsToppings], (err, results)  => {
//             if (err) {
//               res.status(500).send('Erreur lors de la mise à jour de la sauce');
//             } else {
//               res.sendStatus(200);
//             }
//         });
//         connection.query('UPDATE saladsSauces SET ? WHERE idSaladsBase = ? ', [formData, idSaladsBases], (err, results)  => {
//             if (err) {
//               res.status(500).send('Erreur lors de la mise à jour de la sauce');
//             } else {
//               res.sendStatus(200);
//             }
//         });
//         connection.query('UPDATE saladsSauces SET ? WHERE idSaladsIngredients = ? ', [formData, idSaladsIngredients], (err, results)  => {
//             if (err) {
//               res.status(500).send('Erreur lors de la mise à jour de la sauce');
//             } else {
//               res.sendStatus(200);
//             }
//         });
//         connection.commit((err) => {
//             if (err) {
//                 return connection.rollback( _=> {
//                 res 
//                 .status(500)
//                 .send(" error 3")
//                 throw err
//                 })
//             }
//         })
//         res.status(200).json({results: "send"}) 
//     });
// });
// router.delete('/salads', (req, res) => {
//     const idSaladsSauces = req.body.idSaladsSauce;
//     const idSaladsToppings = req.body.idSaladsTopping;
//     const idSaladsIngredients = req.body.idSaladsIngredient;
//     const idSaladsBases = req.body.idSaladsBase;

//     connection.beginTransaction( function (err) {

//         if(err) { throw err }
    
//         connection.query('DELETE FROM saladsSauces WHERE idSaladsSauces = ?', [idSaladsSauces], (err, results)  => {
//         if (err) {
//             res.status(500).send('Erreur lors de la suppression de la sauce');
//         } else {
//             res.sendStatus(200);
//         }
//         });
//         connection.query('DELETE FROM saladsToppings WHERE idSaladsToppings = ?', [idSaladsToppings], (err, results)  => {
//             if (err) {
//                 res.status(500).send('Erreur lors de la suppression de la sauce');
//             } else {
//                 res.sendStatus(200);
//             }
//         });
//         connection.query('DELETE FROM saladsIngredients WHERE idSaladsIngredients = ?', [idSaladsIngredients], (err, results)  => {
//             if (err) {
//                 res.status(500).send('Erreur lors de la suppression de la sauce');
//             } else {
//                 res.sendStatus(200);
//             }
//         });
//         connection.query('DELETE FROM saladsBase WHERE idSaladsBase = ?', [idSaladsBases], (err, results)  => {
//             if (err) {
//                 res.status(500).send('Erreur lors de la suppression de la sauce');
//             } else {
//                 res.sendStatus(200);
//             }
//         });
//         connection.commit((err) => {
//             if (err) {
//                 return connection.rollback( _=> {
//                 res 
//                 .status(500)
//                 .send(" error 3")
//                 throw err
//                 })
//             }
//         })
//         res.status(200).json({results: "send"})
//     })
// });



module.exports = router
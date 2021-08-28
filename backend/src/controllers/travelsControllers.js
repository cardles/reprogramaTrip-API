const travels = require("../models/travels.json");
const passengers = require("../models/passengers.json")
const utils = require("../utils/travelsUtils.js")
// nativo do NODE
const fs = require("fs")

travels.sort((a, b) => a.passengersInfos - b.passengersInfos)

const getAllTravels = (req, res) => {
    res.status(200).send(travels)
};


const getTravelById = (req, res) => {
    let requestedID = req.params.id
    let filteredTravel = utils.findByID(travels, requestedID)

    res.status(200).send(filteredTravel)
};

// adicionar um novo passageiro a uma viagem recendo da requisição nome, email e id da viagem
const createPeople = (req, res) => {
    // trazer os dados da requisição
    // let name = req.body.name
    // let email = req.body.email
    // let documentNumber = req.body.documentNumber
    
    // id da viagem que sera adicionado o passageiro
    let requiredTravelID = req.params.id;

    // parseamento automatico
    let { name, email, documentNumber } = req.body;
    
    let newPerson = { 
        id: Math.random().toString(32).substr(2), 
        name, 
        email, 
        documentNumber,
        travelId: requiredTravelID
    };
    

    // encontrando a viagem a qual se refere o id
    const travelFound = utils.findByID(travels, requiredTravelID);

    travels.forEach((travel) => {
        // verificar o o objeto-viagem de cada item da array para encontrar o que é igual com objeto-viagem requerido
        if (travel === travelFound) {
            travel.passengersInfos.push(newPerson);
        }
    })


    // usar módulo fs para escrever as alterações no nosso arquivo JSON
    fs.writeFile("./src/models/travels.json", JSON.stringify(travels), "UTF-8", (err) => {
        if (err) {
            res.status(500).send({
                "message": err
            }) 
        } else {
                // enviar resposta no postman
                res.status(201).send({
                    "message": "Passeiro adiconado à viagem com sucesso!",
                    travelFound
                })

            }
    })
    
};


// deletar passageiro do sistema (registro permanece nas infos da viagem)
const deletePeople = (req, res) => {
    // id requerido
    const requestedID = req.params.id;
    console.log(requestedID);
    // achar o item da lista que corresponde ao id requerido
    const filteredPerson = utils.findByID(passengers, requestedID);
    console.log(filteredPerson);

    const index = passengers.indexOf(filteredPerson)

    if(index >= 0){

        passengers.splice(index, 1)

        fs.writeFile("./src/models/passengers.json", JSON.stringify(passengers), "UTF-8", (err) => {
            if (err) {
                res.status(500).send({
                    "message": err
                })
            } else {
                res.status(200).send({
                    "message": "Passageiro excluído com sucesso",
                    passengers
                })
            }
        })
    } else {
        res.status(200).send({ message: "Passageiro não encontrado, tente novamente."})
    }
};


const updatePeople = (req, res) => {

    // trazer o id do passageiro
    const requestedID = req.params.id

    // trazer dados da requisição
    const { name, email, documentNumber } = req.body //criando variáveis dentro de um objeto que vai receber o valor de cada chave criada no "body"

    // filtrar para achar passageiro
    let filteredPassenger = utils.findByID(passengers, requestedID)

    // criar novo objeto do passageiro
    const updatedPassenger = {
        id: requestedID,
        name,
        email,
        documentNumber,
        travelId: filteredPassenger.travelId
    }

    // achar o index do passageiro
    const index = passengers.indexOf(filteredPassenger)

    // verificar se o index existe, se existir, usar método splice
    if (index >= 0){
        passengers.splice(index, 1, updatedPassenger)


        // usar método fs e enviar response
        fs.writeFile("./src/models/passengers.json", JSON.stringify(passengers), "UTF-8", (err) => {
            if (err) {
                res.status(500).send({ "message": err.message })
            } else {
                res.status(200).send({
                    "message": "Passageiro atualizado com sucesso",
                    updatedPassenger
                })
            }
        })
    }
};


const updateName = (req, res) => {

    const requiredId = req.params.id; // armazenando em uma variável o id do passageiro que chega via path params
    let newName = req.body.name; // armazenando o nome do passageiro a ser atualizado
    console.log(requiredId)

    let filteredPassenger = utils.findByID(passengers, requiredId);
    // console.log('PASSENGER', filteredPassenger);

    if (filteredPassenger) {
        // console.log(filteredPassenger)
        filteredPassenger.name = newName; // atribuição de valor

        fs.writeFile("./src/models/passengers.json", JSON.stringify(passengers), "UTF-8", (err) => {
            if (err) {
                res.status(500).send({ message: err.message }) // caso de erro retorno status 500
            } else {
                res.status(200).json([{
                    "mensagem": "Nome do passageiro atualizado com sucesso",
                    filteredPassenger
                }]);
            }
        })
    } else {
        res.status(500).send({ "message": "Passageiro não encontrado" })
    }
};

const deleteTravel = (req, res) => {

    const requiredID = req.params.id;

    const travelFound = utils.findByID(travels, requiredID);

    const index = travels.indexOf(travelFound);
    console.log(index);

    if (index < 0) {
        res.status(500).send({ message: "Viagem não encontrada." })
    } else {
        fs.writeFile("./src/models/travels.json", JSON.stringify(travels), "UTF-8", (err) => {
            if (err) {
                res.status(500).send({ message: err.message });
            } else {
                travels.splice(index, 1)

                res.status(200).send({
                    message: "Viagem deletada com sucesso!",
                    travels
                }) 
            }
        })

    }
}

module.exports = {
    getAllTravels,
    getTravelById,
    createPeople,
    deletePeople,
    updatePeople,
    updateName,
    deleteTravel
}
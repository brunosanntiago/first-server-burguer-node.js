const express = require('express')
const uuid = require('uuid')

const app = express()
app.use(express.json())
const port = 3000

const orders = []

// MIDDLEWARE VERIFICAÇÃO ID
const checkOrderId = (req, res, next) => {
    const {id} = req.params

    const index = orders.findIndex(order => order.id === id)

    if(index < 0) {
        return res.status(404).json({message: "Order not found"})
    }

    req.orderIndex = index
    req.orderId = id

    next()
}

// MIDDLEWARE CONSOLE LOG
const consoleLog = (req, res, next) => {
    console.log(`[${req.method}] - ${req.url}`);

    next()
}

// ROTA POST
app.post('/order', consoleLog, (req, res) => {
    const {order, clientName, price} = req.body 
    const newOrder = {id: uuid.v4(), order, clientName, price, status: "Em preparação"} 
    orders.push(newOrder) 

    return res.status(201).json(newOrder)
})

// ROTA GET
app.get('/order', consoleLog, (req, res) => {
    return res.json(orders)
})

// ROTA PUT
app.put('/order/:id', checkOrderId, consoleLog, (req, res) => {
    const id = req.orderId
    const index = req.orderIndex

    const status = orders[index].status
    const {order, clientName, price} = req.body
    const orderUpdate = {id, order, clientName, price, status}
    
    orders[index] = orderUpdate

    return res.json(orderUpdate)
})

// ROTA DELETE
app.delete('/order/:id', checkOrderId, consoleLog, (req, res) => {
    const index = req.orderIndex
    
    orders.splice(index, 1)

    return res.status(204).json()
})

// ROTA GET FILTER ID
app.get('/order/:id', checkOrderId, consoleLog, (req, res) => {
    const index = req.orderIndex

    return res.json(orders[index])
})

// ROTA PATCH
app.patch('/order/:id', checkOrderId, consoleLog, (req, res) => {
    const {status} = req.body
    const index = req.orderIndex

    orders[index].status = status

    return res.json(orders[index])
})

app.listen(port, () => {
    console.log(`🚀 Server starded on port ${port}`);
})

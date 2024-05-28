const express = require('express')
const {open} = require('sqlite')
const sqlite3 = require('sqlite3')
const path = require('path')

const databasePath = path.join(__dirname, 'cricketMatchDetails.db')

const app = express()

app.use(express.json())

let db = null

const initializeDbAndServer = async () => {
  try {
    db = await open({
      filename: databasePath,
      driver: sqlite3.Database,
    })

    app.listen(3000, () =>
      console.log('Server Running at http://localhost:3000/'),
    )
  } catch (error) {
    console.log(`DB Error: ${error.message}`)
    process.exit(1)
  }
}

initializeDbAndServer()
const convert = each => {
  return {
    playerId: each.player_id,
    playerName: each.player_name,
  }
}

app.get('/players/', async (request, response) => {
  const query = `
SELECT *
 FROM 
  player_details
`
  const re = await db.all(query)
  response.send(re.map(each => convert(each)))
  console.log(re)
})

app.get('/players/:playerId/', async (request, response) => {
  const {playerId} = request.params

  const query = `
SELECT *
 FROM 
  player_details
  WHERE
  player_id=${playerId}
`
  const re = await db.all(query)
  response.send(re.map(each => convert(each)))
  console.log(re)
})

app.put('/players/:playerId/', async (request, response) => {
  const {playerId} = request.params
  const {playerName} = request.body

  const query = `
  UPDATE 
  player_details
  SET
  player_name=${playerName}
  WHERE
  player_id=${playerId}
`
  await db.run(query)
  response.send('Player Details Updated')
})
const convertmatch = each => {
  return {}
}
module.exports = app

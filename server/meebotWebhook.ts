import express from 'express'
import { getFirestore, doc, setDoc } from 'firebase/firestore'
const app = express()
app.use(express.json())

app.post('/webhook', async (req, res) => {
  const { wallet, message, type, txHash } = req.body
  const db = getFirestore()

  const ref = doc(db, 'contributors', wallet, 'activity', Date.now().toString())
  await setDoc(ref, {
    message,
    type,
    txHash,
    timestamp: new Date()
  })

  res.status(200).send({ status: 'ok' })
})

app.listen(3001, () => console.log('MeeBot Webhook listening on port 3001'))

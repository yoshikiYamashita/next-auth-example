import { connectToDatabase } from "../../../lib/mongodb";
import { ObjectId } from 'mongodb';

import { MongoClient } from 'mongodb'

export default async function handler(req, res) {
  const method = req.method;
  switch (method) {
    // case 'GET': {

    // }
   
    case 'POST': {
      const { nameId, userEmail } = req.body;
      const { db_auth, db_posteddata } = await connectToDatabase();
      let user = await db_auth.collection('users').findOne({email: userEmail});
      const name = await db_posteddata.collection('names').findOne({_id: ObjectId(nameId)});

      console.log("user:", user);
      console.log('name:', name);

      res.json({
        user: user,
        name: name
      });
    }

    // case 'DELETE': {

    // }

    default: {
      res.status(403).end();
      break;
    }
  }

}
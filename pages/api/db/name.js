import { connectToDatabase } from "../../../lib/mongodb";
import { ObjectId } from 'mongodb';

export default async function handler(req, res) {
  const method = req.method;

  switch (method) {

    case 'GET': {
      const { db_posted_data } = await connectToDatabase();
      const data = await db_posted_data.collection('names').find({}).toArray();
      const properties = JSON.parse(JSON.stringify(data));
      res.json({ names: properties });
      break;
    }

    case 'POST': {
      const { db_posted_data } = await connectToDatabase();
      const { name, auther, email } = req.body;
      if ( name ) {
        const response = await db_posted_data.collection("names").insertOne({
          name: name,
          auther: auther,
          email: email
        });
        res.json(response);
      } else {
        res.json({ err: "name is not defined." });
      }
      break;
    }

    case 'DELETE': {
      const { db_posted_data } = await connectToDatabase();
      const { id } = req.body;
      const response = await db_posted_data.collection('names').deleteOne({"_id": ObjectId(id)});
      res.json(response);
      break;
    }

    default: {
      res.status(403).end();
      break;
    }
  }

}
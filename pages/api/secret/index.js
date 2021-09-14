import { getSession } from "next-auth/client";

export default async (req, res) => {
  const session = await getSession({req: req});

  if(session) {
    res.send({
      content: `welcome to the secret page ${session.user.name}. You are now accessing with ${session.user.email}.`
    });
  } else {
    res.send({
      error: "you need to be signed in"
    })
  }
}
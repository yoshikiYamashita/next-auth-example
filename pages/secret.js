import { connectToDatabase } from '../lib/mongodb';
import { useState, useEffect } from "react";
import { useSession } from "next-auth/client";

export default function Secret({ names }) {
  const [session, loading] = useSession();
  const [content, setContent ] = useState();
  const [error, setError] = useState();
  const [nameList, setNameList] = useState(names);

  const refreshNameList = async () => {
    try {
      const refreshed = await fetch('/api/db/name');
      const { names } = await refreshed.json();
      console.log('refreshed', names);
      setNameList(names);
    }
    catch(err) {
      console.log(err);
    }
  }

  const [name, setName] = useState('');
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (name && session) {
        const res = await fetch('/api/db/name', {
          method: "POST",
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: name,
            auther: session.user.name,
            email:  session.user.email,
          })
        });
        setName('');
        const json = await res.json();
        console.log("json:", json);
        refreshNameList();
      } else {
        alert("enter a name");
      }
    }
    catch(err) {
      console.log(err);
    }
  }

  const handleFavourite = async (e) => {
    e.preventDefault();
    const id = e.target.dataset.nameid;
    try {
      const res = await fetch('/api/db/favourite', {
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nameId: id,
          userEmail: session.user.email
        })
      });
      const json = await res.json();
      console.log(json);
    }
    catch(err) {
      console.log(err);
    }
  }

  const handleDelete = async (e) => {
    e.preventDefault();
    try {
      const id = e.target.dataset.nameid;
      const res = await fetch('/api/db/name', {
        method: "DELETE",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: id
        })
      });
      const json = await res.json();
      console.log(json);
      refreshNameList();
    }
    catch(err) {
      console.log(err);
    }
  }

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch('/api/secret');
      const json = await  res.json();
      if (json.content) {
        setContent(json.content);
      } else if (json.error) {
        setError(json.error);
      }
    }
    fetchData();
  }, [session]);

  if ( typeof window !== "undefined" && loading ) return null;

  if (!session) {
    return (
      <div>
        <h1>Your not sined in, please sine in first</h1>
        <p>error message: { error }</p>
      </div>
    )
  }

  return (
      <div>
        <h1>Protected page</h1>
        <p>{ content }</p>
        <form onSubmit={(e) => handleSubmit(e)}>
          <label>name: </label>
          <input type="text" name="name" value={name} onChange={(e) => setName(e.target.value)} />
          <button>Comfirm</button>
        </form>
        <h3>Name list</h3>
        <ul>
          {nameList.map(name => {
              return (
                <li key={name._id}>
                  <strong>{ name.name }</strong>
                  <p>created by { name.auther }</p>
                  <button data-nameid={name._id} onClick={(e) => handleFavourite(e)}>add to your favourite</button>
                  {
                    name.email === session.user.email && (
                      <button data-nameid={name._id} onClick={(e) => handleDelete(e)}>Delete</button>
                    )
                  }
                </li>
              )
          })}
        </ul>
      </div>
  )
}

export async function getServerSideProps(context) {
  const { db_posted_data } = await connectToDatabase();
  const data = await db_posted_data.collection('names').find({}).toArray();
  const properties = JSON.parse(JSON.stringify(data));
  return {
    props: {
      names: properties
    }
  }
}
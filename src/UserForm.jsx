import React, {useState} from 'react';
import { auth } from './firebase';

const UserForm = () => {
    const [name, setName] = useState('');

    const nameChange = (event) => {
        setName(event.target.value);
    }

    const handleSubmit = async (event) => {
        event.preventDefault();
        localStorage.setItem('userName', name);
        await auth.signInAnonymously();
    }

    return (
      <form className="user-form" onSubmit={handleSubmit}>
        <h1>Choose a name:</h1>
        <br />
        <div className="field">
          <p className="control">
            <input
              type="text"
              name="name"
              id=""
              className="input"
              value={name}
              onChange={nameChange}
              required
            />
          </p>
          <br />
          <div className="field">
              <p className="control">
                  <button className="button is-success" type="submit">
                      Start
                  </button>
              </p>
          </div>
        </div>
      </form>
    );
}   

export default UserForm;
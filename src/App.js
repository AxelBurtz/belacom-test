import './App.css';
import { useState } from "react";
import Axios from "axios";

function App() {
  const [last_name, setLast_Name] = useState("");
  const [first_name, setFirst_Name] = useState("");
  const [title, setTitle] = useState("");
  const [age, setAge] = useState(0);


  const addCustomer = () => {
    Axios.post("http://localhost:8000/create",
    {last_name: last_name, first_name: first_name, title: title, age: age}).then(() => console.log("success"))
  }

  return (
    <div className="App">
      <div className="information">
        <label>Last Name</label>
        <input
        type="text"
        onChange={(event) => {
          setLast_Name(event.target.value);
          }}/>
        <label>First Name</label>
        <input type="text"
          onChange={(event) => {
            setFirst_Name(event.target.value);
          }} />
        <label>Title</label>
        <input type="text"
          onChange={(event) => {
            setTitle(event.target.value);
          }} />
        <label>Age</label>
        <input type="number"
          onChange={(event) => {
            setAge(event.target.value);
          }} />
        <button onClick={addCustomer}>Add Customer</button>
      </div>
    </div>
  );
}

export default App;

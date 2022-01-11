import './App.css';
import { useState } from "react";
import Axios from "axios";

function App() {
  const [last_name, setLastName] = useState("");
  const [first_name, setFirstName] = useState("");
  const [title, setTitle] = useState("");
  const [age, setAge] = useState(0);

  const [new_last_name, setNewLastName] = useState("");
  const [new_first_name, setNewFirstName] = useState("");
  const [new_title, setNewTitle] = useState("");
  const [new_age, setNewAge] = useState(0);



  const [customersList, setCustomersList] = useState([]);

  const getCustomers = () => {
    Axios.get("http://localhost:8000/customers").then((response) => {
    setCustomersList(response.data.rows);
    })
  }


  const addCustomer = () => {
    Axios.post("http://localhost:8000/create",
    {last_name: last_name, first_name: first_name, title: title, age: age
    }).then(() => {
      setCustomersList([
        ...customersList,
        {
          last_name: last_name, first_name: first_name, title: title, age: age,
        },
      ]);
    });
  };

  const updateCustomer = (id) => {
    Axios.patch("http://localhost:8000/update",
    {new_last_name: last_name, first_name: first_name, title: title, age: age, id: id
    }).then((response) => {
      // alert("update");
      console.log("success")
    });
  };

  const deleteCustomer = (id) => {
    Axios.delete(`http://localhost:8000/delete/${id}`);
  };

  return (
    <div className="App">
      <div className="information">
        <label>Last Name</label>
        <input
        type="text"
        onChange={(event) => {
          setLastName(event.target.value);
          }}/>
        <label>First Name</label>
        <input type="text"
          onChange={(event) => {
            setFirstName(event.target.value);
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
        <div className='Customers'>
          <button onClick={getCustomers}>Show Customers</button>
          {customersList.map((val, key) => {
            return <div className='customer'>
              <div className='customer_information'>
                <h3>Last Name : {val.last_name}</h3>
                <h3>First Name : {val.first_name}</h3>
                <p>Title : {val.title}</p>
                <p>Age : {val.age}</p>
              </div>
              <div className='update_information'>
                <input type="text" placeholder='Change Last Name'
                  onChange={(event) => {
                    setNewLastName(event.target.value);
                  }} />
                <input type="text" placeholder='Change First Name'
                  onChange={(event) => {
                    setNewFirstName(event.target.value);
                  }} />
                <input type="text" placeholder='Change Title'
                  onChange={(event) => {
                    setNewTitle(event.target.value);
                  }} />
                <input type="number" placeholder='Change Age'
                onChange={(event) => {
                  setNewAge(event.target.value);
                }} />
                <button onClick={updateCustomer(val.id)}>Update</button>
                <button onClick={() => {deleteCustomer(val.id)}}>Delete</button>
              </div>
            </div>
          })}
        </div>
      </div>
    </div>
  );
}

export default App;

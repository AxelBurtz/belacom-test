import './App.css';
import { useState } from "react";
import Axios from "axios";

function App() {
  const [customersList, setCustomersList] = useState([]);

  // variable pour stocker input create
  const [last_name, setLastName] = useState("");
  const [first_name, setFirstName] = useState("");
  const [title, setTitle] = useState("");
  const [age, setAge] = useState(0);

  // variable pour stocker input update
  const [new_last_name, setNewLastName] = useState("");
  const [new_first_name, setNewFirstName] = useState("");
  const [new_title, setNewTitle] = useState("");
  const [new_age, setNewAge] = useState(0);




  // method all
  const getCustomers = () => {
    Axios.get("http://localhost:8000/customers").then((response) => {
    setCustomersList(response.data.rows);
    })
  }

  // method create
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

  // method update
  const updateCustomer = (id) => {
    const dataUpdate = { last_name: new_last_name, first_name: new_first_name, title: new_title, age: new_age, id: id}
    Axios.put("http://localhost:8000/update",
    dataUpdate
    ).then((response) => {
      setCustomersList([dataUpdate])
    });
  };

  // method delete
  const deleteCustomer = (id) => {
    Axios.delete(`http://localhost:8000/delete/${id}`).then((reponse) => {
      setCustomersList(customersList.filter((val)=> {
        return val.id !== id
      }))
    })
  };

  return (
    <div className="App">
      {/* input pour create */}
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
          {/* button to create customer */}
        <button onClick={addCustomer}>Add Customer</button>
        <div className='Customers'>
          {/* button to show all customers */}
          <button onClick={getCustomers}>Show Customers</button>
          {customersList.map((val, key) => {
            return <div className='customer'>
              <div className='customer_information'>
                <h3>Last Name : {val.last_name}</h3>
                <h3>First Name : {val.first_name}</h3>
                <p>Title : {val.title}</p>
                <p>Age : {val.age}</p>
              </div>
              {/* input to update informations */}
              <div className='update_information'>
                <input type="text" placeholder='Change Last Name'
                onChange={(event) => {
                  setNewLastName(event.target.value);
                }} />
                <input type="text" placeholder='Change First Name'
                  onChange={(event) => {
                    setNewFirstName(event.target.value);
                  }}/>
                <input type="text" placeholder='Change Title'
                 onChange={(event) => {
                  setNewTitle(event.target.value);
                }}/>
                <input type="number" placeholder='Change Age'
                  onChange={(event) => {
                    setNewAge(event.target.value);
                  }}/>
                  {/* button to update customer*/}
                <button onClick={() => {updateCustomer(val.id)}}>Update</button>
                {/* button to destroy customer */}
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

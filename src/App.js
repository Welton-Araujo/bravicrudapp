import './App.css';
import { AiOutlineEdit, AiOutlineDelete } from 'react-icons/ai';
import { useEffect, useState } from "react";
import axios from 'axios'
import Select from 'react-select';
import InputMask from "react-input-mask";

const arrayUsers = [{ casa: "fsadf" }, { casa: "gasdfgas" }]

function App() {

  const Users = ({ users }) => {

    return (
      <div className="users">
        <div style={{ flexDirection: "row", width: 480, marginLeft: 15, display: 'flex', marginTop: 5, borderRadius: 5, backgroundColor: '#a879e6' }}>
          <a style={{ flex: 1, textAlign: 'start', marginLeft: 15 }}>Nome</a>
          <a style={{ flex: 1, textAlign: 'start' }}>Contato</a>
        </div>
        <div style={{ backgroundColor: '#DAE0F5', marginInline: 10, borderRadius: 5, paddingBottom: 30 }}>
          {users.map(user => {
            return (
              <div className="user">
                <div className='boxText'>
                  <div style={{ textAlign: 'start', width: 200, backgroundColor: '#DAE0F5' }}>{user.name}</div>
                </div>
                <div className='boxText'>
                  <div style={{ textAlign: 'start', width: 200 }}>{user.contact.contact}</div>
                </div>
                <button style={{/* backgroundColor: '#a0a0a0',  */borderRadius: 5, marginInline: -5, marginBottom: 5, marginTop: 10 }}><AiOutlineEdit onClick={() => handleWithEditNewButton(user)} size={20} color={'#2AD0D2'} ></AiOutlineEdit></button>
                <button style={{/* backgroundColor: '#a0a0a0',  */borderRadius: 5, marginInline: -5, marginBottom: 5, marginTop: 10 }}><AiOutlineDelete onClick={() => deleteUser(user)} size={20} color={'#2AD0D2'}></AiOutlineDelete></button>
              </div>
            )
          })}
        </div>

      </div>
    )
  }

  const handleWithEditNewButton = async (user) => {
    SetUsersOne(user)
    SetInputName(user.name)
    SetInputTelefone(user.contact.contact)

    const responseContactOne = await axios.get("http://localhost:3000/get-type/" + user.contact.typeContact_id)
    setSelectedOption(responseContactOne.data.name)
    SetInputEdit(true)
    SetInputVisibility(true)
  }

  const handleWithNewButton = () => {
    SetInputVisibility(!inputVisibility)
  }

  const creatUser = async () => {
    if (selectedOption == null) {
      alert("Insira o tipo de contato")
    } else {
      const responseTypeName = await axios.get("http://localhost:3000/get-type-name/" + selectedOption.value)

      if (responseTypeName.data.id) {
        //const responseType = await axios.post("http://localhost:3000/type-contact", {name: responseTypeName.data.name})
        const responseContact = await axios.post("http://localhost:3000/contact", { contact: inputTelefone, typeContact_id: responseTypeName.data.id })
        await axios.post("http://localhost:3000/user", { name: inputName, contact_id: responseContact.data.id })
      } else {
        const responseType = await axios.post("http://localhost:3000/type-contact", { name: selectedOption.value })
        const responseContact = await axios.post("http://localhost:3000/contact", { contact: inputTelefone, typeContact_id: responseType.data.id })
        await axios.post("http://localhost:3000/user", { name: inputName, contact_id: responseContact.data.id })
      }
      getUsers()
      SetInputName("")
      SetInputTelefone("")
      SetInputTipo("")
      SetInputVisibility(!inputVisibility)
    }
  }

  const getUsers = async () => {
    const response = await axios.get("http://localhost:3000/get-user")
    SetUsers(response.data)
  }

  const editUser = async () => {
    if (selectedOption == null) {
      alert("Insira o tipo de contato")
    } else {
    await axios.put("http://localhost:3000/update-user/" + usersOne.id, { name: inputName })
    await axios.put("http://localhost:3000/update-contact/" + usersOne.contact_id, { contact: inputTelefone })
    await axios.put("http://localhost:3000/update-type-contact/" + usersOne.contact.typeContact_id, { name: selectedOption.value })
    }
    getUsers()
    SetInputName("")
    SetInputTelefone("")
    SetInputTipo("")

    SetInputVisibility(false)
    SetInputEdit(false)
  }

  const deleteUser = async (user) => {
    await axios.delete("http://localhost:3000/delete-user/" + user.id)
    await axios.delete("http://localhost:3000/delete-contact/" + user.contact_id)
    //await axios.delete("http://localhost:3000/delete-type-contact/" + user.contact.typeContact_id)

    getUsers()
  }


  const [users, SetUsers] = useState([])
  const [types, SetTypes] = useState([])
  const [inputName, SetInputName] = useState("")
  const [inputTelefone, SetInputTelefone] = useState("")
  const [inputTipo, SetInputTipo] = useState("")
  const [inputVisibility, SetInputVisibility] = useState(false)
  const [inputEdit, SetInputEdit] = useState(false)
  const [usersOne, SetUsersOne] = useState()
  const [options, SetOptions] = useState([])
  const [selectedOption, setSelectedOption] = useState(null);

  const setOptions = async () => {
    const response = await axios.get("http://localhost:3000/get-type-contact")
    let typeArray = []
    response.data.map((type) => {
      typeArray.push({ value: type.name, label: type.name })
    })
    SetOptions(typeArray)
  }

  useEffect(() => {
    getUsers()
    setOptions()
    //getTypes()
  }, [])



  return (
    <div className="App">
      <header className="container">
        <div className="header">
          <h1> Bravi CRUD</h1>
        </div>
        <Users users={users}></Users>
        <div style={{ display: inputVisibility ? "block" : "none", width: 515 }}>
          <div style={{ flexDirection: 'row', marginTop: 10, borderRadius: 10, paddingBottom: 5, borderRadius: 5, backgroundColor: '#EFEFEF' }}>
            <div style={{ flexDirection: "row", marginLeft: 15, display: 'flex', marginTop: 5 }}>
              <a style={{ flex: 1, textAlign: 'start' }}>Nome</a>
              <a style={{ flex: 1, textAlign: 'start' }}>Contato</a>
              <a style={{ flex: 1, textAlign: 'start' }}>Tipo</a>
            </div>
          </div>
          <div style={{ flexDirection: 'row', display: 'flex' }}>
            <input
              placeholder="Welton Araujo"
              value={inputName}
              style={{ height: 33, marginRight: 10, flex: 1 }}
              onChange={(event) => {
                SetInputName(event.target.value)
              }
              } className="inputName"></input>
            <InputMask
              placeholder="(85)99999-9999"
              mask="(99)99999-9999"
              value={inputTelefone}
              style={{ type: "text", name: "telefone", height: 33, marginRight: 10, flex: 1, maxlength: 11 }}
              onChange={(event) => {
                SetInputTelefone(event.target.value)
              }
              } className="inputName"></InputMask>
            <div style={{ display: inputVisibility ? "block" : "none", marginTop: 8, flex: 1, marginRight: 10 }}>
              <Select defaultValue={selectedOption}
                onChange={setSelectedOption}
                options={options} />
            </div>
          </div>
        </div>
        <button onClick={inputVisibility ? inputEdit ? editUser : creatUser : handleWithNewButton} className="newTaskButton">
          {inputVisibility ? "Adicionar User" : "Novo User"}
        </button>
      </header>

    </div>
  );
}

export default App;

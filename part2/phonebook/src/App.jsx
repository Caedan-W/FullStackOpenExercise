import { useState, useEffect } from 'react'
import axios from 'axios'

/*
const Person = ({person}) => {
  return <li>{person.name} {person.number}</li>
}

const App = () => {
  const [persons, setPersons] = useState([
    { name: 'Arto Hellas', number: '040-123456', id: 1 },
    { name: 'Ada Lovelace', number: '39-44-5323523', id: 2 },
    { name: 'Dan Abramov', number: '12-43-234345', id: 3 },
    { name: 'Mary Poppendieck', number: '39-23-6423122', id: 4 }
  ]) 
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filterInput, setFilterInput] = useState('')
  //const [showAll, setShowAll] = useState(true)

  const personsToShow = persons.filter(person => person.name.toLowerCase().includes(filterInput.toLowerCase()))

  const addNewPerson = (event) => {
    event.preventDefault()
    if (persons.find(item => item.name === newName)){
      alert(`${newName} is already added to phonebook`)
    }
    else{
      const personObject = {
        name: newName,
        number: newNumber,
        id: newName
      }
      setPersons(persons.concat(personObject))
      setNewName('')
      setNewNumber('')
    }
  }

  const handleNameChange = (event) => {
    setNewName(event.target.value)
    console.log('new name:', event.target.value)
  }

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value)
    console.log('new number:', event.target.value)
  }

  const handleFilterInput = (event) => {
    setFilterInput(event.target.value)
    console.log('new filter input:', event.target.value)
    //console.log('filter completed!')
  }

  //const personsToShow = (text) => persons.filter(person => person.name.toLowerCase().includes(text.toLowerCase()))

  return (
    <div>
      <h2>Phonebook</h2>

      <div>
        filter shown with <input value={filterInput} onChange={handleFilterInput}/>
      </div>

      <h2>add a new</h2>

      <form onSubmit={addNewPerson}>
          <div>name: <input value={newName} onChange={handleNameChange}/></div>
          <div>number: <input value={newNumber} onChange={handleNumberChange}/></div>
          <div><button type="submit">add</button></div>
      </form>

      
      <h2>Numbers</h2>
      <ul>
        {personsToShow.map(person => 
          <Person key={person.id} person={person} />
        )}
      </ul>
    </div>
  )
}
*/



const Filter = ({value, onChange}) => {
  return(
    <div>
      filter shown with <input value={value} onChange={onChange}/>
    </div>
  )
}

const PersonForm = ({newName, newNumber, onNameChange, onNumberChange, onSubmit}) => {
  return (
    <form onSubmit={onSubmit}>
        <div>name: <input value={newName} onChange={onNameChange}/></div>
        <div>number: <input value={newNumber} onChange={onNumberChange}/></div>
        <div><button type="submit">add</button></div>
    </form>
  )
}

const Person = ({person}) => {
  return <li>{person.name} {person.number}</li>
}

const Persons = ({ persons }) => {
  return (
    <div>
      <ul>
        {persons.map(person => (
          <Person key={person.id} person={person} />
        ))}
      </ul>
    </div>
  );
};


const App = () => {
  /*
  const [persons, setPersons] = useState([
    { name: 'Arto Hellas', number: '040-123456', id: 1 },
    { name: 'Ada Lovelace', number: '39-44-5323523', id: 2 },
    { name: 'Dan Abramov', number: '12-43-234345', id: 3 },
    { name: 'Mary Poppendieck', number: '39-23-6423122', id: 4 }
  ])
  */
  useEffect(() => {
    console.log('effect')
  
    const eventHandler = response => {
      console.log('promise fulfilled')
      setPersons(response.data)
    }
  
    const promise = axios.get('http://localhost:3001/persons')
    promise.then(eventHandler)
  }, [])
  
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filterInput, setFilterInput] = useState('')

  const personsToShow = persons.filter(person => person.name.toLowerCase().includes(filterInput.toLowerCase()))

  const addNewPerson = (event) => {
    event.preventDefault()
    if (persons.find(item => item.name === newName)){
      alert(`${newName} is already added to phonebook`)
    }
    else{
      const personObject = {
        name: newName,
        number: newNumber,
        id: newName
      }
      setPersons(persons.concat(personObject))
      setNewName('')
      setNewNumber('')
    }
  }

  const handleNameChange = (event) => {
    setNewName(event.target.value)
    console.log('new name:', event.target.value)
  }

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value)
    console.log('new number:', event.target.value)
  }

  const handleFilterInput = (event) => {
    setFilterInput(event.target.value)
    console.log('new filter input:', event.target.value)
    //console.log('filter completed!')
  }


  return (
    <div>
      <h2>Phonebook</h2>
      <Filter value={filterInput} onChange={handleFilterInput} />

      <h3>Add a new</h3>
      <PersonForm
        newName={newName}
        newNumber={newNumber}
        onNameChange={handleNameChange}
        onNumberChange={handleNumberChange}
        onSubmit={addNewPerson}
      />
      
      <h3>Numbers</h3>
      <Persons persons={personsToShow} />
    </div>
  )
}







export default App
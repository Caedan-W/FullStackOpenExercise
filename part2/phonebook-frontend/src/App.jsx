import { useState, useEffect } from 'react'
import personService from './services/persons'
import Filter from './components/Filter'
import PersonForm from './components/PersonForm'
import Persons from './components/Persons'
import Notification from './components/Notification'


const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filterInput, setFilterInput] = useState('')
  const [successMessage, setSuccessMessage] = useState(null)

  const personsToShow = persons.filter(person => person.name.toLowerCase().includes(filterInput.toLowerCase()))

  const changeSuccessMessage = (message) => {
    setSuccessMessage(
      message
    )
    setTimeout(() => {
      setSuccessMessage(null)
    }, 3000)
  }

  useEffect(() => {
    console.log('effect')
    personService
      .getAll()
      .then(initialPersons => {
        console.log('promise fulfilled')
        setPersons(initialPersons)
      })
  }, [])

  const updateNumber = (name) => {
    const personToChange = persons.find(person => person.name === name)
    const changedPerson = { ...personToChange, number: newNumber }
    personService
      .update(personToChange.id, changedPerson)
      .then(returnedPerson => {
        setPersons(persons.map(person => person.id !== personToChange.id ? person : returnedPerson))
        setNewName('')
        setNewNumber('')
        changeSuccessMessage(`Updated ${newName}'s number`)
      })
      .catch(error => {
        changeSuccessMessage(`Information of '${personToChange.name}' has already been deleted from server`)
        setPersons(persons.filter(person => person.id !== personToChange.id))
        setNewName('')
        setNewNumber('')
      })
  }

  const addNewPerson = (event) => {
    event.preventDefault()
    if (persons.find(item => item.name === newName)){
      //alert(`${newName} is already added to phonebook, number of this person has been updated`)
      updateNumber(newName)
      
    }
    else{
      const personObject = {
        name: newName,
        number: newNumber
      }
      personService
        .create(personObject)
        .then(returnedPerson => {
          setPersons(persons.concat(returnedPerson))
          setNewName('')
          setNewNumber('')
        })
      changeSuccessMessage(`Added ${newName}`)
    }
  }
  
  const removePerson = id => {
    const personToRemove = persons.find(person => person.id === id)
    personService
      .remove(id)
      .then(() => {
        setPersons(persons.filter(person => person.id !== id))
        setNewName('')
        setNewNumber('')
        changeSuccessMessage(`Removed ${personToRemove.name}`)
      })
      .catch(error => {
        alert(
          `the person '${personToRemove.name}' was already deleted from server`
        )
      })
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
    //console.log('new filter input:', event.target.value)
    //console.log('filter completed!')
  }

  const conditionalRemovePerson = (person) => {
    if (window.confirm(`Delete ${person.name} ?`)) {
      removePerson(person.id)
    }
  }


  return (
    <div>
      <h1>Phonebook</h1>
      <Notification message={successMessage} />
      <Filter value={filterInput} onChange={handleFilterInput} />

      <h2>Add a new</h2>
      <PersonForm
        newName={newName}
        newNumber={newNumber}
        onNameChange={handleNameChange}
        onNumberChange={handleNumberChange}
        onSubmit={addNewPerson}
      />
      
      <h2>Numbers</h2>
      <Persons persons={personsToShow} onClick={conditionalRemovePerson}/>
    </div>
  )
}







export default App
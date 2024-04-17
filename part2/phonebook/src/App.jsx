import { useState, useEffect } from 'react'
import personService from './services/persons'
import Filter from './components/Filter'
import PersonForm from './components/PersonForm'
import Persons from './components/Persons'


const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filterInput, setFilterInput] = useState('')

  const personsToShow = persons.filter(person => person.name.toLowerCase().includes(filterInput.toLowerCase()))

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
      })
  }

  const addNewPerson = (event) => {
    event.preventDefault()
    if (persons.find(item => item.name === newName)){
      alert(`${newName} is already added to phonebook, number of this person has been updated`)
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
    console.log('new filter input:', event.target.value)
    //console.log('filter completed!')
  }

  const conditionalRemovePerson = (person) => {
    if (window.confirm(`Delete ${person.name} ?`)) {
      removePerson(person.id)
    }
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
      <Persons persons={personsToShow} onClick={conditionalRemovePerson}/>
    </div>
  )
}







export default App
import Person from './Person'

const Persons = ({ persons, onClick }) => {
    return (
      <div>
        <ul>
          {persons.map(person => (
            <Person key={person.id} person={person} onClick={onClick}/>
          ))}
        </ul>
      </div>
    );
  };

export default Persons
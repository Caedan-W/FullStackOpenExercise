const Person = ({person, onClick}) => {
    return (
        <li>{person.name} {person.number}  <button onClick={()=>onClick(person)}>delete</button></li>
    )
  }
export default Person
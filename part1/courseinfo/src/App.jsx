
//Header takes care of rendering the name of the course
//Content renders the parts and their number of exercises
//Total renders the total number of exercises.

/*
const Header = (props) => {
  console.log('Header_props:'+props)
  return (
    <h1>{props.course.name}</h1>
  )
}

const Content = (props) => {
  console.log('Content_props:'+props)
  return (
    <>
      <Part part={props.course.parts[0].name} exercises={props.course.parts[0].exercises} />
      <Part part={props.course.parts[1].name} exercises={props.course.parts[1].exercises} />
      <Part part={props.course.parts[2].name} exercises={props.course.parts[2].exercises} />
    </>
  )
}

const Total = (props) => {
  console.log('Total_props:'+props)
  return (
    <p>Total number of exercises {props.course.parts[0].exercises + 
                                  props.course.parts[1].exercises + 
                                  props.course.parts[2].exercises}
    </p>
  )
}

const Part = (props) => {
  console.log('Part_props:'+props)
  return (
    <p>{props.part} {props.exercises}</p>
  )
}


const App = () => {
  // const-definitions
  const course = {
    name: 'Half Stack application development',
    parts: [
      {
        name: 'Fundamentals of React',
        exercises: 10
      },
      {
        name: 'Using props to pass data',
        exercises: 7
      },
      {
        name: 'State of a component',
        exercises: 14
      }
    ]
  }


  return (
    <div>
      <Header course={course} />
      <Content course={course} />
      <Total course={course} />

    </div>
  )
}




export default App
*/

import { useState } from 'react'

const Display = ({ counter }) => <div>{counter}</div>

const Button = ({handleClick, text}) => <button onClick={handleClick}>{text}</button>

/*
const App = () => {
  const [ counter, setCounter ] = useState(0)

  const increaseByOne = () => setCounter(counter + 1)
  const decreaseByOne = () => setCounter(counter - 1)
  const setToZero = () => setCounter(0)

  return (
    <div>
      <Display counter={counter}/>

      <Button onClick={increaseByOne} text='plus'/>

      <Button onClick={setToZero} text='zero'/>

      <Button onClick={decreaseByOne} text='minus'/>
    </div>
  )
}
*/
const History = (props) => {
  //The History component renders completely different React elements 
  //depending on the state of the application. This is called conditional rendering.
  if (props.allClicks.length === 0) {
    return (
      <div>
        the app is used by pressing the buttons
      </div>
    )
  }
  return (
    <div>
      button press history: {props.allClicks.join(' ')}
    </div>
  )
}


const App = () => {
  const [left, setLeft] = useState(0)
  const [right, setRight] = useState(0)
  const [allClicks, setAll] = useState([])

  const [total, setTotal] = useState(0)

  /*
  const handleLeftClick = () => {
    setAll(allClicks.concat('L'))
    console.log('left before', left)
    setLeft(left + 1)
    console.log('left after', left)
    //The reason for this is that a state update in React happens asynchronously, 
    //i.e. not immediately but "at some point" before the component is rendered again.

    setTotal(left + right)
  }
  */

  const handleLeftClick = () => {
    setAll(allClicks.concat('L'))
    const updatedLeft = left + 1
    setLeft(updatedLeft)
    setTotal(updatedLeft + right) 
  }

  const handleRightClick = () => {
    setAll(allClicks.concat('R'))
    const updatedRight = right + 1
    setRight(updatedRight)

    setTotal(left + updatedRight)
  }

  return (
    <div>
      {left}
      <Button handleClick={handleLeftClick} text='left'/>
      <Button handleClick={handleRightClick} text='right'/>
      {right}
      <History allClicks={allClicks} />
    </div>
  )
}

export default App  //export the App component as the default export of the module.
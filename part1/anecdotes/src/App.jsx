import { useState, useEffect } from 'react'


const Button = ({handleClick, text}) => <button onClick={handleClick}>{text}</button>

const App = () => {
  const anecdotes = [
    'If it hurts, do it more often.',
    'Adding manpower to a late software project makes it later!',
    'The first 90 percent of the code accounts for the first 90 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
    'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
    'Premature optimization is the root of all evil.',
    'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.',
    'Programming without an extremely heavy use of console.log is same as if a doctor would refuse to use x-rays or blood tests when diagnosing patients.',
    'The only way to go fast, is to go well.'
  ]

  const [selected, setSelected] = useState(0)
  const [votes, setVotes] = useState(new Array(anecdotes.length).fill(0));
  //console.log(votes)
  
  //使用了 useEffect 来监听 votes 的变化，并在它发生变化时输出，这样可以更清楚地看到因 votes 状态更新引起的输出
  /*
  useEffect(() => {
    console.log(votes);
  }, [votes]);
  */

  const changeAnecdote = () => {
    const randomIndex = Math.floor(Math.random() * anecdotes.length);
    setSelected(randomIndex);
  }
  
  const incrementVotesByOne = (index) => {
    const handler = () => {
      const copyOfVotes = [...votes]
      copyOfVotes[index] += 1
      setVotes(copyOfVotes)
    }
    //console.log(votes)
    return handler
  }

  const getIndexOfAnecdoteWithMostVotes = (votes) => {
    let indexOfMax = 0;
    let max = votes[0];
  
    for (let i = 1; i < votes.length; i++) {
      if (votes[i] > max) {
        max = votes[i];
        indexOfMax = i;
      }
    }
    return indexOfMax 
  }


//reduce方法，找到数组最大元素的索引  
/*
  const indexOfMax = votes.reduce((maxIndex, currentElement, currentIndex, array) => {
    return currentElement > array[maxIndex] ? currentIndex : maxIndex;
  }, 0);
*/
console.log(votes)
console.log(getIndexOfAnecdoteWithMostVotes(votes))
//console.log(indexOfMax)

  return (
    <div>
      <h1>Anecdote of the day</h1>
      <p>{anecdotes[selected]}</p>
      <p>has {votes[selected]} votes</p>
      <Button handleClick={incrementVotesByOne(selected)} text='vote' />
      <Button handleClick={changeAnecdote} text='next anecdote' />
      <h1>Anecdote with most votes</h1>
      <p>{anecdotes[getIndexOfAnecdoteWithMostVotes(votes)]}</p>
      <p>has {votes[getIndexOfAnecdoteWithMostVotes(votes)]} votes</p>
      
    </div>
  )
}

export default App



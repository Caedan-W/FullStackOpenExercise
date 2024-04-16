const Header = ({ course }) => <h2>{course}</h2>

const Sum = ({ parts }) => parts.reduce((sum, part) => sum + part.exercises, 0)

const Total = ({ parts }) => <p><strong>total of {Sum({ parts })} exercises</strong></p>

const Part = ({ part }) => 
    <p>
        {part.name} {part.exercises}
    </p>

const Content = ({ parts }) => parts.map (part => <Part key = {part.id} part = {part} />)


const Course = ({ course }) => {
    return (
        <div>
            <Header course={course.name} />
            <Content parts={course.parts} />
            <Total parts={course.parts} />
        </div>
    )
}

export default Course
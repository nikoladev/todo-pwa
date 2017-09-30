import { h, Component } from 'preact'

const getPlaceholder = () => {
  const placeholders = [
    'Pick up kids',
    'Buy eggs',
    'Take over world',
    'Nap',
    'Call mom',
    'Finish school',
    'Get job',
    'Find true love'
  ]
  return placeholders[Math.floor(Math.random() * placeholders.length)]
}

const colors = {
  primary: '#fc5b39',
  background: '#fcf1ee',
  textPrimary: '#454545',
  textSecondary: '#cacaca'
}

const styles = {
  main: {
    fontFamily: '"Helvetica Neue", Helvetica, Arial, Roboto, sans-serif',
    fontSize: '1.5rem',
    color: colors.textPrimary
  },
  form: {
    margin: '2rem',
    display: 'flex'
  },
  inputField: {
    border: 0,
    borderRadius: '5px',
    padding: '0.75rem',
    fontSize: '1.25rem',
    color: colors.textPrimary,
    width: '100%'
  },
  inputButton: {
    border: 0,
    padding: '0 1.25rem',
    borderRadius: '5px',
    background: colors.primary,
    color: '#fff'
  },
  list: {
    display: 'flex',
    flexDirection: 'column',
    borderBottom: `1px solid ${colors.textSecondary}`
  }
}

const Tasks = ({ tasks, removeTask, completeTask }) => {
  return (
    <section
      style={styles.list}
    >
      {tasks.map((task, index) => (
        <Task
          key={index}
          index={index}
          text={task}
          remove={removeTask}
          complete={completeTask}
        />
      ))}
    </section>
  )
}

const Task = ({ text, remove, index, complete, offset }) => {
  const done = text[0] === '-'
  const style = {
    listStyle: 'none',
    borderTop: `1px solid ${colors.textSecondary}`,
    padding: '1rem 2rem',
    color: done
      ? colors.textSecondary
      : ''
  }

  const formattedText = done
    ? <s>{text.slice(1)}</s>
    : text.slice(1)
  return (
    <article
      style={style}
      onClick={() => complete(index)}
    >
      {formattedText}
    </article>
  )
}

export default class App extends Component {
  constructor () {
    super()
    this.state = {
      input: '',
      placeholder: getPlaceholder(),
      tasks: [
        '+buy groceries',
        '+read about React',
        '+remove this task'
      ]
    }

    this.handleChange = this.handleChange.bind(this)
    this.addToTasks = this.addToTasks.bind(this)
    this.completeTask = this.completeTask.bind(this)
    this.removeTask = this.removeTask.bind(this)
  }

  handleChange (evt) {
    this.setState({ input: evt.target.value })
  }

  addToTasks (evt) {
    evt.preventDefault()
    this.setState((prevState, props) => {
      const newTasks = prevState.tasks.slice()
      const input = prevState.input
      newTasks.unshift('+' + input)

      return {
        input: '',
        placeholder: getPlaceholder(),
        tasks: newTasks
      }
    })
  }

  completeTask (taskIndex) {
    this.setState((prevState, props) => {
      const newTasks = this.state.tasks.slice()
      let str = newTasks[taskIndex]
      if (str[0] === '+') {
        newTasks[taskIndex] = '-' + str.slice(1)
      } else {
        newTasks[taskIndex] = '+' + str.slice(1)
      }

      return {
        tasks: newTasks
      }
    })
  }

  removeTask (taskIndex) {
    this.setState((prevState, props) => {
      const newTasks = this.state.tasks.slice()
      newTasks.splice(taskIndex, 1)
      return {
        tasks: newTasks
      }
    })
  }

  render (props, { input, tasks, placeholder }) {
    return (
      <div style={styles.main}>
        <form
          style={styles.form}
          onSubmit={this.addToTasks}
        >
          <input
            style={styles.inputField}
            type='text'
            placeholder={placeholder}
            value={input}
            onChange={this.handleChange}
          />
          <input
            style={styles.inputButton}
            type='submit'
            value='✔︎'
          />
        </form>
        <Tasks
          tasks={tasks}
          completeTask={this.completeTask}
          removeTask={this.removeTask}
        />
      </div>
    )
  }
}
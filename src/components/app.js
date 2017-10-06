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

class Tasks extends Component {
  constructor (props) {
    super(props)
    this.state = {
      startX: -1,
      currentX: -1,
      target: undefined,
      moving: undefined
    }

    this.handleTouchStart = this.handleTouchStart.bind(this)
    this.handleTouchMove = this.handleTouchMove.bind(this)
    this.handleTouchEnd = this.handleTouchEnd.bind(this)
    this.setMoving = this.setMoving.bind(this)
  }

  handleTouchStart (evt) {
    if (this.state.target !== undefined) {
      return
    }
    const touch = evt.changedTouches[0]

    this.setState({
      startX: touch.clientX,
      currentX: touch.clientX,
      target: touch.target
    })
  }

  handleTouchMove (evt) {
    if (this.state.target === undefined) {
      return
    }
    const touch = evt.changedTouches[0]

    this.setState({
      currentX: touch.clientX
    })
  }

  handleTouchEnd (evt) {
    this.setState((prevState, props) => {
      const { startX, currentX, moving } = prevState
      if (Math.abs(currentX - startX) > 75) {
        this.props.removeTask(moving)
      }
      return {
        startX: -1,
        currentX: -1,
        target: undefined,
        moving: undefined
      }
    })
  }

  setMoving (index) {
    // prevent infinite loop of `setState > render > setState > ...`
    if (this.state.moving !== undefined || index !== this.state.moving) {
      return
    }
    this.setState({ moving: index })
  }

  render ({ tasks, completeTask }, { startX, currentX, target }) {
    const offset = currentX - startX
    const textContent = target !== undefined && target.textContent

    return (
      <section
        style={styles.list}
        onTouchStart={this.handleTouchStart}
        onTouchMove={this.handleTouchMove}
        onTouchEnd={this.handleTouchEnd}
      >
        {tasks.map((task, index) => (
          <Task
            key={index}
            index={index}
            task={task}
            setMoving={this.setMoving}
            complete={completeTask}
            offset={task.slice(1) === textContent
              ? offset
              : 0
            }
          />
        ))}
      </section>
    )
  }
}

const Task = ({ task, setMoving, index, complete, offset }) => {
  const done = task[0] === '-'
  const style = {
    listStyle: 'none',
    borderTop: `1px solid ${colors.textSecondary}`,
    padding: '1rem 2rem',
    color: done
      ? colors.textSecondary
      : ''
  }
  const opacity = Math.min(1, Math.max(0.025, (150 - Math.abs(offset)) / 150))
  const textStyle = {
    position: 'relative',
    opacity: opacity,
    left: `${offset}px`
  }

  if (opacity < 1) {
    setMoving(index)
  }

  const formattedText = done
    ? <s>{task.slice(1)}</s>
    : task.slice(1)
  return (
    <article
      style={style}
      onClick={() => complete(index)}
    >
      <span style={textStyle}>{formattedText}</span>
    </article>
  )
}

const saveToStorage = (tasks) => window.localStorage.setItem('tasks', JSON.stringify(tasks))
const loadFromStorage = () => JSON.parse(window.localStorage.getItem('tasks'))

export default class App extends Component {
  constructor () {
    super()
    this.state = {
      input: '',
      placeholder: getPlaceholder(),
      tasks: loadFromStorage() ||
        [
          '+Original',
          '+Tasks'
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

      saveToStorage(newTasks)

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

      saveToStorage(newTasks)

      return {
        tasks: newTasks
      }
    })
  }

  removeTask (taskIndex) {
    this.setState((prevState, props) => {
      const newTasks = this.state.tasks.slice()
      newTasks.splice(taskIndex, 1)

      saveToStorage(newTasks)

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

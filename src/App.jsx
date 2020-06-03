import React, { useState, useRef, useCallback, useEffect, useMemo, memo } from 'react'
import './App.css'
import { createSet, createAdd, createRemove, createToggle } from './action'
let isSeq = Date.now()
const LS_KEY = '$_todos'
/**
 * { addTodo: createAdd, removeTodo: createRemove} addTodo = payload => dispatch(createAdd(payload))
 * @param {*} actionCreators
 * @param {*} dispatch
 */
function bindActionCreators(actionCreators, dispatch) {
	let ret = {}
	for (let key in actionCreators) {
		ret[key] = function (...args) {
			const actionCreator = actionCreators[key]
			const action = actionCreator(...args)
			dispatch(action)
		}
	}
	return ret
}

const Control = memo(function Control({ dispatch, addTodo }) {
	const inputRef = useRef()
	const submit = (e) => {
		e.preventDefault()
		let newTodo = {
			id: ++isSeq,
			complete: false,
			text: inputRef.current.value,
		}
		addTodo(newTodo)
		// dispatch(
		// 	createAdd(newTodo)
		// )
		// dispatch({
		// 	type: 'add',
		// 	payload: newTodo,
		// })
		inputRef.current.value = ''
	}
	return (
		<div className='control'>
			<h1>todos</h1>
			<form onSubmit={submit}>
				<input type='text' ref={inputRef} className='new-todo' placeholder='what needs to be done?' />
			</form>
		</div>
	)
})
const TodoItem = memo(function TodoItem({ id, text, complete, dispatch, removeTodo, toggleTodo }) {
	const onChange = (id) => {
		// dispatch({
		// 	type: 'toggle',
		// 	payload: id,
		// })
		// dispatch(createToggle(id))
		toggleTodo(id)
	}
	const onRemove = (id) => {
		removeTodo(id)
		// dispatch(createRemove(id))
		// dispatch({
		// 	type: 'remove',
		// 	payload: id,
		// })
	}
	return (
		<li className='todo-item'>
			<input type='checkbox' checked={complete} onChange={() => onChange(id)} />
			<label className={complete ? 'complete' : ''}>{text}</label>
			<button onClick={() => onRemove(id)}>&#xd7;</button>
		</li>
	)
})

const Todos = memo(function Todos({ todos, dispatch, removeTodo, toggleTodo }) {
	return (
		<ul>
			{todos.map((todo) => {
				return <TodoItem dispatch={dispatch} removeTodo={removeTodo} toggleTodo={toggleTodo} text={todo.text} complete={todo.complete} key={todo.id} id={todo.id} />
			})}
		</ul>
	)
})

function TodoList() {
	const [todos, setTodos] = useState([])
	const dispatch = useCallback((action) => {
		const { type, payload } = action
		switch (type) {
			case 'set':
				setTodos(payload)
				break
			case 'add':
				setTodos((todos) => [...todos, payload])
				break
			case 'remove':
				setTodos((todos) =>
					todos.filter((todo) => {
						return todo.id !== payload
					})
				)
				break
			case 'toggle':
				setTodos((todos) =>
					todos.map((todo) => {
						return todo.id === payload ? { ...todo, complete: !todo.complete } : todo
					})
				)
				break
			default:
		}
	}, [])

	// 副作用
	useEffect(() => {
		let todos = JSON.parse(localStorage.getItem(LS_KEY) || '[]')
		dispatch(createSet(todos))
	}, [])
	useEffect(() => {
		localStorage.setItem(LS_KEY, JSON.stringify(todos))
	}, [todos])
	return (
		<div className='todo-list'>
			{/* <Control dispatch={dispatch} />
			<Todos todos={todos} dispatch={dispatch} /> */}
			<Control {...bindActionCreators({ addTodo: createAdd }, dispatch)} />
			<Todos todos={todos} {...bindActionCreators({ removeTodo: createRemove, toggleTodo: createToggle }, dispatch)} />
		</div>
	)
}

export default TodoList

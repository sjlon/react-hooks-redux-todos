export function createSet(payload) {
	return {
		type: 'set',
		payload,
	}
}
export function createAdd(payload) {
	// return {
	// 	type: 'add',
	// 	payload,
	// }
	// 返回一个函数
	return (dispatch, getState) => {
		// 异步
		const state = getState()
		setTimeout(() => {
			if (!state.todos.find((todo) => todo.text === payload.text)) {
				dispatch({
					type: 'add',
					payload,
				})
			}
		}, 3000)
	}
}
export function createRemove(payload) {
	return {
		type: 'remove',
		payload,
	}
}
export function createToggle(payload) {
	return {
		type: 'toggle',
		payload,
	}
}

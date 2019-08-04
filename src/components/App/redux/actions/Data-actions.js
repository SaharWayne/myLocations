export function addCategory(name) {
    return { type: 'ADD_CATEGORY', payload: name };
}

export function addLocation(name) {
    return { type: 'ADD_LOCATION', payload: name };
}

export function editCategory(input) {
    return { type: 'EDIT_CATEGORY', payload: input };
}

export function editLocation(input) {
    return { type: 'EDIT_LOCATION', payload: input };
}

export function removeCategory(name) {
    return { type: 'REMOVE_CATEGORY', payload: name };
}

export function removeLocation(name) {
    return { type: 'REMOVE_LOCATION', payload: name };
}

export function resetCategoryInput() {
    return { type: 'RESET_CATEGORY_INPUT' };
}

export function resetLocationInput() {
    return { type: 'RESET_LOCATION_INPUT' };
}

export function setSelectedCategory(name) {
    return { type: 'SET_SELECTED_CATEGORY', payload: name };
}

export function setSelectedLocation(name) {
    return { type: 'SET_SELECTED_LOCATION', payload: name };
}

export function setUngroupedCategory(name) {
    return { type: 'SET_UNGROUPED_CATEGPRY', payload: name };
}

export function setViewMode(mode) {
    return { type: 'SET_VIEW_MODE', payload: mode };
}

export function updateCategoryInput(input) {
    return { type: 'UPDATE_CATEGORY_INPUT', payload: input };
}

export function updateLocationInput(input) {
    return { type: 'UPDATE_LOCATION_INPUT', payload: input };
}

export function updateMapPosition(position) {
    return { type: 'UPDATE_MAP_POSITION', payload: position };
}

export function updateMapAddress(address) {
    return { type: 'UPDATE_MAP_ADDRESS', payload: address };
}

export function setLocationDialogState(state) {
    return { type: 'SET_LOCATION_DIALOG_STATE', payload: state };
}

export function setCategoryDialogState(state) {
    return { type: 'SET_CATEGORY_DIALOG_STATE', payload: state };
}
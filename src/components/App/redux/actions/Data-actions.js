export const addCategory = name => {
    return { type: 'ADD_CATEGORY', payload: name };
}

export const addLocation = name => {
    return { type: 'ADD_LOCATION', payload: name };
}

export const editCategory = input => {
    return { type: 'EDIT_CATEGORY', payload: input };
}

export const editLocation = input => {
    return { type: 'EDIT_LOCATION', payload: input };
}

export const removeCategory = name => {
    return { type: 'REMOVE_CATEGORY', payload: name };
}

export const removeLocation = name => {
    return { type: 'REMOVE_LOCATION', payload: name };
}

export const resetCategoryInput = () => {
    return { type: 'RESET_CATEGORY_INPUT' };
}

export const resetLocationInput = () => {
    return { type: 'RESET_LOCATION_INPUT' };
}

export const setSelectedCategory = name => {
    return { type: 'SET_SELECTED_CATEGORY', payload: name };
}

export const setSelectedLocation = name => {
    return { type: 'SET_SELECTED_LOCATION', payload: name };
}

export const setUngroupedCategory = name => {
    return { type: 'SET_UNGROUPED_CATEGPRY', payload: name };
}

export const setViewMode = mode => {
    return { type: 'SET_VIEW_MODE', payload: mode };
}

export const updateCategoryInput = input => {
    return { type: 'UPDATE_CATEGORY_INPUT', payload: input };
}

export const updateLocationInput = input => {
    return { type: 'UPDATE_LOCATION_INPUT', payload: input };
}

export const updateMapPosition = position => {
    return { type: 'UPDATE_MAP_POSITION', payload: position };
}

export const updateMapAddress = address => {
    return { type: 'UPDATE_MAP_ADDRESS', payload: address };
}

export const setLocationDialogState = state => {
    return { type: 'SET_LOCATION_DIALOG_STATE', payload: state };
}

export const setCategoryDialogState = state => {
    return { type: 'SET_CATEGORY_DIALOG_STATE', payload: state };
}
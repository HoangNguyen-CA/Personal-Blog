---
title: 'Revisiting Redux'
date: '2021-07-06'
---

I recently decided to read over the official redux documentation when working on a project. In the past, I remember redux needed a lot of boilerplate to set up, and it was a pain recalling what to do.

## Redux Boilerplate

For implementing redux in my application, there were a lot of things that needed to be done. I had to set up the store with the correct middleware, set up my reducers, action creators, action types, and more. This code was written across multiple files and it was a very lengthy process to get right. In the docs, I read about a new package they created, redux-toolkit. redux-toolkit is a package that simplifies the setup for a redux store and makes everything more neat and modular.

## Creating The Store

When setting up a redux store, you have to combine all of the reducers, configure the middleware (most commonly redux-thunk), and set up the redux dev tools extension. This is a lot to remember. With redux-toolkit, all of that code is taken care of with the configure store function.

```js
import { configureStore } from '@reduxjs/toolkit';
import recipeReducer from './slices/recipeSlice';
import authReducer from './slices/authSlice';
import errorReducer from './slices/errorSlice';
import userReducer from './slices/userSlice';

const store = configureStore({
  reducer: {
    recipe: recipeReducer,
    auth: authReducer,
    error: errorReducer,
    user: userReducer,
  },
});

export default store;
```

## Redux Slices

Using slices removes a lot of unnecessary code from the original redux. Originally, I had to keep three separate files for each reducer. An actions file, an action types file, and the reducer file itself. Using a slice combines all of this logic into one. Creating a slice also comes with the benefit that you can modify the reducer state mutably. This is because redux-toolkit comes with a feature that automatically turns mutable updates into immutable updates in the slice reducer.

```js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  error: '',
  show: false,
};

const errorSlice = createSlice({
  name: 'error',
  initialState,
  reducers: {
    setError(state, action) {
      state.error = action.payload;
      state.show = true;
    },
    hideError(state) {
      state.error = '';
      state.show = false;
    },
  },
});

export const { setError, hideError } = errorSlice.actions;

// async actions here

export default errorSlice.reducer;
```

### Conclusion

That is pretty much all of the code necessary to create the Redux store. Without redux-toolkit, the code is much more complicated. In the future, I will 100% be using the redux-toolkit package if my project integrates redux for state management.

# 3rd Parties Used & Their NPM Packages
> **Important**
>
> Keep this list updated when we add or remove a 3rd party library so that we can we have a reference.
- [React](https://reactjs.org/docs/getting-started.html) => `react react-dom`
- [React Router](https://reactrouter.com/web/guides/quick-start) => `react-router-dom localforage match-sorter sort-by`
- [MUI](https://mui.com/material-ui/getting-started/) => `@mui/material @emotion/react @emotion/styled`
- [Axios](https://axios-http.com/docs/intro) => `axios`
- [Fontsource](https://fontsource.org/docs/getting-started) => `@fontsource/roboto`

## Folder Structure
```
src
|
+-- assets            # assets folder can contain all the static files such as images, fonts, etc.
|
+-- components        # shared components used across the entire application
|
+-- config            # all the global configuration, env variables etc. get exported from here and used in the app
|
+-- hooks             # shared hooks used across the entire application
|
+-- routes            # routes configuration
|
+-- types             # base types used across the application
|
+-- utils             # shared utility functions
|
+-- features          # feature based modules
    |
    +-- feature-name    # a feature can be a story or a group of small stories that are related to each other
        |
        +-- api         # exported API request declarations and api hooks related to a specific feature
        |
        +-- assets      # assets folder can contain all the static files for a specific feature
        |
        +-- components  # components scoped to a specific feature
        |
        +-- hooks       # hooks scoped to a specific feature
        |
        +-- routes      # route components for a specific feature pages
        |
        +-- types       # typescript types for TS specific feature domain
        |
        +-- utils       # utility functions for a specific feature
        |
        +-- index.ts    # entry point for the feature, it should serve as the public API of the given feature and exports everything that should be used outside the feature
```
# My Project Notes

## notes

- MyDesignScreen is using the data param that was passed from the project screen and the getDesignSystem function from useAuth()

- getDesignSystem is re-called through useFocus/UseEffect(everytime the screen renders) hooks on the project screen and is called in fetches on the MyDesignScreen

- currentSystem useState is set with data || designSystemData <--- a useState from useAuth()

- when await getDesignSystem is called it stays stuck unless i reload the whole app

## problem

- when a deletion happens the right element or system gets deleted from the system but what is viewable to the user is wrong until the screen re-renders

## Backend Endpoints

-

## Ideas

- Maybe use Axios globally.
- Cleanup UI flows after delete.

import { createBrowserRouter } from "react-router";
import Root from "../layouts/Root";
import TodoList from "../components/TodoList";

const router = createBrowserRouter([
    {
        path: "/",
        element: <Root />,
        children: [
            {
                path: "/",
                element: <TodoList />
            },
        ]
    }
])

export default router;
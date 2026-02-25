import { Router } from "express";

const router=Router()

const routes = [
    {
        path: "/",
        router: router
    }
]

routes.forEach(route => {
    router.use(route.path, route.router)
})

export default router
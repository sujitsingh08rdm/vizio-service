import { Router, Request, Response } from "express"
const GatewayRouter = Router()

GatewayRouter.get("/", (req: Request, res: Response) => {
	res.json({message: "Hello From gateway service"})
})

export default GatewayRouter
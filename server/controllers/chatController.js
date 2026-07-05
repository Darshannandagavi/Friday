import { streamResponse } from "../services/chat/chatServices.js";

export const chat = async (req, res) => {

    try {

        const { sessionId, message } = req.body;

        await streamResponse({
            sessionId,
            message,
            res,
        });

    } catch (err) {

        console.error(err);

        res.status(500).send("Something went wrong");

    }

};